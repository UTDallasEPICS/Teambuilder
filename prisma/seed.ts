import 'dotenv/config'
import type {Season} from "~/prisma/generated";
import {prisma} from "~/server/utils/db";
import partnerService from "~/server/services/partnerService";
import semesterService from "~/server/services/semesterService";
import studentService from "~/server/services/studentService";
import partnersData from "~/prisma/seeddata/partners.json";
import projectsData from "~/prisma/seeddata/projects.json";
import studentsData from "~/prisma/seeddata/students.json";

const SEED_YEARS = [2024, 2025, 2026];
const SEED_SEASONS: Season[] = ['SPRING', 'SUMMER', 'FALL'];

const seedSemesters = async () => {
  for (const year of SEED_YEARS) {
    for (const season of SEED_SEASONS) {
      await semesterService.createSemester({year, season});
    }
  }
}

const seedStudents = async () => {
  const semesters = await semesterService.getAllSemesters();
  const spring2026 = semesters.find(s => s.year === 2026 && s.season === 'SPRING');
  if (!spring2026) {
    throw new Error('Spring 2026 semester was not seeded');
  }

  for (const {choiceProjectIds, gender, major, year, class: studentClass, meetingDay, ...rest} of studentsData) {
    await studentService.createStudent({
      ...rest,
      // @ts-ignore
      Enrollments: [{semesterId: spring2026.id, gender, major, year, class: studentClass, meetingDay}],
      Choices: choiceProjectIds.map((projectId, i) => ({rank: i + 1, projectId, semesterId: spring2026.id})),
    });
  }
}

const seedPartners = async () => {
  await Promise.all(partnersData.map(p => partnerService.createPartner(p)));
}

const seedProjects = async () => {
  // @ts-ignore
  await prisma.project.createMany({data: projectsData});
}

const main = async () => {
  await seedPartners();
  await seedProjects();
  await seedSemesters();
  await seedStudents();

  await prisma.user.createMany({
    data: [
      {
        id: 'admin-001',
        email: 'sxt230118@utdallas.edu',
        name: 'Snigdha Tadi',
        emailVerified: true,
        role: 'admin',
        whitelisted: true
      },
      {
        id: 'admin-002',
        email: 'trp210003@utdallas.edu',
        name: 'Teerth Patel',
        emailVerified: true,
        role: 'admin',
        whitelisted: true
      },
      {
        id: 'admin-003',
        email: 'bxt230017@utdallas.edu',
        name: 'Bhuvi Thiriveedhi',
        emailVerified: true,
        role: 'admin',
        whitelisted: true
      },
    ]
  })

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
    