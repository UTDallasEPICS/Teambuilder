import { faker } from '@faker-js/faker';
import { Student } from "~/types"
import { createRandomStatus } from './status';
import { getRandomElement } from './helpers';

export const createRandomStudent = (): Student => {
  return {
    id: faker.string.uuid(),
    netID: getRandomNetID(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    gitUserName: faker.internet.username(),
    discordUser: faker.internet.username(),
    major: getRandomMajor(),
    seniority: getRandomSeniority(),
    class: getRandomClass(),
    // not sure what enrollment is
    // enrollment: string,
    status: createRandomStatus()
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
  const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
  return getRandomElement(years);
}

const getRandomClass = () => {
  const classes = ['2200', '3200'];
  return getRandomElement(classes);
}