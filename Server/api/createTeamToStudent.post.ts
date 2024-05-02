import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function createTeamToStudent(teamId, studentId) 
{
    return prisma.teamToStudent.create({
      data: {
        teamId: teamId,
        studentId: studentId,
      },
    });
  }
  