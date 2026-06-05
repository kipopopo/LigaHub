/* ================================================
   Placeholder Data — 16 Teams (8 U15 + 8 U17)
   Replace with Firestore data when Firebase is configured
   ================================================ */

import type {
  Tournament,
  Team,
  Player,
  Staff,
  Fixture,
  Score,
  Media,
  Group,
  Kit,
} from '@/types';

// ---------- Tournament ----------
export const tournament: Tournament = {
  id: 'tournament-2026',
  name: 'LigaHub Youth Cup 2026',
  season: '2026',
  status: 'active',
  startDate: '2026-06-20T09:00:00+08:00',
  endDate: '2026-07-15T18:00:00+08:00',
  description: 'The premier youth football tournament featuring 16 teams across U15 and U17 categories.',
};

// ---------- Teams ----------
export const teams: Team[] = [
  // U15 Teams
  {
    id: 'u15-01',
    tournamentId: 'tournament-2026',
    name: 'Harimau Muda FC',
    shortName: 'HRM',
    category: 'U15',
    group: 'A',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A youth academy known for producing technically skilled players with a focus on attacking football.',
    colors: { primary: '#e63946', secondary: '#1d3557' },
    slug: 'harimau-muda-fc',
  },
  {
    id: 'u15-02',
    tournamentId: 'tournament-2026',
    name: 'Garuda United',
    shortName: 'GRD',
    category: 'U15',
    group: 'A',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A disciplined side with strong defensive organisation and quick counter-attacks.',
    colors: { primary: '#ff6b35', secondary: '#004e89' },
    slug: 'garuda-united',
  },
  {
    id: 'u15-03',
    tournamentId: 'tournament-2026',
    name: 'Naga Biru Academy',
    shortName: 'NGA',
    category: 'U15',
    group: 'A',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'Academy renowned for developing well-rounded midfielders with excellent passing range.',
    colors: { primary: '#0077b6', secondary: '#023e8a' },
    slug: 'naga-biru-academy',
  },
  {
    id: 'u15-04',
    tournamentId: 'tournament-2026',
    name: 'Helang Emas SC',
    shortName: 'HLG',
    category: 'U15',
    group: 'A',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A well-structured club emphasising possession-based football and creative play.',
    colors: { primary: '#f4a261', secondary: '#264653' },
    slug: 'helang-emas-sc',
  },
  {
    id: 'u15-05',
    tournamentId: 'tournament-2026',
    name: 'Singa Stars',
    shortName: 'SGS',
    category: 'U15',
    group: 'B',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A competitive youth setup with a reputation for physical fitness and pressing intensity.',
    colors: { primary: '#9b2226', secondary: '#001219' },
    slug: 'singa-stars',
  },
  {
    id: 'u15-06',
    tournamentId: 'tournament-2026',
    name: 'Seladang FC',
    shortName: 'SLD',
    category: 'U15',
    group: 'B',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'Powerful and direct in style, known for set-piece prowess and aerial dominance.',
    colors: { primary: '#606c38', secondary: '#283618' },
    slug: 'seladang-fc',
  },
  {
    id: 'u15-07',
    tournamentId: 'tournament-2026',
    name: 'Rajawali Youth',
    shortName: 'RJW',
    category: 'U15',
    group: 'B',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A fast-paced team that thrives on wing play and crossing from wide areas.',
    colors: { primary: '#7209b7', secondary: '#3a0ca3' },
    slug: 'rajawali-youth',
  },
  {
    id: 'u15-08',
    tournamentId: 'tournament-2026',
    name: 'Kancil Putih FC',
    shortName: 'KCL',
    category: 'U15',
    group: 'B',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A technically gifted squad that values ball retention and patient build-up play.',
    colors: { primary: '#f72585', secondary: '#4361ee' },
    slug: 'kancil-putih-fc',
  },

  // U17 Teams
  {
    id: 'u17-01',
    tournamentId: 'tournament-2026',
    name: 'Panthera FC',
    shortName: 'PNT',
    category: 'U17',
    group: 'A',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'An elite academy that blends tactical intelligence with technical excellence at the U17 level.',
    colors: { primary: '#2d6a4f', secondary: '#1b4332' },
    slug: 'panthera-fc',
  },
  {
    id: 'u17-02',
    tournamentId: 'tournament-2026',
    name: 'Badak FC',
    shortName: 'BDK',
    category: 'U17',
    group: 'A',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A physically imposing side that combines strength with tactical flexibility.',
    colors: { primary: '#495057', secondary: '#212529' },
    slug: 'badak-fc',
  },
  {
    id: 'u17-03',
    tournamentId: 'tournament-2026',
    name: 'Wira Timur United',
    shortName: 'WTU',
    category: 'U17',
    group: 'A',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'Representing the east coast, known for flair and crowd-pleasing football.',
    colors: { primary: '#e76f51', secondary: '#264653' },
    slug: 'wira-timur-united',
  },
  {
    id: 'u17-04',
    tournamentId: 'tournament-2026',
    name: 'Bintang Selatan SC',
    shortName: 'BSS',
    category: 'U17',
    group: 'A',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A southern powerhouse with excellent academy structures and development pathways.',
    colors: { primary: '#ffd60a', secondary: '#003566' },
    slug: 'bintang-selatan-sc',
  },
  {
    id: 'u17-05',
    tournamentId: 'tournament-2026',
    name: 'Rimba Warriors',
    shortName: 'RMB',
    category: 'U17',
    group: 'B',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'Aggressive and fearless, this team presses high and attacks in waves.',
    colors: { primary: '#bc6c25', secondary: '#606c38' },
    slug: 'rimba-warriors',
  },
  {
    id: 'u17-06',
    tournamentId: 'tournament-2026',
    name: 'Angkasa FC',
    shortName: 'AGK',
    category: 'U17',
    group: 'B',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A modern club with a data-driven approach to youth development and match preparation.',
    colors: { primary: '#4895ef', secondary: '#3f37c9' },
    slug: 'angkasa-fc',
  },
  {
    id: 'u17-07',
    tournamentId: 'tournament-2026',
    name: 'Perkasa United',
    shortName: 'PRK',
    category: 'U17',
    group: 'B',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'A team with deep community roots, famous for developing strong centre-backs.',
    colors: { primary: '#d62828', secondary: '#003049' },
    slug: 'perkasa-united',
  },
  {
    id: 'u17-08',
    tournamentId: 'tournament-2026',
    name: 'Satria Muda Academy',
    shortName: 'SMA',
    category: 'U17',
    group: 'B',
    logoUrl: '/images/teams/placeholder-logo.svg',
    description: 'The defending champions, known for their winning mentality and composure under pressure.',
    colors: { primary: '#7b2cbf', secondary: '#240046' },
    slug: 'satria-muda-academy',
  },
];

