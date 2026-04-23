/**
 * POST /api/teams/generate
 * Runs the CPSAT algorithm and returns team assignments.
 * Body: { semesterId: string, config?: CPSATConfig }
 */

import { generateTeamsORTools } from '~/algorithms/CPSAT/ortools';
import type { Student as CPSATStudent, Project as CPSATProject } from '~/algorithms/CPSAT/ortools';
import type { CPSATConfig } from '~/algorithms/CPSAT/ortools';
import type { Year, ProjectType, Student, Choice, Project, Person } from '@prisma/client';

// student with person and choices included
type StudentWithPersonAndChoices = Student & {
  person: Person;
  choices: Choice[];
};

const mapYear = (year: Year): CPSATStudent['seniority'] => {
  const map: Record<Year, CPSATStudent['seniority']> = {
    FRESHMAN:  'Freshman',
    SOPHOMORE: 'Sophomore',
    JUNIOR:    'Junior',
    SENIOR:    'Senior',
  };
  return map[year];
};

const mapProjectType = (type: ProjectType): CPSATProject['type'] => {
  const map: Record<ProjectType, CPSATProject['type']> = {
    SOFTWARE: 'SW',
    HARDWARE: 'HW',
    BOTH:     'Both',
  };
  return map[type];
};

export default defineEventHandler(async (event) => {
  const { semesterId, config } = await readBody<{ semesterId: string; config?: CPSATConfig }>(event);
  const minTeamSize = Math.max(1, config?.min_team_size ?? 4);
  const maxTeamSize = Math.max(minTeamSize, config?.max_team_size ?? 6);

  if (!semesterId) {
    throw createError({ statusCode: 400, message: 'semesterId is required.' });
  }

  // fetch active students with their person record and choices
  const students: StudentWithPersonAndChoices[] = await event.context.client.student.findMany({
    where: { status: 'ACTIVE' },
    include: {
      person: true,
      choices: true,
    },
  });

  const projects: Project[] = await event.context.client.project.findMany({
    where: { teams: { some: { semesterId } } },
  });

  if (!students.length) throw createError({ statusCode: 400, message: 'No active students found.' });
  if (!projects.length) throw createError({ statusCode: 400, message: 'No projects found for this semester. Activate projects first.' });

  const projectIdToName = new Map<string, string>(projects.map((p: Project) => [p.id, p.name] as const));

  const mappedChoicesByStudentId = new Map<string, string[]>(
    students.map((s: StudentWithPersonAndChoices) => {
      const mapped = s.choices
        .slice()
        .sort((a: Choice, b: Choice) => a.rank - b.rank)
        .map((c: Choice) => projectIdToName.get(c.projectId))
        .filter((name): name is string => !!name);
      return [s.id, mapped] as const;
    })
  );

  // map Prisma students to CPSAT Student type
  // name firstName and lastName now come from s.person
  const cpsatStudents: CPSATStudent[] = students.map((s: StudentWithPersonAndChoices) => ({
    id: s.id,
    name: `${s.person.firstName ?? ''} ${s.person.lastName ?? ''}`.trim(),
    major: (s.major as CPSATStudent['major']) ?? 'Other',
    seniority: mapYear(s.year ?? 'FRESHMAN'),
    choices: mappedChoicesByStudentId.get(s.id) ?? [],
    choicesString: (mappedChoicesByStudentId.get(s.id) ?? []).join(','),
    class: s.class as '2200' | '3200',
  }));

  const cpsatProjects: CPSATProject[] = projects.map((p: Project) => ({
    id: p.id,
    name: p.name,
    type: mapProjectType(p.type),
  }));

  const cpsatResult = await generateTeamsORTools(cpsatStudents, cpsatProjects, config);

  const nameToId = new Map<string, string>(projects.map((p: Project) => [p.name, p.id] as const));
  const idToStudent = new Map<string, StudentWithPersonAndChoices>(
    students.map((s: StudentWithPersonAndChoices) => [s.id, s] as const)
  );

  const teamAssignments: Record<string, StudentWithPersonAndChoices[]> = Object.fromEntries(
    projects.map((p: Project) => [p.id, [] as StudentWithPersonAndChoices[]])
  );

  for (const [projectName, cpsatStudentArr] of Object.entries(cpsatResult)) {
    const projectId = nameToId.get(projectName);
    if (projectId) {
      teamAssignments[projectId] = cpsatStudentArr
        .map((cs: CPSATStudent) => idToStudent.get(cs.id))
        .filter((s): s is StudentWithPersonAndChoices => s !== undefined);
    }
  }

  // handle students with no valid choices
  const studentsWithNoChoices = students.filter(
    s => (mappedChoicesByStudentId.get(s.id)?.length ?? 0) === 0
  );

  if (studentsWithNoChoices.length > 0) {
    const projectIdToTeamSize = new Map<string, number>();
    const projectIdToMajors = new Map<string, Map<string, number>>();

    for (const [projectId, assignedStudents] of Object.entries(teamAssignments)) {
      projectIdToTeamSize.set(projectId, assignedStudents.length);
      const majorCounts = new Map<string, number>();
      for (const student of assignedStudents) {
        const major = student.major ?? 'Other';
        majorCounts.set(major, (majorCounts.get(major) ?? 0) + 1);
      }
      projectIdToMajors.set(projectId, majorCounts);
    }

    for (const studentWithNoChoices of studentsWithNoChoices) {
      const projectsNeedingPeople = projects
        .filter(p => (projectIdToTeamSize.get(p.id) ?? 0) > 0)
        .filter(p => (projectIdToTeamSize.get(p.id) ?? 0) < maxTeamSize)
        .sort((a, b) => {
          const sizeA = projectIdToTeamSize.get(a.id) ?? 0;
          const sizeB = projectIdToTeamSize.get(b.id) ?? 0;
          if (sizeA !== sizeB) return sizeA - sizeB;
          const majorCountsA = projectIdToMajors.get(a.id) ?? new Map();
          const majorCountsB = projectIdToMajors.get(b.id) ?? new Map();
          const countA = majorCountsA.get(studentWithNoChoices.major ?? 'Other') ?? 0;
          const countB = majorCountsB.get(studentWithNoChoices.major ?? 'Other') ?? 0;
          return countB - countA;
        });

      if (projectsNeedingPeople.length > 0) {
        const topCandidates = projectsNeedingPeople.slice(0, 3);
        const randomProject = topCandidates[Math.floor(Math.random() * topCandidates.length)];

        let sourceProjectId: string | null = null;
        for (const [currentProjectId, assignedStudents] of Object.entries(teamAssignments)) {
          const studentIndex = assignedStudents.findIndex(s => s.id === studentWithNoChoices.id);
          if (studentIndex !== -1) {
            if (currentProjectId === randomProject.id) { sourceProjectId = null; break; }
            if (assignedStudents.length <= minTeamSize) { sourceProjectId = null; break; }
            assignedStudents.splice(studentIndex, 1);
            sourceProjectId = currentProjectId;
            break;
          }
        }

        if (sourceProjectId) {
          if (!teamAssignments[randomProject.id]) teamAssignments[randomProject.id] = [];
          teamAssignments[randomProject.id].push(studentWithNoChoices);
          projectIdToTeamSize.set(sourceProjectId, Math.max(0, (projectIdToTeamSize.get(sourceProjectId) ?? 0) - 1));
          projectIdToTeamSize.set(randomProject.id, (projectIdToTeamSize.get(randomProject.id) ?? 0) + 1);
        }
      }
    }
  }

  // rebalance undersized teams by pulling from large teams
  const rebalanceUndersizedTeams = () => {
    let moved = true;
    while (moved) {
      moved = false;
      const undersizedTeamIds = Object.entries(teamAssignments)
        .filter(([, s]) => s.length > 0 && s.length < minTeamSize)
        .sort((a, b) => a[1].length - b[1].length)
        .map(([id]) => id);

      for (const targetProjectId of undersizedTeamIds) {
        const targetTeam = teamAssignments[targetProjectId];
        while (targetTeam.length > 0 && targetTeam.length < minTeamSize) {
          const donorEntry = Object.entries(teamAssignments)
            .filter(([id, s]) => id !== targetProjectId && s.length > minTeamSize)
            .sort((a, b) => b[1].length - a[1].length)[0];
          if (!donorEntry) break;
          const movedStudent = donorEntry[1].pop();
          if (!movedStudent) break;
          targetTeam.push(movedStudent);
          moved = true;
        }
      }
    }
  };

  rebalanceUndersizedTeams();

  const undersizedTeams = Object.entries(teamAssignments)
    .filter(([, s]) => s.length > 0 && s.length < minTeamSize)
    .map(([projectId, s]) => {
      const projectName = projects.find((p: Project) => p.id === projectId)?.name ?? projectId;
      return `${projectName} (${s.length})`;
    });

  if (undersizedTeams.length > 0) {
    throw createError({
      statusCode: 400,
      message: `Unable to satisfy minimum team size ${minTeamSize} for: ${undersizedTeams.join(', ')}`,
    });
  }

  // save assignments to the database
  await Promise.all(
    Object.entries(teamAssignments).map(async ([projectId, assignedStudents]) => {
      await event.context.client.team.update({
        where: { projectId_semesterId: { projectId, semesterId } },
        data: { students: { set: assignedStudents.map(s => ({ id: s.id })) } },
      });
    })
  );

  return { teamAssignments, projects };
});
