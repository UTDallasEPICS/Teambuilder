/**
 * POST /api/teams/assign
 * Updates the student members of a team.
 * The frontend now sends teamId directly instead of projectId + semesterId.
 * Body: { teamId: string, studentIds: string[] }
 */

export default defineEventHandler(async (event) => {
  const { teamId, studentIds } = await readBody<{
    teamId: string
    studentIds: string[]
  }>(event)

  if (!teamId || !Array.isArray(studentIds)) {
    throw createError({ statusCode: 400, message: 'teamId and studentIds are required.' })
  }

  const updated = await event.context.client.team.update({
    where: { id: teamId },
    data: {
      students: {
        set: studentIds.map(id => ({ id })),
      },
    },
    include: { students: { include: { person: true } } },
  })

  return updated
})