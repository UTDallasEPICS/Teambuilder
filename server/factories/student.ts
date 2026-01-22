// import { faker } from '@faker-js/faker';
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
  const majors = ['CE', 'CS', 'DS', 'SE', 'ME', 'BME', 'EE', 'Systems', 'Other'];
  return getRandomElement(majors);
}

const getRandomSeniority = () => {
  const years = ['FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR'];
  return getRandomElement(years);
}

// 20% chance for 3200, 80% chance for 2200
const getRandomClass = () => {
  const rand = faker.number.float({ min: 0, max: 1 });
  return rand < 0.2 ? '3200' : '2200';
}

const createRandomStatus = (): StudentStatus => {
  const statuses: StudentStatus[] = ['ACTIVE', 'INACTIVE'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}