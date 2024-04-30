import { PrismaClient, Partner } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTeam(teamId: string, newName: string) {
    return prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        name: newName,
      },
    });
  }
  