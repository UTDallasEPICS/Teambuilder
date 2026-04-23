// Teams are created on the generate teams page.
// This creates multiple teams at once.
// Expects an array of project ids & a semester id.

import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const client: PrismaClient = event.context.client;
  
  const { semesterId, projectIds } = await readBody<TeamPostBody>(event);
  const uniqueProjectIds = [...new Set(projectIds)];
  const projects = await client.project.findMany({
    where: { id: { in: uniqueProjectIds } },
    select: { id: true, meetingDay: true },
  });

  const teamsToCreate = projects.flatMap((project) => {
    if (project.meetingDay === 'BOTH') {
      return [
        { projectId: project.id, semesterId, meetingDay: 'WEDNESDAY' as const },
        { projectId: project.id, semesterId, meetingDay: 'THURSDAY' as const },
      ];
    }

    if (project.meetingDay === 'WEDNESDAY' || project.meetingDay === 'THURSDAY') {
      return [{ projectId: project.id, semesterId, meetingDay: project.meetingDay }];
    }

    return [{ projectId: project.id, semesterId, meetingDay: 'THURSDAY' as const }];
  });

  const existingTeams = await client.team.findMany({
    where: {
      semesterId,
      projectId: { in: projects.map(project => project.id) },
    },
    select: {
      projectId: true,
      meetingDay: true,
    },
  });

  const existingKeys = new Set(
    existingTeams.map(team => `${team.projectId}:${semesterId}:${team.meetingDay}`)
  );

  const teamsToInsert = teamsToCreate.filter(team => !existingKeys.has(`${team.projectId}:${semesterId}:${team.meetingDay}`));

  let createdTeams = { count: 0 };
  
  if (teamsToInsert.length > 0) {
    try {
      createdTeams = await client.team.createMany({
        data: teamsToInsert,
      });
    } catch (error: any) {
      // Handle unique constraint violation (P2002) gracefully
      // This can happen if there's a race condition or database inconsistency
      if (error.code === 'P2002') {
        console.warn('Some teams already exist, attempting individual inserts...');
        let successCount = 0;
        
        for (const team of teamsToInsert) {
          try {
            await client.team.create({ data: team });
            successCount++;
          } catch (err: any) {
            if (err.code !== 'P2002') {
              throw err;
            }
            // Skip if already exists
          }
        }
        
        createdTeams = { count: successCount };
      } else {
        throw error;
      }
    }
  }

  return { status: 201, data: createdTeams};
})

interface TeamPostBody {
  semesterId: string;
  projectIds: string[];
}