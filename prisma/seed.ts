import { PrismaClient } from "@prisma/client"
import { createRandomPartners } from "~/server/factories/partner";
import { createRandomProjects } from "~/server/factories/project";
const prisma = new PrismaClient()

const main = async () => {
    try {
        const partners = createRandomPartners(20);
        const projects = createRandomProjects(100, partners);

        await prisma.partner.createMany({ data: partners });
        await prisma.project.createMany({ data: projects });
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
    