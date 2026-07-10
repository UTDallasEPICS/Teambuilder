import type {EnrollmentCreate, EnrollmentRead} from "~/server/services/enrollmentService";
import type {MembershipCreate, MembershipRead} from "~/server/services/membershipService";
import type {ChoiceCreate, ChoiceRead} from "~/server/services/choiceService";
import {prisma} from "~/server/utils/db";

export interface StudentRead {
  id: string;
  github: string | null;
  discord: string | null;
  email: string | null;
  netID: string;
  firstName: string;
  lastName: string;
  Enrollments: EnrollmentRead[];
  Memberships: MembershipRead[];
  Choices: ChoiceRead[];
}

export interface StudentCreate {
  github?: string;
  discord?: string;
  email?: string;
  netID: string;
  firstName: string;
  lastName: string;
  Enrollments?: Omit<EnrollmentCreate, 'studentId'>[];
  Memberships?: Omit<MembershipCreate, 'studentId'>[];
  Choices?: Omit<ChoiceCreate, 'studentId'>[];
}

export interface StudentUpdate {
  github?: string;
  discord?: string;
  email?: string;
  netID?: string;
  firstName?: string;
  lastName?: string;
}

const getAllStudents = async (): Promise<StudentRead[]> => {
  const students = await prisma.student.findMany({
    orderBy: [
      {lastName: 'asc'},
      {firstName: 'asc'},
    ],
    include: {Enrollments: true, Memberships: true, Choices: true},
  });
  return students;
}

const getStudentById = async (id: string): Promise<StudentRead | null> => {
  const student = await prisma.student.findUnique({
    where: {id},
    include: {Enrollments: true, Memberships: true, Choices: true},
  })
  return student;
}

const createStudent = async (data: StudentCreate): Promise<StudentRead> => {
  const {Enrollments, Memberships, Choices, ...rest} = data;
  const student = await prisma.student.create({
    data: {
      ...rest,
      Enrollments: Enrollments ? {create: Enrollments} : undefined,
      Memberships: Memberships ? {create: Memberships} : undefined,
      Choices: Choices ? {create: Choices} : undefined,
    },
    include: {Enrollments: true, Memberships: true, Choices: true},
  })
  return student;
}

const updateStudent = async (id: string, data: StudentUpdate): Promise<StudentRead> => {
  const student = await prisma.student.update({
    where: {id},
    data,
    include: {Enrollments: true, Memberships: true, Choices: true},
  });
  return student;
}

const deleteStudent = async (id: string): Promise<void> => {
  await prisma.student.delete({where: {id}});
}

const studentService = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

export default studentService;
