import fs from 'fs';
import Papa from 'papaparse';
import type { Student, Project } from "./newAlgorithm";
import { generateTeams } from "./newAlgorithm";

function readCSVFile(filePath: string): Student[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return parseCSV(fileContent);  // Use the same parseCSV function
}

// Function to parse CSV string into an array of objects
function parseCSV(csv: string): Student[] {
  const results = Papa.parse(csv, {
    header: true,   // Use the first row as the keys
    skipEmptyLines: true,  // Skip empty lines
    dynamicTyping: true,  // Automatically type convert values (e.g. numbers)
  });

   // Transform the data
   return results.data.map((row: any) => {
    // Combine choices into an array
    const choices = [
      row['Choice 1'],
      row['Choice 2'],
      row['Choice 3'],
      row['Choice 4'],
      row['Choice 5'],
      row['Choice 6']
    ];

    // Create a string of choices
    const choicesString = choices.join(', ');

    // Return the transformed object
    return {
      id: row.id,
      name: row.name,
      major: row.major,
      seniority: row.seniority,
      choices,
      class: row.class,
      choicesString,
    };
  }) as Student[];  // Type assertion to Student[]
}

const projectData: Project[] = [
    {
      id: "1",
      name: "F24 -  Friends of MLK: Reading Huddle App",
      type: "SW",
    },
    {
      id: "2",
      name: "F24 - UTDesign: EPICS GitHub/Discord",
      type: "SW"
    },
    {
      id: "3",
      name: "F24 - GDYO: Communication App",
      type: "SW",
    },
    {
        id: "4",
        name: "F24 - UTDesign: EPICS Database/Dashboard",
        type: "SW"
    },
    {
        id: "5",
        name: "F24 - Hope Restored Missions: Inventory Tracking",
        type: "SW"
    },
    {
        id: "6",
        name: "F24 - UTDesign: Monitor Dashboard",
        type: "SW"
    },
    {
        id: "7",
        name: "F24 - KidsU: Donor/Grant Database",
        type: "SW"
    },
    {
        id: "8",
        name: "F24 - Office of Sustainability: Residential Solar Calculator",
        type: "SW"
    },
    {
        id: "9",
        name: "F24 - KidsU: Volunteer Database",
        type: "SW"
    },
    {
        id: "10",
        name: "F24 - TheLab.ms Makerspace: Access Control Manager",
        type: "Both"
    },
    {
        id: "11",
        name: " F24 - Kellermann: Solar Array Kitario Project",
        type: "HW"
    },
    {
        id: "12",
        name: " F24 - Kellermann: Water Pump Design Kitario Project",
        type: "HW"
    },
    {
        id: "13",
        name: "F24 - TheLab.ms Makerspace: Kiosk/Calendar",
        type: "SW"
    },
  ];

  const parsedFileData = readCSVFile('Project_Bid_Response_W.csv');
  console.log(parsedFileData);

console.log("\nTeams:");
console.log(generateTeams(parsedFileData, projectData));
