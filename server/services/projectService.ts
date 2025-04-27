import { Semester } from "@prisma/client"
import { ProjectWithSemesters } from "../api/projects/index.get"

// Filter an array of projects by name
export const filterProjectsByName = (projects: ProjectWithSemesters[], filter: string) => (
  projects.filter(project => project.name.toLowerCase().includes(filter.toLowerCase()))
)

// Given an array of projects and a semester, get projects active for that semester
// Returns empty array if semester is null
export const getActiveProjects = (projects: ProjectWithSemesters[], semester: Semester | null) => (
  semester ? projects.filter(project => isProjectActive(project, semester)) : []
)

// Given an array of projects and a semester, get projects inactive for that semester
// Returns empty array if semester is null
export const getInactiveProjects = (projects: ProjectWithSemesters[], semester: Semester | null) => (
  semester ? projects.filter(project => !isProjectActive(project, semester)) : []
)

// Given an array of projects, get inactive projects with status of NEW or RETURNING
// Added in to cut down on the amount of inactive projects on the Generate Teams PickList
export const getAvailableProjects = (projects: ProjectWithSemesters[], semester: Semester | null) => (
  getInactiveProjects(projects, semester).filter(project => project.status === 'NEW' || project.status === 'RETURNING')
)

// Determines if project is active in a given semester
export const isProjectActive = (project: ProjectWithSemesters, semester: Semester) => (
  project.semesters.some(projectSemester => projectSemester.id === semester.id)
)