import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUser = async (id: string, email: string) => {
    return await prisma.user.findUnique({
      where: {
        id,
        email,
      },
    });
  };