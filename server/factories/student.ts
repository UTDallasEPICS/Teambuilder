import { getRandomElement } from './helpers';
import type { Student, StudentStatus } from '@prisma/client';

const FIRST_NAMES = ['Alex','Jordan','Taylor','Morgan','Casey','Drew','Riley','Avery','Quinn','Peyton','Blake','Reese','Skyler','Cameron','Logan'];
const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Moore','Anderson','Thomas','Jackson','White','Harris'];

const randomAlpha = (length: number) =>
  Array.from({ length }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');

const randomNumeric = (length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

export const createRandomStudent = (): Student => {
  const now = new Date();
  const firstName = getRandomElement(FIRST_NAMES);
  const lastName = getRandomElement(LAST_NAMES);

  return {
    id: crypto.randomUUID(),
    netID: getRandomNetID(),
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    github: `${firstName.toLowerCase()}${randomNumeric(4)}`,
    discord: `${firstName.toLowerCase()}_${randomNumeric(4)}`,
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
  const initials = randomAlpha(3);
  const numbers = randomNumeric(6);
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
  return Math.random() < 0.2 ? '3200' : '2200';
}

const createRandomStatus = (): StudentStatus => {
  const statuses: StudentStatus[] = ['ACTIVE', 'INACTIVE'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}