import { PrismaClient } from "@prisma/client";

const client = new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL });

export default defineEventHandler(async (event) => {
  try {
    // delete in reverse order of dependencies
    // choices and teams reference students which references persons
    await client.choice.deleteMany({});
    await client.team.deleteMany({});
    await client.project.deleteMany({});
    await client.partner.deleteMany({});
    await client.semester.deleteMany({});

    // student must go before person because student has a foreign key to person
    await client.student.deleteMany({});

    // personnel must go before person too
    await client.personnel.deleteMany({});

    // person is last since everything links to it
    await client.person.deleteMany({});

    return { success: true, message: "Database cleared" };
  } catch (error) {
    console.error("Error resetting database:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to reset database" });
  }
});
