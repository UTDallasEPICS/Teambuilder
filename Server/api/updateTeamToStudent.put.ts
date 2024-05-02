import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateTeamToStudent(teamToStudentId, data) {
    return prisma.teamToStudent.update({
      where: {
        id: teamToStudentId,
      },
      data: data,
    });
  }