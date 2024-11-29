import { PrismaClient } from "@prisma/client";

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
  Male: number;
  Female: number;
  Total: number;
}

// Helper function to convert `Year` and `Semester` to `Name` format
const generateNameFilters = (years: string[], semesters: string[]): string[] => {
  const semesterMap: { [key: string]: string } = { Fall: "F", Spring: "S", Summer: "U" };
  const filters: string[] = [];
  for (const year of years) {
    const yearSuffix = year.slice(2); // Extract last two digits of the year
    for (const semester of semesters) {
      const semesterCode = semesterMap[semester];
      if (semesterCode) {
        filters.push(`${yearSuffix}${semesterCode}`);
      }
    }
  }
  return filters;
};

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const { Course, Ethnicity, Gender, Year, Semester } = queryParams;

    // Parse query parameters into arrays
    const courses = Course ? String(Course).split(",") : [];
    const ethnicities = Ethnicity ? String(Ethnicity).split(",") : [];
    const genders = Gender ? String(Gender).split(",") : [];
    const years = Year ? String(Year).split(",") : [];
    const semesters = Semester ? String(Semester).split(",") : [];

    // Validate input
    if (courses[0] === "Empty") {
      throw new Error("You must pick at least one Course");
    } else if (years.length > 0 && years.length < 2) {
      throw new Error("Both start and end Year must be chosen");
    } else if (semesters[0] === "Empty") {
      throw new Error("You must pick at least one Semester");
    } else if (ethnicities[0] === "Empty" && genders[0] === "Empty") {
      throw new Error("You must pick at least one Ethnicity or Gender");
    } else if (ethnicities[0] !== "Empty" && genders[0] !== "Empty") {
      throw new Error("Both Ethnicity and Gender cannot be chosen");
    }

    // Generate `Name` filters dynamically from `Year` and `Semester`
    const nameFilters = generateNameFilters(years, semesters);

    // Fetch records from the database
    const records = await prisma.semester.findMany({
      where: {
        Course: {
          in: courses,
        },
        ...(nameFilters.length > 0 && { Name: { in: nameFilters } }),
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
        Male: true,
        Female: true,
        Total: true,
      },
    });

    console.log('Fetched records:', records); // Log the raw records

    // Process results based on Ethnicity or Gender
    let filteredRecords = [];
    if (ethnicities[0] !== "Empty") {
      // Filter by ethnicities
      filteredRecords = records.map((record) =>
        Object.fromEntries([
          ["Name", record.Name],
          ["Course", record.Course],
          ...ethnicities.map((ethnicity) => [
            ethnicity,
            record[ethnicity as keyof Record],
          ]),
        ])
      );
    } else if (genders[0] !== "Empty") {
      // Filter by genders, handle both Male and Female
      filteredRecords = records.map((record) => {
        const genderData = genders.reduce((acc: any, gender: string) => {
          if (gender === "Male") acc[gender] = record.Male;
          if (gender === "Female") acc[gender] = record.Female;
          return acc;
        }, {});

        return {
          Name: record.Name,
          Course: record.Course,
          ...genderData,
        };
      });
    }

    console.log('Filtered records:', filteredRecords); // Log filtered records

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
