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
// Should eventually be added in to cut down on projects on the generate teams page as
// PickList may have performance issues when the number of projects balloons.
// Leaving out for now because I'm not sure how to handle modifying past semesters.  
// Projects for the current semester should all be NEW or RETURNING, but projects 
// from past semesters can have any status, so removing, say, a WITHDRAWN 
// project from a past semester would make it disappear from the page entirely,
// which is very confusing.
export const getAvailableProjects = (projects: ProjectWithSemesters[], semester: Semester | null) => (
  getInactiveProjects(projects, semester).filter(project => project.status === 'NEW' || project.status === 'RETURNING')
)

// Determines if project is active in a given semester
export const isProjectActive = (project: ProjectWithSemesters, semester: Semester) => (
  project.semesters.some(projectSemester => projectSemester.id === semester.id)
)