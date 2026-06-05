'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  teams,
  getTeamBySlug,
  getPlayersByTeam,
  getStaffByTeam,
  getKitsByTeam,
  getFixturesByTeam,
  getTeamById,
  getScoreByFixture,
} from '@/lib/placeholder-data';
import Legend from '@/components/ui/Legend';
import styles from './page.module.css';

export default function TeamProfilePage() {
  const { t } = useI18n();
  const params = useParams();
  const slug = params.slug as string;
  const team = getTeamBySlug(slug);
  const [activeTab, setActiveTab] = useState('squad');

  if (!team) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 'var(--space-4xl)' }}>
        <h1 className="heading-3">Team not found</h1>
        <Link href="/teams/" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>← Back to Teams</Link>
      </div>
    );
  }

  const players = getPlayersByTeam(team.id);
  const staffMembers = getStaffByTeam(team.id);
  const teamKits = getKitsByTeam(team.id);
  const teamFixtures = getFixturesByTeam(team.id);

  const tabs = [
    { id: 'squad', label: t('teams.squad') },
    { id: 'staff', label: t('teams.staff') },
    { id: 'kits', label: t('teams.kits') },
    { id: 'fixtures', label: t('teams.fixtures') },
  ];

  return (
    <div id="team-profile-page">
      {/* Team Header */}
      <div className={styles.teamHeader} style={{ background: `linear-gradient(135deg, ${team.colors.primary}22, ${team.colors.secondary}15, var(--color-bg))` }}>
        <div className={`container ${styles.teamHeaderInner}`}>
          <div className={styles.teamInfo}>
            <div className={styles.teamLogo}>
              <img src={team.logoUrl} alt={team.name} />
            </div>
            <div className={styles.teamDetails}>
              <div className={styles.teamBadges}>
                <span className={`badge ${team.category === 'U15' ? 'badge-primary' : 'badge-accent'}`}>
                  {team.category}
                </span>
                <span className="badge badge-primary">{team.group === 'A' ? 'Group A' : 'Group B'}</span>
              </div>
              <h1 className="heading-2">{team.name}</h1>
              <p className={styles.teamDesc}>{team.description}</p>
              <div className={styles.teamColors}>
                <span className={styles.colorSwatch} style={{ background: team.colors.primary }} />
                <span className={styles.colorSwatch} style={{ background: team.colors.secondary }} />
                <span className={styles.teamShortName}>{team.shortName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
          <div className="tabs" style={{ width: 'fit-content' }}>
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
          <Legend items={[
            { abbr: '⚽', meaning: t('legend.goals') },
            { abbr: '🅰️', meaning: t('legend.assists') },
            { abbr: '👕', meaning: t('legend.apps') },
            { abbr: 'FT', meaning: t('legend.ft'), color: '#22c55e' },
            { abbr: 'U15', meaning: t('legend.u15'), color: '#6366f1' },
            { abbr: 'U17', meaning: t('legend.u17'), color: '#8b5cf6' },
          ]} />
        </div>

        {/* Squad Tab */}
        {activeTab === 'squad' && (
          <div className={styles.playerGrid}>
            {players.map((player) => (
              <div key={player.id} className={`card ${styles.playerCard}`}>
                <div className={styles.playerPhoto}>
                  <img src={player.photoUrl} alt={player.name} />
                  <span className={styles.playerNumber} style={{ background: team.colors.primary }}>
                    {player.jerseyNumber}
                  </span>
                </div>
                <div className={styles.playerInfo}>
                  <h4 className={styles.playerName}>{player.name}</h4>
                  <span className={styles.playerPosition}>{player.position}</span>
                </div>
                <div className={styles.playerStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{player.stats.goals}</span>
                    <span className={styles.statLabel}>⚽</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{player.stats.assists}</span>
                    <span className={styles.statLabel}>🅰️</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{player.stats.appearances}</span>
                    <span className={styles.statLabel}>👕</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className={styles.staffGrid}>
            {staffMembers.map((member) => (
              <div key={member.id} className={`card ${styles.staffCard}`}>
                <div className={styles.staffPhoto}>
                  <img src={member.photoUrl} alt={member.name} />
                </div>
                <div className={styles.staffInfo}>
                  <h4 className={styles.staffName}>{member.name}</h4>
                  <span className={styles.staffRole}>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Kits Tab */}
        {activeTab === 'kits' && (
          <div className={styles.kitsGrid}>
            {teamKits.map((kit) => (
              <div key={kit.id} className={`card ${styles.kitCard}`}>
                <div className={styles.kitImage}>
                  <img src={kit.imageUrl} alt={`${team.name} ${kit.type} kit`} />
                </div>
                <div className={styles.kitLabel}>
                  <span className="badge badge-primary">{kit.type === 'home' ? 'Home' : 'Away'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fixtures Tab */}
        {activeTab === 'fixtures' && (
          <div className={styles.fixturesList}>
            {teamFixtures.map((fixture) => {
              const homeTeam = getTeamById(fixture.homeTeamId);
              const awayTeam = getTeamById(fixture.awayTeamId);
              const score = getScoreByFixture(fixture.id);

              return (
                <div key={fixture.id} className={`glass-card ${styles.fixtureCard}`}>
                  <div className={styles.fixtureInfo}>
                    <span className={`badge ${fixture.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                      {fixture.status === 'completed' ? 'FT' : fixture.category}
                    </span>
                    <span className={styles.fixtureDate}>
                      {new Date(fixture.matchDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className={styles.fixtureMatch}>
                    <span className={styles.fixtureTeamName} style={{ textAlign: 'right' }}>
                      {homeTeam?.shortName}
                    </span>
                    {score ? (
                      <span className="score-text" style={{ fontSize: 'var(--text-xl)', minWidth: '60px', textAlign: 'center' }}>
                        {score.homeScore} - {score.awayScore}
                      </span>
                    ) : (
                      <span style={{ minWidth: '60px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                        {new Date(fixture.matchDate).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    <span className={styles.fixtureTeamName}>{awayTeam?.shortName}</span>
                  </div>
                  <span className={styles.fixtureVenue}>📍 {fixture.venue}</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ height: 'var(--space-2xl)' }} />
      </div>
    </div>
  );
}
