import {prisma} from "~/server/utils/db";

export interface ContactRead {
  id: string;
  partnerId: string;
  name: string;
  email: string;
}

export interface ContactCreate {
  partnerId: string;
  name: string;
  email: string;
}

export interface ContactUpdate {
  name?: string;
  email?: string;
}

const getAllContacts = async (): Promise<ContactRead[]> => {
  const contacts = await prisma.contact.findMany({
    orderBy: {createdAt: 'asc'},
  });
  return contacts;
}

const getContactById = async (id: string): Promise<ContactRead | null> => {
  const contact = await prisma.contact.findUnique({
    where: {id},
  })
  return contact;
}

const createContact = async (data: ContactCreate): Promise<ContactRead> => {
  const contact = await prisma.contact.create({
    data
  })
  return contact;
}

const updateContact = async (id: string, data: ContactUpdate): Promise<ContactRead> => {
  const contact = await prisma.contact.update({
    where: {id},
    data,
  });
  return contact;
}

const deleteContact = async (id: string): Promise<void> => {
  await prisma.contact.delete({where: {id}});
}

const contactService = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};

export default contactService;
