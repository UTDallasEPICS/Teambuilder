import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function createTeamToStudent(data) 
{
    return prisma.teamToStudent.create({
      data: data,
    });
  }
  