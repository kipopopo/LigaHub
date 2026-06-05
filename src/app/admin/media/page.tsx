'use client';

import { useState } from 'react';
import { media as initialMedia } from '@/lib/placeholder-data';
import type { Media, MediaType, Category } from '@/types';
import styles from './page.module.css';

export default function AdminMediaPage() {
  const [mediaState, setMediaState] = useState<Media[]>([...initialMedia]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState('');

  // New media form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<MediaType>('highlight');
  const [newCategory, setNewCategory] = useState<Category>('U15');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addMedia = () => {
    if (!newTitle || !newUrl) return;
    const newItem: Media = {
      id: `media-new-${Date.now()}`,
      tournamentId: 'tournament-2026',
      type: newType,
      title: newTitle,
      description: newDesc,
      url: newUrl,
      thumbnailUrl: '/images/media/placeholder-thumb.svg',
      category: newCategory,
      publishedAt: new Date().toISOString(),
      tags: [newType, newCategory.toLowerCase()],
    };
    setMediaState((prev) => [newItem, ...prev]);
    setShowAddForm(false);
    setNewTitle('');
    setNewDesc('');
    setNewUrl('');
    showToast('✅ Media item added!');
  };

  const deleteMedia = (id: string) => {
    setMediaState((prev) => prev.filter((m) => m.id !== id));
    showToast('🗑️ Media item removed');
  };

  return (
    <div id="admin-media">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <h1 className="heading-3">Media Management</h1>
        <button className="btn btn-accent btn-sm" onClick={() => setShowAddForm(!showAddForm)} id="add-media-btn">
          {showAddForm ? '✕ Cancel' : '+ Add Media'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className={`card ${styles.addForm}`}>
          <h3 className="heading-5" style={{ marginBottom: 'var(--space-md)' }}>Add New Media</h3>
          <div className={styles.formGrid}>
            <div className="input-group">
              <label className="input-label">Title *</label>
              <input className="input" placeholder="Matchday 2 Highlights" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Video URL *</label>
              <input className="input" placeholder="https://www.youtube.com/embed/..." value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Type</label>
              <select className="input" value={newType} onChange={(e) => setNewType(e.target.value as MediaType)}>
                <option value="highlight">Highlight</option>
                <option value="interview">Interview</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select className="input" value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category)}>
                <option value="U15">U15</option>
                <option value="U17">U17</option>
              </select>
            </div>
          </div>
          <div className="input-group" style={{ marginTop: 'var(--space-sm)' }}>
            <label className="input-label">Description</label>
            <textarea className="input" rows={2} placeholder="Brief description..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <button className="btn btn-primary" onClick={addMedia} style={{ marginTop: 'var(--space-md)' }}>
            💾 Save Media
          </button>
        </div>
      )}

      {/* Media List */}
      <div className={styles.mediaList}>
        {mediaState.map((item) => (
          <div key={item.id} className={`card ${styles.mediaItem}`}>
            <div className={styles.mediaThumbnail}>
              <img src={item.thumbnailUrl} alt={item.title} />
            </div>
            <div className={styles.mediaInfo}>
              <div className={styles.mediaHeader}>
                <h4 className={styles.mediaTitle}>{item.title}</h4>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <span className={`badge ${item.type === 'highlight' ? 'badge-accent' : 'badge-primary'}`} style={{ fontSize: '0.6rem' }}>
                    {item.type}
                  </span>
                  <span className="badge badge-primary" style={{ fontSize: '0.6rem', opacity: 0.7 }}>{item.category}</span>
                </div>
              </div>
              <p className={styles.mediaDesc}>{item.description}</p>
              <div className={styles.mediaFooter}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {new Date(item.publishedAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => showToast('✏️ Edit mode (demo)')}>✏️ Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => deleteMedia(item.id)} style={{ color: 'var(--color-danger)' }}>🗑️</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div className={styles.toast}>{toast}</div>
      )}
    </div>
  );
}
