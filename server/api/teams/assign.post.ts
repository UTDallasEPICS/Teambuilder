/**
 * PUT /api/teams/assign
 * Updates the student members of a team identified by teamId.
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
    include: { students: true },
  })

  return updated
})
