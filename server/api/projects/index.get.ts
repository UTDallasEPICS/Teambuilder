import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  return event.context.client.project.findMany({
    include: {
      partner: {
        select: {
          name: true, // this is the organization's name
        },
      },
      teams: {
        select: {
          semester: true,
        },
      },
    },
  });
});

export type ProjectWithSemestersAndPartner = Prisma.ProjectGetPayload<{
  include: {
    partner: {
      select: {
        name: true;
      };
    };
    teams: {
      select: {
        semester: true;
      };
    };
  };
}>;
