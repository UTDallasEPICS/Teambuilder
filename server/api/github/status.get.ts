import { getGitHubStatus } from '~/server/services/githubService';

export default defineEventHandler(async () => {
  return {
    success: true,
    data: getGitHubStatus(),
    timestamp: new Date().toISOString(),
  };
});
