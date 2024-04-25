// myTest.spec.ts
import { generateTeams } from '../algorithms';

describe('createTeam', () => {
  test('should create a new team', () => {
    const team = generateTeams('Team A', 'project123');
    expect(team).toBeDefined();
    expect(team.name).toBe('Team A');
    expect(team.projectId).toBe('project123');
  });
});
