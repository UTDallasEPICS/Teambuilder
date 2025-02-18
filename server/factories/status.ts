import { Status } from "~/types"

export const createRandomStatus = (): Status => {
  const statuses: Status[] = ['new', 'returning', 'archived'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}