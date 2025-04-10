import { faker } from '@faker-js/faker';
import { getRandomElement } from './helpers';
import type { Partner, Project, ProjectStatus } from '@prisma/client';

export const createRandomProject = (partnerId: string): Project => {
  const now = new Date();

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    status: createRandomStatus(),
    repoURL: faker.internet.url(),
    type: createRandomType(),
    createdAt: now,
    updatedAt: now,
    partnerId
  }
}

export const createRandomProjects = (length: number, partners: Partner[] = []): Project[] => {
  return Array.from({ length }, () => {
      const randomPartnerId = getRandomElement(partners.map((partner) => partner.id))
      return createRandomProject(randomPartnerId);
    }
  );
}

const createRandomType  = () => {
  const types = ['SOFTWARE', 'HARDWARE', 'BOTH'];
  return getRandomElement(types);
}

const createRandomStatus = (): ProjectStatus => {
  const statuses: ProjectStatus[] = ['NEW', 'RETURNING', 'WITHDRAWN', 'HOLD', 'COMPLETE'];
  return getRandomElement(statuses);
}