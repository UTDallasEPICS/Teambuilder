// NEW (?) FUNCTION:

//Student Structure that includes Name, Major, Grade, choices, and EPICS level
// Student Structure that includes Name, Major, Grade, choices, and EPICS level
export type Student = {
  id: string;
  name: string;
  major: "CS" | "SE" | "EE" | "ME" | "BME" | "DS" | "CE" | "Systems" | "Other";
  seniority: "Freshman" | "Sophomore" | "Junior" | "Senior";
  choices: string[];
  choicesString: string;
  class: "2200" | "3200";
};

// Project structure that includes if the project is a software, hardware, or both
export type Project = {
  id: string;
  name: string;
  type: "SW" | "HW" | "Both";
};

// Type for Team Assignments
export type TeamAssignments = Record<string, Student[]>;

let numUpperClassmen = 0;

// Main function to generate teams
export function generateTeams(students: Student[], projects: Project[]): TeamAssignments {
  // Initialize Teams for each project
  const teams: TeamAssignments = projects.reduce((acc, current) => {
      acc[current.name] = [];
      return acc;
  }, {} as TeamAssignments);

  // Sort students by preference count
  const sortedStudents = [...students].sort((a, b) => a.choices.length - b.choices.length);

  // Group Students by Preferences, degree, and class
  const groupedByPreference = groupStudentsByPreference(sortedStudents);
  const groupedByDegree = groupStudentsByDegree(groupedByPreference);
  const groupedByClass = groupStudentsByClass(groupedByDegree);

  // Place the students in teams after sorting
  placeStudentsInTeams(groupedByClass, teams, projects);

  // Calculate minimum number of students per team
  const minStudents = Math.floor(students.length / projects.length);

  // Ensure each project has at least one 3200-level student
  ensureUpperClassmen(teams, students, projects);

  // Balance teams based on minimum students required
  balanceTeamsFixed(teams, projects, minStudents);

  return teams;
}

// Group students by their top preference
function groupStudentsByPreference(students: Student[]): Record<string, Student[]> {
  return students.reduce((grouped: Record<string, Student[]>, student) => {
      const preference = student.choices[0] || "No preference";
      grouped[preference] = grouped[preference] || [];
      grouped[preference].push(student);
      return grouped;
  }, {});
}

// Group students by their degree (hardware, software, other)
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

// Helper function to determine degree type
function getDegreeType(major: Student['major']): string {
  if (["EE", "ME", "BME", "CE"].includes(major)) return "HW";
  if (["CS", "SE", "DS"].includes(major)) return "SW";
  return "Other";
}

// Group students based on their class
function groupStudentsByClass(
  studentsByDegree: Record<string, Record<string, Student[]>>
): Record<string, Record<string, Student[]>> {
  return Object.entries(studentsByDegree).reduce((grouped, [preference, degreeGroups]) => {
      grouped[preference] = {
          "2200": [],
          "3200": [],
          null: [],
      };

      Object.values(degreeGroups).forEach(students => {
          students.forEach(student => {
              grouped[preference][student.class].push(student);
          });
      });

      return grouped;
  }, {} as Record<string, Record<string, Student[]>>);
}

function placeStudentsInTeams(
  studentsByClass: Record<string, Record<string, Student[]>>,
  teams: TeamAssignments,
  projects: Project[]
): void {
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
          // Regular preference-based placement
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
function ensureUpperClassmen(
  teams: TeamAssignments,
  students: Student[],
  projects: Project[]
): void {
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

// Balance teams
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

// Find the best student to move for balancing
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

// Calculate a student's impact score
function calculateImpactScore(student: Student, projectName: string): number {
  const preferenceIndex = student.choices.indexOf(projectName);
  const preferenceScore = preferenceIndex === -1 ? 100 : preferenceIndex + 1;
  const classScore = student.class === "3200" ? 0.5 : 1;

  return (preferenceScore + classScore) / 2;
}
