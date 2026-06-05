'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { teams } from '@/lib/placeholder-data';
import styles from '../login/page.module.css';
import regStyles from './page.module.css';

export default function RegisterPage() {
  const { t } = useI18n();
  const { register, error: authError } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleTeam = (teamId: string) => {
    setFavoriteTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(email, password, name);
      router.push('/');
    } catch {
      setError(authError || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage} id="register-page">
      <div className={styles.authGlow} />
      <div className={`${styles.authCard} animate-scale-in`} style={{ maxWidth: '480px' }}>
        <div className={styles.authHeader}>
          <span className={styles.authLogo}>⚽</span>
          <h1 className="heading-3">{t('auth.register.title')}</h1>
          <p className="text-muted">{t('auth.register.subtitle')}</p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className="input-group">
            <label className="input-label" htmlFor="reg-name">{t('auth.register.name')}</label>
            <input
              type="text"
              id="reg-name"
              className="input"
              placeholder="Ahmad Irfan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-email">{t('auth.register.email')}</label>
            <input
              type="email"
              id="reg-email"
              className="input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-password">{t('auth.register.password')}</label>
            <input
              type="password"
              id="reg-password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-confirm">{t('auth.register.confirmPassword')}</label>
            <input
              type="password"
              id="reg-confirm"
              className="input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Favorite Teams */}
          <div className="input-group">
            <label className="input-label">{t('auth.register.favoriteTeams')}</label>
            <div className={regStyles.teamSelector}>
              {teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  className={`${regStyles.teamChip} ${favoriteTeamIds.includes(team.id) ? regStyles.teamChipActive : ''}`}
                  onClick={() => handleToggleTeam(team.id)}
                  style={favoriteTeamIds.includes(team.id) ? { borderColor: team.colors.primary, background: `${team.colors.primary}22` } : {}}
                >
                  <img src={team.logoUrl} alt={team.name} className={regStyles.teamChipLogo} />
                  <span>{team.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }} disabled={loading} id="register-submit">
            {loading ? t('common.loading') : t('auth.register.submit')}
          </button>
        </form>

        <p className={styles.authFooter}>
          {t('auth.register.hasAccount')}{' '}
          <Link href="/auth/login/" className={styles.authLink}>{t('auth.register.login')}</Link>
        </p>
      </div>
    </div>
  );
}
