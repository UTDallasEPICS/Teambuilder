import type {ContactCreate, ContactRead} from "~/server/services/contactService";
import {prisma} from "~/server/utils/db";

export interface PartnerProjectRead {
  id: string;
  name: string;
  Teams: {id: string; semesterId: string}[];
}

export interface PartnerRead {
  id: string;
  name: string;
  Contacts: ContactRead[];
  Projects: PartnerProjectRead[];
}

export interface PartnerCreate {
  name: string;
  Contacts?: Omit<ContactCreate, 'partnerId'>[];
}

export interface PartnerUpdate {
  name?: string;
}

const PARTNER_INCLUDE = {
  Contacts: true,
  Projects: {include: {Teams: {select: {id: true, semesterId: true}}}},
} as const;

const getAllPartners = async (): Promise<PartnerRead[]> => {
  const partners = await prisma.partner.findMany({
    orderBy: {name: 'asc'},
    include: PARTNER_INCLUDE,
  });
  return partners;
}

const getPartnerById = async (id: string): Promise<PartnerRead | null> => {
  const partner = await prisma.partner.findUnique({
    where: {id},
    include: PARTNER_INCLUDE,
  })
  return partner;
}

const createPartner = async (data: PartnerCreate): Promise<PartnerRead> => {
  const {Contacts, ...rest} = data;
  const partner = await prisma.partner.create({
    data: {
      ...rest,
      Contacts: Contacts ? {create: Contacts} : undefined,
    },
    include: PARTNER_INCLUDE,
  })
  return partner;
}

const updatePartner = async (id: string, data: PartnerUpdate): Promise<PartnerRead> => {
  const partner = await prisma.partner.update({
    where: {id},
    data,
    include: PARTNER_INCLUDE,
  });
  return partner;
}

const deletePartner = async (id: string): Promise<void> => {
  await prisma.partner.delete({where: {id}});
}

const partnerService = {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
};

export default partnerService;
