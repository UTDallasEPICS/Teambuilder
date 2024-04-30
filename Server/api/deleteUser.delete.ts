import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const deleteUser = async (id: string) => {
    return await prisma.user.delete({
      where: {
        id: id,
      },
    });
  };
  