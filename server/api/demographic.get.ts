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