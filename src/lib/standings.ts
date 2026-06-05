/* ================================================
   Standings Calculation Utility
   ================================================ */

import type { Fixture, Score, Team, StandingRow } from '@/types';

export function calculateStandings(
  teams: Team[],
  fixtures: Fixture[],
  scores: Score[]
): StandingRow[] {
  const standingsMap = new Map<string, StandingRow>();

  // Initialize standings for each team
  teams.forEach((team) => {
    standingsMap.set(team.id, {
      teamId: team.id,
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
    });
  });

  // Process completed fixtures
  fixtures
    .filter((f) => f.status === 'completed')
    .forEach((fixture) => {
      const score = scores.find((s) => s.fixtureId === fixture.id);
      if (!score) return;

      const homeRow = standingsMap.get(fixture.homeTeamId);
      const awayRow = standingsMap.get(fixture.awayTeamId);
      if (!homeRow || !awayRow) return;

      // Update played
      homeRow.played++;
      awayRow.played++;

      // Update goals
      homeRow.goalsFor += score.homeScore;
      homeRow.goalsAgainst += score.awayScore;
      awayRow.goalsFor += score.awayScore;
      awayRow.goalsAgainst += score.homeScore;

      // Determine result
      if (score.homeScore > score.awayScore) {
        homeRow.won++;
        homeRow.points += 3;
        homeRow.form.push('W');
        awayRow.lost++;
        awayRow.form.push('L');
      } else if (score.homeScore < score.awayScore) {
        awayRow.won++;
        awayRow.points += 3;
        awayRow.form.push('W');
        homeRow.lost++;
        homeRow.form.push('L');
      } else {
        homeRow.drawn++;
        homeRow.points += 1;
        homeRow.form.push('D');
        awayRow.drawn++;
        awayRow.points += 1;
        awayRow.form.push('D');
      }
    });

  // Calculate goal difference and keep last 5 form entries
  standingsMap.forEach((row) => {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
    row.form = row.form.slice(-5);
  });

  // Sort: Points → GD → GF → Alphabetical
  return Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });
}

export function getGroupStandings(
  allTeams: Team[],
  allFixtures: Fixture[],
  allScores: Score[],
  category: 'U15' | 'U17',
  group: string
): StandingRow[] {
  const groupTeams = allTeams.filter(
    (t) => t.category === category && t.group === group
  );
  const groupTeamIds = new Set(groupTeams.map((t) => t.id));
  const groupFixtures = allFixtures.filter(
    (f) =>
      f.category === category &&
      groupTeamIds.has(f.homeTeamId) &&
      groupTeamIds.has(f.awayTeamId)
  );
  return calculateStandings(groupTeams, groupFixtures, allScores);
}
