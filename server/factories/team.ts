import { faker } from "@faker-js/faker";
import type { Project, Semester, Team } from "@prisma/client";

export const createTeams = (projects: Project[], semesters: Semester[]): Team[] => {
  const now = new Date();

  return projects.flatMap((project) => {
    // include a project in a semester 20% of the time
    const randomizedSemesters = semesters.filter(
      semester => faker.number.float({ min: 0, max: 1 }) < 0.2
    );
    
    return randomizedSemesters.map((semester) => (
      {
        id: faker.string.uuid(),
        projectId: project.id,
        semesterId: semester.id,
        createdAt: now,
        updatedAt: now
      }
    ))
  })
}