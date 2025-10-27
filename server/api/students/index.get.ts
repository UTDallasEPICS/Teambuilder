import { Choice, Student } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { choices } = getQuery(event);

  if (choices === 'true') {
    return event.context.client.student.findMany({
      include: {
        choices: true
      }
    });
  } else {
    return event.context.client.student.findMany();
  }
})

export type StudentWithChoices = Student & {
  choices: Choice[]
}