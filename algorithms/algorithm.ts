export type Student = {
  name: string
  major: string
  choices: string[]
  class: '2200' | '3200'
}

export type Project = {
  name: string
  requiredMajors: string[]
}

function setup3200Students(teams: Record<string, Student[]>, students: Student[], minimumStudents:number, maximumStudents:number) {
  // get only students of class '2200' that picked choices
  students.forEach((student) => {
    if (student.class == '2200' && student.choices.length > 0) {
      let found = false
      for (const choice of student.choices) {
        // assign student to the first choice that has room
        // for each student, for each choice, check if that choice has less than the maximum, if so assign student
        if (teams[choice].length < maximumStudents) {
          teams[choice].push(student)
          found = true
          break;
        }
      }
      // if no choice has less than maximum, assign to smallest team among choices
      if(!found)  
        teams[student.choices.sort((a, b) => teams[a].length - teams[b].length)[0]].push(student)
    }
  });
}

function setup2200Students(teams: Record<string, Student[]>, students: Student[], minimumStudents:number, maximumStudents:number) {
  // get only students of class '2200' that picked choices
  students.forEach((student) => {
    if (student.class == '2200' && student.choices.length > 0) {
      let found = false
      for (const choice of student.choices) {
        // assign student to the first choice that has room
        // for each student, for each choice, check if that choice has less than the maximum, if so assign student
        if (teams[choice].length < maximumStudents) {
          teams[choice].push(student)
          found = true
          break;
        }
      }
      // if no choice has less than maximum, assign to smallest team among choices
      if(!found)  
        teams[student.choices.sort((a, b) => teams[a].length - teams[b].length)[0]].push(student)
    }
  });
}

function setupNoChoiceStudents(teams: Record<string, Student[]>, students: Student[], minimumStudents:number, maximumStudents:number) {
  // get only students that didnt pick anything
  students.forEach((student) => {
    if(student.choices.length === 0) {
      // assign these students only to teams that have l ess than the required minimum of students
      let found = false
      for (const team in teams) {
        if (teams[team].length < minimumStudents) {
          teams[team].push(student)
          found = true
          break;
        }
      }
      // if no team has less than minimum, assign to smallest team
      if (!found) {
        teams[Object.keys(teams).sort((a, b) => teams[a].length - teams[b].length)[0]].push(student)
      }

    }
  })
}


/* -- TEAM SCORING --

   priority:
   1. major
   2. year
   3. choice
   score = (team avg. - class avg) * (# of team members / avg. team members)
   student 1 = 1.0
   student 2 = 0.8
   student 3 = 0.6
   student 4 = 0.3
   student 5 = 0.2
   student 6 = 0.1
   student 7 = 0.05
   maxStudents = floor(# students / # projects) + 1

----------------- */


function calcTeamScore(teams: Record<string, Student[]>, students: Student[]) { 
  // (#upper/#on team) - (#upperinclass/#totalinclass)
  // ((#cs/#team) - (target#cs/target#onteam)) * #onteam/target#onteam
  // average the above to get team score  
  let teamScore = 0;
  return teamScore;
}

function calcStudentImpactOnTeam(student: Student, team: Student[]) { 
  //todo, get real algoirthm from max someday
  let impact = 0;
  if (student.class === '3200') {
    impact += 1.0;
  } else {
    impact += 0.5;
  }
  return impact;
}

function passOne(teams: Record<string, Student[]>, students: Student[], projects: Project[], minimumStudents: number, maximumStudents: number) {
  setup3200Students(teams, students, minimumStudents, maximumStudents);
  setup2200Students(teams, students, minimumStudents, maximumStudents);
  setupNoChoiceStudents(teams, students, minimumStudents, maximumStudents);
}

function passTwo(teams: Record<string, Student[]>, minimumStudents: number, maximumStudents: number) {
  // balancing pass - function that takes only the teams and min/max students
  // sort teams by least students to most
  const teamsArray = Object.values(teams)
  //Sort the array by the number of students in each team
  teamsArray.sort((a, b) => a.length - b.length) 
  // any team with less than minimum, find a student from a team that has the most students and move the least impactful student
  teamsArray.forEach((team) => {
    if(team.length < minimumStudents) {
      // find team with most students
      const teamWithMostStudents = teamsArray.sort((a, b) => a.length - b.length)[0]
      // find least impactful student
      const leastImpactfulStudent = teamWithMostStudents.sort((a, b) => calcStudentImpactOnTeam(a, team) - calcStudentImpactOnTeam(b, team))[0]
      // move student to team
      team.push(leastImpactfulStudent)
      teamWithMostStudents.splice(teamWithMostStudents.indexOf(leastImpactfulStudent), 1)
    }
  })
}

export function generateTeams(students: Student[], projects: Project[], minimumStudents: number, maximumStudents: number) {
  const teams: Record<string, Student[]> = projects.reduce((acc, current) => {
    return {
      ...acc,
      [current.name]: []
    }
  }, {})

  // pass 1ts
  passOne(teams, students, projects, minimumStudents, maximumStudents)
  // pass 2
  //passTwo(teams, minimumStudents, maximumStudents)

  // pass 3
  // can be run multiple times to achieve best average team score within 100 iterations
  // calculate average team score, if we have run less than 100 times AND avg team deviation is less than 1 std deviation then do a pass 
  // ends up being a while loop with 2 conditions

  return teams;
}