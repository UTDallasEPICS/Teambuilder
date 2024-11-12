//Student Structure that includes Name, Major, Grade, choices, and EPICS level
//Changed Majors to include more than just CS
export type Student = {
    id: string
    name: string;
    major: "CS" | "SE" | "EE" | "ME" | "BME" | "DS" | "CE" | "Systems" | "Other";
    seniority: "Freshman" | "Sophomore" | "Junior" | "Senior";
    choices: string[];
    choicesString: string;
    class: "2200" | "3200";
  };
  
  //Project sturcture that include if the project is a software, hardware, or both. 
  export type Project = {
    id: string;
    name: string;
    type: "SW"|"HW"|"Both";
  };

  let numUpperClassmen = 0;

  /*export function generateTeams(
    students: Student[],
    projects: Project[],
  ) {
    const teams: Record<string, Student[]> = projects.reduce((acc, current) => {
      return {
        ...acc,
        [current.name]: [],
      };
    }, {});
    
    */

  //created a new team generate(initilaiztion) function, the old is commented above take a look at it. 
  export function generateTeams(students: Student[], projects: Project[]) {
    //Initialize Teams for each proejct
    const teams: Record<string, Student[]> = projects.reduce((acc, current) => {
    acc[current.name] = [];
    return acc;
  }, {} as Record<string, Student[]>);


    //Calculate avg students per team. Floor it to find the ideal min. for a team.

    //Sort students by preference
    students.sort((a, b) => a.choices.length - b.choices.length);    

    //Group Students by Preferences, degree, and class
    const groupedByPreference = groupStudentsByPreference(students);
    const groupedByDegree = groupStudentsByDegree(groupedByPreference);
    const groupedByClass = groupStudentsByClass(groupedByDegree);


    //Place the studenst in teams after the sorting
    placeStudentsInTeams(groupedByClass, teams, projects);

    //calculate minimum number of students
    const minStudents = Math.floor(students.length / projects.length);

    //balance teams based on minium students required
    balanceTeams(teams, students, projects, minStudents);

    //Check that each project has atleast one 3200 level student
    check3200InEachProject(teams,students,projects);

    //Calls for PREVIOUS FUNCTION:

    //adds each student to their top preference
    //passOne(teams, students);
    //Optimize the teams
    //passTwo(teams, students, projects, minimumStudents);

    return teams;
  }


  //function to group students by their top preference
  function groupStudentsByPreference(students: Student[]): Record<string, Student[]> {
    const grouped: Record<string, Student[]> = {};
    students.forEach((student) => {
      const preference = student.choices[0] || "No preference";
      if (!grouped[preference]) {
        grouped[preference] = [];
      }
      grouped[preference].push(student);
    });
    return grouped;
  }

  //function to group students by their degree(hardware, software, other)
  function groupStudentsByDegree(students: Record<string, Student[]>): Record<string, Record<string, Student[]>> {
    const grouped: Record<string, Record<string, Student[]>> = {};
    Object.keys(students).forEach((preference) => {
    grouped[preference] = { HW: [], SW: [], Other: [] };
    students[preference].forEach((student) => {
      if (["EE", "ME", "BME", "CE"].includes(student.major)) {
        grouped[preference]["HW"].push(student);
      } else if (["CS", "SE", "DS"].includes(student.major)) {
        grouped[preference]["SW"].push(student);
      } else {
        grouped[preference]["Other"].push(student);
      }
    });
  });
  return grouped;
  }

  //function to group students based on their class
  function groupStudentsByClass(students: Record<string, Record<string, Student[]>>): Record<string, Record<string, Student[]>> {
    const grouped: Record<string, Record<string, Student[]>> = {};
    Object.keys(students).forEach((preference) => {
    grouped[preference] = { "2200": [], "3200": [] };
    Object.values(students[preference]).forEach((studentList) => {
      studentList.forEach((student) => {
        grouped[preference][student.class].push(student);
      });
    });
  });
  return grouped;
  }

  //function to place students based on preference and class
  function placeStudentsInTeams(
    studentsByClass: Record<string, Record<string, Student[]>>,
    teams: Record<string, Student[]>,
    projects: Project[]
  ) {
    Object.keys(studentsByClass).forEach((preference) => {
      const students2200 = studentsByClass[preference]["2200"];
      const students3200 = studentsByClass[preference]["3200"];
  
      students2200.forEach((student) => {
        teams[student.choices[0]].push(student);
      });
  
      students3200.forEach((student) => {
        teams[student.choices[0]].push(student);
      });
    });
  }
