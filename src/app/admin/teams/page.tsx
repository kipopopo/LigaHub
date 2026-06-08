'use client';

import { useState, useEffect } from 'react';
import { useTeams, usePlayers, useStaff } from '@/lib/data-service';
import { isFirebaseConfigured, getFirebaseDb, getFirebaseStorage } from '@/lib/firebase';
import type { Team } from '@/types';
import styles from './page.module.css';

export default function AdminTeamsPage() {
  const { teams: loadedTeams } = useTeams();
  const { getPlayersByTeam } = usePlayers();
  const { getStaffByTeam } = useStaff();

  const [teamsState, setTeamsState] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [isAddingTeam, setIsAddingTeam] = useState(false);

  // Form states for creating a new team
  const [newName, setNewName] = useState('');
  const [newShortName, setNewShortName] = useState('');
  const [newCategory, setNewCategory] = useState<'U15' | 'U17'>('U15');
  const [newGroup, setNewGroup] = useState('A');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('/images/teams/placeholder-logo.svg');
  const [newDescription, setNewDescription] = useState('');
  const [newPrimaryColor, setNewPrimaryColor] = useState('#e63946');
  const [newSecondaryColor, setNewSecondaryColor] = useState('#1d3557');
  const [newSlug, setNewSlug] = useState('');

  // Sync loaded teams to local state
  useEffect(() => {
    setTeamsState(loadedTeams);
  }, [loadedTeams]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const startEditing = (field: string, currentVal: string) => {
    setEditField(field);
    setEditValue(currentVal);
  };

  const handleLogoUpload = async (file: File, teamId: string): Promise<string> => {
    if (!isFirebaseConfigured()) {
      // Offline fallback: return a local blob URL
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(file));
        }, 1000);
      });
    }

    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const storage = getFirebaseStorage();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storageRef = ref(storage, `teams/${teamId}/logo-${Date.now()}-${cleanFileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  };

  const saveTeamField = async (field: keyof Team | 'colors.primary' | 'colors.secondary', value: any) => {
    if (!selectedTeam) return;
    setSaving(true);

    let updatedTeam: Team;
    if (field === 'colors.primary') {
      updatedTeam = {
        ...selectedTeam,
        colors: { ...selectedTeam.colors, primary: value }
      };
    } else if (field === 'colors.secondary') {
      updatedTeam = {
        ...selectedTeam,
        colors: { ...selectedTeam.colors, secondary: value }
      };
    } else {
      updatedTeam = {
        ...selectedTeam,
        [field]: value
      };
      if (field === 'name') {
        // Also auto-update slug if name changes and slug isn't customized
        updatedTeam.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
    }

    // Save to Firestore
    if (isFirebaseConfigured()) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const db = getFirebaseDb();
        await setDoc(doc(db, 'teams', selectedTeam.id), updatedTeam);
        showToast('✅ Team updated in Firestore!');
      } catch (err) {
        console.error(err);
        showToast('⚠️ Firestore sync failed, updated locally');
      }
    } else {
      showToast('✅ Team updated locally');
    }

    // Update local state
    setTeamsState(prev => prev.map(t => t.id === selectedTeam.id ? updatedTeam : t));
    setSelectedTeam(updatedTeam);
    setEditField(null);
    setSaving(false);
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newShortName) {
      showToast('⚠️ Name and Short Name are required');
      return;
    }

    setSaving(true);
    const newTeamId = `team-${Date.now()}`;
    const generatedSlug = newSlug || newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let uploadedLogoUrl = '/images/teams/placeholder-logo.svg';
    if (logoFile) {
      showToast('⏳ Uploading team logo...');
      try {
        uploadedLogoUrl = await handleLogoUpload(logoFile, newTeamId);
      } catch (err) {
        console.error('Logo upload error:', err);
        showToast('⚠️ Logo upload failed, using default');
      }
    }

    const newTeam: Team = {
      id: newTeamId,
      tournamentId: 'tournament-2026',
      name: newName,
      shortName: newShortName,
      category: newCategory,
      group: newGroup,
      logoUrl: uploadedLogoUrl,
      description: newDescription,
      colors: {
        primary: newPrimaryColor,
        secondary: newSecondaryColor,
      },
      slug: generatedSlug,
    };

    // Save to Firestore
    if (isFirebaseConfigured()) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const db = getFirebaseDb();
        await setDoc(doc(db, 'teams', newTeamId), newTeam);
        showToast('🚀 New team added to Firestore!');
      } catch (err) {
        console.error(err);
        showToast('⚠️ Added locally, Firestore sync failed');
      }
    } else {
      showToast('🚀 New team added locally');
    }

    setTeamsState(prev => [...prev, newTeam]);
    setSelectedTeam(newTeam);
    setIsAddingTeam(false);
    resetAddTeamForm();
    setSaving(false);
  };

  const resetAddTeamForm = () => {
    setNewName('');
    setNewShortName('');
    setNewCategory('U15');
    setNewGroup('A');
    setLogoFile(null);
    setLogoPreview('/images/teams/placeholder-logo.svg');
    setNewDescription('');
    setNewPrimaryColor('#e63946');
    setNewSecondaryColor('#1d3557');
    setNewSlug('');
  };

  return (
    <div id="admin-teams">
      <h1 className="heading-3" style={{ marginBottom: 'var(--space-lg)' }}>Team Management</h1>

      <div className={styles.layout}>
        {/* Team List */}
        <div className={styles.teamList}>
          <div className={styles.listHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--color-surface)', zIndex: 1, borderBottom: '1px solid var(--color-border-subtle)', padding: 'var(--space-md)' }}>
            <span className={styles.listTitle}>Teams ({teamsState.length})</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsAddingTeam(true);
                setSelectedTeam(null);
              }}
            >
              ➕ Add Team
            </button>
          </div>
          {teamsState.map((team) => (
            <button
              key={team.id}
              className={`${styles.teamItem} ${selectedTeam?.id === team.id ? styles.teamItemActive : ''}`}
              onClick={() => {
                setSelectedTeam(team);
                setIsAddingTeam(false);
                setEditField(null);
              }}
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

        {/* Team Detail / Add Team Form */}
        <div className={styles.teamDetail}>
          {isAddingTeam ? (
            <div className="card" style={{ padding: 'var(--space-lg)', border: '1px solid var(--color-border-subtle)' }}>
              <h2 className="heading-4" style={{ marginBottom: 'var(--space-md)' }}>➕ Add New Team</h2>
              <form onSubmit={handleAddTeam} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="form-group">
                  <label className={styles.fieldLabel}>Team Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Harimau Muda FC"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className={styles.fieldLabel}>Short Name *</label>
                    <input
                      type="text"
                      className="input"
                      maxLength={3}
                      placeholder="e.g. HRM"
                      value={newShortName}
                      onChange={(e) => setNewShortName(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className={styles.fieldLabel}>Slug</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="harimau-muda-fc"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className={styles.fieldLabel}>Category</label>
                    <select
                      className="input"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as 'U15' | 'U17')}
                    >
                      <option value="U15">U15</option>
                      <option value="U17">U17</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className={styles.fieldLabel}>Group</label>
                    <select
                      className="input"
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value)}
                    >
                      <option value="A">Group A</option>
                      <option value="B">Group B</option>
                      <option value="C">Group C</option>
                      <option value="D">Group D</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className={styles.fieldLabel}>Team Logo (Upload) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      style={{ width: '48px', height: '48px', objectFit: 'contain', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', padding: '4px' }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLogoFile(file);
                          setLogoPreview(URL.createObjectURL(file));
                        }
                      }}
                      style={{ flex: 1 }}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className={styles.fieldLabel}>Description</label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Brief description..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
                  <div className="form-group">
                    <label className={styles.fieldLabel}>Primary Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                      <input
                        type="color"
                        value={newPrimaryColor}
                        onChange={(e) => setNewPrimaryColor(e.target.value)}
                        style={{ border: 'none', width: '40px', height: '40px', padding: 0, cursor: 'pointer', borderRadius: '4px' }}
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{newPrimaryColor}</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className={styles.fieldLabel}>Secondary Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                      <input
                        type="color"
                        value={newSecondaryColor}
                        onChange={(e) => setNewSecondaryColor(e.target.value)}
                        style={{ border: 'none', width: '40px', height: '40px', padding: 0, cursor: 'pointer', borderRadius: '4px' }}
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{newSecondaryColor}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? '⏳ Saving...' : '💾 Save Team'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => { setIsAddingTeam(false); resetAddTeamForm(); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : selectedTeam ? (
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
                {/* Name */}
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Team Name</label>
                  <div className={styles.fieldValue}>
                    {editField === 'name' ? (
                      <div className={styles.editRow}>
                        <input className="input" value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ flex: 1 }} />
                        <button className="btn btn-primary btn-sm" disabled={saving} onClick={() => saveTeamField('name', editValue)}>Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditField(null)}>✕</button>
                      </div>
                    ) : (
                      <div className={styles.displayRow}>
                        <span>{selectedTeam.name}</span>
                        <button className={styles.editBtn} onClick={() => startEditing('name', selectedTeam.name)}>✏️</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Short Name */}
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Short Name</label>
                  <div className={styles.fieldValue}>
                    {editField === 'shortName' ? (
                      <div className={styles.editRow}>
                        <input className="input" maxLength={3} value={editValue} onChange={(e) => setEditValue(e.target.value.toUpperCase())} style={{ flex: 1 }} />
                        <button className="btn btn-primary btn-sm" disabled={saving} onClick={() => saveTeamField('shortName', editValue)}>Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditField(null)}>✕</button>
                      </div>
                    ) : (
                      <div className={styles.displayRow}>
                        <span>{selectedTeam.shortName}</span>
                        <button className={styles.editBtn} onClick={() => startEditing('shortName', selectedTeam.shortName)}>✏️</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category & Group */}
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <div className={styles.fieldRow} style={{ flex: 1 }}>
                    <label className={styles.fieldLabel}>Category</label>
                    <div className={styles.fieldValue}>
                      {editField === 'category' ? (
                        <div className={styles.editRow}>
                          <select className="input" value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ flex: 1 }}>
                            <option value="U15">U15</option>
                            <option value="U17">U17</option>
                          </select>
                          <button className="btn btn-primary btn-sm" disabled={saving} onClick={() => saveTeamField('category', editValue)}>Save</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditField(null)}>✕</button>
                        </div>
                      ) : (
                        <div className={styles.displayRow}>
                          <span>{selectedTeam.category}</span>
                          <button className={styles.editBtn} onClick={() => startEditing('category', selectedTeam.category)}>✏️</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.fieldRow} style={{ flex: 1 }}>
                    <label className={styles.fieldLabel}>Group</label>
                    <div className={styles.fieldValue}>
                      {editField === 'group' ? (
                        <div className={styles.editRow}>
                          <select className="input" value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ flex: 1 }}>
                            <option value="A">Group A</option>
                            <option value="B">Group B</option>
                            <option value="C">Group C</option>
                            <option value="D">Group D</option>
                          </select>
                          <button className="btn btn-primary btn-sm" disabled={saving} onClick={() => saveTeamField('group', editValue)}>Save</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditField(null)}>✕</button>
                        </div>
                      ) : (
                        <div className={styles.displayRow}>
                          <span>{selectedTeam.group}</span>
                          <button className={styles.editBtn} onClick={() => startEditing('group', selectedTeam.group)}>✏️</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logo URL */}
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Team Logo</label>
                  <div className={styles.fieldValue}>
                    {editField === 'logoUrl' ? (
                      <div className={styles.editRow} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-sm)', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', width: '100%' }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSaving(true);
                                showToast('⏳ Uploading team logo...');
                                try {
                                  const url = await handleLogoUpload(file, selectedTeam.id);
                                  await saveTeamField('logoUrl', url);
                                } catch (err) {
                                  console.error(err);
                                  showToast('❌ Logo upload failed');
                                } finally {
                                  setSaving(false);
                                  setEditField(null);
                                }
                              }
                            }}
                            style={{ flex: 1 }}
                          />
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditField(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div className={styles.displayRow}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                          <img
                            src={selectedTeam.logoUrl}
                            alt={selectedTeam.name}
                            style={{ width: '32px', height: '32px', objectFit: 'contain', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)', padding: '2px' }}
                          />
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', wordBreak: 'break-all', maxWidth: '250px' }}>
                            {selectedTeam.logoUrl.startsWith('blob:') ? 'Local Preview File' : selectedTeam.logoUrl}
                          </span>
                        </div>
                        <button className={styles.editBtn} onClick={() => setEditField('logoUrl')}>✏️ Upload New Logo</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Description</label>
                  <div className={styles.fieldValue}>
                    {editField === 'description' ? (
                      <div className={styles.editRow} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <textarea className="input" rows={3} value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                          <button className="btn btn-primary btn-sm" disabled={saving} onClick={() => saveTeamField('description', editValue)}>Save</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditField(null)}>✕</button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.displayRow}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{selectedTeam.description}</span>
                        <button className={styles.editBtn} onClick={() => startEditing('description', selectedTeam.description)}>✏️</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Colors */}
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Colors</label>
                  <div className={styles.colorPreview}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                      <input
                        type="color"
                        value={selectedTeam.colors.primary}
                        onChange={(e) => saveTeamField('colors.primary', e.target.value)}
                        style={{ border: 'none', width: '28px', height: '28px', padding: 0, cursor: 'pointer', borderRadius: '4px' }}
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{selectedTeam.colors.primary} (Primary)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginLeft: 'var(--space-md)' }}>
                      <input
                        type="color"
                        value={selectedTeam.colors.secondary}
                        onChange={(e) => saveTeamField('colors.secondary', e.target.value)}
                        style={{ border: 'none', width: '28px', height: '28px', padding: 0, cursor: 'pointer', borderRadius: '4px' }}
                      />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{selectedTeam.colors.secondary} (Secondary)</span>
                    </div>
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
