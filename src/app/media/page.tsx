'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useMedia } from '@/lib/data-service';
import type { MediaType, Category } from '@/types';
import styles from './page.module.css';

export default function MediaPage() {
  const { t } = useI18n();
  const { media } = useMedia();
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const filtered = media.filter((m) => {
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="container" id="media-page">
      <div className={styles.pageHeader}>
        <h1 className="heading-2">{t('media.title')}</h1>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className="tabs">
          {(['all', 'highlight', 'interview'] as const).map((type) => (
            <button
              key={type}
              className={`tab ${typeFilter === type ? 'active' : ''}`}
              onClick={() => setTypeFilter(type)}
            >
              {type === 'all' ? t('media.all') : type === 'highlight' ? t('media.highlights') : t('media.interviews')}
            </button>
          ))}
        </div>
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
      </div>

      {/* Media Grid */}
      <div className={styles.mediaGrid}>
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className={`glass-card ${styles.mediaCard} animate-slide-up stagger-${(i % 6) + 1}`}
            onClick={() => setSelectedVideo(item.url)}
            role="button"
            tabIndex={0}
            id={`media-card-${item.id}`}
          >
            <div className={styles.mediaThumbnail}>
              <img src={item.thumbnailUrl} alt={item.title} />
              <div className={styles.mediaPlayBtn}>▶</div>
              <span className={`badge ${item.type === 'highlight' ? 'badge-accent' : 'badge-primary'} ${styles.mediaTypeBadge}`}>
                {item.type === 'highlight' ? t('media.highlights') : t('media.interviews')}
              </span>
              <span className={`badge badge-primary ${styles.mediaCatBadge}`}>
                {item.category}
              </span>
            </div>
            <div className={styles.mediaInfo}>
              <h3 className={styles.mediaTitle}>{item.title}</h3>
              <p className={styles.mediaDesc}>{item.description}</p>
              <div className={styles.mediaMeta}>
                <span>{new Date(item.publishedAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className={styles.modalOverlay} onClick={() => setSelectedVideo(null)} id="video-modal">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedVideo(null)} aria-label="Close">✕</button>
            <div className={styles.videoWrapper}>
              <iframe
                src={selectedVideo}
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.videoIframe}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
