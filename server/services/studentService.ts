import type { Student } from "@prisma/client";
import { StudentWithChoices } from "../api/students/index.get";

export const getDisplayName = (student: Student) => (
  `${student.lastName}, ${student.firstName}`
)

export const getProjectRankForStudent = (projectId: string, student: StudentWithChoices) => (
  student.choices.find(choice => choice.projectId === projectId)?.rank || 7
)