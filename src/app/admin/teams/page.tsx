'use client';

import { useState } from 'react';
import { useTeams, usePlayers, useStaff } from '@/lib/data-service';
import type { Team } from '@/types';
import styles from './page.module.css';

export default function AdminTeamsPage() {
  const { teams: teamsState } = useTeams();
  const { getPlayersByTeam } = usePlayers();
  const { getStaffByTeam } = useStaff();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div id="admin-teams">
      <h1 className="heading-3" style={{ marginBottom: 'var(--space-lg)' }}>Team Management</h1>

      <div className={styles.layout}>
        {/* Team List */}
        <div className={styles.teamList}>
          <div className={styles.listHeader}>
            <span className={styles.listTitle}>Teams ({teamsState.length})</span>
          </div>
          {teamsState.map((team) => (
            <button
              key={team.id}
              className={`${styles.teamItem} ${selectedTeam?.id === team.id ? styles.teamItemActive : ''}`}
              onClick={() => setSelectedTeam(team)}
            >
              <img src={team.logoUrl} alt={team.name} className={styles.teamItemLogo} />
              <div className={styles.teamItemInfo}>
                <span className={styles.teamItemName}>{team.name}</span>
                <span className={styles.teamItemMeta}>
                  {team.category} • Group {team.group}
                </span>
              </div>
              <div className={styles.teamItemColor} style={{ background: team.colors.primary }} />
            </button>
          ))}
        </div>

        {/* Team Detail */}
        <div className={styles.teamDetail}>
          {selectedTeam ? (
            <>
              {/* Header */}
              <div className={styles.detailHeader} style={{ background: `linear-gradient(135deg, ${selectedTeam.colors.primary}22, ${selectedTeam.colors.secondary}15)` }}>
                <img src={selectedTeam.logoUrl} alt={selectedTeam.name} className={styles.detailLogo} />
                <div>
                  <h2 className="heading-4">{selectedTeam.name}</h2>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                    <span className="badge badge-primary">{selectedTeam.category}</span>
                    <span className="badge badge-primary" style={{ opacity: 0.7 }}>Group {selectedTeam.group}</span>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className={styles.fields}>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Team Name</label>
                  <div className={styles.fieldValue}>
                    {editField === 'name' ? (
                      <div className={styles.editRow}>
                        <input className="input" defaultValue={selectedTeam.name} style={{ flex: 1 }} />
                        <button className="btn btn-primary btn-sm" onClick={() => { setEditField(null); showToast('✅ Team name updated!'); }}>Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditField(null)}>✕</button>
                      </div>
                    ) : (
                      <div className={styles.displayRow}>
                        <span>{selectedTeam.name}</span>
                        <button className={styles.editBtn} onClick={() => setEditField('name')}>✏️</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Short Name</label>
                  <div className={styles.displayRow}>
                    <span>{selectedTeam.shortName}</span>
                    <button className={styles.editBtn} onClick={() => showToast('✏️ Edit mode (demo)')}>✏️</button>
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Description</label>
                  <div className={styles.displayRow}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{selectedTeam.description}</span>
                    <button className={styles.editBtn} onClick={() => showToast('✏️ Edit mode (demo)')}>✏️</button>
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Colors</label>
                  <div className={styles.colorPreview}>
                    <span className={styles.colorSwatch} style={{ background: selectedTeam.colors.primary }} />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{selectedTeam.colors.primary}</span>
                    <span className={styles.colorSwatch} style={{ background: selectedTeam.colors.secondary }} />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{selectedTeam.colors.secondary}</span>
                  </div>
                </div>
              </div>

              {/* Squad Summary */}
              <h3 className="heading-5" style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>
                Squad ({getPlayersByTeam(selectedTeam.id).length} players)
              </h3>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Goals</th>
                      <th>Apps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPlayersByTeam(selectedTeam.id).map((player) => (
                      <tr key={player.id}>
                        <td>{player.jerseyNumber}</td>
                        <td style={{ fontWeight: 600 }}>{player.name}</td>
                        <td>{player.position}</td>
                        <td>{player.stats.goals}</td>
                        <td>{player.stats.appearances}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Staff Summary */}
              <h3 className="heading-5" style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>
                Staff ({getStaffByTeam(selectedTeam.id).length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {getStaffByTeam(selectedTeam.id).map((s) => (
                  <div key={s.id} className={`card ${styles.staffItem}`}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{s.name}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{s.role}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyDetail}>
              <span style={{ fontSize: '2.5rem' }}>👈</span>
              <h3 className="heading-5">Select a team</h3>
              <p className="text-muted">Choose a team from the list to view and edit its details.</p>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className={styles.toast}>{toast}</div>
      )}
    </div>
  );
}
