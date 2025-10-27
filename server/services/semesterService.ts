import type { Semester } from "@prisma/client";
import { capitalizeFirst } from "~/utils";

// Returns a string that is an ordered, comma-delimited list of semester display names
export const stringifySemesters = (semesters: Semester[] | undefined) => (
  semesters ? sortSemesters(semesters).map(displaySemester).join(', ') : ''
)

// Sorts semesters in reverse chronological order
export const sortSemesters = (semesters: Semester[]) => {
  const seasonsOrder = {
    'SPRING': 1,
    'SUMMER': 2,
    'FALL': 3
  }
  return semesters.sort((a, b) => b.year - a.year || seasonsOrder[b.season] - seasonsOrder[a.season]);
}

// Returns a string for the given semester in the format "Spring 2025"
export const displaySemester = (semester: Semester) => {
  return capitalizeFirst(semester.season) + ' ' + semester.year;
}