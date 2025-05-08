import { Prisma, Project, Semester } from "@prisma/client";
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

  // Simplifies the API response to directly include a semesters array with each project
  return projectsQuery.map((project: ProjectWithSemestersQuery) => ({
    ...project,
    semesters: sortSemesters(project.teams.map(team => team.semester)),
    teams: undefined
  }))
})

type ProjectWithSemestersQuery = Prisma.ProjectGetPayload<{
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
  semesters: Semester[]
};
