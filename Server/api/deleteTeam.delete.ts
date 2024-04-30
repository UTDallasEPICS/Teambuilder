import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function deleteTeam(teamId: string) {
    return prisma.team.delete({
      where: 
      {
        id: teamId,
      },
    });
  }
  