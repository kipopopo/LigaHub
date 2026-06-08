'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTeams, useFixtures, useScores, usePlayers } from '@/lib/data-service';
import { isFirebaseConfigured, getFirebaseDb } from '@/lib/firebase';
import type { Fixture, Score, MatchEvent, Category, MatchStatus, Round } from '@/types';
import styles from './page.module.css';

export default function AdminFixturesPage() {
  const { teams } = useTeams();
  const { fixtures: allFixtures } = useFixtures();
  const { scores: loadedScores } = useScores();
  const { getPlayersByTeam } = usePlayers();

  const getTeamById = (id: string) => teams.find((t) => t.id === id);

  const [fixturesState, setFixturesState] = useState<Fixture[]>([]);
  const [scoresState, setScoresState] = useState<Score[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'all'>('all');
  const [editingFixture, setEditingFixture] = useState<string | null>(null);
  const [homeScoreInput, setHomeScoreInput] = useState(0);
  const [awayScoreInput, setAwayScoreInput] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  // --- Event form state ---
  const [eventType, setEventType] = useState<MatchEvent['type']>('goal');
  const [eventMinute, setEventMinute] = useState(1);
  const [eventTeamSide, setEventTeamSide] = useState<'home' | 'away'>('home');
  const [eventPlayerId, setEventPlayerId] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // --- Add Fixture Form State ---
  const [isAddingFixture, setIsAddingFixture] = useState(false);
  const [newFixtureCategory, setNewFixtureCategory] = useState<Category>('U15');
  const [newHomeTeamId, setNewHomeTeamId] = useState('');
  const [newAwayTeamId, setNewAwayTeamId] = useState('');
  const [newRound, setNewRound] = useState<Round>('group');
  const [newMatchDate, setNewMatchDate] = useState('');
  const [newVenue, setNewVenue] = useState('Pitch A');
  const [newFixtureStatus, setNewFixtureStatus] = useState<MatchStatus>('upcoming');
  const [newHomeScore, setNewHomeScore] = useState(0);
  const [newAwayScore, setNewAwayScore] = useState(0);

  // Sync data from hooks when they load
  useEffect(() => {
    setFixturesState(allFixtures);
  }, [allFixtures]);

  useEffect(() => {
    setScoresState(loadedScores);
  }, [loadedScores]);

  // Filter teams dynamically based on selected category for fixture creation
  const filteredTeamsForNewFixture = useMemo(() => {
    return teams.filter(t => t.category === newFixtureCategory);
  }, [teams, newFixtureCategory]);

  // Handle auto-populating default teams when category changes
  useEffect(() => {
    if (filteredTeamsForNewFixture.length >= 2) {
      setNewHomeTeamId(filteredTeamsForNewFixture[0].id);
      setNewAwayTeamId(filteredTeamsForNewFixture[1].id);
    } else {
      setNewHomeTeamId('');
      setNewAwayTeamId('');
    }
  }, [filteredTeamsForNewFixture]);

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
    setEvents(existingScore?.events ? [...existingScore.events] : []);
    resetEventForm();
  };

  const resetEventForm = () => {
    setEventType('goal');
    setEventMinute(1);
    setEventTeamSide('home');
    setEventPlayerId('');
    setEventDescription('');
  };

  const addEvent = (fixture: Fixture) => {
    if (!eventPlayerId) {
      showToast('⚠️ Please select a player');
      return;
    }
    const newEvent: MatchEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: eventType,
      minute: eventMinute,
      playerId: eventPlayerId,
      teamId: eventTeamSide === 'home' ? fixture.homeTeamId : fixture.awayTeamId,
      description: eventDescription || undefined,
    };
    setEvents((prev) => [...prev, newEvent].sort((a, b) => a.minute - b.minute));
    resetEventForm();
    showToast(`✅ ${eventType.replace('_', ' ')} added at ${eventMinute}'`);
  };

  const removeEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const saveScore = async (fixtureId: string) => {
    setSaving(true);

    const scoreData: Score = {
      id: `score-${fixtureId}`,
      fixtureId,
      homeScore: homeScoreInput,
      awayScore: awayScoreInput,
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin',
      events,
    };

    // Save to Firestore
    if (isFirebaseConfigured()) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const db = getFirebaseDb();
        
        // Save score
        await setDoc(doc(db, 'scores', fixtureId), scoreData);

        // Save updated fixture status
        const currentFixture = fixturesState.find((f) => f.id === fixtureId);
        if (currentFixture) {
          const updatedFixture = { ...currentFixture, status: 'completed' as const };
          await setDoc(doc(db, 'fixtures', fixtureId), updatedFixture);
        }
        showToast('✅ Score & fixture updated in Firestore!');
      } catch (err) {
        console.error('Firestore save error:', err);
        showToast('⚠️ Saved locally but Firestore sync failed');
      }
    } else {
      showToast('✅ Score & events saved locally');
    }

    // Update local state
    setScoresState((prev) => {
      const existing = prev.find((s) => s.fixtureId === fixtureId);
      if (existing) {
        return prev.map((s) => (s.fixtureId === fixtureId ? scoreData : s));
      }
      return [...prev, scoreData];
    });

    setFixturesState((prev) =>
      prev.map((f) => (f.id === fixtureId ? { ...f, status: 'completed' as const } : f))
    );

    setEditingFixture(null);
    setSaving(false);
  };

  const setFixtureStatus = async (fixtureId: string, status: MatchStatus) => {
    // Save to Firestore
    if (isFirebaseConfigured()) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const db = getFirebaseDb();
        const currentFixture = fixturesState.find((f) => f.id === fixtureId);
        if (currentFixture) {
          const updatedFixture = { ...currentFixture, status };
          await setDoc(doc(db, 'fixtures', fixtureId), updatedFixture);
          showToast(`✅ Status updated to ${status} in Firestore!`);
        }
      } catch (err) {
        console.error('Firestore status save error:', err);
        showToast('⚠️ Status updated locally but Firestore sync failed');
      }
    } else {
      showToast(`Status updated to ${status} locally`);
    }

    setFixturesState((prev) =>
      prev.map((f) => (f.id === fixtureId ? { ...f, status } : f))
    );
  };

  const handleAddFixture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomeTeamId || !newAwayTeamId) {
      showToast('⚠️ Home Team and Away Team are required');
      return;
    }
    if (newHomeTeamId === newAwayTeamId) {
      showToast('⚠️ Home Team and Away Team cannot be the same');
      return;
    }
    if (!newMatchDate) {
      showToast('⚠️ Match date and time are required');
      return;
    }

    setSaving(true);
    const newFixtureId = `fixture-${Date.now()}`;
    const homeTeamObj = teams.find(t => t.id === newHomeTeamId);

    const newFixture: Fixture = {
      id: newFixtureId,
      tournamentId: 'tournament-2026',
      groupId: homeTeamObj?.group ? `group-${newFixtureCategory.toLowerCase()}-${homeTeamObj.group.toLowerCase()}` : `group-${newFixtureCategory.toLowerCase()}-a`,
      category: newFixtureCategory,
      round: newRound,
      homeTeamId: newHomeTeamId,
      awayTeamId: newAwayTeamId,
      matchDate: new Date(newMatchDate).toISOString(),
      venue: newVenue,
      status: newFixtureStatus,
    };

    // Save to Firestore
    if (isFirebaseConfigured()) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const db = getFirebaseDb();
        await setDoc(doc(db, 'fixtures', newFixtureId), newFixture);

        // If completed, save scores too
        if (newFixtureStatus === 'completed') {
          const newScoreObj: Score = {
            id: `score-${newFixtureId}`,
            fixtureId: newFixtureId,
            homeScore: newHomeScore,
            awayScore: newAwayScore,
            updatedAt: new Date().toISOString(),
            updatedBy: 'admin',
            events: [],
          };
          await setDoc(doc(db, 'scores', newFixtureId), newScoreObj);
          setScoresState(prev => [...prev, newScoreObj]);
        }

        showToast('🚀 New fixture added to Firestore!');
      } catch (err) {
        console.error(err);
        showToast('⚠️ Added locally, Firestore sync failed');
      }
    } else {
      // Offline fallback
      if (newFixtureStatus === 'completed') {
        const newScoreObj: Score = {
          id: `score-${newFixtureId}`,
          fixtureId: newFixtureId,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin',
          events: [],
        };
        setScoresState(prev => [...prev, newScoreObj]);
      }
      showToast('🚀 New fixture added locally');
    }

    setFixturesState(prev => [newFixture, ...prev]);
    setIsAddingFixture(false);
    resetAddFixtureForm();
    setSaving(false);
  };

  const resetAddFixtureForm = () => {
    setNewRound('group');
    setNewMatchDate('');
    setNewVenue('Pitch A');
    setNewFixtureStatus('upcoming');
    setNewHomeScore(0);
    setNewAwayScore(0);
  };

  const handleDeleteFixture = async (fixtureId: string) => {
    if (!confirm('⚠️ Are you sure you want to delete this fixture? This will also delete its scores.')) return;
    setSaving(true);

    if (isFirebaseConfigured()) {
      try {
        const { doc, deleteDoc } = await import('firebase/firestore');
        const db = getFirebaseDb();
        
        // Delete fixture doc
        await deleteDoc(doc(db, 'fixtures', fixtureId));
        
        // Delete score doc if exists
        await deleteDoc(doc(db, 'scores', fixtureId));
        
        showToast('🗑️ Fixture and scores deleted from Firestore');
      } catch (err) {
        console.error(err);
        showToast('⚠️ Deleted locally, Firestore sync failed');
      }
    } else {
      showToast('🗑️ Fixture deleted locally');
    }

    setFixturesState((prev) => prev.filter((f) => f.id !== fixtureId));
    setScoresState((prev) => prev.filter((s) => s.fixtureId !== fixtureId));
    setSaving(false);
  };

  const eventIcon = (type: string) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow_card': return '🟨';
      case 'red_card': return '🟥';
      case 'substitution': return '🔄';
      case 'penalty': return '⚽🅿️';
      default: return '•';
    }
  };

  return (
    <div id="admin-fixtures">
      <h1 className="heading-3" style={{ marginBottom: 'var(--space-lg)' }}>Fixtures & Scores</h1>

      {/* Control Area: Filters and Add Fixture Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div className={styles.filters} style={{ margin: 0 }}>
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

        <button className="btn btn-primary" onClick={() => setIsAddingFixture(prev => !prev)}>
          {isAddingFixture ? '✕ Close Form' : '➕ Add Fixture'}
        </button>
      </div>

      {/* Add Fixture Form */}
      {isAddingFixture && (
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)', border: '1px solid var(--color-border-subtle)' }}>
          <h2 className="heading-4" style={{ marginBottom: 'var(--space-md)' }}>➕ Add New Fixture</h2>
          <form onSubmit={handleAddFixture} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                <label className={styles.fieldLabel}>Category</label>
                <select
                  className="input"
                  value={newFixtureCategory}
                  onChange={(e) => setNewFixtureCategory(e.target.value as Category)}
                >
                  <option value="U15">U15</option>
                  <option value="U17">U17</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                <label className={styles.fieldLabel}>Round</label>
                <select
                  className="input"
                  value={newRound}
                  onChange={(e) => setNewRound(e.target.value as Round)}
                >
                  <option value="group">Group Stage</option>
                  <option value="quarter">Quarter Final</option>
                  <option value="semi">Semi Final</option>
                  <option value="final">Final</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label className={styles.fieldLabel}>Home Team *</label>
                <select
                  className="input"
                  value={newHomeTeamId}
                  onChange={(e) => setNewHomeTeamId(e.target.value)}
                  required
                >
                  <option value="">Select home team...</option>
                  {filteredTeamsForNewFixture.map(t => (
                    <option key={t.id} value={t.id}>{t.name} (Group {t.group})</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label className={styles.fieldLabel}>Away Team *</label>
                <select
                  className="input"
                  value={newAwayTeamId}
                  onChange={(e) => setNewAwayTeamId(e.target.value)}
                  required
                >
                  <option value="">Select away team...</option>
                  {filteredTeamsForNewFixture.map(t => (
                    <option key={t.id} value={t.id}>{t.name} (Group {t.group})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                <label className={styles.fieldLabel}>Match Date & Time *</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={newMatchDate}
                  onChange={(e) => setNewMatchDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                <label className={styles.fieldLabel}>Venue</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Pitch A"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                <label className={styles.fieldLabel}>Status</label>
                <select
                  className="input"
                  value={newFixtureStatus}
                  onChange={(e) => setNewFixtureStatus(e.target.value as MatchStatus)}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed (FT)</option>
                </select>
              </div>
            </div>

            {newFixtureStatus === 'completed' && (
              <div className="card" style={{ padding: 'var(--space-sm)', background: 'var(--color-surface-hover)', display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                <span className={styles.fieldLabel} style={{ margin: 0 }}>Initial Score:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={newHomeScore}
                    onChange={(e) => setNewHomeScore(Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ width: '60px', textAlign: 'center' }}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={newAwayScore}
                    onChange={(e) => setNewAwayScore(Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ width: '60px', textAlign: 'center' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Fixture'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setIsAddingFixture(false); resetAddFixtureForm(); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fixtures List */}
      <div className={styles.fixturesList}>
        {filtered.map((fixture) => {
          const homeTeam = getTeamById(fixture.homeTeamId);
          const awayTeam = getTeamById(fixture.awayTeamId);
          const score = scoresState.find((s) => s.fixtureId === fixture.id);
          const isEditing = editingFixture === fixture.id;
          const homePlayers = getPlayersByTeam(fixture.homeTeamId);
          const awayPlayers = getPlayersByTeam(fixture.awayTeamId);
          const currentPlayers = eventTeamSide === 'home' ? homePlayers : awayPlayers;

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

              {/* Match Events Editor */}
              {isEditing && (
                <div className={styles.eventsEditor}>
                  <h4 className={styles.eventsTitle}>Match Events</h4>

                  {/* Events List */}
                  {events.length > 0 && (
                    <div className={styles.eventsList}>
                      {events.map((evt) => {
                        const player = [...homePlayers, ...awayPlayers].find((p) => p.id === evt.playerId);
                        const team = getTeamById(evt.teamId);
                        return (
                          <div key={evt.id} className={styles.eventItem}>
                            <span className={styles.eventMinute}>{evt.minute}&apos;</span>
                            <span className={styles.eventIconBadge}>{eventIcon(evt.type)}</span>
                            <span className={styles.eventPlayerName}>{player?.name || 'Unknown'}</span>
                            <span className={styles.eventTeamBadge} style={{ background: `${team?.colors.primary}33`, color: team?.colors.primary }}>
                              {team?.shortName}
                            </span>
                            {evt.description && (
                              <span className={styles.eventDesc}>{evt.description}</span>
                            )}
                            <button className={styles.eventRemoveBtn} onClick={() => removeEvent(evt.id)} title="Remove">✕</button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Event Form */}
                  <div className={styles.addEventForm}>
                    <div className={styles.addEventRow}>
                      <select value={eventType} onChange={(e) => setEventType(e.target.value as MatchEvent['type'])} className={styles.eventSelect}>
                        <option value="goal">⚽ Goal</option>
                        <option value="yellow_card">🟨 Yellow Card</option>
                        <option value="red_card">🟥 Red Card</option>
                        <option value="substitution">🔄 Substitution</option>
                        <option value="penalty">⚽ Penalty</option>
                      </select>

                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={eventMinute}
                        onChange={(e) => setEventMinute(Number(e.target.value))}
                        className={styles.eventMinuteInput}
                        placeholder="Min"
                      />
                      <span className={styles.eventMinuteLabel}>&apos;</span>
                    </div>

                    <div className={styles.addEventRow}>
                      <div className={styles.teamToggle}>
                        <button
                          className={`${styles.teamToggleBtn} ${eventTeamSide === 'home' ? styles.teamToggleActive : ''}`}
                          onClick={() => { setEventTeamSide('home'); setEventPlayerId(''); }}
                        >
                          {homeTeam?.shortName}
                        </button>
                        <button
                          className={`${styles.teamToggleBtn} ${eventTeamSide === 'away' ? styles.teamToggleActive : ''}`}
                          onClick={() => { setEventTeamSide('away'); setEventPlayerId(''); }}
                        >
                          {awayTeam?.shortName}
                        </button>
                      </div>

                      <select
                        value={eventPlayerId}
                        onChange={(e) => setEventPlayerId(e.target.value)}
                        className={styles.eventSelect}
                        style={{ flex: 1 }}
                      >
                        <option value="">Select player...</option>
                        {currentPlayers.map((p) => (
                          <option key={p.id} value={p.id}>#{p.jerseyNumber} {p.name} ({p.position})</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.addEventRow}>
                      <input
                        type="text"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        className={styles.eventDescInput}
                        placeholder={eventType === 'goal' ? 'Assist: player name' : eventType === 'substitution' ? 'In: player name' : 'Optional note...'}
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => addEvent(fixture)}>
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Show existing events count when not editing */}
              {!isEditing && score && score.events.length > 0 && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {score.events.filter((e) => e.type === 'goal').length} goals •{' '}
                  {score.events.filter((e) => e.type === 'yellow_card').length} yellow •{' '}
                  {score.events.filter((e) => e.type === 'red_card').length} red •{' '}
                  {score.events.filter((e) => e.type === 'substitution').length} subs
                </div>
              )}

              {/* Actions */}
              <div className={styles.fixtureActions}>
                {isEditing ? (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => saveScore(fixture.id)} disabled={saving}>
                      {saving ? '⏳ Saving...' : '💾 Save Score & Events'}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingFixture(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => startEditing(fixture)}>
                      ✏️ {score ? 'Edit Score & Events' : 'Enter Score'}
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
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeleteFixture(fixture.id)}
                      style={{ color: 'var(--color-danger)', marginLeft: 'auto' }}
                      disabled={saving}
                    >
                      🗑️ Delete
                    </button>
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
