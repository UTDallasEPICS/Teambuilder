import type { Semester } from "@prisma/client";
import { capitalizeFirst } from "~/utils";

// Returns a string that is an ordered, comma-delimited list of semester display names
export const stringifySemesters = (semesters: Semester[] | undefined) => (
  semesters ? sortSemesters(semesters).map(displaySemester).join(', ') : ''
)

// Sorts semesters chronologically
export const sortSemesters = (semesters: Semester[]) => {
  const seasonsOrder = {
    'SPRING': 1,
    'SUMMER': 2,
    'FALL': 3
  }
  return semesters.sort((a, b) => a.year - b.year || seasonsOrder[a.season] - seasonsOrder[b.season]);
}

// Returns a string for the given semester in the format "Spring 2025"
export const displaySemester = (semester: Semester) => {
  return capitalizeFirst(semester.season) + ' ' + semester.year;
}