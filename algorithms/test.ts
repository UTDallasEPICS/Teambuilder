//dummy student nad project data to test with
import { Student, Project } from "./algorithm";
import { generateTeams } from "./algorithm";

const studentData: Student[] = [
  // Student 1
  {
    name: "Michael Johnson",
    major: "Other",
    seniority: "Senior",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "3200",
  },
  // Student 2
  {
    name: "Jessica Davis",
    major: "CS",
    seniority: "Junior",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  // Student 3
  {
    name: "Emily Wilson",
    major: "CS",
    seniority: "Senior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
  },
  // Student 4
  {
    name: "Daniel Martinez",
    major: "CS",
    seniority: "Freshman",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
    ],
    class: "2200",
  },
  // Student 5
  {
    name: "Sarah Brown",
    major: "CS",
    seniority: "Sophomore",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  // Student 6
  {
    name: "David Miller",
    major: "Other",
    seniority: "Senior",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "3200",
  },
  // Student 7
  {
    name: "Jennifer Lee",
    major: "CS",
    seniority: "Junior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  // Student 8
  {
    name: "Matthew Clark",
    major: "CS",
    seniority: "Sophomore",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "2200",
  },
  // Student 9
  {
    name: "Olivia Rodriguez",
    major: "Other",
    seniority: "Senior",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
  },
  // Student 10
  {
    name: "Ryan Taylor",
    major: "CS",
    seniority: "Freshman",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  // Student 11
  {
    name: "Emma Garcia",
    major: "CS",
    seniority: "Junior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  // Student 12
  {
    name: "Ethan Martinez",
    major: "CS",
    seniority: "Senior",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
  },
  // Student 13
  {
    name: "Ava Moore",
    major: "Other",
    seniority: "Freshman",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "2200",
  },
  // Student 14
  {
    name: "Noah Thompson",
    major: "CS",
    seniority: "Sophomore",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
    ],
    class: "2200",
  },
  // Student 15
  {
    name: "Sophia Hernandez",
    major: "CS",
    seniority: "Junior",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "2200",
  },
  // Student 16
  {
    name: "Logan Martin",
    major: "CS",
    seniority: "Senior",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
  },
  // Student 17
  {
    name: "Isabella Nguyen",
    major: "Other",
    seniority: "Freshman",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
    ],
    class: "2200",
  },
  // Student 18
  {
    name: "Mason Rivera",
    major: "CS",
    seniority: "Sophomore",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
  },
  // Student 19
  {
    name: "Charlotte Walker",
    major: "CS",
    seniority: "Junior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
    ],
    class: "2200",
  },
  // Student 20
  {
    name: "Lucas Garcia",
    major: "CS",
    seniority: "Senior",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "3200",
  },
];

const projectData: Project[] = [
  {
    name: "Carson's Village: Automated Family Page",
    targetCS: 4,
    requiredMajors: ["CS"],
  },
  {
    name: "ATC: Patient Data Collection App",
    targetCS: 5,
    requiredMajors: ["CS"],
  },
  {
    name: "ATC: Sensory Devices",
    targetCS: 3,
    requiredMajors: ["CS"],
  },
];

// Output the dummy data
console.log("Dummy Student Data:");
//console.log(studentData);
console.log("\nDummy Project Data:");
//console.log(projectData);
console.log("\nTeams:");
console.log(generateTeams(studentData, projectData, 6, 7));
