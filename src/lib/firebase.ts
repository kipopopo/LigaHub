/* ================================================
   Firebase Client SDK Configuration
   ================================================
   
   SETUP INSTRUCTIONS:
   1. Go to https://console.firebase.google.com/
   2. Click "Create a project" → name it "ligahub"
   3. Enable Authentication:
      - Go to Authentication → Sign-in method
      - Enable "Email/Password"
      - Enable "Google" (add your domain as authorized)
   4. Enable Cloud Firestore:
      - Go to Firestore Database → Create database
      - Choose "Start in test mode" (we'll add rules later)
      - Select closest region (asia-southeast1 for Malaysia)
   5. Enable Storage:
      - Go to Storage → Get started
      - Choose your region
   6. Get your config:
      - Go to Project settings → General → Your apps
      - Click "Web" icon (</>)  → Register app
      - Copy the firebaseConfig object
   7. Create .env.local in project root with your values
      (see .env.local.example)
*/

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000:web:000',
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }
  return storage;
}

// Check if Firebase is configured with real credentials
export function isFirebaseConfigured(): boolean {
  return (
    firebaseConfig.apiKey !== 'demo-api-key' &&
    firebaseConfig.projectId !== 'demo-project'
  );
}
