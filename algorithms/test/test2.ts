//dummy student nad project data to test with
//dummy student nad project data to test with
import type { Student, Project } from "../algorithm-F24";
import { generateTeams } from "../algorithm-F24";

const studentData: Student[] = [
  // Student 1
  {
    id: "1",
    name: "Michael Johnson",
    major: "ME",
    seniority: "Senior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
  // Student 2
  {
    id: "2",
    name: "Jessica Davis",
    major: "CS",
    seniority: "Junior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
  // Student 3
  {
    id: "3",
    name: "Emily Wilson",
    major: "CS",
    seniority: "Senior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
  // Student 4
  {
    id: "4",
    name: "Daniel Martinez",
    major: "CS",
    seniority: "Freshman",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
  // Student 5
  {
    id: "5",
    name: "Sarah Brown",
    major: "CS",
    seniority: "Sophomore",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
  // Student 6
  {
    id: "6",
    name: "David Miller",
    major: "EE",
    seniority: "Senior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
  // Student 7
  {
    id: "7",
    name: "Jennifer Lee",
    major: "CS",
    seniority: "Junior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
  // Student 8
  {
    id: "8",
    name: "Matthew Clark",
    major: "CS",
    seniority: "Sophomore",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
  // Student 9
  {
    id: "9",
    name: "Olivia Rodriguez",
    major: "BME",
    seniority: "Senior",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
  // Student 10
  {
    id: "10",
    name: "Ryan Taylor",
    major: "CS",
    seniority: "Freshman",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Sensory Devices",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Sensory Devices, ATC: Patient Data Collection App",
  },
];

const projectData: Project[] = [
  {
    id: "1",
    name: "Carson's Village: Automated Family Page",
    type: "SW",
  },
  {
    id: "2",
    name: "ATC: Patient Data Collection App",
    type: "SW"
  },
  {
    id: "3",
    name: "ATC: Sensory Devices",
    type: "Both",
  },
];

// Output the dummy data
console.log("Dummy Student Data:");
//console.log(studentData);
console.log("\nDummy Project Data:");
//console.log(projectData);
console.log("\nTeams:");
console.log(generateTeams(studentData, projectData));
