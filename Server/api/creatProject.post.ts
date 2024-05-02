import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createProject = async (name: string, team: string) => {
    return await prisma.project.create({
      data: {
       name,
       team,
      },
    });
  };
  