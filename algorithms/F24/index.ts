// NOTE:
// This is the most recent version of the algorithm created by Fall 2024.
// The steps to test the algorithm are listed below.
// ~~ Fall 2024 Teambuilder Team 12/10/2024

// To test algorithm:
// 1. type "npm install -g tsx" into terminal
// 2. change directories into the algorithms folder
// 3. type "tsx test.ts" (or replace test.ts with whichever file you want to test)
// whenever you want to test the algorithm in the future, you only need to repeat steps 2 and 3 and you should be good
// ~~ Fall 2024 Teambuilder Team 12/10/2024

// Student Structure that includes Name, Major, Grade, choices, and EPICS level


// ===================== DATA STRUCTURES =====================

// TODO: synchronize with types/index.ts and/or prisma schema
export type Student = {
  id: string;
  name: string;
  major: "CS" | "SE" | "EE" | "ME" | "BME" | "DS" | "CE" | "Systems" | "Other";
  seniority: "Freshman" | "Sophomore" | "Junior" | "Senior";
  choices: string[];        // List of preferred project choices (ordered by preference)
  choicesString: string;    // String representation of choices (Why is there a string list and a string array?)
  class: "2200" | "3200";   // Class level (lower or upper)
};

// Defines the structure of a Project object, including its name and type.
export type Project = {
  id: string;
  name: string;
  type: "SW" | "HW" | "Both";
};

// Defines a mapping from project names to lists of students (team assignments).
// Input string is project names, and the values are arrays of Student[] objects. 
export type TeamAssignments = Record<string, Student[]>;


// ===================== MAIN FUNCTION TO GENERATE TEAMS =====================

// Main function to generate team assignments based on student preferences, degree type, and class level.
export function generateTeams(students: Student[], projects: Project[]): TeamAssignments {
  // Initialize an empty array for each project.
  // acc = Accumulator
  const teams: TeamAssignments = projects.reduce((acc, current) => {
      acc[current.name] = [];     // Assigns an empty array to the current project. 
      return acc;
  }, {} as TeamAssignments);

  // Sort students by the number of project choices they provided (students with fewer choices go first).
  // [...students] is a shallow copy
  const sortedStudents = [...students].sort((a, b) => a.choices.length - b.choices.length);

  // Group students by their first preference, then by their degree type, then by class level.
  const groupedByPreference = groupStudentsByPreference(sortedStudents);
  const groupedByDegree = groupStudentsByDegree(groupedByPreference);
  const groupedByClass = groupStudentsByClass(groupedByDegree);

  // Assign students to teams based on these groupings.
  placeStudentsInTeams(groupedByClass, teams, projects);

  // Calculate the minimum number of students required per team.
  const minStudents = Math.floor(students.length / projects.length);

  // Ensure each project has at least one 3200-level student
  ensureUpperClassmen(teams, projects);

  // Balance teams based on minimum students required
  balanceTeamsFixed(teams, projects, minStudents);

  // Return the final team assignments.
  return teams;
}

// ===================== STUDENT GROUPING FUNCTIONS =====================

// Groups students based on their highest-ranked project preference.
function groupStudentsByPreference(students: Student[]): Record<string, Student[]> {

  return students.reduce((grouped: Record<string, Student[]>, student) => {
      const preference = student.choices[0] || "No preference";     // Default to "No preference" if they have none.
      grouped[preference] = grouped[preference] || [];
      grouped[preference].push(student);
      return grouped;
  }, {});
}

// Group students by their degree (hardware, software, other)
function groupStudentsByDegree(studentsByPreference: Record<string, Student[]>): Record<string, Record<string, Student[]>> {

  return Object.entries(studentsByPreference).reduce((grouped, [preference, students]) => {
      grouped[preference] = students.reduce(
          (degreeGroups: Record<string, Student[]>, student) => {
              const degreeType = getDegreeType(student.major);        // Determine degree type (HW, SW, Other).
              degreeGroups[degreeType] = degreeGroups[degreeType] || [];
              degreeGroups[degreeType].push(student);
              return degreeGroups;
          },
          { HW: [], SW: [], Other: [] }     // Initialize groups.
      );
      return grouped;
  }, {} as Record<string, Record<string, Student[]>>);
}

