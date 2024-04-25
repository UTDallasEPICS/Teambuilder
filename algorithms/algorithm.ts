export type Student = {
  name: string;
  major: "CS" | "Other";
  seniority: "Freshman" | "Sophomore" | "Junior" | "Senior";
  choices: string[];
  class: "2200" | "3200";
};

export type Project = {
  name: string;
  targetCS: number;
  requiredMajors: string[];
};

let numUpperClassmen = 0;
let totalNumInClass = 0;

function setup3200Students(
  teams: Record<string, Student[]>,
  students: Student[],
  minimumStudents: number,
  maximumStudents: number
) {
  // get only students of class '2200' that picked choices
  students.forEach((student) => {
    totalNumInClass++;
    if (student.class == "3200" && student.choices.length > 0) {
      let found = false;
      for (const choice of student.choices) {
        // assign student to the first choice that has room
        // for each student, for each choice, check if that choice has less than the maximum, if so assign student
        if (teams[choice].length < maximumStudents) {
          teams[choice].push(student);
          found = true;
          break;
        }
      }
      // if no choice has less than maximum, assign to smallest team among choices
      if (!found)
        teams[
          student.choices.sort((a, b) => teams[a].length - teams[b].length)[0]
        ].push(student);
    }
    if (student.seniority == "Junior" || student.seniority == "Senior") {
      numUpperClassmen++;
    }
  });
}

function setup2200Students(
  teams: Record<string, Student[]>,
  students: Student[],
  minimumStudents: number,
  maximumStudents: number
) {
  // get only students of class '2200' that picked choices
  students.forEach((student) => {
    if (student.class == "2200" && student.choices.length > 0) {
      let found = false;
      for (const choice of student.choices) {
        // assign student to the first choice that has room
        // for each student, for each choice, check if that choice has less than the maximum, if so assign student
        if (teams[choice].length < maximumStudents) {
          teams[choice].push(student);
          found = true;
          break;
        }
      }
      // if no choice has less than maximum, assign to smallest team among choices
      if (!found)
        teams[
          student.choices.sort((a, b) => teams[a].length - teams[b].length)[0]
        ].push(student);
    }
  });
}

function setupNoChoiceStudents(
  teams: Record<string, Student[]>,
  students: Student[],
  minimumStudents: number,
  maximumStudents: number
) {
  // get only students that didnt pick anything
  students.forEach((student) => {
    if (student.choices.length === 0) {
      // assign these students only to teams that have l ess than the required minimum of students
      let found = false;
      for (const team in teams) {
        if (teams[team].length < minimumStudents) {
          teams[team].push(student);
          found = true;
          break;
        }
      }
      // if no team has less than minimum, assign to smallest team
      if (!found) {
        teams[
          Object.keys(teams).sort(
            (a, b) => teams[a].length - teams[b].length
          )[0]
        ].push(student);
      }
    }
  });
}

/* -- TEAM SCORING --

   priority:
   1. major
   2. year
   3. choice
   score = (team avg. - class avg) * (# of team members / avg. team members)
   maxStudents = floor(# students / # projects) + 1
-------------------- */
function classScore(student: Student, team: Student[]) {
  let upperOnTeam = 0;
  let teamTotal = 0;

  // get total number of 3200 students and total students
  team.forEach((student) =>
  {
    if(student.class == '3200')
      upperOnTeam++;
    teamTotal++;
  })

  return ((upperOnTeam/teamTotal) - (numUpperClassmen/totalNumInClass));
}

function majorScore(
  student: Student,
  team: Student[],
  projects: Project[],
  index: number
) {
  let csOnTeam = 0;
  let teamTotal = 0;

  team.forEach((student) => {
    if (student.major == "CS") csOnTeam++;
    teamTotal++;
  });

  /* Calculate target number on team by taking total students 
  (3200 + 2200) / total number of projects… if number is 5.6, 
  floor it for target number, round up for the max (in passTwo function). */

  let teamTarget = 0;

  //find num of projects
  teamTarget = Math.floor(totalNumInClass / projects.length);

  // HOW TO FIND TARGET CS??
  return (
    (csOnTeam / teamTotal - (projects[index].targetCS - teamTarget)) * (teamTotal / teamTarget)
  );
}

//function which calculates a score based on preference of student choices
function preferenceScore(
  student: Student,
  team: Student[],
  teams: Record<string, Student[]>
) {
  //looping through the teams record, looking for a team (Student []) that mataches with team parameter
  Object.values(teams).forEach((currentTeam, index) => {
    //if the team is equal to team we're looking for
    if (JSON.stringify(team) === JSON.stringify(currentTeam)) {
      //go through each of student choices, if is equal to teamName, then return the preferenceScore based on order of Preference
      student.choices.forEach((teamName, i) => {
        //if the name of team of student choice matches with name of paramter team, return the preference score
        if (teamName === Object.keys(teams)[index]) {
          switch (i + 1) {
            case 1:
              return 1.0;
            case 2:
              return 0.8;
            case 3:
              return 0.6;
            case 4:
              return 0.3;
            case 5:
              return 0.2;
            case 6:
              return 0.1;
            case 7:
              return 0.05;
          }
        }
      });
    }
  });
  return 0;
}

