// Teams are created on the generate teams page.
// This creates multiple teams at once.
// Expects an array of project ids & a semester id.

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const client: PrismaClient = event.context.client;
  
  const { semesterId, projectIds } = await readBody<TeamPostBody>(event);
  const teamsToCreate = projectIds.map(projectId => ({
    projectId,
    semesterId
  }))

  const createdTeams = await client.team.createMany({
    data: teamsToCreate
  });

  return { status: 201, data: createdTeams};
})

interface TeamPostBody {
  semesterId: string;
  projectIds: string[];
}