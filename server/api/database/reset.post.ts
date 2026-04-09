import { PrismaClient } from "@prisma/client";

const client = new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL });

export default defineEventHandler(async (event) => {
  try {
    // Delete all existing data in reverse order of dependencies
    await client.choice.deleteMany({});
    await client.team.deleteMany({});
    await client.project.deleteMany({});
    await client.partner.deleteMany({});
    await client.student.deleteMany({});
    await client.semester.deleteMany({});

    return { success: true, message: "Database cleared" };
  } catch (error) {
    console.error("Error resetting database:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to reset database",
    });
  }
});
