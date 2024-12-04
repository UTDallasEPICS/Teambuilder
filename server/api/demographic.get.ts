import { PrismaClient } from "@prisma/client"
import { access } from "fs";

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
  }
export default defineEventHandler(async (event) =>
    try {
    const queryParams = getQuery(event)
    const { Course, Ethnicity, Gender, Year, Semester} = queryParams

    const courses = Course ? String(Course).split(",") : [];
    const ethnicities = Ethnicity ? String(Ethnicity).split(",") : [];
    const genders = Gender ? String(Gender).split(",") : [];
    const years = Year ? String(Year).split(",") : [];
    const semesters = Semester ? String(Semester).split(",") : [];

    if (courses[0] == "Empty") {
        throw new Error("You must pick atleast one Course")
    } else if (years[0] == "Empty" || years.length < 2) {
        throw new Error("Both Years must be chosen")
    } else if(semesters[0] == "Empty") {
        throw new Error("You must pick atleast one Semester")
    } else if (ethnicities[0] == "Empty" && genders[0] == "Empty") {
        throw new Error("You must pick atleast one Ethnicity or Gender")
    } else if (ethnicities[0] != "Empty" && genders[0] != "Empty") {
        throw new Error("Both Ethnicity and Gender cannot be chosen")
    } 


    if (ethnicities[0] != "Empty") {
        const records = await prisma.semester.findMany({
            where: {
                Course:  {
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
                White: true
            }
        });

        console.log(records)
        const filteredRecords = records.map(r => 
            Object.fromEntries([
              ['Name', r.Name],
              ['Course', r.Course], 
              ...ethnicities.map(e => [e, r[e as keyof Record]])
            ] as [string, number][])
          );

          console.log(filteredRecords)
        
        return {
            success: true,
            data: filteredRecords
        }

    } else {
        return {
            message: "Gender not done yet"
        }
    }
    } catch(error) {
        console.error(error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error"
        }
    }
    
});