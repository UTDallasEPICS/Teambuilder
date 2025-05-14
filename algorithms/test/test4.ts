//dummy student nad project data to test with
//dummy student nad project data to test with
import type { Student, Project } from "../algorithm-F24";
import { generateTeams } from "../algorithm-F24";

const studentData: Student[] = [
  // Student 1
  {
    id: "woa24000",
    name: "Adegenro, William",
    major: "CE",
    seniority: "Freshman",
    choices: [
      "F24 - Office of Sustainability: Residential Solar Calculator",
      "F24 - UTDesign: EPICS Database/Dashboard",
      "F24 - KidsU: Volunteer Database",
      "F24 -  Friends of MLK: Reading Huddle App",
      "F24 - KidsU: Donor/Grant Database",
      "F24 - UTDesign: Monitor Dashboard",
    ],
    class: "2200",
    choicesString:
      "F24 - Office of Sustainability: Residential Solar Calculator, F24 - UTDesign: EPICS Database/Dashboard, F24 - KidsU: Volunteer Database, F24 -  Friends of MLK: Reading Huddle App, F24 - KidsU: Donor/Grant Database, F24 - UTDesign: Monitor Dashboard",
  },
  // Student 2
  {
    id: "axa220269",
    name: "Aggarwal, Aadit",
    major: "CS",
    seniority: "Sophomore",
    choices: [
        "F24 -  Friends of MLK: Reading Huddle App",
        "F24 - TheLab.ms Makerspace: Access Control Manager",
        "F24 - Kellermann: Solar Array Kitario Project",
        "F24 - Office of Sustainability: Residential Solar Calculator",
        "F24 - Hope Restored Missions: Inventory Tracking",
        "F24 - UTDesign: EPICS GitHub/Discord",
      ],
      class: "2200",
      choicesString:
      "F24 -  Friends of MLK: Reading Huddle App, F24 - TheLab.ms Makerspace: Access Control Manager, F24 - Kellermann: Solar Array Kitario Project, F24 - Office of Sustainability: Residential Solar Calculator, F24 - Hope Restored Missions: Inventory Tracking, F24 - UTDesign: EPICS GitHub/Discord",
    },
  // Student 3
  {
    id: "dxa210031",
    name: "Agrawal, Devansh",
    major: "CS",
    seniority: "Junior",
    choices: [
        "F24 - TheLab.ms Makerspace: Kiosk/Calendar",
        "F24 - GDYO: Communication App",
        "F24 - Office of Sustainability: Residential Solar Calculator",
        "F24 -  Friends of MLK: Reading Huddle App",
        "F24 - Hope Restored Missions: Inventory Tracking",
        "F24 - KidsU: Donor/Grant Database",
      ],
      class: "2200",
      choicesString:
        "F24 - TheLab.ms Makerspace: Kiosk/Calendar, F24 - GDYO: Communication App, F24 - Office of Sustainability: Residential Solar Calculator, F24 -  Friends of MLK: Reading Huddle App, F24 - Hope Restored Missions: Inventory Tracking, F24 - KidsU: Donor/Grant Database",    
    },
  // Student 4
  {
    id: "4",
    name: "Daniel Martinez",
    major: "CS",
    seniority: "Freshman",
    choices: [
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
    ],
    class: "2200",
    choicesString:
      "Carson's Village: Automated Family Page, ATC: Patient Data Collection App, ATC: Sensory Devices",
  },
  // Student 5
  {
    id: "5",
    name: "Sarah Brown",
    major: "CS",
    seniority: "Sophomore",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
    choicesString:
      "ATC: Sensory Devices, Carson's Village: Automated Family Page, ATC: Patient Data Collection App",
  },
  // Student 6
  {
    id: "6",
    name: "David Miller",
    major: "EE",
    seniority: "Senior",
    choices: [
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "3200",
    choicesString:
      "ATC: Patient Data Collection App, ATC: Sensory Devices, Carson's Village: Automated Family Page",
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
      "ATC: Patient Data Collection App",
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
    ],
    class: "2200",
    choicesString:
      "ATC: Patient Data Collection App, ATC: Sensory Devices, Carson's Village: Automated Family Page",
  },
  // Student 9
  {
    id: "9",
    name: "Olivia Rodriguez",
    major: "BME",
    seniority: "Senior",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "3200",
    choicesString:
      "ATC: Sensory Devices, Carson's Village: Automated Family Page, ATC: Patient Data Collection App",
  },
  // Student 10
  {
    id: "10",
    name: "Ryan Taylor",
    major: "CS",
    seniority: "Freshman",
    choices: [
      "ATC: Sensory Devices",
      "Carson's Village: Automated Family Page",
      "ATC: Patient Data Collection App",
    ],
    class: "2200",
    choicesString:
      "ATC: Sensory Devices, Carson's Village: Automated Family Page, ATC: Patient Data Collection App",
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