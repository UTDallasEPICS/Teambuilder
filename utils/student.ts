import type { Choice } from "~/prisma/generated";

type StudentName = { firstName: string; lastName: string };
type StudentWithChoices = { Choices?: Choice[] };

export const getDisplayName = (student: StudentName) => (
  `${student.lastName}, ${student.firstName}`
);

export const getProjectRankForStudent = (projectId: string, student: StudentWithChoices) => (
  student.Choices?.find(choice => choice.projectId === projectId)?.rank ?? 7
);
