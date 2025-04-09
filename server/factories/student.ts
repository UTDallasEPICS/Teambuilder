import { faker } from '@faker-js/faker';
import { getRandomElement } from './helpers';
import type { Student, StudentStatus } from '@prisma/client';

export const createRandomStudent = (): Student => {
  const now = new Date();

  return {
    id: faker.string.uuid(),
    netID: getRandomNetID(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    github: faker.internet.username(),
    discord: faker.internet.username(),
    major: getRandomMajor(),
    year: getRandomSeniority(),
    class: getRandomClass(),
    // not sure what enrollment is
    enrollment: '',
    status: createRandomStatus(),
    createdAt: now,
    updatedAt: now
  }
}

export const createRandomStudents = (numStudents: number): Student[] => {
  const arr = [];
  for (let i = 0; i < numStudents; i++) {
    arr.push(createRandomStudent())
  }
  return arr;
}

const getRandomNetID = () => {
  const initials = faker.string.alpha({ length: 3, casing: 'lower' });
  const numbers = faker.string.numeric(6);
  return initials + numbers;
}

const getRandomMajor = () => {
  const majors = ['CE', 'CS', 'DS', 'SE', 'ME', 'BME', 'EE'];
  return getRandomElement(majors);
}

const getRandomSeniority = () => {
  const years = ['FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR'];
  return getRandomElement(years);
}

const getRandomClass = () => {
  const classes = ['2200', '3200'];
  return getRandomElement(classes);
}

const createRandomStatus = (): StudentStatus => {
  const statuses: StudentStatus[] = ['ACTIVE', 'INACTIVE'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}