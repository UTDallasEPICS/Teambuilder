/**
 * This is the Fall 2025 version of the algorithm.
 * 
 * This optimizes student placement by leveraging an implementation of the Hungarian/Kuhn-Munkres algorithm:
 * https://gitlab.com/whkwok/munkres-algorithm
 * 
 * The Hungarian algorithm is designed to assign n people to n preferences.
 * The algorithm's main function, minWeightAssign, expects a 2-dimensional cost matrix,
 * where each row corresponds to a student and each column corresponds to the student's preference.
 * 
 * Because the algorithm is not designed to assign multiple people to a single preference (i.e. a project),
 * duplicate cost arrays are created, with each cost value corresponding to that student's preference for that project.
 * E.g. if there are 70 students and 25 projects, a single student's cost array will have a length of 75,
 * with costArray[0] = costArray[25] = costArray[50], and so on.  Even though there are only 70 slots available,
 * a cost array of length 75 allows for the possibility of any team having size 3.
 * 
 * Note: the terms "cost" and "rank" are used interchangeably.
 * 
 * To achieve certain constraints, some more modifications were made:
 * 1) The last duplication of the base cost array has its values inflated by 7; this way the algorithm 
 *    prefers to fill in all slots except the last one, forcing it to balance teams to either size n or n-1.
 * 2) The algorithm is run twice: first for 3200 students, second for 2200 students.
 * 3) 3200 students are assigned first to ensure that they are distributed as evenly as possible.  Because there are far
 *    fewer 3200 students, this leads to some substandard placements at times, so it will need to be decided if this is
 *    acceptable or if 3200 preferences should hold higher priority.
 * 4) The slots filled in by 3200 students are taken into account when assigning 2200 students by setting every 2200
 *    student's preference to Infinity for those slots.  This ensures teams are filled out in a balanced way.
 * 5) If a student didn't choose a project, their ranking for that project defaults to 7.  In almost all cases, this 
 *    prevents anyone from being assigned to a project they didn't choose, except for students who didn't fill out any choices.
 * 
 * Testing for this algorithm can be found in ./test.ts.
 */

import type { StudentWithChoices } from "~/server/api/students/index.get";
import { minWeightAssign, type AssignResult } from 'munkres-algorithm';
import type { Project, Semester } from "@prisma/client";

export interface TeamAssignments {
  [key: string]: StudentWithChoices[],
}

export const generateTeamAssignments = (
  students: StudentWithChoices[], 
  projects: Project[],
) => {
  const teamAssignments: TeamAssignments = {};
  projects.forEach(project => {
    teamAssignments[project.id] = [];
  })

  const upperStudents: StudentWithChoices[] = []; // 3200
  const lowerStudents: StudentWithChoices[] = []; // 2200
  
  students.forEach(student => {
    if (student.class === '3200') {
      upperStudents.push(student);
    } else if (student.class === '2200') {
      lowerStudents.push(student);
    }
  })

  const upperCostMatrix = getUpperCostMatrix(upperStudents, projects);
  const upperAssignments = minWeightAssign(upperCostMatrix);

  assignStudentsToTeams(teamAssignments, upperStudents, projects, upperAssignments);

  const maxTeamSize = Math.ceil(students.length/projects.length);
  const lowerCostMatrix = getLowerCostMatrix(lowerStudents, projects, teamAssignments, maxTeamSize);
  const lowerAssignments = minWeightAssign(lowerCostMatrix);

  assignStudentsToTeams(teamAssignments, lowerStudents, projects, lowerAssignments);

  return teamAssignments;
}

const getUpperCostMatrix = (
  students: StudentWithChoices[], 
  projects: Project[],
) => {
  // max number of slots that can be filled in by upperClassmen
  const upperStudentSlots = Math.ceil(students.length/projects.length);
  
  return students.map(student => {
    // base array of project rankings for a student
    const baseArray = projects.map(project => (
      student.choices.find(choice => choice.projectId === project.id)?.rank ?? 7
    ))
    // base array appended to itself upperStudentSlots number of times to simulate upperStudentSlots number of slots on each team
    // final iteration of the array (i.e. final slot on the team) has its ranks inflated by 7,
    // which forces the algorithm to prefer balanced team sizes over pure rank optimization
    return Array.from({ length: upperStudentSlots }, (_, idx) => {
      return idx === upperStudentSlots - 1 ? baseArray.map(rank => rank + 7) : baseArray
    }).flat();
  })
}

const getLowerCostMatrix = (
  students: StudentWithChoices[], 
  projects: Project[],
  teamAssignments: TeamAssignments,
  maxTeamSize: number
) => {
  // creates an array with indices of spots already filled in by upperClassmen
  const filledIndices: number[] = [];

  Object.entries(teamAssignments).forEach(([projectId, students]) => {
    const teamSize = students.length;
    const projectIndex = projects.findIndex(project => project.id === projectId);

    for (let i = 0; i < teamSize; i++) {
      filledIndices.push(projectIndex + i*projects.length);
    }
  })

  return students.map(student => {
    // base array of project rankings for a student
    const baseArray = projects.map(project => (
      student.choices.find(choice => choice.projectId === project.id)?.rank ?? 7
    ))
    // base array appended to itself maxTeamSize number of times to simulate maxTeamSize number of spots on each team
    // final iteration of the array (i.e. final spot on the team) has its costs inflated by 7,
    // which forces the algorithm to prefer balanced team sizes over pure cost optimization
    const totalArray = Array.from({ length: maxTeamSize }, (_, idx) => {
      return idx === maxTeamSize - 1 ? baseArray.map(cost => cost + 7) : baseArray
    }).flat();
    // sets student cost to infinity for slots already filled in by upperClassmen
    for (const idx of filledIndices) {
      totalArray[idx] = Infinity;
    }
    return totalArray;
  })
}

const assignStudentsToTeams = (teamAssignments: TeamAssignments, students: StudentWithChoices[], projects: Project[], assignments: AssignResult) => {
  students.forEach((student, idx) => {
    const assignmentIdx = assignments.assignments[idx]
    const projectId = assignmentIdx !== null ? projects[assignmentIdx % projects.length].id : 'empty';
    teamAssignments[projectId].push(student);
  })
}