import { PrismaClient } from "@prisma/client"
import { access } from "fs"

const prisma = new PrismaClient()

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
        const queryParams = getQuery(event)
        const { Course, Ethnicity, Gender, Year, Semester } = queryParams

        const courses = Course ? String(Course).split(",") : [];
        const ethnicities = Ethnicity ? String(Ethnicity).split(",") : [];
        const genders = Gender ? String(Gender).split(",") : [];
        const years = Year ? String(Year).split(",") : [];
        const semesters = Semester ? String(Semester).split(",") : [];

        if (courses[0] == "Empty") {
            throw new Error("You must pick atleast one Course")
        } else if (years[0] == "Empty" || years.length < 2) {
            throw new Error("Both Years must be chosen")
        } else if (semesters[0] == "Empty") {
            throw new Error("You must pick atleast one Semester")
        }

        // If neither ethnicity nor gender is selected, return total only
        if (ethnicities[0] == "Empty" && genders[0] == "Empty") {
            const records = await prisma.semester.findMany({
                where: {
                    Course: {
                        in: courses
                    },
                    Year: {
                        gte: Number(years[0]),
                        lte: Number(years[1])
                    },
                    Sem: {
                        in: semesters
                    }
                },
                select: {
                    Name: true,
                    Course: true,
                    Total: true
                }
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

            return {
                success: true,
                data: records
            }
        } else if (ethnicities[0] != "Empty" && genders[0] != "Empty") {
            throw new Error("Both Ethnicity and Gender cannot be chosen")
        }

        if (ethnicities[0] != "Empty") {
            const records = await prisma.semester.findMany({
                where: {
                    Course: {
                        in: courses
                    },
                    Year: {
                        gte: Number(years[0]),
                        lte: Number(years[1])
                    },
                    Sem: {
                        in: semesters
                    }
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
                    Total: true
                }
            });

            const filteredRecords = records.map(r =>
                Object.fromEntries([
                    ['Name', r.Name],
                    ['Course', r.Course],
                    ...ethnicities.map(e => [e, r[e as keyof Record]]),
                    ['Total', r.Total]
                ] as [string, number][])
            );
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
                data: filteredRecords
            }
        } else {
            const records = await prisma.semester.findMany({
                where: {
                    Course: {
                        in: courses
                    },
                    Year: {
                        gte: Number(years[0]),
                        lte: Number(years[1])
                    },
                    Sem: {
                        in: semesters
                    }
                },
                select: {
                    Name: true,
                    Course: true,
                    Male: true,
                    Female: true,
                    Total: true
                }
            });

            const filteredRecords = records.map(r =>
                Object.fromEntries([
                    ['Name', r.Name],
                    ['Course', r.Course],
                    ...genders.map(g => [g, r[g as keyof typeof r]]),
                    ['Total', r.Total]
                ] as [string, number][])
            );

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
                data: filteredRecords
            }
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error"
        }
    }
});