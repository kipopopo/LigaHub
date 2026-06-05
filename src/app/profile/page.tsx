'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { teams, getTeamById } from '@/lib/placeholder-data';
import styles from './page.module.css';

export default function ProfilePage() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifPrefs, setNotifPrefs] = useState({
    scoreUpdates: true,
    matchReminders: true,
    mediaAlerts: false,
    emailDigest: true,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login/');
    }
  }, [user, router]);

  if (!user) return null;

  const favoriteTeams = (user.favoriteTeams || [])
    .map((id) => getTeamById(id))
    .filter(Boolean);

  const tabs = [
    { id: 'overview', label: t('profile.overview') },
    { id: 'favorites', label: t('profile.favorites') },
    { id: 'notifications', label: t('profile.notifications') },
    { id: 'settings', label: t('profile.settings') },
  ];

  return (
    <div className="container" id="profile-page">
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          {user.displayName?.[0]?.toUpperCase() || '?'}
        </div>
        <div className={styles.profileInfo}>
          <h1 className="heading-3">{user.displayName}</h1>
          <p className="text-muted">{user.email}</p>
          <div className={styles.profileBadges}>
            <span className={`badge ${user.role === 'admin' ? 'badge-accent' : 'badge-primary'}`}>
              {user.role === 'admin' ? 'Admin' : t('profile.fan')}
            </span>
            <span className="badge badge-primary" style={{ opacity: 0.7 }}>
              Member since {new Date(user.createdAt).toLocaleDateString('en-MY', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-xl)', width: 'fit-content' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className={styles.overviewGrid}>
          <div className={`glass-card ${styles.statCard}`}>
            <span className={styles.statIcon}>🏟️</span>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Matches Followed</span>
          </div>
          <div className={`glass-card ${styles.statCard}`}>
            <span className={styles.statIcon}>❤️</span>
            <span className={styles.statValue}>{favoriteTeams.length}</span>
            <span className={styles.statLabel}>Favorite Teams</span>
          </div>
          <div className={`glass-card ${styles.statCard}`}>
            <span className={styles.statIcon}>🔔</span>
            <span className={styles.statValue}>3</span>
            <span className={styles.statLabel}>Notifications</span>
          </div>
          <div className={`glass-card ${styles.statCard}`}>
            <span className={styles.statIcon}>📅</span>
            <span className={styles.statValue}>
              {new Date(user.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
            </span>
            <span className={styles.statLabel}>Joined</span>
          </div>
        </div>
      )}

      {/* Favorites */}
      {activeTab === 'favorites' && (
        <div>
          <h3 className="heading-4" style={{ marginBottom: 'var(--space-md)' }}>{t('profile.favorites')}</h3>
          {favoriteTeams.length === 0 ? (
            <div className={styles.emptyState}>
              <span style={{ fontSize: '2rem' }}>⭐</span>
              <p>You haven&apos;t added any favorite teams yet.</p>
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
                Browse teams and add them to your favorites to receive updates.
              </p>
            </div>
          ) : (
            <div className={styles.favoritesGrid}>
              {favoriteTeams.map((team) =>
                team ? (
                  <div key={team.id} className={`glass-card ${styles.favoriteTeamCard}`}>
                    <img src={team.logoUrl} alt={team.name} className={styles.favTeamLogo} />
                    <div>
                      <h4 style={{ fontWeight: 600 }}>{team.name}</h4>
                      <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>{team.category} — {team.group === 'A' ? 'Group A' : 'Group B'}</span>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          <h4 className="heading-5" style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>
            All Teams
          </h4>
          <div className={styles.allTeamsGrid}>
            {teams.map((team) => (
              <div key={team.id} className={styles.allTeamChip}>
                <img src={team.logoUrl} alt={team.name} className={styles.allTeamChipLogo} />
                <span>{team.shortName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className={styles.settingsSection}>
          <h3 className="heading-4" style={{ marginBottom: 'var(--space-lg)' }}>
            {t('profile.notificationPrefs')}
          </h3>
          {Object.entries(notifPrefs).map(([key, value]) => (
            <div key={key} className={styles.settingRow}>
              <div>
                <span className={styles.settingLabel}>
                  {key === 'scoreUpdates' && '⚽ Score Updates'}
                  {key === 'matchReminders' && '📅 Match Reminders'}
                  {key === 'mediaAlerts' && '🎬 New Media Alerts'}
                  {key === 'emailDigest' && '📧 Email Digest'}
                </span>
                <span className={styles.settingDesc}>
                  {key === 'scoreUpdates' && 'Get notified when your favorite teams score'}
                  {key === 'matchReminders' && 'Reminders before match kickoff'}
                  {key === 'mediaAlerts' && 'New highlights and interviews'}
                  {key === 'emailDigest' && 'Weekly email summary'}
                </span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifPrefs((prev) => ({ ...prev, [key]: e.target.checked }))}
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className={styles.settingsSection}>
          <h3 className="heading-4" style={{ marginBottom: 'var(--space-lg)' }}>
            {t('profile.settings')}
          </h3>

          <div className="input-group" style={{ maxWidth: '400px' }}>
            <label className="input-label">{t('profile.displayName')}</label>
            <input type="text" className="input" defaultValue={user.displayName} />
          </div>

          <div className="input-group" style={{ maxWidth: '400px', marginTop: 'var(--space-md)' }}>
            <label className="input-label">{t('profile.email')}</label>
            <input type="email" className="input" defaultValue={user.email} disabled />
          </div>

          <hr className="divider" style={{ margin: 'var(--space-xl) 0' }} />

          <h4 className="heading-5" style={{ marginBottom: 'var(--space-md)', color: 'var(--color-danger)' }}>
            Danger Zone
          </h4>
          <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={logout}>
            🚪 {t('nav.logout')}
          </button>
        </div>
      )}

      <div style={{ height: 'var(--space-2xl)' }} />
    </div>
  );
}
