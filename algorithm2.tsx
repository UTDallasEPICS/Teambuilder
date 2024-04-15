type Student = {
  major: string
  choices: string[]
  class: '2200' | '3200'
}

type Project = {
  name: string
  requiredMajors: string[]
}

function setup3200Students(teams: Record<string, Student[]>, students: Student[], minimumStudents:number, maximumStudents:number) {
  // get only students of class '3200' that picked choices
  students.forEach((student) => {
    if (student.class === '3200' && student.choices.length > 0) {
      // assign 3200 students to their first choice, no matter what
      const firstChoice = student.choices[0];
      teams[firstChoice].push(student);
    }
  });
}

function setup2200Students(teams: Record<string, Student[]>, students: Student[], minimumStudents:number, maximumStudents:number) {
  // get only students of class '2200' that picked choices
  students.forEach((student) => {
    if (student.class === '2200' && student.choices.length > 0) {
      for (const choice of student.choices) {
        let check = false;
        // assign student to the first choice that has room
        // for each student, for each choice, check if that choice has less than the maximum, if so assign student
        if (teams[choice].length < maximumStudents) {
          teams[choice].push(student)
          let isTeacher = true;
          break;
        }
      }
    // if no choice has less than maximum, assign to smallest team among choices
    teams[student.choices.sort((a, b) => teams[a].length - teams[b].length)[0]].push(student)
    }
  });
}

function setupNoChoiceStudents(teams: Record<string, Student[]>, students: Student[], minimumStudents:number, maximumStudents:number) {
  // get only students that didnt pick anything
  students.forEach((student) => {
    if(student.choices.length === 0) {
      // assign these students only to teams that have l ess than the required minimum of students
      for (const team in teams) {
        if (teams[team].length < minimumStudents) {
          teams[team].push(student)
          break;
        }
      }
    }
  })
}

function calcTeamScore() { }

function calcStudentImpactOnTeam() { }

function passOne(teams: Record<string, Student[]>, students: Student[], projects: Project[], minimumStudents: number, maximumStudents: number) {
  setup3200Students(teams, students, minimumStudents, maximumStudents)
  setup2200Students(teams, students, minimumStudents, maximumStudents)
  setupNoChoiceStudents(teams, students, minimumStudents, maximumStudents);
}

function passTwo(teams: Record<string, Student[]>, minimumStudents: number, maximumStudents: number) {
  // balancing pass - function that takes only the teams and min/max students
  // sort teams by least students to most
  const teamsArray = Object.entries(teams)
  //Sort the array by the number of students in each team
  teamsArray.sort((a, b) => a.length - b.length)
  // any team with less than minimum, find a student from a team that has the most students and move the least impactful student
  teamsArray.forEach((team) => {
    if(team.length < minimumStudents) {
      // find team with most students
      const teamWithMostStudents = teamsArray.sort((a, b) => a.length - b.length)[0]
      // find least impactful student
      const leastImpactfulStudent = teamWithMostStudents.sort((a, b) => calcStudentImpactOnTeam(a) - calcStudentImpactOnTeam(b))[0]
      // move student to team
      team.push(leastImpactfulStudent)
      teamWithMostStudents.splice(teamWithMostStudents.indexOf(leastImpactfulStudent), 1)
    }
  })
}

function generateTeams(students: Student[], projects: Project[], minimumStudents: number, maximumStudents: number) {
  const teams: Record<string, Student[]> = projects.reduce((acc, current) => {
    return {
      ...acc,
      [current.name]: []
    }
  }, {})
  // pass 1
  passOne(teams, students, projects, minimumStudents, maximumStudents)
  // pass 2
  passTwo(teams, minimumStudents, maximumStudents)
    

  // pass 3
  // can be run multiple times to achieve best average team score within 100 iterations
  // calculate average team score, if we have run less than 100 times AND avg team deviation is less than 1 std deviation then do a pass 
  // ends up being a while loop with 2 conditions

}