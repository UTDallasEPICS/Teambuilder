/**
 * PUT /api/teams/assign
 * Updates the student members of a team identified by projectId + semesterId.
 * Body: { semesterId: string, projectId: string, studentIds: string[] }
 */

export default defineEventHandler(async (event) => {
  const { semesterId, projectId, studentIds } = await readBody<{
    semesterId: string
    projectId: string
    studentIds: string[]
  }>(event)

  if (!semesterId || !projectId || !Array.isArray(studentIds)) {
    throw createError({ statusCode: 400, message: 'semesterId, projectId, and studentIds are required.' })
  }

  const updated = await event.context.client.team.update({
    where: { projectId_semesterId: { projectId, semesterId } },
    data: {
      students: {
        set: studentIds.map(id => ({ id })),
      },
    },
    include: { students: true },
  })

  return updated
})
