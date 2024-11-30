import ExcelJS from 'exceljs'; // Importing ExcelJS
import fs from 'fs'; // For writing CSV files
import { PrismaClient } from '@prisma/client'; // Importing PrismaClient
import { parse } from 'json2csv'; // For converting JSON to CSV

const prisma = new PrismaClient();

// Log the Prisma client version (works for Prisma v5)
console.log("Prisma client version:", prisma._clientVersion);

async function parseAndUpload() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('/Users/krk/Desktop/EPCS 2200 and 3200 data from Mette as of Summer 2024.xlsx'); // Use your actual file path
  const worksheet = workbook.getWorksheet(1); // Get the first sheet

  // Data for EPCS 2100
  const epcs2100Columns = ['C', 'D', 'E', 'F', 'G', 'H', 'I']; 
  const epcs2100SemesterNames = ['16S', '16F', '17S', '17F', '18S', '18F', '19S'];

  // Data for EPCS 2200
  const epcs2200Columns = ['L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']; 
  const epcs2200SemesterNames = ['19F', '20S', '20F', '21S', '21F', '22S', '22F', '23S', '23F', '24S', '24U'];

  // Data for EPCS 3100 
  const epcs3100Columns = ['C', 'D', 'E', 'F', 'G', 'H', 'I']; 
  const epcs3100SemesterNames = ['16S', '16F', '17S', '17F', '18S', '18F', '19S']; 

  // Data for EPCS 3200 
  const epcs3200Columns = ['L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V']; 
  const epcs3200SemesterNames = ['19F', '20S', '20F', '21S', '21F', '22S', '22F', '23S', '23F', '24S', '24U']; 

  // Collect all data for both sets of semesters
  const allSemesterData = [];

  // Function to process semesters and upload
  const processSemesters = (semesterColumns, semesterNames, courseCell, courseType) => {
    return new Promise((resolve, reject) => {
      try {
        // Loop through the semesters for the given columns and names
        for (let semesterIndex = 0; semesterIndex < semesterColumns.length; semesterIndex++) {
          const semesterColumn = semesterColumns[semesterIndex]; // Get the current column for the semester
          const semesterName = semesterNames[semesterIndex]; // Get the current semester name (e.g., '16S')

          console.log(`Importing data for semester ${semesterName}`);

          // Collecting data for the current semester (column)
          let semesterData;

          if (courseType === 'EPCS 3100' || courseType === 'EPCS 3200') {
            // Special handling for EPCS 3100 and EPCS 3200
            semesterData = {
              Name: worksheet.getCell(`${semesterColumn}47`).value, // Semester name
              Course: worksheet.getCell(courseCell).value || "", // Dynamic Course cell reference (A19 for 3100, J19 for 3200)
              African_American: worksheet.getCell(`${semesterColumn}48`).value || 0, 
              Asian: worksheet.getCell(`${semesterColumn}49`).value || 0, 
              Hispanic: worksheet.getCell(`${semesterColumn}50`).value || 0, 
              International: worksheet.getCell(`${semesterColumn}51`).value || 0, 
              Two_or_More: worksheet.getCell(`${semesterColumn}52`).value || 0, 
              Other: worksheet.getCell(`${semesterColumn}53`).value || 0, 
              White: worksheet.getCell(`${semesterColumn}54`).value || 0, 
              Male: worksheet.getCell(`${semesterColumn}55`).value || 0, 
              Female: worksheet.getCell(`${semesterColumn}56`).value || 0, 
              Total: worksheet.getCell(`${semesterColumn}57`).value || 0, 
            };
          } else {
            // Default structure for other courses (e.g., EPCS 2100, EPCS 2200)
            semesterData = {
              Name: worksheet.getCell(`${semesterColumn}34`).value, // Semester name 
              Course: worksheet.getCell(courseCell).value || "", // Dynamic Course cell reference (A6, J6, etc.)
              African_American: worksheet.getCell(`${semesterColumn}35`).value || 0, 
              Asian: worksheet.getCell(`${semesterColumn}36`).value || 0, 
              Hispanic: worksheet.getCell(`${semesterColumn}37`).value || 0, 
              International: worksheet.getCell(`${semesterColumn}38`).value || 0, 
              Two_or_More: worksheet.getCell(`${semesterColumn}39`).value || 0, 
              Other: worksheet.getCell(`${semesterColumn}40`).value + worksheet.getCell(`${semesterColumn}41`).value || 0, //Add other + unknown, put ti in other
              White: worksheet.getCell(`${semesterColumn}42`).value || 0, 
              Male: worksheet.getCell(`${semesterColumn}43`).value || 0, 
              Female: worksheet.getCell(`${semesterColumn}44`).value || 0, 
              Total: worksheet.getCell(`${semesterColumn}45`).value || 0, 
            };
          }

          // Add the semester data to an array
          allSemesterData.push({ semesterName, semesterData });

          // Write to CSV file
          const csv = parse([semesterData]); // Convert to CSV
          const csvFilePath = `/Users/krk/Desktop/${semesterName}_data.csv`; // Set the path for the CSV file

          fs.writeFileSync(csvFilePath, csv); // Write the CSV to disk
          console.log(`CSV file created for ${semesterName}: ${csvFilePath}`);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // Process EPCS 2100 (use 'A6' for course)
  await processSemesters(epcs2100Columns, epcs2100SemesterNames, 'A6', 'EPCS 2100');
  
  // Process EPCS 2200 (use 'J6' for course)
  await processSemesters(epcs2200Columns, epcs2200SemesterNames, 'J6', 'EPCS 2200');

  // Process EPCS 3100 (use 'A19' for course)
  await processSemesters(epcs3100Columns, epcs3100SemesterNames, 'A19', 'EPCS 3100');

  // Process EPCS 3200 (use 'J19' for course)
  await processSemesters(epcs3200Columns, epcs3200SemesterNames, 'J19', 'EPCS 3200');

  // Now upload all semester data in the order of the `semesterNames`
  for (const { semesterName, semesterData } of allSemesterData) {
    try {
      await prisma.semester.create({
        data: semesterData, // Include all fields (Name, Course, etc.)
      });
      console.log(`Data uploaded to the database for ${semesterName}`);
    } catch (error) {
      console.error(`Error uploading data for ${semesterName}:`, error);
    }
  }

  console.log('Data upload completed!');
}

parseAndUpload().catch((error) => {
  console.error('Error during process:', error);
}).finally(async () => {
  await prisma.$disconnect();
});
