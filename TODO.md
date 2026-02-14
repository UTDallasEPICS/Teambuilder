# TODO List

This document tracks pending tasks and improvements for the Teambuilder project.

## High Priority

### Backend/API

- **Team Deletion Logic** ([server/api/teams/index.delete.ts](server/api/teams/index.delete.ts))
  - Determine how to handle deleting teams with students already assigned
  - Consider implementing soft deletes or reassignment workflow
  
- **Partner Update Testing** ([server/api/partners/index.put.ts](server/api/partners/index.put.ts))
  - Test the PUT/Update functionality for partners API
  - Add integration tests

### Frontend Components

- **Semester Management** ([components/generate-teams/NewSemesterCard.vue](components/generate-teams/NewSemesterCard.vue))
  - Add functionality to delete semesters
  - Consider adding archive functionality instead of permanent deletion

- **Project Service Refactoring** ([components/generate-teams/ActivateProjectsCard.vue](components/generate-teams/ActivateProjectsCard.vue))
  - Change `getInactiveProjects` to `getAvailableProjects`
  - See notes in projectService for details

### Styling

- **PrimeVue Theme Migration** ([pages/students.vue](pages/students.vue))
  - Move custom select styling to PrimeVue's tokens in nuxt.config.ts
  - Ensure consistent theming across components

## Medium Priority

### Type System

- **Type Synchronization** ([algorithms/F24/index.ts](algorithms/F24/index.ts))
  - Synchronize Student and Project types with:
    - `types/index.ts` 
    - Prisma schema
  - Eliminate redundancy between `choices` array and `choicesString`

## Completed

- ✅ Removed unused files (oldIndex.css, FileUpload.ts, repoData.json, etc.)
- ✅ Fixed .gitignore to properly track package.json
- ✅ Improved error handling in stores (replaced console.error with proper throws)
- ✅ Cleaned up excessive blank lines in source files

## Notes

- Server-side console logging in Discord bot and GitHub integration is intentional for operational monitoring
- Test files intentionally keep console.log statements for debugging purposes
