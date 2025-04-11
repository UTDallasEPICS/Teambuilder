import type { Semester } from "@prisma/client";

export const capitalizeFirst = (string: string | null) => {
  if (!string) return null;
  return string[0].toUpperCase() + string.substring(1).toLowerCase();
}

// TODO: get these ordered
export const stringifySemesters = (semesters: Semester[] | undefined) => {
  let string = '';
  if (!semesters) return string;
  
  semesters.forEach(semester => {
    string += capitalizeFirst(semester.season);
    string += ' ';
    string += semester.year;
    string += ', ';
  })

  return string.slice(0, -2);
}