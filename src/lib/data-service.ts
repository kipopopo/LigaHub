/* ================================================
   Data Service — Firestore-first, placeholder-fallback
   ================================================
   
   Usage in components:
     const { teams, loading } = useTeams();
     const { fixtures, loading } = useFixtures();
     const { scores, getScore, loading } = useScores();
     const { media, loading } = useMedia();
     const { players, getPlayersByTeam, loading } = usePlayers();
     const { staff, getStaffByTeam, loading } = useStaff();
     const { tournament, loading } = useTournament();
     const { groups, loading } = useGroups();
   
   Data is fetched once from Firestore, cached, and falls back
   to placeholder-data.ts if Firestore is empty or unavailable.
*/

'use client';

import { useState, useEffect, useCallback } from 'react';
import { isFirebaseConfigured, getFirebaseDb } from '@/lib/firebase';
import {
  teams as placeholderTeams,
  players as placeholderPlayers,
  staff as placeholderStaff,
  fixtures as placeholderFixtures,
  scores as placeholderScores,
  media as placeholderMedia,
  groups as placeholderGroups,
  kits as placeholderKits,
  tournament as placeholderTournament,
} from '@/lib/placeholder-data';
import type { Team, Player, Staff, Fixture, Score, Media, Group, Kit, Tournament } from '@/types';

// ---------- Cache ----------
const cache: Record<string, { data: unknown; ts: number }> = {};
const CACHE_TTL = 60_000; // 1 minute

function getCached<T>(key: string): T | null {
  const entry = cache[key];
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T;
  return null;
}

function setCache(key: string, data: unknown) {
  cache[key] = { data, ts: Date.now() };
}

// ---------- Generic Firestore fetcher ----------
async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const db = getFirebaseDb();
    const snap = await getDocs(collection(db, collectionName));
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as T));
  } catch {
    return [];
  }
}

async function fetchDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const db = getFirebaseDb();
    const snap = await getDoc(doc(db, collectionName, docId));
    if (!snap.exists()) return null;
    return snap.data() as T;
  } catch {
    return null;
  }
}

// ---------- Generic hook ----------
function useFirestoreCollection<T>(
  collectionName: string,
  placeholder: T[]
): { data: T[]; loading: boolean } {
  const [data, setData] = useState<T[]>(placeholder);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = getCached<T[]>(collectionName);
    if (cached && cached.length > 0) {
      setData(cached);
      setLoading(false);
      return;
    }

    (async () => {
      const firestoreData = await fetchCollection<T>(collectionName);
      if (firestoreData.length > 0) {
        setData(firestoreData);
        setCache(collectionName, firestoreData);
      }
      // else keep placeholder
      setLoading(false);
    })();
  }, [collectionName]);

  return { data, loading };
}

// ---------- Teams ----------
export function useTeams() {
  const { data: teams, loading } = useFirestoreCollection<Team>('teams', placeholderTeams);

  const getTeamById = useCallback(
    (id: string) => teams.find((t) => t.id === id),
    [teams]
  );

  const getTeamBySlug = useCallback(
    (slug: string) => teams.find((t) => t.slug === slug),
    [teams]
  );

  const getTeamsByCategory = useCallback(
    (category: 'U15' | 'U17') => teams.filter((t) => t.category === category),
    [teams]
  );

  return { teams, loading, getTeamById, getTeamBySlug, getTeamsByCategory };
}

// ---------- Players ----------
export function usePlayers() {
  const { data: players, loading } = useFirestoreCollection<Player>('players', placeholderPlayers);

  const getPlayersByTeam = useCallback(
    (teamId: string) => players.filter((p) => p.teamId === teamId),
    [players]
  );

  const getPlayerById = useCallback(
    (id: string) => players.find((p) => p.id === id),
    [players]
  );

  return { players, loading, getPlayersByTeam, getPlayerById };
}

// ---------- Staff ----------
export function useStaff() {
  const { data: staffList, loading } = useFirestoreCollection<Staff>('staff', placeholderStaff);

  const getStaffByTeam = useCallback(
    (teamId: string) => staffList.filter((s) => s.teamId === teamId),
    [staffList]
  );

  return { staff: staffList, loading, getStaffByTeam };
}

// ---------- Fixtures ----------
export function useFixtures() {
  const { data: fixtures, loading } = useFirestoreCollection<Fixture>('fixtures', placeholderFixtures);

  const getFixturesByTeam = useCallback(
    (teamId: string) => fixtures.filter((f) => f.homeTeamId === teamId || f.awayTeamId === teamId),
    [fixtures]
  );

  const getFixturesByCategory = useCallback(
    (category: 'U15' | 'U17') => fixtures.filter((f) => f.category === category),
    [fixtures]
  );

  return { fixtures, loading, getFixturesByTeam, getFixturesByCategory };
}