// Determines if a student belongs to Hardware (HW), Software (SW), or Other category based on their major.
function getDegreeType(major: Student['major']): string {
  if (["EE", "ME", "BME", "CE"].includes(major)) return "HW";   // Engineering fields are hardware-based.
  if (["CS", "SE", "DS"].includes(major)) return "SW";          // CS-related fields are software-based.
  return "Other";                                               // Everything else falls under "Other."
}

// Further groups students by their class level (2200 = lower-level, 3200 = upper-level).
function groupStudentsByClass(studentsByDegree: Record<string, Record<string, Student[]>>): Record<string, Record<string, Student[]>> {

  return Object.entries(studentsByDegree).reduce((grouped, [preference, degreeGroups]) => {
      grouped[preference] = {     // Initialize groups.
          "2200": [],
          "3200": [],
          null: [],
      };

      Object.values(degreeGroups).forEach(students => {
          students.forEach(student => {
              grouped[preference][student.class].push(student);   // Place student into their class category.
          });
      });

      return grouped;
  }, {} as Record<string, Record<string, Student[]>>);
}


// ===================== TEAM ASSIGNMENT FUNCTIONS =====================

// Places students into teams based on their preferences and class level.
function placeStudentsInTeams(studentsByClass: Record<string, Record<string, Student[]>>, teams: TeamAssignments, projects: Project[]): void {
  
  Object.entries(studentsByClass).forEach(([preference, classGroups]) => {
      if (preference === "No preference") {
          // Assign students with no preferences to the smallest team
          const smallestTeam = projects.reduce((smallest, project) => {
              return teams[project.name].length < teams[smallest.name].length
                  ? project
                  : smallest;
          }, projects[0]);

          classGroups["2200"].forEach((student) => {
              teams[smallestTeam.name].push(student);
          });

          classGroups["3200"].forEach((student) => {
              teams[smallestTeam.name].push(student);
          });
      } else {
          // Assign students to their preferred projects.
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

// Ensure each project has at least one 3200-level student
function ensureUpperClassmen(teams: TeamAssignments, projects: Project[]): void {
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
              project.name
          );

          if (availableUpperClassman) {
              const currentTeam = studentLocations.get(availableUpperClassman.name);
              if (currentTeam) {
                  teams[currentTeam] = teams[currentTeam].filter(
                      s => s.name !== availableUpperClassman.name
                  );
                  teams[project.name].push(availableUpperClassman);
                  studentLocations.set(availableUpperClassman.name, project.name);
              }
          }
      }
  });
}

// Find an available upperclassman for balancing
function findAvailableUpperClassman(teams: TeamAssignments, targetProject: string): Student | null {
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

// ===================== TEAM BALANCING FUNCTIONS =====================

// Redistributes students to ensure teams have at least minStudents number of members.
function balanceTeamsFixed(teams: TeamAssignments, projects: Project[], minStudents: number): void {
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

// Find the best student to move for balancing
function findBestStudentToMove(team: Student[], targetProject: string): Student | null {
  return team.reduce((best, current) => {
      if (!best) return current;
      const bestImpact = calculateImpactScore(best, targetProject);
      const currentImpact = calculateImpactScore(current, targetProject);
      return currentImpact < bestImpact ? current : best;
  }, null as Student | null);
}

// Calculate a student's impact score
function calculateImpactScore(student: Student, projectName: string): number {
  const preferenceIndex = student.choices.indexOf(projectName);
  const preferenceScore = preferenceIndex === -1 ? 100 : preferenceIndex + 1;
  const classScore = student.class === "3200" ? 0.5 : 1;

  return (preferenceScore + classScore) / 2;
}
