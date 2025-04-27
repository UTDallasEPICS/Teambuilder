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

    // Validate required fields
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
          Course: { in: courses },
          Year: { gte: Number(years[0]), lte: Number(years[1]) },
          Sem: { in: semesters },
        },
        select: {
          Name: true,
          Course: true,
          Total: true,
        },
      });

      records.sort((first, second) => {
        const firstName = first.Name;
        const secondName = second.Name;
        const firstYear = firstName.substring(0, 2);
        const firstSem = firstName.substring(2, 3);
        const secondYear = secondName.substring(0, 2);
        const secondSem = secondName.substring(2, 3);

        if (firstYear > secondYear) return 1;
        if (firstYear < secondYear) return -1;

        const semesterOrder = ['S', 'U', 'F'];
        return semesterOrder.indexOf(firstSem) - semesterOrder.indexOf(secondSem);
      });

      return {
        success: true,
        data: records,
      };
    }

    // Ethnicity filter logic
    if (ethnicities[0] != "Empty") {
      const records = await prisma.semester.findMany({
        where: {
          Course: { in: courses },
          Year: { gte: Number(years[0]), lte: Number(years[1]) },
          Sem: { in: semesters },
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

      const filteredRecords = records.map((r) => {
        const total = r.Total;
        const data: Record = {
          Name: r.Name,
          Course: r.Course,
          Total: r.Total,
        };

        ethnicities.forEach((e) => {
          data[e] = Yaxis === "Percentages"
            ? ((r[e as keyof Record] / total) * 100).toFixed(2) + "%"
            : r[e as keyof Record];
        });

        return data;
      });

      filteredRecords.sort((first, second) => {
        const firstName = first.Name;
        const secondName = second.Name;
        const firstYear = firstName.substring(0, 2);
        const firstSem = firstName.substring(2, 3);
        const secondYear = secondName.substring(0, 2);
        const secondSem = secondName.substring(2, 3);

        if (firstYear > secondYear) return 1;
        if (firstYear < secondYear) return -1;

        const semesterOrder = ['S', 'U', 'F'];
        return semesterOrder.indexOf(firstSem) - semesterOrder.indexOf(secondSem);
      });

      return {
        success: true,
        data: filteredRecords,
      };
    }

    // Gender filter logic
    const records = await prisma.semester.findMany({
      where: {
        Course: { in: courses },
        Year: { gte: Number(years[0]), lte: Number(years[1]) },
        Sem: { in: semesters },
      },
      select: {
        Name: true,
        Course: true,
        Male: true,
        Female: true,
        Total: true,
      },
    });

    const filteredRecords = records.map((r) => {
      const total = r.Total;
      const data = {
        Name: r.Name,
        Course: r.Course,
        Total: r.Total,
      };

      genders.forEach((g) => {
        data[g] = Yaxis === "Percentages"
          ? ((r[g as keyof typeof r] / total) * 100).toFixed(2) + "%"
          : r[g as keyof typeof r];
      });

      return data;
    });

    filteredRecords.sort((first, second) => {
      const firstName = first.Name;
      const secondName = second.Name;
      const firstYear = firstName.substring(0, 2);
      const firstSem = firstName.substring(2, 3);
      const secondYear = secondName.substring(0, 2);
      const secondSem = secondName.substring(2, 3);

      if (firstYear > secondYear) return 1;
      if (firstYear < secondYear) return -1;

      const semesterOrder = ['S', 'U', 'F'];
      return semesterOrder.indexOf(firstSem) - semesterOrder.indexOf(secondSem);
    });

    return {
      success: true,
      data: filteredRecords,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
});