// ---------- Scores ----------
export function useScores() {
  const { data: scores, loading } = useFirestoreCollection<Score>('scores', placeholderScores);

  const getScore = useCallback(
    (fixtureId: string) => scores.find((s) => s.fixtureId === fixtureId),
    [scores]
  );

  return { scores, loading, getScore };
}

// ---------- Media ----------
export function useMedia() {
  const { data: mediaList, loading } = useFirestoreCollection<Media>('media', placeholderMedia);
  return { media: mediaList, loading };
}

// ---------- Groups ----------
export function useGroups() {
  const { data: groupsList, loading } = useFirestoreCollection<Group>('groups', placeholderGroups);
  return { groups: groupsList, loading };
}

// ---------- Kits ----------
export function useKits() {
  const { data: kitsList, loading } = useFirestoreCollection<Kit>('kits', placeholderKits);

  const getKitsByTeam = useCallback(
    (teamId: string) => kitsList.filter((k) => k.teamId === teamId),
    [kitsList]
  );

  return { kits: kitsList, loading, getKitsByTeam };
}

// ---------- Tournament ----------
export function useTournament() {
  const [tournament, setTournament] = useState<Tournament>(placeholderTournament);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchDocument<Tournament>('tournament', 'config');
      if (data) setTournament(data);
      setLoading(false);
    })();
  }, []);

  return { tournament, loading };
}

// ---------- Seed Firestore ----------
export async function seedFirestore(): Promise<string[]> {
  if (!isFirebaseConfigured()) return ['Firebase not configured'];
  const logs: string[] = [];

  try {
    const { doc, setDoc, writeBatch } = await import('firebase/firestore');
    const db = getFirebaseDb();

    // Seed tournament
    await setDoc(doc(db, 'tournament', 'config'), placeholderTournament);
    logs.push('✅ Tournament config seeded');

    // Seed teams
    const teamBatch = writeBatch(db);
    placeholderTeams.forEach((t) => teamBatch.set(doc(db, 'teams', t.id), t));
    await teamBatch.commit();
    logs.push(`✅ ${placeholderTeams.length} teams seeded`);

    // Seed groups
    const groupBatch = writeBatch(db);
    placeholderGroups.forEach((g) => groupBatch.set(doc(db, 'groups', g.id), g));
    await groupBatch.commit();
    logs.push(`✅ ${placeholderGroups.length} groups seeded`);

    // Seed fixtures
    const fixBatches = [];
    for (let i = 0; i < placeholderFixtures.length; i += 500) {
      const batch = writeBatch(db);
      placeholderFixtures.slice(i, i + 500).forEach((f) => batch.set(doc(db, 'fixtures', f.id), f));
      fixBatches.push(batch.commit());
    }
    await Promise.all(fixBatches);
    logs.push(`✅ ${placeholderFixtures.length} fixtures seeded`);

    // Seed players (in batches of 500)
    const playerBatches = [];
    for (let i = 0; i < placeholderPlayers.length; i += 500) {
      const batch = writeBatch(db);
      placeholderPlayers.slice(i, i + 500).forEach((p) => batch.set(doc(db, 'players', p.id), p));
      playerBatches.push(batch.commit());
    }
    await Promise.all(playerBatches);
    logs.push(`✅ ${placeholderPlayers.length} players seeded`);

    // Seed staff
    const staffBatch = writeBatch(db);
    placeholderStaff.forEach((s) => staffBatch.set(doc(db, 'staff', s.id), s));
    await staffBatch.commit();
    logs.push(`✅ ${placeholderStaff.length} staff seeded`);

    // Seed kits
    const kitBatch = writeBatch(db);
    placeholderKits.forEach((k) => kitBatch.set(doc(db, 'kits', k.id), k));
    await kitBatch.commit();
    logs.push(`✅ ${placeholderKits.length} kits seeded`);

    // Seed media
    const mediaBatch = writeBatch(db);
    placeholderMedia.forEach((m) => mediaBatch.set(doc(db, 'media', m.id), m));
    await mediaBatch.commit();
    logs.push(`✅ ${placeholderMedia.length} media items seeded`);

    // Seed scores
    const scoreBatches = [];
    for (let i = 0; i < placeholderScores.length; i += 500) {
      const batch = writeBatch(db);
      placeholderScores.slice(i, i + 500).forEach((s) => batch.set(doc(db, 'scores', s.fixtureId), s));
      scoreBatches.push(batch.commit());
    }
    await Promise.all(scoreBatches);
    logs.push(`✅ ${placeholderScores.length} scores seeded`);

    // Clear cache
    Object.keys(cache).forEach((k) => delete cache[k]);
    logs.push('✅ Cache cleared — reload to see Firestore data');

  } catch (err) {
    logs.push(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
  }

  return logs;
}
