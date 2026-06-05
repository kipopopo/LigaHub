'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User as AppUser, UserRole } from '@/types';
import { isFirebaseConfigured, getFirebaseAuth } from '@/lib/firebase';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo admin credentials
const DEMO_ADMIN_EMAIL = 'admin@ligahub.my';
const DEMO_ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  // Check for persisted session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('ligahub-user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('ligahub-user');
      }
    }
    setLoading(false);

    // If Firebase is configured, also listen for real auth
    if (isFirebaseConfigured()) {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        const auth = getFirebaseAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const appUser: AppUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              photoUrl: firebaseUser.photoURL || '',
              createdAt: new Date().toISOString(),
              favoriteTeams: [],
              role: 'fan',
              language: 'en',
            };
            setUser(appUser);
            localStorage.setItem('ligahub-user', JSON.stringify(appUser));
          }
          setLoading(false);
        });
        return () => unsubscribe();
      });
    }
  }, []);

  const persistUser = useCallback((u: AppUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('ligahub-user', JSON.stringify(u));
    } else {
      localStorage.removeItem('ligahub-user');
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured()) {
        // Check if this is the demo admin login
        const isDemoAdmin = email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD;

        try {
          const { signInWithEmailAndPassword } = await import('firebase/auth');
          const auth = getFirebaseAuth();
          const cred = await signInWithEmailAndPassword(auth, email, password);

          // Check Firestore for admin role
          let role: UserRole = 'fan';
          try {
            const { doc, getDoc } = await import('firebase/firestore');
            const { getFirebaseDb } = await import('@/lib/firebase');
            const userDoc = await getDoc(doc(getFirebaseDb(), 'users', cred.user.uid));
            if (userDoc.exists() && userDoc.data()?.role === 'admin') {
              role = 'admin';
            }
          } catch {
            // Firestore not set up yet — continue as fan
          }

          const appUser: AppUser = {
            id: cred.user.uid,
            email: cred.user.email || email,
            displayName: cred.user.displayName || email.split('@')[0],
            photoUrl: cred.user.photoURL || '',
            createdAt: new Date().toISOString(),
            favoriteTeams: [],
            role,
            language: 'en',
          };
          persistUser(appUser);
        } catch (firebaseErr) {
          // If Firebase auth failed but credentials are demo admin, use demo mode
          if (isDemoAdmin) {
            await new Promise((r) => setTimeout(r, 500));
            const demoUser: AppUser = {
              id: 'demo-admin',
              email: DEMO_ADMIN_EMAIL,
              displayName: 'Admin',
              photoUrl: '',
              createdAt: new Date().toISOString(),
              favoriteTeams: [],
              role: 'admin',
              language: 'en',
            };
            persistUser(demoUser);
          } else {
            throw firebaseErr;
          }
        }
      } else {
        // Full demo mode (no Firebase configured)
        await new Promise((r) => setTimeout(r, 800));
        const role: UserRole =
          email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD
            ? 'admin'
            : 'fan';
        const demoUser: AppUser = {
          id: `demo-${Date.now()}`,
          email,
          displayName: role === 'admin' ? 'Admin' : email.split('@')[0],
          photoUrl: '',
          createdAt: new Date().toISOString(),
          favoriteTeams: [],
          role,
          language: 'en',
        };
        persistUser(demoUser);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      // Clean up Firebase error messages for display
      const cleanMsg = msg
        .replace('Firebase: Error (auth/', '')
        .replace(').', '')
        .replace('auth/', '');
      setError(cleanMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured()) {
        const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
        const auth = getFirebaseAuth();
        await signInWithPopup(auth, new GoogleAuthProvider());
      } else {
        await new Promise((r) => setTimeout(r, 800));
        const demoUser: AppUser = {
          id: `demo-google-${Date.now()}`,
          email: 'demo@gmail.com',
          displayName: 'Google User',
          photoUrl: '',
          createdAt: new Date().toISOString(),
          favoriteTeams: [],
          role: 'fan',
          language: 'en',
        };
        persistUser(demoUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured()) {
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const auth = getFirebaseAuth();
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      } else {
        await new Promise((r) => setTimeout(r, 800));
        const demoUser: AppUser = {
          id: `demo-${Date.now()}`,
          email,
          displayName: name,
          photoUrl: '',
          createdAt: new Date().toISOString(),
          favoriteTeams: [],
          role: 'fan',
          language: 'en',
        };
        persistUser(demoUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const logout = useCallback(async () => {
    try {
      if (isFirebaseConfigured()) {
        const { signOut } = await import('firebase/auth');
        await signOut(getFirebaseAuth());
      }
    } finally {
      persistUser(null);
    }
  }, [persistUser]);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, loginWithGoogle, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
