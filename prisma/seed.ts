import { PrismaClient } from "@prisma/client"
import { createRandomPartners } from "~/server/factories/partner";
import { createRandomProjects } from "~/server/factories/project";
import { createSemesters } from "~/server/factories/semester";
import { createRandomStudents } from "~/server/factories/student";
import { createTeams } from "~/server/factories/team";

const prisma = new PrismaClient()

const main = async () => {
    try {
        const semesters = createSemesters();
        const partners = createRandomPartners(20);
        const projects = createRandomProjects(100, partners);
        const students = createRandomStudents(200);
        const teams = createTeams(projects, semesters);

        await prisma.semester.createMany({ data: semesters });
        await prisma.partner.createMany({ data: partners });
        await prisma.project.createMany({ data: projects });
        await prisma.student.createMany({ data: students });
        await prisma.team.createMany({ data: teams });
    } catch(error) {
        console.log(error)
    }
}

main()
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
    