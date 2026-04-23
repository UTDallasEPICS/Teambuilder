import { Choice, Student, Person } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { choices } = getQuery(event);

  if (choices === 'true') {
    return event.context.client.student.findMany({
      include: {
        person: true,
        choices: true,
      },
    });
  } else {
    return event.context.client.student.findMany({
      include: { person: true },
    });
  }
});

// student with person nested so callers get name email etc
export type StudentWithPerson = Student & {
  person: Person;
};

// student with person and choices for the algorithm
export type StudentWithChoices = Student & {
  person: Person;
  choices: Choice[];
};
