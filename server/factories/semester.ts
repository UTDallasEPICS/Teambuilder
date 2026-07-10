import type { Season, Semester } from "~/prisma/generated";

export const createSemesters = (): Semester[] => {
  const years = [2023, 2024, 2025, 2026];
  const seasons: Season[] = ['SPRING', 'SUMMER', 'FALL'];
  const now = new Date();

  return years.flatMap((year) => 
    seasons.map((season) => ({
      id: crypto.randomUUID(),
      year,
      season,
      createdAt: now,
      updatedAt: now
    }))
  )
}