import type {ProjectMeetingDay} from "~/prisma/generated";
import type {MembershipCreate, MembershipRead} from "~/server/services/membershipService";
import type {SemesterRead} from "~/server/services/semesterService";
import {prisma} from "~/server/utils/db";

export interface TeamRead {
  id: string;
  projectId: string;
  semesterId: string;
  meetingDay: ProjectMeetingDay;
  Memberships: MembershipRead[];
  Semester: SemesterRead;
}

export interface TeamCreate {
  projectId: string;
  semesterId: string;
  meetingDay: ProjectMeetingDay;
  Memberships?: Omit<MembershipCreate, 'teamId'>[];
}

export interface TeamUpdate {
  semesterId?: string;
  meetingDay?: ProjectMeetingDay;
}

const getAllTeams = async (): Promise<TeamRead[]> => {
  const teams = await prisma.team.findMany({
    orderBy: {createdAt: 'asc'},
    include: {Memberships: true, Semester: true},
  });
  return teams;
}

const getTeamById = async (id: string): Promise<TeamRead | null> => {
  const team = await prisma.team.findUnique({
    where: {id},
    include: {Memberships: true, Semester: true},
  })
  return team;
}

const createTeam = async (data: TeamCreate): Promise<TeamRead> => {
  const {Memberships, ...rest} = data;
  const team = await prisma.team.create({
    data: {
      ...rest,
      Memberships: Memberships ? {create: Memberships} : undefined,
    },
    include: {Memberships: true, Semester: true},
  })
  return team;
}

const updateTeam = async (id: string, data: TeamUpdate): Promise<TeamRead> => {
  const team = await prisma.team.update({
    where: {id},
    data,
    include: {Memberships: true, Semester: true},
  });
  return team;
}

const deleteTeam = async (id: string): Promise<void> => {
  await prisma.team.delete({where: {id}});
}

const teamService = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};

export default teamService;
