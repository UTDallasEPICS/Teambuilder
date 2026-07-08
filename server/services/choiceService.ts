import {prisma} from "~/server/utils/db";

export interface ChoiceRead {
  id: string;
  rank: number;
  studentId: string;
  projectId: string;
  semesterId: string;
}

export interface ChoiceCreate {
  rank: number;
  studentId: string;
  projectId: string;
  semesterId: string;
}

export interface ChoiceUpdate {
  rank?: number;
  semesterId?: string;
}

const getAllChoices = async (): Promise<ChoiceRead[]> => {
  const choices = await prisma.choice.findMany({
    orderBy: {rank: 'asc'},
  });
  return choices;
}

const getChoiceById = async (id: string): Promise<ChoiceRead | null> => {
  const choice = await prisma.choice.findUnique({
    where: {id},
  })
  return choice;
}

const createChoice = async (data: ChoiceCreate): Promise<ChoiceRead> => {
  const choice = await prisma.choice.create({
    data
  })
  return choice;
}

const updateChoice = async (id: string, data: ChoiceUpdate): Promise<ChoiceRead> => {
  const choice = await prisma.choice.update({
    where: {id},
    data,
  });
  return choice;
}

const deleteChoice = async (id: string): Promise<void> => {
  await prisma.choice.delete({where: {id}});
}

const choiceService = {
  getAllChoices,
  getChoiceById,
  createChoice,
  updateChoice,
  deleteChoice,
};

export default choiceService;
