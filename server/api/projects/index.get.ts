import type { Prisma, Project, Semester } from "@prisma/client";
import { sortSemesters } from "~/server/services/semesterService";

export default defineEventHandler(async (event) => {
  const projectsQuery = await event.context.client.project.findMany({
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

  // Simplifies the API response to directly include:
  // 1) a semesters array with each project
  // 2) partnerName
  return projectsQuery.map((project: ProjectWithSemestersAndPartnerQuery) => ({
    ...project,
    semesters: sortSemesters(project.teams.map(team => team.semester)),
    partnerName: project.partner.name,
    teams: undefined,
    partner: undefined
  }))
})

type ProjectWithSemestersAndPartnerQuery = Prisma.ProjectGetPayload<{
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
}>

export type ProjectWithSemesters = Project & {
  semesters: Semester[],
};

export type ProjectWithSemestersAndPartner = Project & {
  semesters: Semester[],
  partnerName: string
};
