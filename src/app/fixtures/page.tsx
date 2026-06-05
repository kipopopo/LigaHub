'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { fixtures, getTeamById, getScoreByFixture } from '@/lib/placeholder-data';
import type { Category, MatchStatus } from '@/types';
import styles from './page.module.css';

export default function FixturesPage() {
  const { t } = useI18n();
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all');

  const filteredFixtures = fixtures.filter((f) => {
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    return true;
  });

  // Group fixtures by date
  const groupedByDate = filteredFixtures.reduce<Record<string, typeof fixtures>>((acc, fixture) => {
    const dateKey = new Date(fixture.matchDate).toLocaleDateString('en-MY', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(fixture);
    return acc;
  }, {});

  return (
    <div className="container" id="fixtures-page">
      <div className={styles.pageHeader}>
        <h1 className="heading-2">{t('fixtures.title')}</h1>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className="tabs">
          {(['all', 'U15', 'U17'] as const).map((cat) => (
            <button
              key={cat}
              className={`tab ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all' ? t('fixtures.filter.all') : cat}
            </button>
          ))}
        </div>
        <div className="tabs">
          {(['all', 'upcoming', 'live', 'completed'] as const).map((status) => (
            <button
              key={status}
              className={`tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {t(`fixtures.filter.${status}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures List */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className={styles.emptyState}>
          <span style={{ fontSize: '2rem' }}>📅</span>
          <p>{t('fixtures.noMatches')}</p>
        </div>
      ) : (
        Object.entries(groupedByDate).map(([dateKey, dateFixtures]) => (
          <div key={dateKey} className={styles.dateGroup}>
            <h3 className={styles.dateLabel}>{dateKey}</h3>
            <div className={styles.fixturesList}>
              {dateFixtures.map((fixture) => {
                const homeTeam = getTeamById(fixture.homeTeamId);
                const awayTeam = getTeamById(fixture.awayTeamId);
                const score = getScoreByFixture(fixture.id);

                return (
                  <div key={fixture.id} className={`glass-card ${styles.fixtureCard}`}>
                    <div className={styles.fixtureLeft}>
                      <span className={`badge ${fixture.status === 'completed' ? 'badge-success' : fixture.status === 'live' ? 'badge-live' : 'badge-primary'}`}>
                        {fixture.status === 'completed' ? 'FT' : fixture.status === 'live' ? '● LIVE' : fixture.category}
                      </span>
                      <span className={styles.fixtureRound}>{t(`fixtures.round.${fixture.round}`)}</span>
                    </div>

                    <div className={styles.fixtureCenter}>
                      <div className={styles.fixtureTeam}>
                        <img src={homeTeam?.logoUrl} alt={homeTeam?.name} className={styles.fixtureLogo} />
                        <span className={styles.fixtureTeamName}>{homeTeam?.name}</span>
                      </div>

                      <div className={styles.fixtureScore}>
                        {score ? (
                          <span className="score-text" style={{ fontSize: 'var(--text-2xl)' }}>
                            {score.homeScore} - {score.awayScore}
                          </span>
                        ) : (
                          <span className={styles.fixtureTime}>
                            {new Date(fixture.matchDate).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div className={styles.fixtureTeam}>
                        <img src={awayTeam?.logoUrl} alt={awayTeam?.name} className={styles.fixtureLogo} />
                        <span className={styles.fixtureTeamName}>{awayTeam?.name}</span>
                      </div>
                    </div>

                    <div className={styles.fixtureRight}>
                      <span className={styles.fixtureVenue}>📍 {fixture.venue}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
