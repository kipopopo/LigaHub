'use client';

import { useI18n } from '@/lib/i18n';
import { useTeams, usePlayers } from '@/lib/data-service';
import type { Fixture, Score } from '@/types';
import styles from './MatchDetail.module.css';

interface MatchDetailProps {
  fixture: Fixture;
  score?: Score;
  onClose: () => void;
}

export default function MatchDetail({ fixture, score, onClose }: MatchDetailProps) {
  const { t } = useI18n();
  const { getTeamById } = useTeams();
  const { getPlayersByTeam, getPlayerById } = usePlayers();
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const homePlayers = getPlayersByTeam(fixture.homeTeamId);
  const awayPlayers = getPlayersByTeam(fixture.awayTeamId);

  if (!home || !away) return null;

  const homeGoals = score?.events.filter((e) => e.type === 'goal' && e.teamId === fixture.homeTeamId) || [];
  const awayGoals = score?.events.filter((e) => e.type === 'goal' && e.teamId === fixture.awayTeamId) || [];

  // Split events by half
  const firstHalf = score?.events.filter((e) => e.minute <= 45) || [];
  const secondHalf = score?.events.filter((e) => e.minute > 45) || [];

  // Match stats (simulated for completed matches)
  const matchStats = score ? [
    { label: t('match.detail.possession'), home: '52%', away: '48%', homeVal: 52 },
    { label: t('match.detail.shots'), home: `${3 + (score.homeScore * 2)}`, away: `${3 + (score.awayScore * 2)}`, homeVal: 50 + score.homeScore * 5 },
    { label: t('match.detail.shotsOnTarget'), home: `${score.homeScore + 1}`, away: `${score.awayScore + 1}`, homeVal: 50 },
    { label: t('match.detail.corners'), home: `${2 + Math.floor(Math.random() * 5)}`, away: `${2 + Math.floor(Math.random() * 5)}`, homeVal: 50 },
    { label: t('match.detail.fouls'), home: `${5 + Math.floor(Math.random() * 8)}`, away: `${5 + Math.floor(Math.random() * 8)}`, homeVal: 50 },
  ] : [];

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
    <div className={styles.overlay} onClick={onClose} id="match-detail-modal">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        {/* Header: Teams & Score */}
        <div className={styles.header}>
          <div className={styles.headerBg} style={{
            background: `linear-gradient(135deg, ${home.colors.primary}30, transparent, ${away.colors.primary}30)`,
          }} />
          <div className={styles.matchMeta}>
            <span className={`badge ${fixture.status === 'completed' ? 'badge-success' : fixture.status === 'live' ? 'badge-live' : 'badge-primary'}`}>
              {fixture.status === 'completed' ? 'FT' : fixture.status === 'live' ? '● LIVE' : fixture.category}
            </span>
            <span className={styles.matchMetaText}>{t(`fixtures.round.${fixture.round}`)}</span>
            <span className={styles.matchMetaText}>{fixture.category}</span>
          </div>

          <div className={styles.scoreBoard}>
            <div className={styles.teamSide}>
              <img src={home.logoUrl} alt={home.name} className={styles.teamLogo} />
              <span className={styles.teamName}>{home.name}</span>
              <div className={styles.goalScorers}>
                {homeGoals.map((g) => {
                  const player = getPlayerById(g.playerId);
                  return (
                    <span key={g.id} className={styles.scorer}>
                      ⚽ {player?.name || 'Unknown'} {g.minute}&apos;
                    </span>
                  );
                })}
              </div>
            </div>

            <div className={styles.scoreCenter}>
              {score ? (
                <span className={styles.scoreText}>{score.homeScore} - {score.awayScore}</span>
              ) : (
                <span className={styles.timeText}>
                  {new Date(fixture.matchDate).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            <div className={styles.teamSide}>
              <img src={away.logoUrl} alt={away.name} className={styles.teamLogo} />
              <span className={styles.teamName}>{away.name}</span>
              <div className={styles.goalScorers}>
                {awayGoals.map((g) => {
                  const player = getPlayerById(g.playerId);
                  return (
                    <span key={g.id} className={styles.scorer}>
                      ⚽ {player?.name || 'Unknown'} {g.minute}&apos;
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.matchInfo}>
            <span>📅 {new Date(fixture.matchDate).toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>📍 {fixture.venue}</span>
          </div>
        </div>

        {/* Events Timeline */}
        {score && score.events.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('match.detail.events')}</h3>

            {firstHalf.length > 0 && (
              <>
                <div className={styles.halfLabel}>{t('match.detail.firstHalf')}</div>
                {firstHalf.map((event) => {
                  const player = getPlayerById(event.playerId);
                  const isHome = event.teamId === fixture.homeTeamId;
                  return (
                    <div key={event.id} className={`${styles.eventRow} ${isHome ? styles.eventHome : styles.eventAway}`}>
                      {isHome ? (
                        <>
                          <span className={styles.eventInfo}>
                            <strong>{player?.name}</strong>
                            {event.description && <span className={styles.eventDesc}>{event.description}</span>}
                          </span>
                          <span className={styles.eventIcon}>{eventIcon(event.type)}</span>
                          <span className={styles.eventMinute}>{event.minute}&apos;</span>
                          <span className={styles.eventSpacer} />
                        </>
                      ) : (
                        <>
                          <span className={styles.eventSpacer} />
                          <span className={styles.eventMinute}>{event.minute}&apos;</span>
                          <span className={styles.eventIcon}>{eventIcon(event.type)}</span>
                          <span className={styles.eventInfo}>
                            <strong>{player?.name}</strong>
                            {event.description && <span className={styles.eventDesc}>{event.description}</span>}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {secondHalf.length > 0 && (
              <>
                <div className={styles.halfLabel}>{t('match.detail.secondHalf')}</div>
                {secondHalf.map((event) => {
                  const player = getPlayerById(event.playerId);
                  const isHome = event.teamId === fixture.homeTeamId;
                  return (
                    <div key={event.id} className={`${styles.eventRow} ${isHome ? styles.eventHome : styles.eventAway}`}>
                      {isHome ? (
                        <>
                          <span className={styles.eventInfo}>
                            <strong>{player?.name}</strong>
                            {event.description && <span className={styles.eventDesc}>{event.description}</span>}
                          </span>
                          <span className={styles.eventIcon}>{eventIcon(event.type)}</span>
                          <span className={styles.eventMinute}>{event.minute}&apos;</span>
                          <span className={styles.eventSpacer} />
                        </>
                      ) : (
                        <>
                          <span className={styles.eventSpacer} />
                          <span className={styles.eventMinute}>{event.minute}&apos;</span>
                          <span className={styles.eventIcon}>{eventIcon(event.type)}</span>
                          <span className={styles.eventInfo}>
                            <strong>{player?.name}</strong>
                            {event.description && <span className={styles.eventDesc}>{event.description}</span>}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* Match Stats */}
        {score && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('match.detail.stats')}</h3>
            <div className={styles.statsList}>
              {matchStats.map((stat, i) => (
                <div key={i} className={styles.statRow}>
                  <span className={styles.statValue}>{stat.home}</span>
                  <div className={styles.statCenter}>
                    <span className={styles.statLabel}>{stat.label}</span>
                    <div className={styles.statBar}>
                      <div className={styles.statBarHome} style={{ width: `${stat.homeVal}%` }} />
                      <div className={styles.statBarAway} style={{ width: `${100 - stat.homeVal}%` }} />
                    </div>
                  </div>
                  <span className={styles.statValue}>{stat.away}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lineups */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('match.detail.lineups')}</h3>
          <div className={styles.lineupsGrid}>
            {/* Home Lineup */}
            <div>
              <div className={styles.lineupTeamHeader} style={{ borderColor: home.colors.primary }}>
                <img src={home.logoUrl} alt={home.name} style={{ width: 20, height: 20 }} />
                <span>{home.shortName}</span>
              </div>
              <div className={styles.lineupList}>
                {homePlayers.slice(0, 11).map((p) => (
                  <div key={p.id} className={styles.lineupPlayer}>
                    <span className={styles.lineupNumber} style={{ background: home.colors.primary }}>{p.jerseyNumber}</span>
                    <span className={styles.lineupName}>{p.name}</span>
                    <span className={styles.lineupPos}>{p.position.slice(0, 3).toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <div className={styles.lineupSubsLabel}>{t('match.detail.substitutes')}</div>
              <div className={styles.lineupList}>
                {homePlayers.slice(11).map((p) => (
                  <div key={p.id} className={styles.lineupPlayer}>
                    <span className={styles.lineupNumber} style={{ background: home.colors.primary, opacity: 0.6 }}>{p.jerseyNumber}</span>
                    <span className={styles.lineupName} style={{ opacity: 0.6 }}>{p.name}</span>
                    <span className={styles.lineupPos}>{p.position.slice(0, 3).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Away Lineup */}
            <div>
              <div className={styles.lineupTeamHeader} style={{ borderColor: away.colors.primary }}>
                <img src={away.logoUrl} alt={away.name} style={{ width: 20, height: 20 }} />
                <span>{away.shortName}</span>
              </div>
              <div className={styles.lineupList}>
                {awayPlayers.slice(0, 11).map((p) => (
                  <div key={p.id} className={styles.lineupPlayer}>
                    <span className={styles.lineupNumber} style={{ background: away.colors.primary }}>{p.jerseyNumber}</span>
                    <span className={styles.lineupName}>{p.name}</span>
                    <span className={styles.lineupPos}>{p.position.slice(0, 3).toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <div className={styles.lineupSubsLabel}>{t('match.detail.substitutes')}</div>
              <div className={styles.lineupList}>
                {awayPlayers.slice(11).map((p) => (
                  <div key={p.id} className={styles.lineupPlayer}>
                    <span className={styles.lineupNumber} style={{ background: away.colors.primary, opacity: 0.6 }}>{p.jerseyNumber}</span>
                    <span className={styles.lineupName} style={{ opacity: 0.6 }}>{p.name}</span>
                    <span className={styles.lineupPos}>{p.position.slice(0, 3).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming match info */}
        {!score && fixture.status === 'upcoming' && (
          <div className={styles.section} style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              {t('match.detail.upcoming')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
