//import { Octokit } from "@octokit/rest";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";

dotenv.config();

class GitHubManager {
  private octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GitHub token not found. Please add it to the .env file.");
    }
    this.octokit = new Octokit({ auth: token });
  }

  // get authenticated user's username
  async getAuthenticatedUsername(): Promise<string> {
    try {
      const response = await this.octokit.users.getAuthenticated();
      return response.data.login;
    } catch (error) {
      console.error("Error fetching authenticated username:", error);
      throw error;
    }
  }

  // Check if a repository exists
  async repositoryExists(owner: string, repoName: string): Promise<boolean> {
    try {
      await this.octokit.repos.get({
        owner,
        repo: repoName,
      });
      return true;
    } catch (error: any) {
      if (error.status === 404) {
        return false;
      } else {
        console.error("Error checking repository existence:", error);
        throw error;
      }
    }
  }

  // Create a new repository
  async createRepository(repoName: string, isPrivate: boolean = true): Promise<void> {
    try {
      const response = await this.octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: isPrivate,
      });
      console.log(`Repository created: ${response.data.html_url}`);
    } catch (error) {
      console.error("Error creating repository:", error);
    }
  }

  // Add a collaborator to a repository
  async addUserToRepository(owner: string, repoName: string, username: string): Promise<void> {
    try {
      await this.octokit.repos.addCollaborator({
        owner,
        repo: repoName,
        username,
        permission: "push", // Default to pull/push access
      });
      console.log(`User ${username} added to ${owner}/${repoName} with push permission.`);
    } catch (error) {
      console.error(`Error adding user ${username} to repository:`, error);
    }
  }

  // Remove a collaborator from a repository
  async removeUserFromRepository(owner: string, repoName: string, username: string): Promise<void> {
    try {
      await this.octokit.repos.removeCollaborator({
        owner,
        repo: repoName,
        username,
      });
      console.log(`User ${username} removed from ${owner}/${repoName}.`);
    } catch (error) {
      console.error(`Error removing user ${username} from repository:`, error);
    }
  }

  // List collaborators of a repository
  async listCollaborators(owner: string, repoName: string): Promise<string[]> {
    try {
      const response = await this.octokit.repos.listCollaborators({
        owner,
        repo: repoName,
      });
      return response.data.map((collaborator) => collaborator.login);
    } catch (error) {
      console.error("Error listing collaborators:", error);
      throw error;
    }
  }
}

// Helper function to prompt for file path
const promptFilePath = async (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

// Main Function
(async () => {
  const manager = new GitHubManager();
  const username = await manager.getAuthenticatedUsername();

  console.log(`Authenticated as: ${username}`);

  const filePath = await promptFilePath("Enter the JSON file path: ");

  // Read and parse the JSON file
  let teamData;
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    teamData = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return;
  }

  const { teamName, collaborators } = teamData;

  if (!teamName || !Array.isArray(collaborators)) {
    console.error("Invalid JSON format. Please provide 'teamName' and 'collaborators' array.");
    return;
  }

  const repoExists = await manager.repositoryExists(username, teamName);

  if (repoExists) {
    console.log(`Repository '${teamName}' exists. Updating collaborators...`);

    // Get current collaborators
    const currentCollaborators = await manager.listCollaborators(username, teamName);

    // Normalize usernames to lowercase for case-insensitive comparison
    const normalizedCurrentCollaborators = currentCollaborators.map((collab) => collab.toLowerCase());
    const normalizedCollaborators = collaborators.map((collab: string) => collab.toLowerCase());
    const normalizedUsername = username.toLowerCase();

    // Determine collaborators to add and remove
    const collaboratorsToAdd = normalizedCollaborators.filter(
      (collab) => !normalizedCurrentCollaborators.includes(collab)
    );
    const collaboratorsToRemove = normalizedCurrentCollaborators.filter(
      (collab) => !normalizedCollaborators.includes(collab) && collab !== normalizedUsername // Do not remove the repo owner
    );

    // Add new collaborators
    for (const collab of collaboratorsToAdd) {
      await manager.addUserToRepository(username, teamName, collab);
    }

    // Remove collaborators not in the JSON file
    for (const collab of collaboratorsToRemove) {
      await manager.removeUserFromRepository(username, teamName, collab);
    }

    console.log("Collaborators updated.");

  } else {
    console.log(`Repository '${teamName}' does not exist. Creating repository and adding collaborators...`);
    await manager.createRepository(teamName, true);

    // Add collaborators
    for (const collab of collaborators) {
      await manager.addUserToRepository(username, teamName, collab);
    }

    console.log("Repository created and collaborators added.");
  }

  console.log("Program completed.");
})();