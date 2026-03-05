/**
 * GET /api/teams?semesterId=...
 * Returns all teams for a semester with their assigned students and project info.
 * Response: { teamAssignments: Record<projectId, Student[]>, projects: Project[] }
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
  for (const team of teams) {
    teamAssignments[team.projectId] = team.students
  }

  const projects = teams.map(t => t.project)

  return { teamAssignments, projects }
})
