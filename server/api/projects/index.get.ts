import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  return event.context.client.project.findMany({
    include: {
      teams: {
        select: {
          semester: true
        }
      }
    }
  });
})

export type ProjectWithSemesters = Prisma.ProjectGetPayload<{
  include: {
    teams: {
      select: {
        semester: true
      }
    }
  }
}>