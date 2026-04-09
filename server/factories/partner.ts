import type { Partner } from "@prisma/client";

const COMPANY_NAMES = ['Acme Corp','Blue Horizon','Catalyst Labs','Delta Systems','Evergreen Tech','Frontier Solutions','Global Ventures','Horizon Group','Innovate Inc','Jade Technologies'];
const CONTACT_FIRST = ['Alice','Bob','Carol','David','Eva','Frank','Grace','Henry','Iris','James'];
const CONTACT_LAST = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Moore'];

export const createRandomPartner = (): Partner => {
  const now = new Date();
  const firstName = CONTACT_FIRST[Math.floor(Math.random() * CONTACT_FIRST.length)];
  const lastName = CONTACT_LAST[Math.floor(Math.random() * CONTACT_LAST.length)];
  const company = COMPANY_NAMES[Math.floor(Math.random() * COMPANY_NAMES.length)];

  return {
    id: crypto.randomUUID(),
    name: company,
    contactName: `${firstName} ${lastName}`,
    contactEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    createdAt: now,
    updatedAt: now
  }
}

export const createRandomPartners = (length: number): Partner[] => {
  return Array.from({ length }, () => createRandomPartner());
}