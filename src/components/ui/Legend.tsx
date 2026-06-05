'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import styles from './Legend.module.css';

export interface LegendItem {
  abbr: string;
  meaning: string;
  color?: string;
}

interface LegendProps {
  items: LegendItem[];
  title?: string;
}

export default function Legend({ items, title }: LegendProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.legendWrapper}>
      <button
        className={styles.legendBtn}
        onClick={() => setOpen(!open)}
        aria-label="Show abbreviation legend"
        id="legend-toggle"
      >
        <span className={styles.legendIcon}>?</span>
        <span className={styles.legendLabel}>{t('legend.button')}</span>
      </button>

      {open && (
        <>
          <div className={styles.legendOverlay} onClick={() => setOpen(false)} />
          <div className={styles.legendPanel} id="legend-panel">
            <div className={styles.legendHeader}>
              <h4 className={styles.legendTitle}>{title || t('legend.title')}</h4>
              <button className={styles.legendClose} onClick={() => setOpen(false)} aria-label="Close legend">✕</button>
            </div>
            <div className={styles.legendList}>
              {items.map((item, i) => (
                <div key={i} className={styles.legendItem}>
                  <span
                    className={styles.legendAbbr}
                    style={item.color ? { background: `${item.color}22`, color: item.color, borderColor: `${item.color}44` } : {}}
                  >
                    {item.abbr}
                  </span>
                  <span className={styles.legendMeaning}>{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