// ---------- Groups ----------
export const groups: Group[] = [
  { id: 'u15-grp-a', tournamentId: 'tournament-2026', category: 'U15', name: 'Group A' },
  { id: 'u15-grp-b', tournamentId: 'tournament-2026', category: 'U15', name: 'Group B' },
  { id: 'u17-grp-a', tournamentId: 'tournament-2026', category: 'U17', name: 'Group A' },
  { id: 'u17-grp-b', tournamentId: 'tournament-2026', category: 'U17', name: 'Group B' },
];

// ---------- Helper: Generate Players ----------
const positions = ['Goalkeeper', 'Defender', 'Defender', 'Defender', 'Defender', 'Midfielder', 'Midfielder', 'Midfielder', 'Midfielder', 'Forward', 'Forward', 'Forward', 'Goalkeeper', 'Defender', 'Midfielder'] as const;

const playerNames = [
  'Adam Irfan', 'Aiman Hakim', 'Danial Asyraf', 'Farhan Zikri', 'Hafiz Iman',
  'Izzat Nabil', 'Jazlan Akmal', 'Khairul Amir', 'Luqman Hariz', 'Mikail Danish',
  'Nazrin Aqil', 'Qayyum Faris', 'Rizwan Haziq', 'Syahmi Aizat', 'Wan Amirul',
];

