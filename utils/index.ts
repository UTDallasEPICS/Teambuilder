import type { Semester } from "@prisma/client";

// Returns a string where only the first letter is capitalized.
export const capitalizeFirst = (string: string | null) => {
  if (!string) return null;
  return string[0].toUpperCase() + string.substring(1).toLowerCase();
}

// Returns a string that is a comma-delimited list of semester display names
export const stringifySemesters = (semesters: Semester[] | undefined) => {
  let string = '';
  if (!semesters) return string;

  // sort chronologically
  const seasonsOrder = {
    'SPRING': 1,
    'SUMMER': 2,
    'FALL': 3
  }
  semesters.sort((a, b) => a.year - b.year || seasonsOrder[a.season] - seasonsOrder[b.season]);
  
  return semesters.map(displaySemester).join(', ');
}

// Returns a string for the given semester in the format "Spring 2025"
export const displaySemester = (semester: Semester) => {
  return capitalizeFirst(semester.season) + ' ' + semester.year;
}