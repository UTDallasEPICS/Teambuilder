import type { Project, Semester, Team } from "~/prisma/generated";

type ProjectWithTeams = Project & { Teams?: Team[] };

// Determines if a project has an active team in a given semester
export const isProjectActive = (project: ProjectWithTeams, semester: Semester) => (
  project.Teams?.some(team => team.semesterId === semester.id) ?? false
);

// Given an array of projects and a semester, get projects active for that semester
// Returns empty array if semester is null
export const getActiveProjects = <T extends ProjectWithTeams>(projects: T[], semester: Semester | null) => (
  semester ? projects.filter(project => isProjectActive(project, semester)) : []
);

// Given an array of projects and a semester, get projects inactive for that semester
// Returns empty array if semester is null
export const getInactiveProjects = <T extends ProjectWithTeams>(projects: T[], semester: Semester | null) => (
  semester ? projects.filter(project => !isProjectActive(project, semester)) : []
);

// Filter an array of projects by name
export const filterProjectsByName = <T extends { name: string }>(projects: T[], filter: string) => (
  projects.filter(project => project.name.toLowerCase().includes(filter.toLowerCase()))
);

// Get the name of a project by projectId from a projects array
export const getProjectNameFromId = (projectId: string, projects: Pick<Project, 'id' | 'name'>[]) => (
  projects.find(project => project.id === projectId)?.name ?? 'Project not found'
);
