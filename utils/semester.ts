import type { Semester } from "~/prisma/generated";
import { capitalizeFirst } from "~/utils";

const SEASON_ORDER: Record<Semester['season'], number> = {
  SPRING: 1,
  SUMMER: 2,
  FALL: 3,
};

// Sorts semesters in reverse chronological order
export const sortSemesters = <T extends Semester>(semesters: T[]) => (
  [...semesters].sort((a, b) => b.year - a.year || SEASON_ORDER[b.season] - SEASON_ORDER[a.season])
);

// Returns a string for the given semester in the format "Spring 2025"
export const displaySemester = (semester: Semester | null | undefined) => (
  semester ? `${capitalizeFirst(semester.season)} ${semester.year}` : ''
);

// Returns a string that is an ordered, comma-delimited list of semester display names
export const stringifySemesters = (semesters: Semester[] | undefined) => (
  semesters?.length ? sortSemesters(semesters).map(displaySemester).join(', ') : ''
);
