import { faker } from "@faker-js/faker";
import type { Project, Semester, Team } from "@prisma/client";

export const createTeams = (projects: Project[], semesters: Semester[]): Team[] => {
  const now = new Date();

  return projects.flatMap((project) => {
    const projectLength = faker.number.int({ min: 1, max: semesters.length});

    return semesters.slice(0, projectLength).map((semester) => {
      return {
        id: faker.string.uuid(),
        projectId: project.id,
        semesterId: semester.id,
        createdAt: now,
        updatedAt: now
      }
    })
  })
}