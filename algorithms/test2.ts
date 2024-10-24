//dummy student nad project data to test with
//dummy student nad project data to test with
import type { Student, Project } from "./newAlgorithm";
import { generateTeams } from "./newAlgorithm";

const studentData: Student[] = [
  // Student 1
  {
    name: "Michael Johnson",
    major: "Other",
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
    name: "David Miller",
    major: "Other",
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
    name: "Olivia Rodriguez",
    major: "Other",
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
    name: "Carson's Village: Automated Family Page",
    type: "SW",
  },
  {
    name: "ATC: Patient Data Collection App",
    type: "SW"
  },
  {
    name: "ATC: Sensory Devices",
    type: "HW",
  },
];

// Output the dummy data
console.log("Dummy Student Data:");
//console.log(studentData);
console.log("\nDummy Project Data:");
//console.log(projectData);
console.log("\nTeams:");
console.log(generateTeams(studentData, projectData));
