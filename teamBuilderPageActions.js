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
  for (let sid in manuallyAssignedStudents) {
    //Change students to map from sid to their info
    for (let i = 0; i < tempStudents.length; i++) {
      if (parseInt(tempStudents[i].id) === parseInt(sid)) {
        tempStudents[i].assigned = true;
        teams[manuallyAssignedStudents[sid]].members.push(tempStudents[i]);
        tempStudents.splice(i, 1);
        break;
      }
    }
  }

  //Pull out all students who did not respond
  let noResponseStudents = tempStudents.filter(student => !student.response);
  tempStudents = tempStudents.filter(student => student.response);

  //Let returning students get priority in project choice first
  for (let i = 0; i < tempStudents.length; i++) {
    if (tempStudents[i].returning) {
      for (let j = 0; j < tempStudents[i].choices.length; j++) {
        if (!teams[`${tempStudents[i]?.choices[j]}`]) {
          console.error(`${tempStudents[i]}, ${tempStudents[i]?.choices[j]} does not exist in teams list`)
          continue
        }
        if (teams[`${tempStudents[i].choices[j]}`].members.length < maxTeamSize) {
          tempStudents[i].choice_num_awarded = j + 1;
          teams[`${tempStudents[i].choices[j]}`].members.push(tempStudents[i]);
          tempStudents.splice(i, 1);
          break;
        }
      }
    }
  }

  let teamCombos = [];
  let wrongNames = []
  //Loop through creation of teams
  for (let i = 0; i < 100; i++) {
    //Make copies to start off on
    let randomStudents = JSON.parse(JSON.stringify(tempStudents));
    let newTeams = JSON.parse(JSON.stringify(teams));
    //Shuffle students to hopefully get different results
    for (var k = randomStudents.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      let temp = randomStudents[k];
      randomStudents[k] = randomStudents[j];
      randomStudents[j] = temp;
    }
    //Place normal students in their top choices if possible
    for (let j = randomStudents.length - 1; j >= 0; j--) {
      for (let k = 0; k < numOfPrefProjects; k++) {
        if (randomStudents[j].choices[k]) {
          if (!newTeams[`${randomStudents[j].choices[k]}`]) {
            wrongNames.push(`${randomStudents[j].name}, choice ${k+1}`)
          } else if (newTeams[`${randomStudents[j].choices[k]}`].members.length < 3) {
            randomStudents[j].choice_num_awarded = k + 1;
            newTeams[`${randomStudents[j].choices[k]}`].members.push(randomStudents[j]);
            randomStudents.splice(j, 1);
            break;
          }
        }
      }
    }

    //Try to find teams for students who still have not been placed on a team
    for (let j = randomStudents.length - 1; j >= 0; j--) {
      if (findTeamForStudent(randomStudents[j], newTeams, numOfPrefProjects, maxTeamSize)) {
        randomStudents.splice(j, 1);
      }
    }

    //Check if a student couldn't be assigned to any of their choices
    if (randomStudents.length > 1) {
      console.log(randomStudents)
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

    //go through every small team and check if students from larger teams can be swapped over
/*     smallTeams.forEach((sTeam) => {
      largeTeams.forEach((lTeam) => {
        for (let k = lTeam.members.length - 1; k >= 0; k--) {
          let member = lTeam.members[k];
          if (member.returning || member.assigned) {
            continue;
          }

          member.choices.forEach((choice, ind) => {
            if (choice === sTeam.project.name) {
              member.choice_num_awarded = ind + 1;
              newTeams[`${sTeam.project.name}`].members.push(member);
              newTeams[`${lTeam.project.name}`].members.splice(k, 1);
            }
          });

          if (newTeams[`${sTeam.project.name}`].members.length >= 3) {
            break;
          }
        }
      })

    }) */

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

      //Calculate the average choice and spread of students by classsification
      teamMembers.forEach(student => {
        teamTotalChoice += student.choice_num_awarded;
        switch (student.classification) {
          case 'Freshman':
            teamTotalClass += -2;
            break;
          case 'Sophomore':
            teamTotalClass += -1;
            break;
          case 'Junior':
            teamTotalClass += 1;
            break;
          case 'Senior':
            teamTotalClass += 2;
            break;
          default:
            break;
        }
      });
      teamAverageChoice += teamTotalChoice / teamMembers.length;
      teamAverageClass += teamTotalClass / teamMembers.length;
      totalWeighedTeams++;
    }

    //Value is the average choice a student is given. The lower the better

    let avgScoreChoice = teamAverageChoice / totalWeighedTeams;
    //Value is weight ranging from 0 to 1. The closer to 0, the better spread of students by grade
    let avgScoreClass = Math.abs(teamAverageClass / totalWeighedTeams) / 2;

    let skillsMet = 0;
    //For each team find how many skills are met by its members
    for (let team in newTeams) {
      newTeams[team].skillsMet = 0;
      for (let skill of newTeams[team].project.skills) {
        for (let member of newTeams[team].members) {
          if (member.skills.includes(skill)) {
            skillsMet++;
            newTeams[team].skillsMet++;
          }
        }
      }
    }

    //average skills met per team
    let avgSkillsMet = skillsMet / Object.keys(newTeams).length;

    let temp = 0;
    for (let team in newTeams) {
      temp += Math.exp(newTeams[team].skillsMet - avgSkillsMet, 2);
    }

    let staDevSkillsMet = Math.sqrt(temp / skillsMet);

    //use normalized average and coefficient of variation as weights
    let skillsMetWeight =
      avgSkillsMet / newTeams[Object.keys(newTeams)[0]].project.skills.length + (staDevSkillsMet / avgSkillsMet) * -0.2;

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
      skillsMetRatio: skillsMetWeight,
      coVarMembers,
      unassignedReturn,
      unassignedNormal,
      noResponseStudents,
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
      console.log(`choice ${i} for ${student.id}`, student.choices[i]);
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