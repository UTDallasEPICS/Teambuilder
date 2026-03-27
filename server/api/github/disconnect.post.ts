import { disconnectGitHub } from '~/server/services/githubService';

export default defineEventHandler(async () => {
  const result = await disconnectGitHub();
  return {
    success: result.success,
    message: result.message,
    timestamp: new Date().toISOString(),
  };
});
