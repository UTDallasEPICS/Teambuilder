// NOTE: 
// This is the algorithm used prior to the creation of Teambuilder in the Spring of 2024.
// This file is outdated, and is here for the sake of gathering ideas.
// The most recent version of the algorithm is in newAlgorithm.ts.
// ~~ Fall 2024 Teambuilder Team 12/10/2024

import { INITIATE_TEAM_GENERATION } from './actionTypes/teamBuilderActionTypes';
import { SELECT_TEAM_COMBINATION } from './actionTypes/teamBuilderActionTypes';

export const generateTeams = ({ projects, students, manuallyAssignedStudents, numOfPrefProjects, maxTeamSize }) => {
  const teams = {};
  let tempStudents = JSON.parse(JSON.stringify(students));
  projects.forEach(project => {
    teams[`${project.name}`] = {
      project,
      members: [],
      value: 0
    };
  });

  //First assign manually assigned students
  Object.keys(manuallyAssignedStudents).forEach(sid => {
    const studentIndex = tempStudents.findIndex(student => parseInt(student.id) === parseInt(sid));
    if (studentIndex !== -1) {
      tempStudents[studentIndex].assigned = true;
      teams[manuallyAssignedStudents[sid]].members.push(tempStudents[studentIndex]);
      tempStudents.splice(studentIndex, 1);
    }
  });

  // we should GET RID OF THESE LINES... must assume all data is valid upon file upload
  let noResponseStudents = tempStudents.filter(student => !student.response);
  tempStudents = tempStudents.filter(student => student.response);
  // end ^

  //Let returning students get priority in project choice first
  tempStudents.forEach(student => {
    if (student.returning) {
      student.choices.forEach((choice, index) => {
        if (!teams[choice]) {
          console.error(`${student}, ${choice} does not exist in teams list`);
          return;
        }
        if (teams[choice].members.length < maxTeamSize) {
          student.choice_num_awarded = index + 1;
          teams[choice].members.push(student);
          const studentIndex = tempStudents.findIndex(s => s === student);
          tempStudents.splice(studentIndex, 1);
          return;
        }
      });
    }
  });

  let teamCombos = [];
  let wrongNames = []
  // Loop through creation of teams
  for (let i = 0; i < 100; i++) {
    // Make copies to start off on
    let randomStudents = JSON.parse(JSON.stringify(tempStudents));
    let newTeams = JSON.parse(JSON.stringify(teams));
    // Shuffle students to hopefully get different results
    randomStudents.forEach((student, index, array) => {
      const j = Math.floor(Math.random() * (index + 1));
      [array[index], array[j]] = [array[j], array[index]]; // Swap elements
    });
    // Place normal students in their top choices if possible
    randomStudents.forEach((student, index) => {
      for (let k = numOfPrefProjects - 1; k >= 0; k--) {
        if (student.choices[k]) {
          const choice = student.choices[k];
          if (!newTeams[choice]) {
            wrongNames.push(`${student.name}, choice ${k + 1}`);
          } else if (newTeams[choice].members.length < 3) {
            student.choice_num_awarded = k + 1;
            newTeams[choice].members.push(student);
            randomStudents.splice(index, 1);
            break;
          }
        }
      }
    });
  }
  
    for (let i = 0; i < 100; i++) {
      // Make copies to start off on
      let randomStudents = JSON.parse(JSON.stringify(tempStudents));
      let newTeams = JSON.parse(JSON.stringify(teams));
      // Shuffle students to hopefully get different results
      randomStudents.forEach((student, index, array) => {
        const j = Math.floor(Math.random() * (index + 1));
        [array[index], array[j]] = [array[j], array[index]]; // Swap elements
      });
      // Place normal students in their top choices if possible
      randomStudents.forEach((student, index) => {
        for (let k = numOfPrefProjects - 1; k >= 0; k--) {
          if (student.choices[k]) {
            const choice = student.choices[k];
            if (!newTeams[choice]) {
              wrongNames.push(`${student.name}, choice ${k + 1}`);
            } else if (newTeams[choice].members.length < 3) {
              student.choice_num_awarded = k + 1;
              newTeams[choice].members.push(student);
              randomStudents.splice(index, 1);
              break;
            }
          }
        }
      });
    

    //Try to find teams for students who still have not been placed on a team
    randomStudents.slice().reverse().forEach((student, index) => {
      if (findTeamForStudent(student, newTeams, numOfPrefProjects, maxTeamSize)) {
          randomStudents.splice(randomStudents.length - 1 - index, 1);
      }
  });

    //Check if a student couldn't be assigned to any of their choices
    if (randomStudents.length > 1) {
      console.log("Remaining students: ", randomStudents.length)
      console.log('Students who responded could not be placed on team based on choices');
    }

    let smallTeams = [];
    let largeTeams = [];

    //seperate teams into categories based on size
    for (let teamName in newTeams) {
      if (newTeams[teamName].members.length < 3) {
        smallTeams.push(newTeams[teamName]);
      } else if (newTeams[teamName].members.length > 3) {
        largeTeams.push(newTeams[teamName]);
      }
    }

    let unassignedReturn = 0;
    let unassignedNormal = 0;
    randomStudents.forEach(student => {
      student.returning ? unassignedReturn++ : unassignedNormal++;
    });

    //Calculate weights for choices and classification
    let teamAverageChoice = 0;
    let teamAverageClass = 0;
    let totalWeighedTeams = 0;
    for (let team in newTeams) {
      let teamTotalClass = 0;
      let teamTotalChoice = 0;

      //Filter out assigned and returning students from calculations
      let teamMembers = newTeams[team].members.filter(student =>
        student.returning || student.assigned ? false : true
      );

      if (teamMembers.length === 0) {
        continue;
      }
      teamAverageChoice += teamTotalChoice / teamMembers.length;
      teamAverageClass += teamTotalClass / teamMembers.length;
      totalWeighedTeams++;
    }

    //Value is the average choice a student is given. The lower the better

    let avgScoreChoice = teamAverageChoice / totalWeighedTeams;
    //Value is weight ranging from 0 to 1. The closer to 0, the better spread of students by grade
    let avgScoreClass = Math.abs(teamAverageClass / totalWeighedTeams) / 2;

    let totalMembers = 0;
    for (let team in newTeams) {
      totalMembers += newTeams[team].members.length;
    }

    let avgMembersPerTeam = totalMembers / Object.keys(newTeams).length;
    temp = 0;
    for (let team in newTeams) {
      temp += Math.exp(newTeams[team].members.length - avgMembersPerTeam, 2);
    }

    let coVarMembers = Math.sqrt(temp / totalMembers) / avgMembersPerTeam;

    teamCombos.push({
      teams: newTeams,
      avgScoreChoice,
      avgScoreClass,
      // skillsMetRatio: skillsMetWeight,
      coVarMembers,
      unassignedReturn,
      unassignedNormal,
      // noResponseStudents,
      unassignedStudents: randomStudents
    });
  }
  if (wrongNames.length) 
    alert(`Following students have nonexistent choices: \n ${[...new Set(wrongNames)].join("\n")}`)

  return {
    type: INITIATE_TEAM_GENERATION,
    payload: teamCombos
  };
};

