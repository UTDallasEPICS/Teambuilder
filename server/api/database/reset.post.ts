import { PrismaClient } from "@prisma/client";
import { createChoicesForSemester } from "~/server/factories/choice";
import { createRandomPartners } from "~/server/factories/partner";
import { createRandomProjects } from "~/server/factories/project";
import { createSemesters } from "~/server/factories/semester";
import { createRandomStudents } from "~/server/factories/student";
import { createRandomTeams } from "~/server/factories/team";

const client = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Delete all existing data in reverse order of dependencies
    await client.choice.deleteMany({});
    await client.team.deleteMany({});
    await client.project.deleteMany({});
    await client.partner.deleteMany({});
    await client.student.deleteMany({});
    await client.semester.deleteMany({});

    // Re-seed with default data from factories
    const semesters = createSemesters();
    const partners = createRandomPartners(50);
    const projects = createRandomProjects(100, partners);
    const students = createRandomStudents(300);
    const teams = createRandomTeams(projects, semesters);
    const latestSemester = semesters[semesters.length - 1];
    const choices = createChoicesForSemester(students, teams, latestSemester);

    await client.semester.createMany({ data: semesters });
    await client.partner.createMany({ data: partners });
    await client.project.createMany({ data: projects });
    await client.student.createMany({ data: students });
    await client.team.createMany({ data: teams });
    await client.choice.createMany({ data: choices });

    return { success: true, message: "Database reset to default seed data" };
  } catch (error) {
    console.error("Error resetting database:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to reset database",
    });
  }
});
