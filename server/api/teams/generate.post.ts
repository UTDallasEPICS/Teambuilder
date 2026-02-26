/**
 * POST /api/teams/generate
 * Runs the CPSAT (OR-Tools CP-SAT) algorithm server-side and returns team assignments.
 * Body: { semesterId: string }
 * Response: { teamAssignments: Record<projectId, StudentWithChoices[]>, projects: Project[] }
 */

import { generateTeamsORTools } from '~/algorithms/CPSAT/ortools'
import type { Student as CPSATStudent, Project as CPSATProject } from '~/algorithms/CPSAT/ortools'
import type { CPSATConfig } from '~/algorithms/CPSAT/ortools'
import type { Year, ProjectType, Student, Choice, Project } from '@prisma/client'

type StudentWithChoices = Student & { choices: Choice[] }

const mapYear = (year: Year): CPSATStudent['seniority'] => {
  const map: Record<Year, CPSATStudent['seniority']> = {
    FRESHMAN: 'Freshman',
    SOPHOMORE: 'Sophomore',
    JUNIOR: 'Junior',
    SENIOR: 'Senior',
  }
  return map[year]
}

const mapProjectType = (type: ProjectType): CPSATProject['type'] => {
  const map: Record<ProjectType, CPSATProject['type']> = {
    SOFTWARE: 'SW',
    HARDWARE: 'HW',
    BOTH: 'Both',
  }
  return map[type]
}

export default defineEventHandler(async (event) => {
  const { semesterId, config } = await readBody<{ semesterId: string; config?: CPSATConfig }>(event)

  if (!semesterId) {
    throw createError({ statusCode: 400, message: 'semesterId is required.' })
  }

  // Fetch active students with their choices
  const students: StudentWithChoices[] = await event.context.client.student.findMany({
    where: { status: 'ACTIVE' },
    include: { choices: true },
  })

  // Fetch active projects for this semester (those with a team in this semester)
  const projects: Project[] = await event.context.client.project.findMany({
    where: {
      teams: {
        some: { semesterId },
      },
    },
  })

  if (!students.length) {
    throw createError({ statusCode: 400, message: 'No active students found.' })
  }
  if (!projects.length) {
    throw createError({ statusCode: 400, message: 'No projects found for this semester. Activate projects first.' })
  }

  const projectIdToName = new Map<string, string>(projects.map((p: Project) => [p.id, p.name] as const))
  const allActiveProjectNames = projects.map((p: Project) => p.name)

  // Map Prisma students → CPSAT Student type
  const cpsatStudents: CPSATStudent[] = students.map((s: StudentWithChoices) => ({
    // CPSAT expects project NAMES in choices (not IDs)
    // Keep only choices that map to currently active semester projects.
    // If a student has no valid active choices, allow all active projects as fallback
    // so the model remains feasible.
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
    major: (s.major as CPSATStudent['major']) ?? 'Other',
    seniority: mapYear(s.year),
    choices: (() => {
      const mapped = s.choices
        .sort((a: Choice, b: Choice) => a.rank - b.rank)
        .map((c: Choice) => projectIdToName.get(c.projectId))
        .filter((name): name is string => !!name)
      return mapped.length > 0 ? mapped : allActiveProjectNames
    })(),
    choicesString: (() => {
      const mapped = s.choices
      .sort((a: Choice, b: Choice) => a.rank - b.rank)
      .map((c: Choice) => projectIdToName.get(c.projectId))
      .filter((name): name is string => !!name)
      return (mapped.length > 0 ? mapped : allActiveProjectNames).join(',')
    })(),
    class: s.class as '2200' | '3200',
  }))

  // Map Prisma projects → CPSAT Project type
  const cpsatProjects: CPSATProject[] = projects.map((p: Project) => ({
    id: p.id,
    name: p.name,
    type: mapProjectType(p.type),
  }))

  // Run the CP-SAT algorithm (spawns a Python process)
  const cpsatResult = await generateTeamsORTools(cpsatStudents, cpsatProjects, config)

  // cpsatResult keys are project names; convert back to projectId → StudentWithChoices[]
  const nameToId = new Map<string, string>(projects.map((p: Project) => [p.name, p.id] as const))
  const idToStudent = new Map<string, StudentWithChoices>(students.map((s: StudentWithChoices) => [s.id, s] as const))

  const teamAssignments: Record<string, StudentWithChoices[]> = {}
  for (const [projectName, cpsatStudentArr] of Object.entries(cpsatResult)) {
    const projectId = nameToId.get(projectName)
    if (projectId) {
      teamAssignments[projectId] = cpsatStudentArr
        .map((cs: CPSATStudent) => idToStudent.get(cs.id))
        .filter((s): s is StudentWithChoices => s !== undefined)
    }
  }

  return { teamAssignments, projects }
})
