'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useTeams } from '@/lib/data-service';
import type { Category } from '@/types';
import styles from './page.module.css';

export default function TeamsPage() {
  const { t } = useI18n();
  const { teams } = useTeams();
  const [category, setCategory] = useState<Category | 'all'>('all');

  const filteredTeams = category === 'all' ? teams : teams.filter((team) => team.category === category);

  return (
    <div className="container" id="teams-page">
      <div className={styles.pageHeader}>
        <h1 className="heading-2">{t('teams.title')}</h1>
        <p className="text-muted">16 {t('nav.teams').toLowerCase()} • 2 {t('category.all').toLowerCase()}</p>
      </div>

      {/* Category Filter */}
      <div className="tabs" style={{ marginBottom: 'var(--space-xl)', width: 'fit-content' }}>
        {(['all', 'U15', 'U17'] as const).map((cat) => (
          <button
            key={cat}
            className={`tab ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat === 'all' ? t('fixtures.filter.all') : cat}
          </button>
        ))}
      </div>

      {/* Team Grid */}
      <div className={styles.teamGrid}>
        {filteredTeams.map((team, i) => (
          <Link
            key={team.id}
            href={`/teams/${team.slug}/`}
            className={`${styles.teamCard} animate-slide-up stagger-${(i % 6) + 1}`}
            id={`team-card-${team.slug}`}
          >
            <div className={styles.teamCardGlow} style={{ background: `linear-gradient(135deg, ${team.colors.primary}33, ${team.colors.secondary}22)` }} />
            <div className={styles.teamCardInner}>
              <div className={styles.teamCardHeader}>
                <span className={`badge ${team.category === 'U15' ? 'badge-primary' : 'badge-accent'}`}>
                  {team.category}
                </span>
                <span className="badge badge-primary" style={{ opacity: 0.7 }}>
                  {team.group === 'A' ? 'Group A' : 'Group B'}
                </span>
              </div>
              <div className={styles.teamCardLogo}>
                <img src={team.logoUrl} alt={team.name} />
              </div>
              <h3 className={styles.teamCardName}>{team.name}</h3>
              <p className={styles.teamCardDesc}>{team.description}</p>
              <div className={styles.teamCardFooter}>
                <span className={styles.teamCardShort} style={{ color: team.colors.primary }}>
                  {team.shortName}
                </span>
                <span className={styles.teamCardArrow}>→</span>
              </div>
            </div>
            <div className={styles.teamCardBorderGlow} style={{ borderColor: team.colors.primary }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
