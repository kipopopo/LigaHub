'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { tournament, teams, fixtures, scores, media, getTeamById, getScoreByFixture } from '@/lib/placeholder-data';
import styles from './page.module.css';

function CountdownTimer() {
  const { t } = useI18n();
  // Find next upcoming fixture
  const nextFixture = fixtures.find((f) => f.status === 'upcoming');
  if (!nextFixture) return null;

  const homeTeam = getTeamById(nextFixture.homeTeamId);
  const awayTeam = getTeamById(nextFixture.awayTeamId);

  // Static countdown display (would be dynamic with useEffect in production)
  return (
    <div className={styles.countdownCard}>
      <span className={`badge badge-accent ${styles.countdownBadge}`}>{t('home.countdown.title')}</span>
      <div className={styles.countdownMatch}>
        <div className={styles.countdownTeam}>
          <img src={homeTeam?.logoUrl} alt={homeTeam?.name} className={styles.countdownLogo} />
          <span className={styles.countdownTeamName}>{homeTeam?.shortName}</span>
        </div>
        <div className={styles.countdownVs}>
          <span className="score-text" style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)' }}>VS</span>
        </div>
        <div className={styles.countdownTeam}>
          <img src={awayTeam?.logoUrl} alt={awayTeam?.name} className={styles.countdownLogo} />
          <span className={styles.countdownTeamName}>{awayTeam?.shortName}</span>
        </div>
      </div>
      <div className={styles.countdownTimer}>
        {[
          { value: '15', label: t('home.countdown.days') },
          { value: '08', label: t('home.countdown.hours') },
          { value: '42', label: t('home.countdown.minutes') },
          { value: '17', label: t('home.countdown.seconds') },
        ].map((item) => (
          <div key={item.label} className={styles.countdownUnit}>
            <span className={styles.countdownValue}>{item.value}</span>
            <span className={styles.countdownLabel}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.countdownMeta}>
        <span>📍 {nextFixture.venue}</span>
        <span>•</span>
        <span>{new Date(nextFixture.matchDate).toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
      </div>
    </div>
  );
}

function MatchCard({ fixtureId }: { fixtureId: string }) {
  const fixture = fixtures.find((f) => f.id === fixtureId);
  if (!fixture) return null;
  const homeTeam = getTeamById(fixture.homeTeamId);
  const awayTeam = getTeamById(fixture.awayTeamId);
  const score = getScoreByFixture(fixture.id);

  return (
    <div className={`glass-card ${styles.matchCard}`}>
      <div className={styles.matchHeader}>
        <span className={`badge ${fixture.status === 'live' ? 'badge-live' : fixture.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
          {fixture.status === 'completed' ? 'FT' : fixture.status === 'live' ? '● LIVE' : fixture.category}
        </span>
        <span className={styles.matchVenue}>{fixture.venue}</span>
      </div>
      <div className={styles.matchBody}>
        <div className={styles.matchTeam}>
          <img src={homeTeam?.logoUrl} alt={homeTeam?.name} className={styles.matchLogo} />
          <span className={styles.matchTeamName}>{homeTeam?.shortName}</span>
        </div>
        <div className={styles.matchScore}>
          {score ? (
            <span className="score-text" style={{ fontSize: 'var(--text-3xl)' }}>
              {score.homeScore} - {score.awayScore}
            </span>
          ) : (
            <span className={styles.matchTime}>
              {new Date(fixture.matchDate).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <div className={styles.matchTeam}>
          <img src={awayTeam?.logoUrl} alt={awayTeam?.name} className={styles.matchLogo} />
          <span className={styles.matchTeamName}>{awayTeam?.shortName}</span>
        </div>
      </div>
      <div className={styles.matchDate}>
        {new Date(fixture.matchDate).toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' })}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { t } = useI18n();

  const completedFixtures = fixtures.filter((f) => f.status === 'completed').slice(0, 4);
  const upcomingFixtures = fixtures.filter((f) => f.status === 'upcoming').slice(0, 6);
  const u15Teams = teams.filter((team) => team.category === 'U15');
  const u17Teams = teams.filter((team) => team.category === 'U17');

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero} id="hero-section">
        <div className={styles.heroBg}>
          <div className={styles.heroGlow1} />
          <div className={styles.heroGlow2} />
          <div className={styles.heroGlow3} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <span className={`badge badge-accent ${styles.heroBadge}`}>
              ⚽ {tournament.season} Season
            </span>
            <h1 className={`heading-1 ${styles.heroTitle}`}>
              <span className="gradient-text">{tournament.name.split(' ').slice(0, 2).join(' ')}</span>
              <br />
              {tournament.name.split(' ').slice(2).join(' ')}
            </h1>
            <p className={styles.heroSubtitle}>
              {t('home.hero.subtitle')} — 16 {t('nav.teams')}, 2 {t('category.all').toLowerCase()}, 1 champion.
            </p>
            <div className={styles.heroActions}>
              <Link href="/fixtures/" className="btn btn-primary btn-lg" id="hero-cta">
                {t('home.hero.cta')} →
              </Link>
              <Link href="/teams/" className="btn btn-ghost btn-lg">
                {t('home.teams.title')}
              </Link>
            </div>
          </div>
          <div className={styles.heroCountdown}>
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Latest Results */}
      {completedFixtures.length > 0 && (
        <section className="section" id="latest-results">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className="heading-3">{t('home.results.title')}</h2>
              <Link href="/fixtures/" className="btn btn-ghost btn-sm">
                {t('home.viewAll')} →
              </Link>
            </div>
            <div className={styles.matchGrid}>
              {completedFixtures.map((fixture, i) => (
                <div key={fixture.id} className={`animate-slide-up stagger-${i + 1}`}>
                  <MatchCard fixtureId={fixture.id} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Matches Carousel */}
      <section className="section" id="upcoming-matches" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-3">{t('home.upcoming.title')}</h2>
            <Link href="/fixtures/" className="btn btn-ghost btn-sm">
              {t('home.viewAll')} →
            </Link>
          </div>
        </div>
        <div className="carousel" style={{ paddingBlock: 'var(--space-md)' }}>
          {upcomingFixtures.map((fixture) => (
            <div key={fixture.id} style={{ width: 'min(320px, 80vw)' }}>
              <MatchCard fixtureId={fixture.id} />
            </div>
          ))}
        </div>
      </section>

      {/* Participating Teams */}
      <section className="section" id="teams-section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-3">{t('home.teams.title')}</h2>
            <Link href="/teams/" className="btn btn-ghost btn-sm">
              {t('home.viewAll')} →
            </Link>
          </div>

          {/* U15 */}
          <div className={styles.categorySection}>
            <span className="badge badge-primary" style={{ marginBottom: 'var(--space-md)' }}>U15</span>
            <div className={styles.teamLogoGrid}>
              {u15Teams.map((team) => (
                <Link key={team.id} href={`/teams/${team.slug}/`} className={styles.teamLogoCard} title={team.name}>
                  <div className={styles.teamLogoWrapper} style={{ borderColor: team.colors.primary }}>
                    <img src={team.logoUrl} alt={team.name} className={styles.teamLogoImg} />
                  </div>
                  <span className={styles.teamLogoName}>{team.shortName}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* U17 */}
          <div className={styles.categorySection}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-md)' }}>U17</span>
            <div className={styles.teamLogoGrid}>
              {u17Teams.map((team) => (
                <Link key={team.id} href={`/teams/${team.slug}/`} className={styles.teamLogoCard} title={team.name}>
                  <div className={styles.teamLogoWrapper} style={{ borderColor: team.colors.primary }}>
                    <img src={team.logoUrl} alt={team.name} className={styles.teamLogoImg} />
                  </div>
                  <span className={styles.teamLogoName}>{team.shortName}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Media */}
      <section className="section" id="media-section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="heading-3">{t('home.media.title')}</h2>
            <Link href="/media/" className="btn btn-ghost btn-sm">
              {t('home.viewAll')} →
            </Link>
          </div>
          <div className="grid-auto">
            {media.slice(0, 3).map((item, i) => (
              <div key={item.id} className={`glass-card ${styles.mediaCard} animate-slide-up stagger-${i + 1}`}>
                <div className={styles.mediaThumbnail}>
                  <img src={item.thumbnailUrl} alt={item.title} />
                  <div className={styles.mediaPlayBtn}>▶</div>
                  <span className={`badge ${item.type === 'highlight' ? 'badge-accent' : 'badge-primary'} ${styles.mediaTypeBadge}`}>
                    {item.type === 'highlight' ? t('media.highlights') : t('media.interviews')}
                  </span>
                </div>
                <div className={styles.mediaInfo}>
                  <h4 className={styles.mediaTitle}>{item.title}</h4>
                  <p className={styles.mediaDesc}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
