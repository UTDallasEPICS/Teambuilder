import { PrismaClient } from "@prisma/client";
import { access } from "fs";

const prisma = new PrismaClient();

interface Record {
  Name: string;
  Course: string;
  African_American: number;
  Asian: number;
  Hispanic: number;
  International: number;
  Other: number;
  White: number;
  Total: number;
}

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const { Course, Ethnicity, Gender, Year, Semester, Yaxis } = queryParams; // Fixed Y-axis to Yaxis

    const courses = Course ? String(Course).split(",") : [];
    const ethnicities = Ethnicity ? String(Ethnicity).split(",") : [];
    const genders = Gender ? String(Gender).split(",") : [];
    const years = Year ? String(Year).split(",") : [];
    const semesters = Semester ? String(Semester).split(",") : [];

    if (courses[0] == "Empty") {
      throw new Error("You must pick at least one Course");
    } else if (years[0] == "Empty" || years.length < 2) {
      throw new Error("Both Years must be chosen");
    } else if (semesters[0] == "Empty") {
      throw new Error("You must pick at least one Semester");
    }
    if (courses[0] == "Empty") {
      throw new Error("You must pick at least one Course");
    } else if (years[0] == "Empty" || years.length < 2) {
      throw new Error("Both Years must be chosen");
    } else if (semesters[0] == "Empty") {
      throw new Error("You must pick at least one Semester");
    }

    // If neither ethnicity nor gender is selected, return total only
    if (ethnicities[0] == "Empty" && genders[0] == "Empty") {
      const records = await prisma.semester.findMany({
        where: {
          Course: {
            in: courses,
          },
          Year: {
            gte: Number(years[0]),
            lte: Number(years[1]),
          },
          Sem: {
            in: semesters,
          },
        },
        select: {
          Name: true,
          Course: true,
          Total: true,
        },
      });

            records.sort((first, second)=>{
              let firstName = first.Name;
              let secondName = second.Name;
              let firstYear = firstName.substring(0,2);
              let firstSem = firstName.substring(2,3);
              let secondYear = secondName.substring(0,2);
              let secondSem = secondName.substring(2,3);
              if (firstYear>secondYear) {
                return 1;
              }
              else if (firstYear<secondYear) {
                return -1;
              }
              else {//Fall (F) > Summer (U) > Spring (S)
                //If first is fall and second is summer or first is fall and second is spring or first is summer and second is spring, the first is greater
                if(((firstSem === 'F') && (secondSem === 'U'))||((firstSem === 'F') && (secondSem === 'S'))||((firstSem === 'U') && (secondSem === 'S'))){
                  return 1;
                }
                //Assuming no duplicate semesters, the previous if statement exhausts all possible ways for the first to be greater than the second
                return -1;
              }
            });
    // If neither ethnicity nor gender is selected, return total only
    if (ethnicities[0] == "Empty" && genders[0] == "Empty") {
      const records = await prisma.semester.findMany({
        where: {
          Course: {
            in: courses,
          },
          Year: {
            gte: Number(years[0]),
            lte: Number(years[1]),
          },
          Sem: {
            in: semesters,
          },
        },
        select: {
          Name: true,
          Course: true,
          Total: true,
        },
      });

      return {
        success: true,
        data: records,
      };
    } else if (ethnicities[0] != "Empty" && genders[0] != "Empty") {
      throw new Error("Both Ethnicity and Gender cannot be chosen");
    }

    // Ethnicity filter logic
    if (ethnicities[0] != "Empty") {
      const records = await prisma.semester.findMany({
        where: {
          Course: {
            in: courses,
          },
          Year: {
            gte: Number(years[0]),
            lte: Number(years[1]),
          },
          Sem: {
            in: semesters,
          },
        },
        select: {
          Name: true,
          Course: true,
          African_American: true,
          Asian: true,
          Hispanic: true,
          International: true,
          Other: true,
          White: true,
          Total: true,
        },
      });

      // Calculate the number or percentage based on the Y-axis
      const filteredRecords = records.map((r) => {
        const total = r.Total;

        const data: Record = {
          Name: r.Name,
          Course: r.Course,
          Total: r.Total,
        };

        // Add the ethnicity data
        ethnicities.forEach((e) => {
          if (Yaxis === "Percentages") {
            // Calculate percentage
            data[e] = ((r[e as keyof Record] / total) * 100).toFixed(2) + "%";
          } else {
            // Show raw count
            data[e] = r[e as keyof Record];
          }
        });

        return data;
      });
            filteredRecords.sort((first, second)=>{
              let firstName = first.Name;
              let secondName = second.Name;
              let firstYear = firstName.substring(0,2);
              let firstSem = firstName.substring(2,3);
              let secondYear = secondName.substring(0,2);
              let secondSem = secondName.substring(2,3);
              if (firstYear>secondYear) {
                // console.log("First year > Second year");
                return 1;
              }
              else if (firstYear<secondYear) {
                // console.log("First year < Second year");
                return -1;
              }
              else {//Fall (F) > Summer (U) > Spring (S)
                //If first is fall and second is summer or first is fall and second is spring or first is summer and second is spring, the first is greater
                if(((firstSem === 'F') && (secondSem === 'U'))||((firstSem === 'F') && (secondSem === 'S'))||((firstSem === 'U') && (secondSem === 'S'))){
                  // console.log("First semester > Second semester");
                  return 1;
                }
                //Assuming no duplicate semesters, the previous if statement exhausts all possible ways for the first to be greater than the second
                // console.log("First semester < Second semester");
                return -1;
              }
            });

      return {
        success: true,
        data: filteredRecords,
      };
    } else {
      // Gender filter logic
      const records = await prisma.semester.findMany({
        where: {
          Course: {
            in: courses,
          },
          Year: {
            gte: Number(years[0]),
            lte: Number(years[1]),
          },
          Sem: {
            in: semesters,
          },
        },
        select: {
          Name: true,
          Course: true,
          Male: true,
          Female: true,
          Total: true,
        },
      });

      // Calculate the number or percentage based on the Y-axis
      const filteredRecords = records.map((r) => {
        const total = r.Total;

        const data = {
          Name: r.Name,
          Course: r.Course,
          Total: r.Total,
        };

        // Add the gender data
        genders.forEach((g) => {
          if (Yaxis === "Percentages") {
            // Calculate percentage
            data[g] = ((r[g as keyof typeof r] / total) * 100).toFixed(2) + "%";
          } else {
            // Show raw count
            data[g] = r[g as keyof typeof r];
          }
        });

        return data;
      });

            //Sorting the list returned from the API by year and then semester
            filteredRecords.sort((first, second)=>{
              // console.log("First: " + JSON.stringify(first) + " second: " + JSON.stringify(second));
              let firstName = first.Name;
              let secondName = second.Name;
              let firstYear = firstName.substring(0,2);
              let firstSem = firstName.substring(2,3);
              let secondYear = secondName.substring(0,2);
              let secondSem = secondName.substring(2,3);
              if (firstYear>secondYear) {
                // console.log("First year > Second year");
                return 1;
              }
              else if (firstYear<secondYear) {
                // console.log("First year < Second year");
                return -1;
              }
              else {//Fall (F) > Summer (U) > Spring (S)
                //If first is fall and second is summer or first is fall and second is spring or first is summer and second is spring, the first is greater
                if(((firstSem === 'F') && (secondSem === 'U'))||((firstSem === 'F') && (secondSem === 'S'))||((firstSem === 'U') && (secondSem === 'S'))){
                  // console.log("First semester > Second semester");
                  return 1;
                }
                //Assuming no duplicate semesters, the previous if statement exhausts all possible ways for the first to be greater than the second
                // console.log("First semester < Second semester");
                return -1;
              }
            });

      return {
        success: true,
        data: filteredRecords,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
});