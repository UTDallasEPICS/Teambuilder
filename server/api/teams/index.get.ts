/**
 * GET /api/teams?semesterId=...
 * Returns all teams for a semester with their assigned students and project info.
 * Response: { teamAssignments: Record<teamId, Student[]>, projects: Project[], teamMeta: Record<teamId, ...> }
 */

export default defineEventHandler(async (event) => {
  const { semesterId } = getQuery(event)

  if (!semesterId) {
    throw createError({ statusCode: 400, message: 'semesterId is required.' })
  }

  const teams = await event.context.client.team.findMany({
    where: { semesterId: String(semesterId) },
    include: {
      students: {
        include: { choices: true },
      },
      project: true,
    },
  })

  const teamAssignments: Record<string, any[]> = {}
  const teamMeta: Record<string, { projectId: string; meetingDay: string; projectName: string }> = {}
  for (const team of teams) {
    teamAssignments[team.id] = team.students
    teamMeta[team.id] = {
      projectId: team.projectId,
      meetingDay: String(team.meetingDay ?? 'THURSDAY'),
      projectName: team.project.name,
    }
  }

  const projectsById = new Map<string, any>()
  for (const team of teams) {
    if (!projectsById.has(team.project.id)) {
      projectsById.set(team.project.id, team.project)
    }
  }
  const projects = Array.from(projectsById.values())

  return { teamAssignments, projects, teamMeta }
})
