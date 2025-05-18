import { faker } from "@faker-js/faker";
import type { Semester, Student, Team } from "@prisma/client";

export const createChoicesForSemester = (students: Student[], teams: Team[], semester: Semester) => {
  const now = new Date();
  const projectIdsForSemester = teams.filter(team => team.semesterId === semester.id).map(team => team.projectId)
  const activeStudents = students.filter(student => student.status === 'ACTIVE');

  // chop off 10% of students to simulate them not filling out the choices survey
  const numNoPreference = Math.round(activeStudents.length / 10);

  return activeStudents.slice(numNoPreference, activeStudents.length).flatMap(student => {
    // shuffle projectIds
    for (let i = projectIdsForSemester.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [projectIdsForSemester[i], projectIdsForSemester[j]] = [projectIdsForSemester[j], projectIdsForSemester[i]];
    }

    // take the first 6
    return projectIdsForSemester.slice(0, 6).map((projectId, idx) => (
      {
        id: faker.string.uuid(),
        rank: idx+1,
        studentId: student.id,
        projectId,
        createdAt: now,
        updatedAt: now
      }
    ))
  })
}