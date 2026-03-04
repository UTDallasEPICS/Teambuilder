import type { Season, Semester } from "@prisma/client";

export const createSemesters = (): Semester[] => {
  const years = [2023, 2024];
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