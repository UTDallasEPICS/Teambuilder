import 'dotenv/config'
import { PrismaClient } from "@prisma/client"
import { createChoicesForSemester } from "~/server/factories/choice";
import { createRandomPartners } from "~/server/factories/partner";
import { createRandomProjects } from "~/server/factories/project";
import { createSemesters } from "~/server/factories/semester";
import { createRandomStudents } from "~/server/factories/student";
import { createRandomTeams } from "~/server/factories/team";

const prisma = new PrismaClient({ datasourceUrl: process.env.PRISMA_DB_URL })

const main = async () => {
    // Ensure key users always exist
    await prisma.user.upsert({
        where: { email: 'sxt230118@utdallas.edu' },
        update: {},
        create: {
            id: 'admin-001',
            email: 'sxt230118@utdallas.edu',
            name: 'Snigdha Tadi',
            emailVerified: true,
            role: 'admin',
            whitelisted: true,
            removed: false,
        }
    });

    await prisma.user.upsert({
        where: { email: 'amt101000@utdallas.edu' },
        update: {},
        create: {
            id: 'admin-002',
            email: 'amt101000@utdallas.edu',
            name: 'Andrea Turcatti',
            emailVerified: true,
            role: 'admin',
            whitelisted: true,
            removed: false,
        }
    });

    await prisma.user.upsert({
        where: { email: 'trp210003@utdallas.edu' },
        update: {},
        create: {
            id: 'admin-003',
            email: 'trp210003@utdallas.edu',
            name: 'Teerth Patel',
            emailVerified: true,
            role: 'admin',
            whitelisted: true,
            removed: false,
        }
    });

    await prisma.user.upsert({
        where: { email: 'bxt230017@utdallas.edu' },
        update: {},
        create: {
            id: 'user-001',
            email: 'bxt230017@utdallas.edu',
            name: 'Bhuvi Thiriveedhi',
            emailVerified: true,
            role: 'user',
            whitelisted: true,
            removed: false,
        }
    });

    await prisma.user.upsert({
        where: { email: 'nxs230112@utdallas.edu' },
        update: {},
        create: {
            id: 'user-002',
            email: 'nxs230112@utdallas.edu',
            name: 'Nishanth Srinivasan',
            emailVerified: true,
            role: 'user',
            whitelisted: true,
            removed: false,
        }
    });

    await prisma.user.upsert({
        where: { email: 'dal825784@utdallas.edu' },
        update: {},
        create: {
            id: 'user-003',
            email: 'dal825784@utdallas.edu',
            name: 'Aditya Narayanan',
            emailVerified: true,
            role: 'user',
            whitelisted: true,
            removed: false,
        }
    });

    try {
        const semesters = createSemesters();
        const partners = createRandomPartners(50);
        const projects = createRandomProjects(100, partners);
        const students = createRandomStudents(300);
        const teams = createRandomTeams(projects, semesters);
        const latestSemester = semesters[semesters.length-1];
        const choices = createChoicesForSemester(students, teams, latestSemester);

        await prisma.semester.createMany({ data: semesters });
        await prisma.partner.createMany({ data: partners });
        await prisma.project.createMany({ data: projects });
        await prisma.student.createMany({ data: students });
        await prisma.team.createMany({ data: teams });
        await prisma.choice.createMany({ data: choices });
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
    