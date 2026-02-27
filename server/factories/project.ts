import { getRandomElement } from './helpers';
import type { Partner, Project, ProjectStatus } from '@prisma/client';

const PROJECT_NAMES = ['Smart Scheduler','Campus Navigator','Data Dashboard','Resource Tracker','Event Planner','Inventory Manager','Survey Tool','Alert System','Budget Analyzer','Lab Monitor'];
const DESCRIPTIONS = ['A tool to help manage and organize resources efficiently.','An application for tracking and visualizing key metrics.','A platform to streamline communication and collaboration.','A system to automate repetitive tasks and improve workflow.','A solution for monitoring and reporting on important data.'];

export const createRandomProject = (partnerId: string): Project => {
  const now = new Date();
  const name = getRandomElement(PROJECT_NAMES);

  return {
    id: crypto.randomUUID(),
    name,
    description: getRandomElement(DESCRIPTIONS),
    status: createRandomStatus(),
    repoURL: `https://github.com/epics/${name.toLowerCase().replace(/\s+/g, '-')}`,
    type: createRandomType(),
    createdAt: now,
    updatedAt: now,
    partnerId
  }
}

export const createRandomProjects = (length: number, partners: Partner[] = []): Project[] => {
  return Array.from({ length }, (_, i) => {
      return createRandomProject(partners[i % partners.length].id);
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