function findTeamForStudent(student, teams, numOfPrefProjects, maxTeamSize) {
  //Iterate through student's choices
  for (let i = 0; i < numOfPrefProjects && i < student.choices.length; i++) {
    let team = teams[`${student.choices[i]}`];
    if (!team) {
      console.error(`choice ${i} for ${student.id}`, student.choices[i]);
    }
    //Check if member on team has another choice which they can switch to
    for (let j = team.members.length - 1; j >= 0; j--) {
      if (!team.members[j].returning && !team.members[j].assigned) {
        for (let k = 0; k < numOfPrefProjects; k++) {
          //If member can be moved to new team, move student and then add other student to team
          if (!teams[`${team.members[j].choices[k]}`]) console.log("other", team.members[j].choices[k], team.members[j])
          if (teams[`${team.members[j].choices[k]}`].members.length < maxTeamSize) {
            team.members[j].choice_num_awarded = k + 1;
            student.choice_num_awarded = i + 1;

            teams[`${team.members[j].choices[k]}`].members.push(team.members[j]);
            team.members.splice(j, 1);
            team.members.push(student);
            return true;
          }
        }
      }
    }
  }
  return false;
}

export const selectCombination = value => {
  return {
    type: SELECT_TEAM_COMBINATION,
    payload: value
  };
};