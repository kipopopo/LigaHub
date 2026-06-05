'use client';

import { useState, useMemo } from 'react';
import { fixtures as allFixtures, teams, scores as allScores, getTeamById } from '@/lib/placeholder-data';
import type { Fixture, Score, Category, MatchStatus } from '@/types';
import styles from './page.module.css';

export default function AdminFixturesPage() {
  const [fixturesState, setFixturesState] = useState<Fixture[]>([...allFixtures]);
  const [scoresState, setScoresState] = useState<Score[]>([...allScores]);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all');
  const [editingFixture, setEditingFixture] = useState<string | null>(null);
  const [homeScoreInput, setHomeScoreInput] = useState(0);
  const [awayScoreInput, setAwayScoreInput] = useState(0);
  const [toast, setToast] = useState('');

  const filtered = useMemo(() => {
    return fixturesState.filter((f) => {
      if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      return true;
    });
  }, [fixturesState, categoryFilter, statusFilter]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const startEditing = (fixture: Fixture) => {
    const existingScore = scoresState.find((s) => s.fixtureId === fixture.id);
    setEditingFixture(fixture.id);
    setHomeScoreInput(existingScore?.homeScore ?? 0);
    setAwayScoreInput(existingScore?.awayScore ?? 0);
  };

  const saveScore = (fixtureId: string) => {
    // Update or create score
    setScoresState((prev) => {
      const existing = prev.find((s) => s.fixtureId === fixtureId);
      if (existing) {
        return prev.map((s) =>
          s.fixtureId === fixtureId
            ? { ...s, homeScore: homeScoreInput, awayScore: awayScoreInput, updatedAt: new Date().toISOString(), updatedBy: 'admin' }
            : s
        );
      }
      return [
        ...prev,
        {
          id: `score-${fixtureId}`,
          fixtureId,
          homeScore: homeScoreInput,
          awayScore: awayScoreInput,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin',
          events: [],
        },
      ];
    });

    // Mark fixture as completed
    setFixturesState((prev) =>
      prev.map((f) => (f.id === fixtureId ? { ...f, status: 'completed' as const } : f))
    );

    setEditingFixture(null);
    showToast('✅ Score updated successfully!');
  };

  const setFixtureStatus = (fixtureId: string, status: MatchStatus) => {
    setFixturesState((prev) =>
      prev.map((f) => (f.id === fixtureId ? { ...f, status } : f))
    );
    showToast(`Status updated to ${status}`);
  };

  return (
    <div id="admin-fixtures">
      <h1 className="heading-3" style={{ marginBottom: 'var(--space-lg)' }}>Fixtures & Scores</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <div className="tabs">
          {(['all', 'U15', 'U17'] as const).map((cat) => (
            <button key={cat} className={`tab ${categoryFilter === cat ? 'active' : ''}`} onClick={() => setCategoryFilter(cat)}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
        <div className="tabs">
          {(['all', 'upcoming', 'live', 'completed'] as const).map((s) => (
            <button key={s} className={`tab ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures List */}
      <div className={styles.fixturesList}>
        {filtered.map((fixture) => {
          const homeTeam = getTeamById(fixture.homeTeamId);
          const awayTeam = getTeamById(fixture.awayTeamId);
          const score = scoresState.find((s) => s.fixtureId === fixture.id);
          const isEditing = editingFixture === fixture.id;

          return (
            <div key={fixture.id} className={`card ${styles.fixtureCard}`}>
              <div className={styles.fixtureTop}>
                <div className={styles.fixtureMeta}>
                  <span className={`badge ${fixture.status === 'completed' ? 'badge-success' : fixture.status === 'live' ? 'badge-live' : 'badge-primary'}`}>
                    {fixture.status === 'completed' ? 'FT' : fixture.status === 'live' ? '● LIVE' : fixture.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {fixture.category} • {fixture.venue}
                  </span>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {new Date(fixture.matchDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                  {' '}
                  {new Date(fixture.matchDate).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className={styles.fixtureMatch}>
                <div className={styles.fixtureTeam}>
                  <img src={homeTeam?.logoUrl} alt={homeTeam?.name} className={styles.fixtureLogo} />
                  <span className={styles.fixtureTeamName}>{homeTeam?.name}</span>
                </div>

                {isEditing ? (
                  <div className={styles.scoreEditor}>
                    <div className={styles.scoreInputGroup}>
                      <button className={styles.scoreBtn} onClick={() => setHomeScoreInput(Math.max(0, homeScoreInput - 1))}>−</button>
                      <span className={styles.scoreDisplay}>{homeScoreInput}</span>
                      <button className={styles.scoreBtn} onClick={() => setHomeScoreInput(homeScoreInput + 1)}>+</button>
                    </div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>vs</span>
                    <div className={styles.scoreInputGroup}>
                      <button className={styles.scoreBtn} onClick={() => setAwayScoreInput(Math.max(0, awayScoreInput - 1))}>−</button>
                      <span className={styles.scoreDisplay}>{awayScoreInput}</span>
                      <button className={styles.scoreBtn} onClick={() => setAwayScoreInput(awayScoreInput + 1)}>+</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.fixtureScore}>
                    {score ? (
                      <span className="score-text" style={{ fontSize: 'var(--text-2xl)' }}>
                        {score.homeScore} - {score.awayScore}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>vs</span>
                    )}
                  </div>
                )}

                <div className={styles.fixtureTeam} style={{ textAlign: 'right' }}>
                  <img src={awayTeam?.logoUrl} alt={awayTeam?.name} className={styles.fixtureLogo} />
                  <span className={styles.fixtureTeamName}>{awayTeam?.name}</span>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.fixtureActions}>
                {isEditing ? (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => saveScore(fixture.id)}>
                      💾 Save Score
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingFixture(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => startEditing(fixture)}>
                      ✏️ {score ? 'Edit Score' : 'Enter Score'}
                    </button>
                    {fixture.status !== 'live' && (
                      <button className="btn btn-ghost btn-sm" onClick={() => setFixtureStatus(fixture.id, 'live')} style={{ color: 'var(--color-danger)' }}>
                        ● Set Live
                      </button>
                    )}
                    {fixture.status === 'live' && (
                      <button className="btn btn-ghost btn-sm" onClick={() => setFixtureStatus(fixture.id, 'completed')}>
                        ✅ End Match
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div className={styles.toast} id="admin-toast">
          {toast}
        </div>
      )}
    </div>
  );
}
