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

  return projects.flatMap(project => {
    const day = project.meetingDay ?? 'THURSDAY'

    if (day === 'BOTH') {
      return [
        {
          id: crypto.randomUUID(),
          projectId: project.id,
          semesterId: semester.id,
          meetingDay: 'WEDNESDAY',
          createdAt: now,
          updatedAt: now
        },
        {
          id: crypto.randomUUID(),
          projectId: project.id,
          semesterId: semester.id,
          meetingDay: 'THURSDAY',
          createdAt: now,
          updatedAt: now
        }
      ]
    }

    return [
      {
        id: crypto.randomUUID(),
        projectId: project.id,
        semesterId: semester.id,
        meetingDay: day,
        createdAt: now,
        updatedAt: now
      }
    ]
  })
}