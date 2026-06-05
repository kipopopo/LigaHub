'use client';

import { teams, fixtures, scores, media, players } from '@/lib/placeholder-data';
import styles from './page.module.css';

export default function AdminDashboard() {
  const completedMatches = fixtures.filter((f) => f.status === 'completed').length;
  const upcomingMatches = fixtures.filter((f) => f.status === 'upcoming').length;
  const totalGoals = scores.reduce((sum, s) => sum + s.homeScore + s.awayScore, 0);

  const stats = [
    { icon: '👥', value: teams.length, label: 'Teams', color: 'var(--color-primary)' },
    { icon: '⚽', value: players.length, label: 'Players', color: 'var(--color-accent)' },
    { icon: '📅', value: fixtures.length, label: 'Total Fixtures', color: 'var(--color-info)' },
    { icon: '✅', value: completedMatches, label: 'Completed', color: 'var(--color-success)' },
    { icon: '⏳', value: upcomingMatches, label: 'Upcoming', color: 'var(--color-warning)' },
    { icon: '🥅', value: totalGoals, label: 'Total Goals', color: 'var(--color-danger)' },
    { icon: '🎬', value: media.length, label: 'Media Items', color: 'var(--color-primary-light)' },
    { icon: '📊', value: `${(totalGoals / (completedMatches || 1)).toFixed(1)}`, label: 'Goals/Match', color: 'var(--color-accent-light)' },
  ];

  return (
    <div id="admin-dashboard">
      <h1 className="heading-3" style={{ marginBottom: 'var(--space-lg)' }}>Dashboard</h1>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={`glass-card ${styles.statCard}`}>
            <div className={styles.statIconWrap} style={{ background: `${stat.color}22`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="heading-4" style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-md)' }}>
        Recent Results
      </h2>
      <div className={styles.recentList}>
        {fixtures
          .filter((f) => f.status === 'completed')
          .slice(0, 5)
          .map((fixture) => {
            const homeTeam = teams.find((t) => t.id === fixture.homeTeamId);
            const awayTeam = teams.find((t) => t.id === fixture.awayTeamId);
            const score = scores.find((s) => s.fixtureId === fixture.id);

            return (
              <div key={fixture.id} className={`card ${styles.recentItem}`}>
                <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>FT</span>
                <span className={styles.recentTeam}>{homeTeam?.shortName}</span>
                <span className="score-text" style={{ fontSize: 'var(--text-lg)' }}>
                  {score?.homeScore} - {score?.awayScore}
                </span>
                <span className={styles.recentTeam}>{awayTeam?.shortName}</span>
                <span className={styles.recentMeta}>{fixture.category} • {fixture.venue}</span>
              </div>
            );
          })}
      </div>

      {/* Quick Actions */}
      <h2 className="heading-4" style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-md)' }}>
        Quick Actions
      </h2>
      <div className={styles.actionsGrid}>
        <a href="/admin/fixtures/" className={`glass-card ${styles.actionCard}`}>
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <span className={styles.actionLabel}>Update Scores</span>
          <span className={styles.actionDesc}>Enter live match scores</span>
        </a>
        <a href="/admin/teams/" className={`glass-card ${styles.actionCard}`}>
          <span style={{ fontSize: '1.5rem' }}>👥</span>
          <span className={styles.actionLabel}>Manage Teams</span>
          <span className={styles.actionDesc}>Edit rosters & details</span>
        </a>
        <a href="/admin/media/" className={`glass-card ${styles.actionCard}`}>
          <span style={{ fontSize: '1.5rem' }}>🎬</span>
          <span className={styles.actionLabel}>Add Media</span>
          <span className={styles.actionDesc}>Upload highlights & interviews</span>
        </a>
      </div>
    </div>
  );
}
