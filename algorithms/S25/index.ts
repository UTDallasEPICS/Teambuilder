import type { ProjectWithSemesters } from "~/server/api/projects/index.get";
import type { StudentWithChoices } from "~/server/api/students/index.get";
import { minWeightAssign } from 'munkres-algorithm';
import type { Semester, Student, Team } from "@prisma/client";

interface TeamAssignments {
  [key: string]: StudentWithChoices[];
}

export const generateTeams = (
  students: StudentWithChoices[], 
  projects: ProjectWithSemesters[],
  semester: Semester
) => {
  const teams: TeamAssignments = {};
  projects.forEach(project => {
    teams[project.id] = []; 
  })
  const choicelessStudents: StudentWithChoices[] = []; // students who didn't fill out the form
  const upperStudents: StudentWithChoices[] = []; // 3200
  const lowerStudents: StudentWithChoices[] = []; // 2200
  
  students.forEach(student => {
    if (student.choices.length === 0) {
      choicelessStudents.push(student);
    } else if (student.class === '3200') {
      upperStudents.push(student);
    } else if (student.class === '2200') {
      lowerStudents.push(student);
    }
  })

  const upperCostMatrix = getCostMatrix(upperStudents, projects);
  const lowerCostMatrix = getCostMatrix(lowerStudents, projects);

  const upperAssignments = minWeightAssign(upperCostMatrix);
  const lowerAssignments = minWeightAssign(lowerCostMatrix);

  upperStudents.forEach((student, idx) => {
    const assignmentIdx = upperAssignments.assignments[idx]
    const projectId = assignmentIdx !== null ? projects[assignmentIdx % projects.length].id : 'empty';
    teams[projectId].push(student);
  })

  lowerStudents.forEach((student, idx) => {
    const assignmentIdx = lowerAssignments.assignments[idx]
    const projectId = assignmentIdx !== null ? projects[assignmentIdx % projects.length].id : 'empty';
    teams[projectId].push(student);
  })

  const smallestTeamSize = Math.floor(students.length/projects.length) - 1;

  // this still can leave some choicelessStudents unassigned.
  // need to check choicelessStudents array again and add the rest to smallestTeamSize + 1
  Object.entries(teams).forEach(([projectId, students]) => {
    if (students.length === smallestTeamSize) {
      const student = choicelessStudents.pop();
      if (student) {
        teams[projectId].push(student);
      }
    }
  })

  return teams;
}

// This generates a cost matrix for use with the munkres algorithm.
// Each row corresponds to a student and each column correponds to a ranking for a project, 1-6.
// Every project must have a ranking, so 100 is filled in for projects the student didn't rank.
const getCostMatrix = (
  students: StudentWithChoices[], 
  projects: ProjectWithSemesters[]
) => {
  const arrayMultiplier = Math.ceil(students.length/projects.length);
  
  return students.map(student => {
    const baseArray = projects.map(project => (
      student.choices.find(choice => choice.projectId === project.id)?.rank ?? 100
    ))
    return Array.from({ length: arrayMultiplier }, (_, idx) => baseArray.map(cost => cost + idx*10)).flat();
  })
}