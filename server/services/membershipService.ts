import {prisma} from "~/server/utils/db";

export interface MembershipRead {
  id: string;
  teamId: string;
  studentId: string;
}

export interface MembershipCreate {
  teamId: string;
  studentId: string;
}

const getAllMemberships = async (): Promise<MembershipRead[]> => {
  const memberships = await prisma.membership.findMany({
    orderBy: {createdAt: 'asc'},
  });
  return memberships;
}

const getMembershipById = async (id: string): Promise<MembershipRead | null> => {
  const membership = await prisma.membership.findUnique({
    where: {id},
  })
  return membership;
}

const createMembership = async (data: MembershipCreate): Promise<MembershipRead> => {
  const membership = await prisma.membership.create({
    data
  })
  return membership;
}

const deleteMembership = async (id: string): Promise<void> => {
  await prisma.membership.delete({where: {id}});
}

const membershipService = {
  getAllMemberships,
  getMembershipById,
  createMembership,
  deleteMembership,
};

export default membershipService;