function generatePlayers(teamId: string): Player[] {
  return playerNames.map((name, i) => ({
    id: `${teamId}-player-${i + 1}`,
    teamId,
    name,
    jerseyNumber: i === 0 ? 1 : i === 12 ? 30 : i + 1,
    position: positions[i] as Player['position'],
    photoUrl: '/images/players/placeholder-player.svg',
    stats: {
      goals: positions[i] === 'Forward' ? Math.floor(Math.random() * 8) : Math.floor(Math.random() * 3),
      assists: Math.floor(Math.random() * 5),
      yellowCards: Math.floor(Math.random() * 3),
      redCards: Math.floor(Math.random() * 1),
      appearances: 3 + Math.floor(Math.random() * 3),
    },
  }));
}

export const players: Player[] = teams.flatMap((team) => generatePlayers(team.id));

// ---------- Staff ----------
export const staff: Staff[] = teams.flatMap((team) => [
  {
    id: `${team.id}-coach`,
    teamId: team.id,
    name: `Coach ${team.shortName}`,
    role: 'Head Coach' as const,
    photoUrl: '/images/staff/placeholder-staff.svg',
  },
  {
    id: `${team.id}-asst`,
    teamId: team.id,
    name: `Asst. Coach ${team.shortName}`,
    role: 'Assistant Coach' as const,
    photoUrl: '/images/staff/placeholder-staff.svg',
  },
  {
    id: `${team.id}-mgr`,
    teamId: team.id,
    name: `Manager ${team.shortName}`,
    role: 'Manager' as const,
    photoUrl: '/images/staff/placeholder-staff.svg',
  },
]);

// ---------- Kits ----------
export const kits: Kit[] = teams.flatMap((team) => [
  {
    id: `${team.id}-home-kit`,
    teamId: team.id,
    type: 'home' as const,
    imageUrl: '/images/kits/placeholder-kit.svg',
  },
  {
    id: `${team.id}-away-kit`,
    teamId: team.id,
    type: 'away' as const,
    imageUrl: '/images/kits/placeholder-kit.svg',
  },
]);

// ---------- Fixtures ----------
function generateGroupFixtures(
  teamIds: string[],
  groupId: string,
  category: 'U15' | 'U17',
  startDate: Date
): Fixture[] {
  const fixtures: Fixture[] = [];
  let matchDay = 0;
  const venues = ['Stadium Utama', 'Padang A', 'Padang B', 'Mini Stadium'];

  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + matchDay);
      const hour = 9 + (fixtures.length % 3) * 3; // 9am, 12pm, 3pm
      date.setHours(hour, 0, 0, 0);

      fixtures.push({
        id: `fixture-${groupId}-${i}-${j}`,
        tournamentId: 'tournament-2026',
        groupId,
        category,
        round: 'group',
        homeTeamId: teamIds[i],
        awayTeamId: teamIds[j],
        matchDate: date.toISOString(),
        venue: venues[fixtures.length % venues.length],
        status: fixtures.length < 2 ? 'completed' : fixtures.length < 4 ? 'upcoming' : 'upcoming',
      });

      if (fixtures.length % 2 === 0) matchDay++;
    }
  }
  return fixtures;
}

const u15GroupA = teams.filter((t) => t.category === 'U15' && t.group === 'A').map((t) => t.id);
const u15GroupB = teams.filter((t) => t.category === 'U15' && t.group === 'B').map((t) => t.id);
const u17GroupA = teams.filter((t) => t.category === 'U17' && t.group === 'A').map((t) => t.id);
const u17GroupB = teams.filter((t) => t.category === 'U17' && t.group === 'B').map((t) => t.id);

export const fixtures: Fixture[] = [
  ...generateGroupFixtures(u15GroupA, 'u15-grp-a', 'U15', new Date('2026-06-20')),
  ...generateGroupFixtures(u15GroupB, 'u15-grp-b', 'U15', new Date('2026-06-20')),
  ...generateGroupFixtures(u17GroupA, 'u17-grp-a', 'U17', new Date('2026-06-21')),
  ...generateGroupFixtures(u17GroupB, 'u17-grp-b', 'U17', new Date('2026-06-21')),
];

