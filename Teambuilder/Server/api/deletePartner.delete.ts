// deletePartner.ts

import { PrismaClient, Partner } from '@prisma/client';

const prisma = new PrismaClient();

export const deletePartner = async (partnerId: string): Promise<Partner | null> => {
  return await prisma.partner.delete({
    where: {
      id: partnerId,
    },
    include: {
      projects: true,
      teams: true,
    },
  });
};
