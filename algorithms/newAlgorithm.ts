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
  let totalNumInClass = 0;

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

    //adds each student to their top preference
    passOne(teams, students);

    return teams;
  }

  function passOne(
    teams: Record<string, Student[]>,
    students: Student[],
  ) {
    students.forEach((student) => {
        totalNumInClass++;
        if (student.class == "3200") {
          numUpperClassmen++; //if a student is a part of 3200, they are an "upperclassman"
        }
        if(student.choices.length > 0) {
          teams[student.choices[0]].push(student); //assign each student to their top choice
        }
        else {
          //TODO: Determine what to do with students with no choices.
        }
    });
  }

  