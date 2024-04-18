import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function deleteTeamToStudent(teamToStudentId) {
    return prisma.teamToStudent.delete({
      where: {
        id: teamToStudentId,
      },
    });
  }