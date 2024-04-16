import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function getTeam(teamId: string) {
    return prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });
  }
  