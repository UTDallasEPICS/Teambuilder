// Run this file with `npx tsx algorithms/S25/test.ts`

// batchTestGenerateTeamAssignments generates any number of simulated
// sets of data to verify algorithm works as intended.

// Metrics
// Average rank: the average rank a student gave to the project they ended up with
// Size differential: the average difference in team sizes across all runs
// Size differential report: key-value pairs across all runs where the key is the 
// number of people teams differ by, and the value is the number of runs with that difference

import { createSemesters } from "~/server/factories/semester";
import { generateTeamAssignments } from "../S25";
import { createRandomPartners } from "~/server/factories/partner";
import { createRandomProjects } from "~/server/factories/project";
import { createRandomStudents } from "~/server/factories/student";
import { createRandomTeams } from "~/server/factories/team";
import { createChoicesForSemester } from "~/server/factories/choice";
import type { StudentWithChoices } from "~/server/api/students/index.get";
import type { Choice } from "@prisma/client";
import type { TeamAssignments } from "../S25";

const testGenerateTeamAssignments = () => {
  const semesters = createSemesters();
  const partners = createRandomPartners(50);
  const projects = createRandomProjects(100, partners);
  const students = createRandomStudents(300);
  const teams = createRandomTeams(projects, semesters);
  const latestSemester = semesters[semesters.length-1];
  const choices = createChoicesForSemester(students, teams, latestSemester);

  const studentChoices: { [key: string]: Choice[] } = {};

  for(const choice of choices) {
    if (!studentChoices[choice.studentId]) {
      studentChoices[choice.studentId] = [];
    }

    studentChoices[choice.studentId].push(choice);
  }

  const studentsWithChoices: StudentWithChoices[] = students.map(student => (
    {
      ...student,
      choices: studentChoices[student.id] || []
    }
  ))

  const activeStudents = studentsWithChoices.filter(student => student.status === 'ACTIVE')
  const activeProjectIds = teams.filter(team => team.semesterId === latestSemester.id).map(team => team.projectId);
  const activeProjects = projects.filter(project => activeProjectIds.includes(project.id));

  const teamAssignments = generateTeamAssignments(activeStudents, activeProjects);

  const averageRank = getAverageRank(teamAssignments);
  const sizeDifferential = getSizeDifferential(teamAssignments);

  return {
    averageRank,
    sizeDifferential
  };
}

const batchTestGenerateTeamAssignments = (num: number) => {
  const averageRanks: number[] = [];
  const sizeDifferentials: number[] = [];

  for (let i = 0; i < num; i++) {
    const { averageRank, sizeDifferential } = testGenerateTeamAssignments();
    averageRanks.push(averageRank);
    sizeDifferentials.push(sizeDifferential);
  }

  const batchAverageRank = getArrayAverage(averageRanks);
  const batchAverageSizeDifferential = getArrayAverage(sizeDifferentials);
  const sizeDifferentialReport: { [key: string]: number } = {};
  for(const sizeDifferential of sizeDifferentials) {
    sizeDifferentialReport[sizeDifferential] = (sizeDifferentialReport[sizeDifferential] || 0) + 1
  }
  console.log('Batch average rank: ', batchAverageRank);
  console.log('Batch size differential: ', batchAverageSizeDifferential);
  console.log('Size differential report: ', sizeDifferentialReport);
}

const getAverageRank = (teamAssignments: TeamAssignments) => {
  const ranks: number[] = [];

  Object.entries(teamAssignments).forEach(([projectId, studentsWithChoices]) => {
    for (const student of studentsWithChoices) {
      const choice = student.choices.find(choice => choice.projectId === projectId);
      if (choice) {
        ranks.push(choice.rank);
      }
    }
  })

  const averageRank = getArrayAverage(ranks);

  return averageRank;
}

const getSizeDifferential = (teamAssignments: TeamAssignments) => {
  let smallestTeam = 100;
  let largestTeam = 0;

  Object.keys(teamAssignments).forEach(projectId => {
    const teamSize = teamAssignments[projectId].length;

    if (teamSize < smallestTeam) {
      smallestTeam = teamSize;
    }
    if (teamSize > largestTeam) {
      largestTeam = teamSize;
    }
  })

  const sizeDifferential = largestTeam - smallestTeam;

  if (sizeDifferential === 2) {
    logTeamSizes(teamAssignments);
  }

  return sizeDifferential;
}

const logTeamSizes = (teamAssignments: TeamAssignments) => {
  Object.keys(teamAssignments).forEach(projectId => {
    console.log('Project ID: ', projectId)
    console.log('Students: ', teamAssignments[projectId].length)
  })
}

const getArrayAverage = (arr: number[]) => (
  arr.reduce((sum, val) => sum + val, 0) / arr.length
)

batchTestGenerateTeamAssignments(1000);