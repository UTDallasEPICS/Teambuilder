//typeScript wrapper for Google OR-Tools Python CP-SAT solver
import { spawn, execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { TeamAssignments } from '../F24/index';

const execFileAsync = promisify(execFile);

export type Student = {
  id: string;
  name: string;
  major: "CS" | "SE" | "EE" | "ME" | "BME" | "DS" | "CE" | "Systems" | "Other";
  seniority: "Freshman" | "Sophomore" | "Junior" | "Senior";
  choices: string[];
  choicesString: string;
  class: "2200" | "3200";
  previousProject?: string;
  skills?: string[];
  gender?: "Male" | "Female" | "Non-binary" | "Prefer not to say";
  day?: "Wednesday" | "Thursday";
};

export type Project = {
  id: string;
  name: string;
  type: "SW" | "HW" | "Both";
  requiredSkills?: string[];
  preferredMajors?: string[];
  day?: "Wednesday" | "Thursday";
};

export interface CPSATConfig {
  min_team_size?: number;
  max_team_size?: number;
  prioritize_returning_students?: boolean;
  prioritize_3200_first_choice?: boolean;
  prefer_major_diversity?: boolean;
  match_skills?: boolean;
  balance_gender?: boolean;
  prefer_2200_early_choices?: boolean;
}

export interface CPSATResult {
  success: boolean;
  teams?: { [projectName: string]: string[] };
  score?: number;
  solve_time?: number;
  status?: string;
  error?: string;
  deactivated_projects?: string[];
}

/**
 * Generate team assignments using Google OR-Tools CP-SAT solver via Python
 * 
 * @param students - Array of students to assign
 * @param projects - Array of projects to assign students to
 * @param config - Optional configuration
 * @returns Team assignments mapping project names to arrays of students
 */
export async function generateTeamsORTools(
  students: Student[],
  projects: Project[],
  config?: CPSATConfig
): Promise<TeamAssignments> {
  console.log('Starting OR-Tools CP-SAT team generation...');
  console.log(`Students: ${students.length}, Projects: ${projects.length}`);
  
  const startTime = Date.now();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  // Prepare input data
  const inputData = {
    students: students.map(s => ({
      id: s.id,
      name: s.name,
      major: s.major,
      seniority: s.seniority,
      choices: s.choices,
      class: s.class,
      previousProject: s.previousProject,
      skills: s.skills,
      gender: s.gender,
      day: s.day,
    })),
    projects: projects.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      requiredSkills: p.requiredSkills,
      preferredMajors: p.preferredMajors,
      day: p.day,
    })),
    config: config || {
      min_team_size: 4,
      max_team_size: 6,
      prioritize_returning_students: true,
      prioritize_3200_first_choice: true,
      prefer_major_diversity: true,
      match_skills: true,
      balance_gender: true,
      prefer_2200_early_choices: true,
    },
  };
  
  const inputJson = JSON.stringify(inputData);
  
  return new Promise((resolve, reject) => {
    // Spawn Python process
    const pythonProcess = spawn('python', ['team_generator.py'], {
      cwd: __dirname,
    });
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('error', (error: Error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
    
    pythonProcess.on('close', (code: number | null) => {
      if (code !== 0) {
        console.error('Python stderr:', stderr);
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }
      
      try {
        // Parse result
        const result: CPSATResult = JSON.parse(stdout);
        
        if (!result.success) {
          reject(new Error(result.error || 'Failed to generate teams'));
          return;
        }
        
        console.log(`\nSolution found in ${result.solve_time?.toFixed(3)}s`);
        console.log(`Status: ${result.status}`);
        console.log(`Score: ${result.score}`);
        if (result.deactivated_projects && result.deactivated_projects.length > 0) {
          console.log(`Deactivated Projects (${result.deactivated_projects.length}): ${result.deactivated_projects.join(', ')}`);
        }
        
        // Convert student IDs back to student objects
        const teamAssignments: TeamAssignments = {};
        const studentMap = new Map(students.map(s => [s.id, s]));
        
        for (const [projectName, studentIds] of Object.entries(result.teams!)) {
          teamAssignments[projectName] = studentIds
            .map(id => studentMap.get(id))
            .filter((s): s is Student => s !== undefined);
        }
        
        const endTime = Date.now();
        console.log(`Total execution time: ${endTime - startTime}ms\n`);
        
        resolve(teamAssignments);
      } catch (error: any) {
        reject(new Error(`Failed to parse Python output: ${error.message}\nOutput: ${stdout}`));
      }
    });
    
    // Write input to stdin
    pythonProcess.stdin.write(inputJson);
    pythonProcess.stdin.end();
  });
}

/**
 * Backward compatibility export - uses OR-Tools
 */
export const generateTeamsCSP = generateTeamsORTools;