// ---------- Scores (for completed fixtures) ----------
function generateMatchEvents(fixture: Fixture, homeScore: number, awayScore: number): Score['events'] {
  const events: Score['events'] = [];
  const homePlayers = players.filter((p) => p.teamId === fixture.homeTeamId);
  const awayPlayers = players.filter((p) => p.teamId === fixture.awayTeamId);
  let eventId = 0;

  // Generate goal events
  const usedMinutes = new Set<number>();
  const getMinute = () => {
    let m;
    do { m = 5 + Math.floor(Math.random() * 85); } while (usedMinutes.has(m));
    usedMinutes.add(m);
    return m;
  };

  for (let i = 0; i < homeScore; i++) {
    const scorers = homePlayers.filter((p) => p.position === 'Forward' || p.position === 'Midfielder');
    const scorer = scorers[i % scorers.length];
    const assisters = homePlayers.filter((p) => p.id !== scorer?.id && (p.position === 'Midfielder' || p.position === 'Forward'));
    events.push({
      id: `${fixture.id}-evt-${eventId++}`,
      type: 'goal',
      minute: getMinute(),
      playerId: scorer?.id || homePlayers[0]?.id || '',
      teamId: fixture.homeTeamId,
      description: assisters.length > 0 ? `Assist: ${assisters[i % assisters.length]?.name}` : undefined,
    });
  }

  for (let i = 0; i < awayScore; i++) {
    const scorers = awayPlayers.filter((p) => p.position === 'Forward' || p.position === 'Midfielder');
    const scorer = scorers[i % scorers.length];
    const assisters = awayPlayers.filter((p) => p.id !== scorer?.id && (p.position === 'Midfielder' || p.position === 'Forward'));
    events.push({
      id: `${fixture.id}-evt-${eventId++}`,
      type: 'goal',
      minute: getMinute(),
      playerId: scorer?.id || awayPlayers[0]?.id || '',
      teamId: fixture.awayTeamId,
      description: assisters.length > 0 ? `Assist: ${assisters[i % assisters.length]?.name}` : undefined,
    });
  }

  // Generate 1-3 yellow cards per match
  const yellowCount = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < yellowCount; i++) {
    const pool = i % 2 === 0 ? homePlayers : awayPlayers;
    const defenders = pool.filter((p) => p.position === 'Defender' || p.position === 'Midfielder');
    events.push({
      id: `${fixture.id}-evt-${eventId++}`,
      type: 'yellow_card',
      minute: getMinute(),
      playerId: defenders[i % defenders.length]?.id || pool[0]?.id || '',
      teamId: i % 2 === 0 ? fixture.homeTeamId : fixture.awayTeamId,
    });
  }

  // Occasional red card (20% chance)
  if (Math.random() < 0.2) {
    const pool = Math.random() > 0.5 ? homePlayers : awayPlayers;
    events.push({
      id: `${fixture.id}-evt-${eventId++}`,
      type: 'red_card',
      minute: getMinute(),
      playerId: pool.filter((p) => p.position === 'Defender')[0]?.id || pool[0]?.id || '',
      teamId: Math.random() > 0.5 ? fixture.homeTeamId : fixture.awayTeamId,
    });
  }

  // Generate 2-4 substitutions per match
  const subCount = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < subCount; i++) {
    const pool = i % 2 === 0 ? homePlayers : awayPlayers;
    const outPlayer = pool[10 + (i % 5)] || pool[i % pool.length];
    const inPlayer = pool[12 + (i % 3)] || pool[(i + 5) % pool.length];
    events.push({
      id: `${fixture.id}-evt-${eventId++}`,
      type: 'substitution',
      minute: 55 + Math.floor(Math.random() * 35),
      playerId: outPlayer?.id || '',
      teamId: i % 2 === 0 ? fixture.homeTeamId : fixture.awayTeamId,
      description: `In: ${inPlayer?.name || 'Unknown'}`,
    });
  }

  // Sort by minute
  return events.sort((a, b) => a.minute - b.minute);
}

export const scores: Score[] = fixtures
  .filter((f) => f.status === 'completed')
  .map((f) => {
    const homeScore = Math.floor(Math.random() * 4);
    const awayScore = Math.floor(Math.random() * 4);
    return {
      id: `score-${f.id}`,
      fixtureId: f.id,
      homeScore,
      awayScore,
      updatedAt: f.matchDate,
      updatedBy: 'admin',
      events: generateMatchEvents(f, homeScore, awayScore),
    };
  });