//function to make sure each student has atleast one 3200 student
function check3200InEachProject(teams: Record<string, Student[]>,
  students: Student[],
  projects: Project[]
) {
  // Precompute which team each student is currently in
  const studentTeamMap: Record<string, string> = {};
  for (const teamName in teams) {
    teams[teamName].forEach(student => {
      studentTeamMap[student.name] = teamName;
    });
  }

  for(let i = 0; i < projects.length; i++){
    const has3200 = teams[projects[i].name].some((student) => student.class === "3200");
    if (!has3200) {
      const studentToMove = students.find(
        (student) => 
          student.class === "3200" && //finds a student in 3200
          student.choices.includes(projects[i].name) && //makes sure that student has the 3200-less project as a choice
          teams[studentTeamMap[student.name]].filter(s => s.class === "3200").length > 1 //makes sure the student's current project has multiple 3200 students
      );
      const studentToRemove = findLeastImpactfulStudent(teams[projects[i].name], projects[i].name);
      if (studentToMove && studentToRemove) {
        //Get the team the students are currently on
        const currentTeam = studentTeamMap[studentToMove.name];

        //Remove students from teams
        teams[currentTeam] = teams[currentTeam].filter((s) => s !== studentToMove);
        teams[projects[i].name] = teams[projects[i].name].filter((s) => s !== studentToRemove);

        //Add the students to their new teams
        teams[projects[i].name].push(studentToMove);
        teams[currentTeam].push(studentToRemove);

        //Update the students' teams in the map
        studentTeamMap[studentToMove.name] = projects[i].name;
        studentTeamMap[studentToRemove.name] = currentTeam;
      }
    } 
  }
}
//function to balance the teams
//each team will have at least minimumStudents (total students / total projects [rounded down]) 
function balanceTeams(teams: Record<string, Student[]>,
  students: Student[],
  projects: Project[],
  minimumStudents: number
) {
  const teamsArray = Object.values(teams).sort((a, b) => a.length - b.length); // Sort by team size
  for(let i = 0; i < teamsArray.length; i++) {
  if (teamsArray[i].length < minimumStudents) {
      // Find the array with the most elements
      const largestTeam = teamsArray.reduce((maxArray, currentArray) => {
          return currentArray.length > maxArray.length ? currentArray : maxArray;
      }, [] as Student[]);
      if (largestTeam) {
        const studentToMove = findLeastImpactfulStudent(largestTeam, teamsArray[i][0]?.name);
        if (studentToMove) {
          teamsArray[i].push(studentToMove);
          largestTeam.splice(largestTeam.indexOf(studentToMove), 1);

          teamsArray.sort((a, b) => a.length - b.length); //resort
          i--;
        }
      }
    }
  }

}
//function to calcuate the impact score of the student, which would mean that the lower is better
function findLeastImpactfulStudent(team: Student[],
  targetProject: string
): Student | null {
  const sortedByImpact = team.sort((a, b) => {
    return calculateImpact(b, targetProject) - calculateImpact(a, targetProject);
  });
  return sortedByImpact.length > 0 ? sortedByImpact[sortedByImpact.length - 1] : null;

}


// Function to calculate a student's impact on a project
//Lower score is beter, since they will create a larger impact, and will be less likely to move
//low score = not moved

function calculateImpact(student: Student, project: string): number {
  // Corrected Preference Score: lower score for higher preference
  const preferenceIndex = student.choices.indexOf(project);
  const preferenceScore = preferenceIndex !== -1 ? preferenceIndex + 1 : Infinity;

  // Major Fit Score: 0.5 for a good match, 1 for a poor match
  const majorFitScore = (project === "HW" && ["EE", "ME", "BME", "CE"].includes(student.major)) ||
    (project === "SW" && ["CS", "SE", "DS"].includes(student.major)) ? 0.5 : 1;

  // Class Score: 0.5 for 3200 students, 1 for 2200 students
  const classScore = student.class === "3200" ? 0.5 : 1;

  // Return the average score (lower score is better fit)
  return (preferenceScore + majorFitScore + classScore) / 3;
}

// PREVIOUS FUNCTION:

  /*function passOne(
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
      */
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
      //i--; //loops back through this team to make sure that it has reached minimum
    
    
  
