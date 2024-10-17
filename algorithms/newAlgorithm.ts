export type Student = {
    name: string;
    major: "CS" | "Other";
    seniority: "Freshman" | "Sophomore" | "Junior" | "Senior";
    choices: string[];
    choicesString: string;
    class: "2200" | "3200";
  };
  
  export type Project = {
    name: string;
    targetCS: number;
  };

  let numUpperClassmen = 0;

  export function generateTeams(
    students: Student[],
    projects: Project[],
  ) {
    const teams: Record<string, Student[]> = projects.reduce((acc, current) => {
      return {
        ...acc,
        [current.name]: [],
      };
    }, {});
    
    //Caluclate avg students per team. Floor it to find the ideal min. for a team.
    let minimumStudents = Math.floor(students.length / projects.length);

    //adds each student to their top preference
    passOne(teams, students);
    //Optimize the teams
    passTwo(teams, students, projects, minimumStudents);

    return teams;
  }

  function passOne(
    teams: Record<string, Student[]>,
    students: Student[],
  ) {
    students.forEach((student) => {
        if (student.class == "3200") {
          numUpperClassmen++; //if a student is a part of 3200, they are an "upperclassman"
        }
        if(student.choices.length > 0) {
          teams[student.choices[0]].push(student); //assign each student to their top choice
        }
        //if no preferences, assign to smallest team
        else {
          teams[
            Object.keys(teams).sort(
              (a, b) => teams[a].length - teams[b].length
            )[0]
          ].push(student);
        }
    });
  }

function passTwo(
  teams: Record<string, Student[]>,
  students: Student[],
  projects: Project[],
  minimumStudents: number,
) {
  console.log("passTwo");
  // balancing pass - function that takes only the teams and min/max students
  // sort teams by least students to most
  const teamsArray = Object.values(teams);
  //Sort the array by the number of students in each team by low to high
  teamsArray.sort((a, b) => a.length - b.length);
  // any team with less than minimum, find a student from a team that has the more students and move a student that has a high preference
  for(let i = 0; i < teamsArray.length; i++) {
    let leastTeam = teamsArray[i]
    if (leastTeam.length < minimumStudents) {
      //find student with this project as highest preference
      //ideally, find all students with 2nd pref. move student from largest group
      const reversedTeamsArray = teamsArray.toReversed();
      reversedTeamsArray.forEach((team, index) => {
        team.forEach((student, indexStud) => {
          if(student.choices[1] === Object.keys(teams).find(
              (a) => teams[a] === team
            ))
          {
            //move student to team, remove student from previous team
            leastTeam.push(student);
            team.splice(
              team.indexOf(student),
              1
            )
          }
        });
      });
      /*// find team with most students
      const teamWithMostStudents = teamsArray.sort(
        (a, b) => b.length - a.length
      )[0];
      // find student with lowest team at next highest preference
      const leastImpactfulStudent = teamWithMostStudents.sort(
        (a, b) =>
          preferenceScore(
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
      ); */
      i--; //loops back through this team to make sure that it has reached minimum
    }
  }
}