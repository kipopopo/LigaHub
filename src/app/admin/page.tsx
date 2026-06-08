'use client';

import { useState } from 'react';
import { useTeams, useFixtures, useScores, useMedia, usePlayers, seedFirestore } from '@/lib/data-service';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { teams } = useTeams();
  const { fixtures } = useFixtures();
  const { scores } = useScores();
  const { media } = useMedia();
  const { players } = usePlayers();

  const [seeding, setSeeding] = useState(false);
  const [seedLogs, setSeedLogs] = useState<string[]>([]);

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

  const handleSeed = async () => {
    if (!confirm('This will overwrite all Firestore data with placeholder data. Continue?')) return;
    setSeeding(true);
    setSeedLogs([]);
    const logs = await seedFirestore();
    setSeedLogs(logs);
    setSeeding(false);
  };

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

      {/* Firestore Seed */}
      <h2 className="heading-4" style={{ marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-md)' }}>
        Database Management
      </h2>
      <div className={`card ${styles.seedSection}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.3rem' }}>🌱 Seed Firestore</h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              Push all placeholder data (teams, players, fixtures, etc.) to Firestore. This will overwrite existing data.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSeed} disabled={seeding}>
            {seeding ? '⏳ Seeding...' : '🚀 Seed All Data'}
          </button>
        </div>
        {seedLogs.length > 0 && (
          <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontFamily: 'monospace' }}>
            {seedLogs.map((log, i) => (
              <div key={i} style={{ padding: '0.2rem 0' }}>{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
