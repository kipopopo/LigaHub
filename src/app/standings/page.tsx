'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { teams, fixtures, scores, groups } from '@/lib/placeholder-data';
import { getGroupStandings } from '@/lib/standings';
import Legend from '@/components/ui/Legend';
import type { Category } from '@/types';
import styles from './page.module.css';

export default function StandingsPage() {
  const { t } = useI18n();
  const [category, setCategory] = useState<Category>('U15');

  const categoryGroups = groups.filter((g) => g.category === category);

  const standingsLegend = [
    { abbr: 'Pos', meaning: t('legend.pos') },
    { abbr: t('standings.p'), meaning: t('legend.p') },
    { abbr: t('standings.w'), meaning: t('legend.w'), color: '#22c55e' },
    { abbr: t('standings.d'), meaning: t('legend.d'), color: '#f59e0b' },
    { abbr: t('standings.l'), meaning: t('legend.l'), color: '#ef4444' },
    { abbr: t('standings.gf'), meaning: t('legend.gf') },
    { abbr: t('standings.ga'), meaning: t('legend.ga') },
    { abbr: t('standings.gd'), meaning: t('legend.gd') },
    { abbr: t('standings.pts'), meaning: t('legend.pts'), color: '#a78bfa' },
    { abbr: 'W', meaning: t('legend.formW'), color: '#22c55e' },
    { abbr: 'D', meaning: t('legend.formD'), color: '#f59e0b' },
    { abbr: 'L', meaning: t('legend.formL'), color: '#ef4444' },
    { abbr: '🟢', meaning: t('legend.qualified') },
  ];

  return (
    <div className="container" id="standings-page">
      <div className={styles.pageHeader}>
        <h1 className="heading-2">{t('standings.title')}</h1>
        <Legend items={standingsLegend} />
      </div>

      {/* Category Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-xl)', alignSelf: 'flex-start', width: 'fit-content' }}>
        {(['U15', 'U17'] as const).map((cat) => (
          <button
            key={cat}
            className={`tab ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Group Tables */}
      {categoryGroups.map((group) => {
        const standings = getGroupStandings(teams, fixtures, scores, category, group.name.split(' ')[1]);

        return (
          <div key={group.id} className={styles.groupSection}>
            <h3 className={styles.groupTitle}>
              <span className="badge badge-primary">{category}</span>
              {group.name}
            </h3>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>{t('standings.pos')}</th>
                    <th>{t('standings.team')}</th>
                    <th style={{ textAlign: 'center' }}>{t('standings.p')}</th>
                    <th style={{ textAlign: 'center' }}>{t('standings.w')}</th>
                    <th style={{ textAlign: 'center' }}>{t('standings.d')}</th>
                    <th style={{ textAlign: 'center' }}>{t('standings.l')}</th>
                    <th style={{ textAlign: 'center' }}>{t('standings.gf')}</th>
                    <th style={{ textAlign: 'center' }}>{t('standings.ga')}</th>
                    <th style={{ textAlign: 'center' }}>{t('standings.gd')}</th>
                    <th style={{ textAlign: 'center' }}>{t('standings.pts')}</th>
                    <th>{t('standings.form')}</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, index) => (
                    <tr key={row.teamId} className={index < 2 ? 'qualified' : ''}>
                      <td>
                        <span className={styles.position}>{index + 1}</span>
                      </td>
                      <td>
                        <div className={styles.teamCell}>
                          <img src={row.team.logoUrl} alt={row.team.name} className={styles.teamCellLogo} />
                          <span className={styles.teamCellName}>{row.team.name}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{row.played}</td>
                      <td style={{ textAlign: 'center' }}>{row.won}</td>
                      <td style={{ textAlign: 'center' }}>{row.drawn}</td>
                      <td style={{ textAlign: 'center' }}>{row.lost}</td>
                      <td style={{ textAlign: 'center' }}>{row.goalsFor}</td>
                      <td style={{ textAlign: 'center' }}>{row.goalsAgainst}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={row.goalDifference > 0 ? styles.positive : row.goalDifference < 0 ? styles.negative : ''}>
                          {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={styles.points}>{row.points}</span>
                      </td>
                      <td>
                        <div className={styles.form}>
                          {row.form.map((result, i) => (
                            <span
                              key={i}
                              className={`${styles.formDot} ${
                                result === 'W' ? styles.formWin : result === 'D' ? styles.formDraw : styles.formLoss
                              }`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
