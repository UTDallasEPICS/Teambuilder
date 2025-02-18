import { faker } from '@faker-js/faker';
import { Project } from "~/types";
import { createRandomStatus } from './status';
import { getRandomElement } from './helpers';

export const createRandomProject = (): Project => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    targetCS: faker.number.int({ min: 0, max: 5 }),
    status: createRandomStatus(),
    semester: createRandomSemester(),
    repoURL: faker.internet.url(),
    type: createRandomType()
  }
}

export const createRandomProjects = (numProjects: number): Project[] => {
  const arr = [];
  for (let i = 0; i < numProjects; i++) {
    arr.push(createRandomProject())
  }
  return arr;
}

const createRandomSemester = () => {
  const semesters = ['S2023', 'F2023', 'S2024', 'F2024', 'S2025'];
  return getRandomElement(semesters);
}

const createRandomType  = () => {
  const types = ['software', 'hardware', 'both'];
  return getRandomElement(types);
}