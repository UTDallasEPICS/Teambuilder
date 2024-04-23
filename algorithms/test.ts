//dummy student nad project data to test with
import { Student, Project } from "./algorithm";
import { generateTeams } from "./algorithm";

const studentData: Student[] = [
  {
    name: "Michael Johnson",
    major: "Electrical Engineering",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "3200",
  },
  {
    name: "Jessica Davis",
    major: "Software Engineering",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  {
    name: "David Martinez",
    major: "Industrial Design",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
    ],
    class: "3200",
  },
  {
    name: "Emily Rodriguez",
    major: "Graphic Design",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
  },
  {
    name: "Daniel Brown",
    major: "Computer Science",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  {
    name: "Sarah Garcia",
    major: "Renewable Energy",
    choices: [
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
      "Carson's Village: Automated Family Page",
    ],
    class: "2200",
  },
  {
    name: "Christopher Smith",
    major: "Civil Engineering",
    choices: [
      "ATC: Patient Data Collection App",
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
    ],
    class: "3200",
  },
  {
    name: "Jane Jones",
    major: "Healthcare Administration",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  {
    name: "Ashley Miller",
    major: "Information Technology",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "2200",
  },
  {
    name: "John Rodriguez",
    major: "Human-Computer Interaction",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
    ],
    class: "3200",
  },
  {
    name: "Jessica Davis",
    major: "Biomedical Engineering",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "2200",
  },
  {
    name: "Daniel Smith",
    major: "Nonprofit Management",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
    ],
    class: "3200",
  },
  {
    name: "Jessica Williams",
    major: "Data Science",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  {
    name: "Michelle Lee",
    major: "Chemical Engineering",
    choices: [
      "ATC: Patient Data Collection App",
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
    ],
    class: "3200",
  },
  {
    name: "Ryan Brown",
    major: "Mechanical Engineering",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
    ],
    class: "2200",
  },
  {
    name: "Sophia Garcia",
    major: "Physics",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  {
    name: "Brian Martinez",
    major: "Aerospace Engineering",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
  },
  {
    name: "Emma Rodriguez",
    major: "Biomedical Sciences",
    choices: [
      "ATC: Patient Data Collection App",
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
    ],
    class: "2200",
  },
  {
    name: "Matthew Nguyen",
    major: "Mathematics",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
  },
  {
    name: "Olivia Taylor",
    major: "Environmental Science",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "2200",
  },
];

const projectData: Project[] = [
  {
    name: "ATC: Patient Data Collection App",
    requiredMajors: [
      "Computer Science",
      "Software Engineering",
      "Information Technology",
    ],
  },
  {
    name: "ATC: Sensory Devices",
    requiredMajors: [
      "Electrical Engineering",
      "Mechanical Engineering",
      "Biomedical Engineering",
    ],
  },
  {
    name: "Carson's Village: Automated Family Page",
    requiredMajors: ["Computer Science", "Web Development", "Graphic Design"],
  },
];

// Output the dummy data
console.log("Dummy Student Data:");
//console.log(studentData);
console.log("\nDummy Project Data:");
//console.log(projectData);
console.log("\nTeams:");
console.log(generateTeams(studentData, projectData, 6, 7));
