import type { Project, Semester, Team } from "@prisma/client";

export const createRandomTeams = (projects: Project[], semesters: Semester[]): Team[] => {
  return semesters.flatMap((semester) => {
    // include a project in a semester 20% of the time
    const randomizedProjects = projects.filter(
      _project => Math.random() < 0.2
    )
    return createTeamsForSemester(randomizedProjects, semester)
  })
}

export const createTeamsForSemester = (projects: Project[], semester: Semester): Team[] => {
  const now = new Date();

  return projects.map(project => (
    {
      id: crypto.randomUUID(),
      projectId: project.id,
      semesterId: semester.id,
      createdAt: now,
      updatedAt: now
    }
  ))
}