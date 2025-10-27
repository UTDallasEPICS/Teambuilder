import { faker } from "@faker-js/faker";
import type { Partner } from "@prisma/client";

export const createRandomPartner = (): Partner => {
  const now = new Date();

  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    contactName: faker.person.fullName(),
    contactEmail: faker.internet.email(),
    createdAt: now,
    updatedAt: now
  }
}

export const createRandomPartners = (length: number): Partner[] => {
  return Array.from({ length }, () => createRandomPartner());
}