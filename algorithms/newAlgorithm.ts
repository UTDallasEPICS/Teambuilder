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

/*
//Student Structure that includes Name, Major, Grade, choices, and EPICS level
//Changed Majors to include more than just CS
export type Student = {
    id: string;
    name: string;
    major: "CS" | "SE" | "EE" | "ME" | "BME" | "DS" | "CE" | "Systems" | "Other";
    seniority: "Freshman" | "Sophomore" | "Junior" | "Senior";
    choices: string[];
    choicesString: string;
    class: "2200" | "3200";
};

//Project structure that includes if the project is a software, hardware, or both
export type Project = {
    id: string;
    name: string;
    type: "SW" | "HW" | "Both";
};

export type TeamAssignments = Record<string, Student[]>;

let numUpperClassmen = 0;


  
  

//created a new team generate(initialization) function, the old is commented above take a look at it.
export function generateTeams(students: Student[], projects: Project[]): TeamAssignments {
  //Initialize Teams for each project
  const teams: TeamAssignments = projects.reduce((acc, current) => {
      acc[current.name] = [];
      return acc;
  }, {} as TeamAssignments);

  //Calculate avg students per team. Floor it to find the ideal min. for a team.

  //Sort students by preference count
  const sortedStudents = [...students].sort((a, b) => a.choices.length - b.choices.length);

  //Group Students by Preferences, degree, and class
  const groupedByPreference = groupStudentsByPreference(sortedStudents);
  const groupedByDegree = groupStudentsByDegree(groupedByPreference);
  const groupedByClass = groupStudentsByClass(groupedByDegree);

  //Place the students in teams after the sorting
  placeStudentsInTeams(groupedByClass, teams, projects);

  //Check that each project has at least one 3200 level student
  ensureUpperClassmen(teams, students, projects);

  //calculate minimum number of students
  const minStudents = Math.floor(students.length / projects.length);

  //balance teams based on minimum students required
  balanceTeamsFixed(teams, projects, minStudents);

  //adds each student to their top preference
  //passOne(teams, students);
  //Optimize the teams
  //passTwo(teams, students, projects, minimumStudents);

  return teams;
}

//function to group students by their top preference
function groupStudentsByPreference(students: Student[]): Record<string, Student[]> {
  return students.reduce((grouped: Record<string, Student[]>, student) => {
      const preference = student.choices[0] || "No preference";
      grouped[preference] = grouped[preference] || [];
      grouped[preference].push(student);
      return grouped;
  }, {});
}

//function to group students by their degree(hardware, software, other)
function groupStudentsByDegree(
  studentsByPreference: Record<string, Student[]>
): Record<string, Record<string, Student[]>> {
  return Object.entries(studentsByPreference).reduce((grouped, [preference, students]) => {
      grouped[preference] = students.reduce(
          (degreeGroups: Record<string, Student[]>, student) => {
              const degreeType = getDegreeType(student.major);
              degreeGroups[degreeType] = degreeGroups[degreeType] || [];
              degreeGroups[degreeType].push(student);
              return degreeGroups;
          },
          { HW: [], SW: [], Other: [] }
      );
      return grouped;
  }, {} as Record<string, Record<string, Student[]>>);
}

//Helper function to determine degree type
function getDegreeType(major: Student['major']): string {
  if (["EE", "ME", "BME", "CE"].includes(major)) return "HW";
  if (["CS", "SE", "DS"].includes(major)) return "SW";
  return "Other";
}

//function to group students based on their class
function groupStudentsByClass(
  studentsByDegree: Record<string, Record<string, Student[]>>
): Record<string, Record<string, Student[]>> {
  return Object.entries(studentsByDegree).reduce((grouped, [preference, degreeGroups]) => {
      grouped[preference] = {
          "2200": [],
          "3200": []
      };
      
      Object.values(degreeGroups).forEach(students => {
          students.forEach(student => {
              grouped[preference][student.class].push(student);
          });
      });
      
      return grouped;
  }, {} as Record<string, Record<string, Student[]>>);
}

//function to place students based on preference and class
function placeStudentsInTeams(
  studentsByClass: Record<string, Record<string, Student[]>>,
  teams: TeamAssignments,
  projects: Project[]
): void {
  Object.entries(studentsByClass).forEach(([preference, classGroups]) => {
      if (teams[preference]) {  // Check if preference is a valid project
          ["2200", "3200"].forEach(classLevel => {
              classGroups[classLevel].forEach(student => {
                  if (student.choices[0]) {
                      teams[student.choices[0]].push(student);
                  }
              });
          });
      }
  });
}

//function to make sure each student has at least one 3200 student
function ensureUpperClassmen(
  teams: TeamAssignments,
  students: Student[],
  projects: Project[]
): void {
  // Create student location map for efficient lookups
  const studentLocations = new Map<string, string>();
  Object.entries(teams).forEach(([teamName, teamStudents]) => {
      teamStudents.forEach(student => {
          studentLocations.set(student.name, teamName);
      });
  });

  projects.forEach(project => {
      const team = teams[project.name];
      if (!team.some(student => student.class === "3200")) {
          const availableUpperClassman = findAvailableUpperClassman(
              teams,
              studentLocations,
              project.name
          );
          
          if (availableUpperClassman) {
              const currentTeam = studentLocations.get(availableUpperClassman.name);
              if (currentTeam) {
                  // Remove from current team
                  teams[currentTeam] = teams[currentTeam].filter(
                      s => s.name !== availableUpperClassman.name
                  );
                  // Add to new team
                  teams[project.name].push(availableUpperClassman);
                  // Update location
                  studentLocations.set(availableUpperClassman.name, project.name);
              }
          }
      }
  });
}

//Helper function to find available upperclassman for team balancing
function findAvailableUpperClassman(
  teams: TeamAssignments,
  studentLocations: Map<string, string>,
  targetProject: string
): Student | null {
  for (const [teamName, teamStudents] of Object.entries(teams)) {
      if (teamName !== targetProject) {
          const upperClassmen = teamStudents.filter(s => s.class === "3200");
          if (upperClassmen.length > 1) {
              return upperClassmen.reduce((best, current) => {
                  const bestImpact = calculateImpactScore(best, targetProject);
                  const currentImpact = calculateImpactScore(current, targetProject);
                  return currentImpact < bestImpact ? current : best;
              });
          }
      }
  }
  return null;
}

// Function to calculate a student's impact on a project
//Lower score is better, since they will create a larger impact, and will be less likely to move
//low score = not moved
function calculateImpactScore(student: Student, projectName: string): number {
  const preferenceIndex = student.choices.indexOf(projectName);
  const preferenceScore = preferenceIndex === -1 ? 100 : preferenceIndex + 1;
  const classScore = student.class === "3200" ? 0.5 : 1;
  
  return (preferenceScore + classScore) / 2;
}

//function to balance the teams
function balanceTeamsFixed(
  teams: TeamAssignments,
  projects: Project[],
  minStudents: number
): void {
  let balanced = false;
  while (!balanced) {
      balanced = true;
      const teamSizes = projects.map(p => ({
          name: p.name,
          size: teams[p.name].length
      })).sort((a, b) => a.size - b.size);

      const smallestTeam = teamSizes[0];
      const largestTeam = teamSizes[teamSizes.length - 1];

      if (smallestTeam.size < minStudents && largestTeam.size > minStudents) {
          balanced = false;
          const studentToMove = findBestStudentToMove(
              teams[largestTeam.name],
              smallestTeam.name
          );
          
          if (studentToMove) {
              teams[largestTeam.name] = teams[largestTeam.name].filter(
                  s => s.id !== studentToMove.id
              );
              teams[smallestTeam.name].push(studentToMove);
          }
      }
  }
}

//Helper function to find the best student to move during team balancing
function findBestStudentToMove(
  team: Student[],
  targetProject: string
): Student | null {
  return team.reduce((best, current) => {
      if (!best) return current;
      const bestImpact = calculateImpactScore(best, targetProject);
      const currentImpact = calculateImpactScore(current, targetProject);
      return currentImpact < bestImpact ? current : best;
  }, null as Student | null);
}

*/


