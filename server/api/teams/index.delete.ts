// Teams are deleted on the generate teams page.
// This deletes multiple teams at once.
// Expects an array of project ids & a semester id.
// TODO: how to handle deleting a team with students already assigned?

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async event => {
  const client: PrismaClient = event.context.client;

  const { semesterId, projectIds } = await readBody<TeamDeleteBody>(event);
  
  const deletedTeams = await client.team.deleteMany({
    where: {
      semesterId,
      projectId: { in: projectIds }
    }
  });

  return { status: 200, data: deletedTeams};
});

interface TeamDeleteBody {
  semesterId: string;
  projectIds: string[];
}