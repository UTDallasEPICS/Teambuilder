import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTeam(name: string, projectId: string) {
  return prisma.team.create({
    data: {
      name,
      projectId,
    },
  });
}