// ---------- Media ----------
export const media: Media[] = [
  {
    id: 'media-01',
    tournamentId: 'tournament-2026',
    type: 'highlight',
    title: 'Matchday 1 Highlights: Harimau Muda FC vs Garuda United',
    description: 'All the action from the opening match of the tournament.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/images/media/placeholder-thumb.svg',
    category: 'U15',
    publishedAt: '2026-06-20T18:00:00+08:00',
    tags: ['highlights', 'matchday-1', 'u15'],
  },
  {
    id: 'media-02',
    tournamentId: 'tournament-2026',
    type: 'interview',
    title: 'Pre-Tournament Interview: Panthera FC Head Coach',
    description: 'The head coach shares his expectations and squad preparation ahead of the tournament.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/images/media/placeholder-thumb.svg',
    category: 'U17',
    publishedAt: '2026-06-19T10:00:00+08:00',
    tags: ['interview', 'pre-tournament', 'u17'],
  },
  {
    id: 'media-03',
    tournamentId: 'tournament-2026',
    type: 'highlight',
    title: 'Top 5 Goals of Matchday 1',
    description: 'The best strikes from across all matches on the opening day.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/images/media/placeholder-thumb.svg',
    category: 'U15',
    publishedAt: '2026-06-20T20:00:00+08:00',
    tags: ['highlights', 'top-goals', 'matchday-1'],
  },
  {
    id: 'media-04',
    tournamentId: 'tournament-2026',
    type: 'interview',
    title: 'Post-Match: Satria Muda Academy Captain Speaks',
    description: 'The defending champions captain reflects on their opening game performance.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/images/media/placeholder-thumb.svg',
    category: 'U17',
    publishedAt: '2026-06-21T17:00:00+08:00',
    tags: ['interview', 'post-match', 'u17'],
  },
  {
    id: 'media-05',
    tournamentId: 'tournament-2026',
    type: 'highlight',
    title: 'U17 Matchday 1: Panthera FC vs Badak FC',
    description: 'A tactical battle between two well-organised sides.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/images/media/placeholder-thumb.svg',
    category: 'U17',
    publishedAt: '2026-06-21T19:00:00+08:00',
    tags: ['highlights', 'matchday-1', 'u17'],
  },
  {
    id: 'media-06',
    tournamentId: 'tournament-2026',
    type: 'highlight',
    title: 'Kancil Putih FC Amazing Team Goal',
    description: 'A 20-pass sequence culminating in a spectacular team goal.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/images/media/placeholder-thumb.svg',
    category: 'U15',
    publishedAt: '2026-06-22T14:00:00+08:00',
    tags: ['highlights', 'team-goal', 'u15'],
  },
];

// ---------- Helper Functions ----------
export function getTeamById(id: string): Team | undefined {
  return teams.find((t) => t.id === id);
}

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

export function getTeamBySlug(slug: string): Team | undefined {
  return teams.find((t) => t.slug === slug);
}

export function getTeamsByCategory(category: 'U15' | 'U17'): Team[] {
  return teams.filter((t) => t.category === category);
}

export function getPlayersByTeam(teamId: string): Player[] {
  return players.filter((p) => p.teamId === teamId);
}

export function getStaffByTeam(teamId: string): Staff[] {
  return staff.filter((s) => s.teamId === teamId);
}

export function getKitsByTeam(teamId: string): Kit[] {
  return kits.filter((k) => k.teamId === teamId);
}

export function getFixturesByTeam(teamId: string): Fixture[] {
  return fixtures.filter((f) => f.homeTeamId === teamId || f.awayTeamId === teamId);
}

export function getScoreByFixture(fixtureId: string): Score | undefined {
  return scores.find((s) => s.fixtureId === fixtureId);
}

export function getFixturesByCategory(category: 'U15' | 'U17'): Fixture[] {
  return fixtures.filter((f) => f.category === category);
}

export function getFixturesByStatus(status: 'upcoming' | 'live' | 'completed'): Fixture[] {
  return fixtures.filter((f) => f.status === status);
}
