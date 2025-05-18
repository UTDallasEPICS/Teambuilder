import { faker } from "@faker-js/faker";
import type { Project, Semester, Team } from "@prisma/client";

export const createRandomTeams = (projects: Project[], semesters: Semester[]): Team[] => {
  return semesters.flatMap((semester) => {
    // include a project in a semester 20% of the time
    const randomizedProjects = projects.filter(
      project => faker.number.float({ min: 0, max: 1 }) < 0.2
    )
    return createTeamsForSemester(randomizedProjects, semester)
  })
}

export const createTeamsForSemester = (projects: Project[], semester: Semester): Team[] => {
  const now = new Date();

  return projects.map(project => (
    {
      id: faker.string.uuid(),
      projectId: project.id,
      semesterId: semester.id,
      createdAt: now,
      updatedAt: now
    }
  ))
}