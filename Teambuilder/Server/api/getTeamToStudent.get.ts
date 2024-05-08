import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getTeamToStudent(teamToStudentId) {
    return prisma.teamToStudent.findUnique({
      where: {
        id: teamToStudentId,
      },
    });
  }