import { connectGitHub } from '~/server/services/githubService';

export default defineEventHandler(async () => {
  const result = await connectGitHub();
  return {
    success: result.success,
    message: result.message,
    username: result.username,
    timestamp: new Date().toISOString(),
  };
});
