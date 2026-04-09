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
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumeric(3)}@example.com`,
    github: `${firstName.toLowerCase()}${randomNumeric(4)}`,
    discord: `${firstName.toLowerCase()}_${randomNumeric(4)}`,
    major: getRandomMajor(),
    year: getRandomSeniority(),
    class: getRandomClass(),
    meetingDay: getRandomMeetingDay(),
    // not sure what enrollment is
    enrollment: '',
    status: createRandomStatus(),
    createdAt: now,
    updatedAt: now
  }
}

export const createRandomStudents = (numStudents: number): Student[] => {
  const arr: Student[] = [];
  const usedNetIDs = new Set<string>();
  const usedEmails = new Set<string>();
  const usedGithubs = new Set<string>();
  const usedDiscords = new Set<string>();

  for (let i = 0; i < numStudents; i++) {
    let student = createRandomStudent();
    // Ensure deterministic uniqueness for fields with DB unique constraints.
    while (
      usedNetIDs.has(student.netID) ||
      (student.email !== null && usedEmails.has(student.email)) ||
      (student.github !== null && usedGithubs.has(student.github)) ||
      (student.discord !== null && usedDiscords.has(student.discord))
    ) {
      student = createRandomStudent();
    }

    usedNetIDs.add(student.netID);
    if (student.email) usedEmails.add(student.email);
    if (student.github) usedGithubs.add(student.github);
    if (student.discord) usedDiscords.add(student.discord);
    arr.push(student);
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

const getRandomMeetingDay = (): Student['meetingDay'] => (
  Math.random() < 0.5 ? 'WEDNESDAY' : 'THURSDAY'
)