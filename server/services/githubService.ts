import { GitHubManager } from '../integrations/github/GithubManagement';

let manager: GitHubManager | null = null;
let githubStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
let githubError: string | null = null;
let githubUsername: string | null = null;
let connectedAt: Date | null = null;

export interface TeamRepoInput {
  projectName: string;
  githubUsernames: string[];
}

export interface TeamRepoResult {
  team: string;
  success: boolean;
  repoUrl?: string;
  created?: boolean;
  error?: string;
}

export function getGitHubStatus() {
  return {
    status: githubStatus,
    error: githubError,
    username: githubUsername,
    connectedAt: connectedAt?.toISOString() ?? null,
  };
}

export async function connectGitHub(): Promise<{ success: boolean; message: string; username?: string }> {
  if (manager && githubStatus === 'connected') {
    return {
      success: true,
      message: `Already connected as ${githubUsername}`,
      username: githubUsername ?? undefined,
    };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    const message = 'GITHUB_TOKEN is not defined in environment variables';
    githubStatus = 'disconnected';
    githubError = message;
    return { success: false, message };
  }

  try {
    manager = new GitHubManager();
    githubUsername = await manager.getAuthenticatedUsername();
    githubStatus = 'connected';
    githubError = null;
    connectedAt = new Date();
    return { success: true, message: `Connected as ${githubUsername}`, username: githubUsername };
  } catch (error) {
    githubStatus = 'error';
    githubError = error instanceof Error ? error.message : 'Unknown error';
    manager = null;
    githubUsername = null;
    connectedAt = null;
    return { success: false, message: `Failed to connect: ${githubError}` };
  }
}

export async function disconnectGitHub(): Promise<{ success: boolean; message: string }> {
  manager = null;
  githubStatus = 'disconnected';
  githubError = null;
  githubUsername = null;
  connectedAt = null;
  return { success: true, message: 'Disconnected from GitHub' };
}

function toRepoName(projectName: string): string {
  return projectName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

export async function createOrSyncTeamRepositories(
  teams: TeamRepoInput[]
): Promise<{ success: boolean; message: string; results: TeamRepoResult[] }> {
  if (!manager || githubStatus !== 'connected') {
    const connected = await connectGitHub();
    if (!connected.success || !manager) {
      return { success: false, message: connected.message, results: [] };
    }
  }

  const owner = githubUsername!;
  const results: TeamRepoResult[] = [];

  for (const team of teams) {
    const repoName = toRepoName(team.projectName);

    if (!repoName) {
      results.push({ team: team.projectName, success: false, error: 'Could not derive a valid repository name' });
      continue;
    }

    try {
      const exists = await manager!.repositoryExists(owner, repoName);

      if (!exists) {
        await manager!.createRepository(repoName, true);
      }

      const existingCollaborators = await manager!.listCollaborators(owner, repoName);
      const existingSet = new Set(existingCollaborators.map(c => c.toLowerCase()));
      const ownerLower = owner.toLowerCase();
      const desiredUsernames = team.githubUsernames.filter(Boolean);
      const desiredSet = new Set(desiredUsernames.map(u => u.toLowerCase()));

      for (const username of desiredUsernames) {
        if (!existingSet.has(username.toLowerCase())) {
          await manager!.addUserToRepository(owner, repoName, username);
        }
      }

      for (const existing of existingSet) {
        if (existing === ownerLower) continue;
        if (!desiredSet.has(existing)) {
          await manager!.removeUserFromRepository(owner, repoName, existing);
        }
      }

      results.push({
        team: team.projectName,
        success: true,
        created: !exists,
        repoUrl: `https://github.com/${owner}/${repoName}`,
      });
    } catch (error) {
      results.push({
        team: team.projectName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const failures = results.filter(r => !r.success).length;
  const successes = results.length - failures;

  return {
    success: failures === 0,
    message: `Processed ${results.length} repos: ${successes} succeeded, ${failures} failed`,
    results,
  };
}
