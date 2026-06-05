/* ================================================
   TypeScript Types for LigaHub
   ================================================ */

// ---------- Tournament ----------
export interface Tournament {
  id: string;
  name: string;
  season: string;
  status: 'upcoming' | 'active' | 'completed';
  startDate: string; // ISO date
  endDate: string;
  description?: string;
}

// ---------- Team ----------
export interface Team {
  id: string;
  tournamentId: string;
  name: string;
  shortName: string;
  category: Category;
  group: string;
  logoUrl: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
  };
  slug: string;
}

// ---------- Player ----------
export interface Player {
  id: string;
  teamId: string;
  name: string;
  jerseyNumber: number;
  position: Position;
  photoUrl: string;
  stats: PlayerStats;
}

export interface PlayerStats {
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
}

// ---------- Staff ----------
export interface Staff {
  id: string;
  teamId: string;
  name: string;
  role: StaffRole;
  photoUrl: string;
}

// ---------- Kit ----------
export interface Kit {
  id: string;
  teamId: string;
  type: 'home' | 'away';
  imageUrl: string;
}

// ---------- Group ----------
export interface Group {
  id: string;
  tournamentId: string;
  category: Category;
  name: string;
}

// ---------- Fixture ----------
export interface Fixture {
  id: string;
  tournamentId: string;
  groupId: string;
  category: Category;
  round: Round;
  homeTeamId: string;
  awayTeamId: string;
  matchDate: string; // ISO date
  venue: string;
  status: MatchStatus;
}

// ---------- Score ----------
export interface Score {
  id: string;
  fixtureId: string;
  homeScore: number;
  awayScore: number;
  updatedAt: string;
  updatedBy: string;
  events: MatchEvent[];
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty';
  minute: number;
  playerId: string;
  teamId: string;
  description?: string;
}

// ---------- Media ----------
export interface Media {
  id: string;
  tournamentId: string;
  type: MediaType;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  category: Category;
  publishedAt: string;
  tags: string[];
}

// ---------- User ----------
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl: string;
  createdAt: string;
  favoriteTeams: string[];
  role: UserRole;
  language: Language;
}

// ---------- Subscription ----------
export interface Subscription {
  id: string;
  userId: string;
  teamId: string;
  scoreAlerts: boolean;
  scheduleAlerts: boolean;
}

// ---------- Notification ----------
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  fixtureId?: string;
  read: boolean;
  createdAt: string;
}

// ---------- Standings ----------
export interface StandingRow {
  teamId: string;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: MatchResult[];
}

// ---------- Enums / Unions ----------
export type Category = 'U15' | 'U17';
export type Round = 'group' | 'quarter' | 'semi' | 'final';
export type MatchStatus = 'upcoming' | 'live' | 'completed';
export type MediaType = 'highlight' | 'interview' | 'photo';
export type UserRole = 'fan' | 'admin';
export type StaffRole = 'Head Coach' | 'Assistant Coach' | 'Manager' | 'Physio';
export type NotificationType = 'score' | 'schedule' | 'media';
export type MatchResult = 'W' | 'D' | 'L';
export type Language = 'en' | 'ms';

export type Position =
  | 'Goalkeeper'
  | 'Defender'
  | 'Midfielder'
  | 'Forward';

// ---------- Fixture with populated team data ----------
export interface FixtureWithTeams extends Fixture {
  homeTeam: Team;
  awayTeam: Team;
  score?: Score;
}

// ---------- i18n ----------
export interface TranslationStrings {
  [key: string]: string | TranslationStrings;
}
