'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

export default function LoginPage() {
  const { t } = useI18n();
  const { login, loginWithGoogle, error: authError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch {
      setError(authError || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      router.push('/');
    } catch {
      setError('Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage} id="login-page">
      <div className={styles.authGlow} />
      <div className={`${styles.authCard} animate-scale-in`}>
        <div className={styles.authHeader}>
          <span className={styles.authLogo}>⚽</span>
          <h1 className="heading-3">{t('auth.login.title')}</h1>
          <p className="text-muted">{t('auth.login.subtitle')}</p>
        </div>

        {/* Demo credentials hint */}
        <div className={styles.demoHint}>
          <strong>Demo Admin:</strong> admin@ligahub.my / admin123
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">{t('auth.login.email')}</label>
            <input
              type="email"
              id="login-email"
              className="input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="login-password">{t('auth.login.password')}</label>
            <input
              type="password"
              id="login-password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="login-submit">
            {loading ? t('common.loading') : t('auth.login.submit')}
          </button>
        </form>

        <div className={styles.authDivider}>
          <span>or</span>
        </div>

        <button className={`btn btn-ghost btn-lg ${styles.googleBtn}`} onClick={handleGoogleLogin} disabled={loading} id="google-login-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {t('auth.login.google')}
        </button>

        <p className={styles.authFooter}>
          {t('auth.login.noAccount')}{' '}
          <Link href="/auth/register/" className={styles.authLink}>{t('auth.login.register')}</Link>
        </p>
      </div>
    </div>
  );
}
