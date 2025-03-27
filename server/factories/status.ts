import { Status } from "@prisma/client";

export const createRandomStatus = (): Status => {
  const statuses: Status[] = ['NEW', 'RETURNING', 'ARCHIVED'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}