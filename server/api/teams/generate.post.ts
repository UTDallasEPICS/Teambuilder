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

  // Post-processing: Randomize students with no valid choices into teams that need more people
  // and match their major when possible
  const studentsWithNoChoices = students.filter(s => s.choices.length === 0)
  if (studentsWithNoChoices.length > 0) {
    // Identify which teams need more people (below max team size)
    const projectIdToTeamSize = new Map<string, number>()
    const projectIdToMajors = new Map<string, Map<string, number>>() // projectId -> { major: count }
    
    // Count current team sizes and major distributions
    for (const [projectId, assignedStudents] of Object.entries(teamAssignments)) {
      projectIdToTeamSize.set(projectId, assignedStudents.length)
      
      const majorCounts = new Map<string, number>()
      for (const student of assignedStudents) {
        const major = student.major ?? 'Other'
        majorCounts.set(major, (majorCounts.get(major) ?? 0) + 1)
      }
      projectIdToMajors.set(projectId, majorCounts)
    }

    // Re-assign students with no choices
    for (const studentWithNoChoices of studentsWithNoChoices) {
      // Find teams that need more people
      const projectsNeedingPeople = projects
        .filter(p => (projectIdToTeamSize.get(p.id) ?? 0) < 6) // Below max team size
        .sort((a, b) => {
          const sizeA = projectIdToTeamSize.get(a.id) ?? 0
          const sizeB = projectIdToTeamSize.get(b.id) ?? 0
          
          // Prioritize teams that are smaller (need more people)
          if (sizeA !== sizeB) return sizeA - sizeB
          
          // Tiebreaker: prioritize teams with matching major
          const majorCountsA = projectIdToMajors.get(a.id) ?? new Map()
          const majorCountsB = projectIdToMajors.get(b.id) ?? new Map()
          
          const countA = majorCountsA.get(studentWithNoChoices.major ?? 'Other') ?? 0
          const countB = majorCountsB.get(studentWithNoChoices.major ?? 'Other') ?? 0
          
          return countB - countA // Higher major match count first
        })

      if (projectsNeedingPeople.length > 0) {
        // Randomly pick from top 3 teams (or fewer if not available) to balance distribution
        const topCandidates = projectsNeedingPeople.slice(0, 3)
        const randomProject = topCandidates[Math.floor(Math.random() * topCandidates.length)]
        
        // Find current project this student was assigned to and move them
        for (const [currentProjectId, assignedStudents] of Object.entries(teamAssignments)) {
          const studentIndex = assignedStudents.findIndex(s => s.id === studentWithNoChoices.id)
          if (studentIndex !== -1) {
            // Remove from current project
            assignedStudents.splice(studentIndex, 1)
            break
          }
        }
        
        // Add to new project
        if (!teamAssignments[randomProject.id]) {
          teamAssignments[randomProject.id] = []
        }
        teamAssignments[randomProject.id].push(studentWithNoChoices)
        
        // Update size map
        projectIdToTeamSize.set(randomProject.id, (projectIdToTeamSize.get(randomProject.id) ?? 0) + 1)
      }
    }
  }

  // Persist student assignments to the database
  await Promise.all(
    Object.entries(teamAssignments).map(async ([projectId, assignedStudents]) => {
      await event.context.client.team.update({
        where: { projectId_semesterId: { projectId, semesterId } },
        data: {
          students: {
            set: assignedStudents.map(s => ({ id: s.id })),
          },
        },
      })
    })
  )

  return { teamAssignments, projects }
})
