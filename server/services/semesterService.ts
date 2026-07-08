import type {Season} from "~/prisma/generated";
import {prisma} from "~/server/utils/db";

export interface SemesterRead {
  id: string;
  year: number;
  season: Season;
}

export interface SemesterCreate {
  year: number;
  season: Season;
}

export interface SemesterUpdate {
  year?: number;
  season?: Season;
}

const getAllSemesters = async (): Promise<SemesterRead[]> => {
  const semesters = await prisma.semester.findMany({
    orderBy: [
      {year: 'desc'},
      {season: 'desc'},
    ],
  });
  return semesters;
}

const getSemesterById = async (id: string): Promise<SemesterRead | null> => {
  const semester = await prisma.semester.findUnique({
    where: { id: id },
  })
  return semester;
}

const createSemester = async (data: SemesterCreate): Promise<SemesterRead> => {
  const semester = await prisma.semester.create({
    data
  })
  return semester;
}

const updateSemester = async (id: string, data: SemesterUpdate): Promise<SemesterRead> => {
  const semester = await prisma.semester.update({
    where: { id },
    data,
  });
  return semester;
}

const deleteSemester = async (id: string) : Promise<void> => {
  await prisma.semester.delete({ where: { id } });
}

const semesterService = {
  getAllSemesters,
  getSemesterById,
  createSemester,
  updateSemester,
  deleteSemester,
};

export default semesterService;