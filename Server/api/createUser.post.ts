import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createUser = async (id: string, email: string) => {
    return await prisma.user.create({
      data: {
        id,
        email,
      },
    });
  };
  