import { PrismaClient } from "~/prisma/generated";

const prismaClientSingleton = () => {
  return new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;