// need to figure out what the weight for major, year, and choice is for each student (are freshman/sophomore and junior/senior a category)
// add scores of all students together on a team and divide by scores of all teams? (does it change depending on # of students on a team?)
// what score should we be aiming for for each team? what do we do in the case where the score is too far from our optimal score?
function calcTeamScore(
  student: Student,
  team: Student[],
  teams: Record<string, Student[]>,
  projects: Project[],
  index: number
) {
  // FROM PIC (below)
  // (#upper/#on team) - (#upperinclass/#totalinclass)
  // ((#cs/#team) - (target#cs/target#onteam)) * #onteam/target#onteam
  // average the above to get team score
  let teamScore =
    (classScore(student, team) +
      majorScore(student, team, projects, index) +
      preferenceScore(student, team, teams)) /
    3;
  return teamScore;
}

//calculates the impact of removing the student from the team
function calcStudentImpactOnTeam(
  student: Student,
  team: Student[],
  teams: Record<string, Student[]>,
  projects: Project[],
  index: number
) {
  //filter function will create new Student[], with only the students that are not equal to student paramater
  let teamWithoutStudent = team.filter((students) => students !== student);
  return Math.abs(
    calcTeamScore(student, teamWithoutStudent, teams, projects, index) -
      calcTeamScore(student, team, teams, projects, index)
  );
}

function passOne(
  teams: Record<string, Student[]>,
  students: Student[],
  projects: Project[],
  minimumStudents: number,
  maximumStudents: number
) {
  setup3200Students(teams, students, minimumStudents, maximumStudents);
  setup2200Students(teams, students, minimumStudents, maximumStudents);
  setupNoChoiceStudents(teams, students, minimumStudents, maximumStudents);
}

function passTwo(
  teams: Record<string, Student[]>,
  projects: Project[],
  minimumStudents: number,
  maximumStudents: number
) {
  // balancing pass - function that takes only the teams and min/max students
  // sort teams by least students to most
  const teamsArray = Object.values(teams);
  //Sort the array by the number of students in each team by low to high
  teamsArray.sort((a, b) => a.length - b.length);
  // any team with less than minimum, find a student from a team that has the most students and move the least impactful student
  teamsArray.forEach((team, index) => {
    if (team.length < minimumStudents) {
      // find team with most students
      const teamWithMostStudents = teamsArray.sort(
        (a, b) => b.length - a.length
      )[0];
      // find least impactful student
      const leastImpactfulStudent = teamWithMostStudents.sort(
        (a, b) =>
          calcStudentImpactOnTeam(
            a,
            teamWithMostStudents,
            teams,
            projects,
            index
          ) -
          calcStudentImpactOnTeam(
            b,
            teamWithMostStudents,
            teams,
            projects,
            index
          )
      )[0];
      // move student to team, remove student from previous big team
      team.push(leastImpactfulStudent);
      teamWithMostStudents.splice(
        teamWithMostStudents.indexOf(leastImpactfulStudent),
        1
      );
    }
  });
}

// can be run multiple times to achieve best average team score within 1000 iterations
// calculate average team score, if we have run less than 1000 times AND avg team deviation is less than 1 std deviation then do a pass
// ends up being a while loop with 2 conditions
function passThree(
  teams: Record<string, Student[]>,
  students: Student[],
  projects: Project[],
  minimumStudents: number,
  maximumStudents: number
) {
  for (let i = 0; i < 1000; i++) {
    let avgTeamScore = 0;
    let totalTeams = 0;
    Object.values(teams).forEach((team) => {
      let teamScore = 0;
      team.forEach((student) => {
        teamScore += calcTeamScore(student, team, teams);
      });
      avgTeamScore += teamScore / team.length;
      totalTeams++;
    });
    avgTeamScore = avgTeamScore / totalTeams;
    //calculate standard deviation
    let stdDev = 0;
    Object.values(teams).forEach((team) => {
      let teamScore = 0;
      team.forEach((student) => {
        teamScore += calcTeamScore(student, team, teams);
      });
      stdDev += Math.pow(teamScore / team.length - avgTeamScore, 2);
    });
    stdDev = Math.sqrt(stdDev / totalTeams);
    //if the standard deviation is less than 1, break out of the loop
    if (stdDev < 1) break;
    //run passTwo
    passTwo(teams, minimumStudents, maximumStudents);
  }
}

export function generateTeams(
  students: Student[],
  projects: Project[],
  minimumStudents: number,
  maximumStudents: number
) {
  const teams: Record<string, Student[]> = projects.reduce((acc, current) => {
    return {
      ...acc,
      [current.name]: [],
    };
  }, {});

  // pass 1
  passOne(teams, students, projects, minimumStudents, maximumStudents);

  // pass 2
  passTwo(teams, projects, minimumStudents, maximumStudents);

  // pass 3
  passThree(teams, students, projects, minimumStudents, maximumStudents);

  return teams;
}
