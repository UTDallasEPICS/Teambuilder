import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const updateUserEmail = async (id: string, email: string) => {
    return await prisma.user.update({
      where: {
        id: id, // Change from userId to id
      },
      data: {
        email: email, // Change from newEmail to email
      },
    });
  };
  