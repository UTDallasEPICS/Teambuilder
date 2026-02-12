// This file is a TypeScript interface around the Python file
// where the CP-SAT algorithm is written

// TypeScript wrapper for Python CP-SAT team assignment solver
// Handles process spawning, data serialization, and result processing

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type {
  Student,
  Project,
  AlgorithmConfig,
  TeamAssignments,
  AlgorithmResult,
  OptimizationMode,
} from './types';
import {
  STUDENT_FIRST_CONFIG,
  PROJECT_FIRST_CONFIG,
  BALANCED_CONFIG,
  FAIR_DISTRIBUTION_CONFIG,
  getPresetConfig,
} from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Result structure from Python solver (before processing)
 */
interface PythonSolverResult {
  success: boolean;
  teams?: { [projectName: string]: string[] }; // Maps to student IDs
  score?: number;
  solveTime?: number;
  status?: string;
  error?: string;
  deactivatedProjects?: string[];
}

/**
 * Generate team assignments using OR-Tools CP-SAT solver
 * 
 * @param students - Array of students to assign
 * @param projects - Array of projects to assign students to
 * @param config - Optional configuration (defaults to student-first mode)
 * @returns Team assignments mapping project names to arrays of students
 */
export async function generateTeams(
  students: Student[],
  projects: Project[],
  config?: AlgorithmConfig
): Promise<TeamAssignments> {
  console.log('Starting OR-Tools CP-SAT team generation...');
  console.log(`Students: ${students.length}, Projects: ${projects.length}`);
  
  const startTime = Date.now();
  
  // Use provided config or default to student-first
  const finalConfig = config || STUDENT_FIRST_CONFIG;
  
  // Prepare input data for Python solver
  const inputData = {
    students: students.map(s => ({
      id: s.id,
      name: s.name,
      major: s.major,
      classLevel: s.classLevel,
      seniority: s.seniority,
      preferences: s.preferences,
      skills: s.skills || [],
      gender: s.gender,
      availableDay: s.availableDay,
      returningToProject: s.returningToProject,
    })),
    projects: projects.map(p => ({
      id: p.id,
      name: p.name,
      projectType: p.projectType,
      meetingDay: p.meetingDay,
      requiredSkills: p.requiredSkills || [],
      preferredMajors: p.preferredMajors || [],
      majorRequirements: p.majorRequirements || {},
    })),
    config: finalConfig,
  };
  
  const inputJson = JSON.stringify(inputData);
  
  return new Promise((resolve, reject) => {
    // Spawn Python process
    const pythonProcess = spawn('python3', ['team-generator.py'], {
      cwd: __dirname,
    });
    
    let stdout = '';
    let stderr = '';
    
    // Collect stdout (will contain JSON result)
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    // Collect stderr (for error messages and debug output)
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Handle process errors
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python stderr:', stderr);
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }
      
      try {
        // Find the JSON result in stdout (last line should be the JSON)
        const lines = stdout.trim().split('\n');
        const jsonLine = lines[lines.length - 1];
        const result: PythonSolverResult = JSON.parse(jsonLine);
        
        if (!result.success) {
          reject(new Error(result.error || 'Failed to generate teams'));
          return;
        }
        
        console.log(`\n✓ Solution found in ${result.solveTime?.toFixed(3)}s`);
        console.log(`  Status: ${result.status}`);
        console.log(`  Score: ${result.score}`);
        
        if (result.deactivatedProjects && result.deactivatedProjects.length > 0) {
          console.log(`  Deactivated Projects (${result.deactivatedProjects.length}): ${result.deactivatedProjects.join(', ')}`);
        }
        
        // Convert student IDs back to full student objects
        const teamAssignments: TeamAssignments = {};
        const studentMap = new Map(students.map(s => [s.id, s]));
        
        for (const [projectName, studentIds] of Object.entries(result.teams!)) {
          teamAssignments[projectName] = studentIds
            .map(id => studentMap.get(id))
            .filter((s): s is Student => s !== undefined);
        }
        
        const endTime = Date.now();
        console.log(`  Total execution time: ${endTime - startTime}ms\n`);
        
        resolve(teamAssignments);
      } catch (error: any) {
        reject(new Error(`Failed to parse Python output: ${error.message}\nOutput: ${stdout}`));
      }
    });
    
    // Write input data to Python process stdin
    pythonProcess.stdin.write(inputJson);
    pythonProcess.stdin.end();
  });
}

/**
 * Generate team assignments with a specific optimization mode preset
 * 
 * @param students - Array of students to assign
 * @param projects - Array of projects to assign students to
 * @param mode - Optimization mode preset to use
 * @returns Team assignments
 */
export async function generateTeamsWithMode(
  students: Student[],
  projects: Project[],
  mode: OptimizationMode = 'student-first'
): Promise<TeamAssignments> {
  const config = getPresetConfig(mode);
  console.log(`Using optimization mode: ${mode}`);
  return generateTeams(students, projects, config);
}

/**
 * Generate team assignments and return full result with statistics
 * 
 * @param students - Array of students to assign
 * @param projects - Array of projects to assign students to
 * @param config - Optional configuration
 * @returns Full algorithm result with statistics
 */
export async function generateTeamsWithStats(
  students: Student[],
  projects: Project[],
  config?: AlgorithmConfig
): Promise<AlgorithmResult> {
  try {
    const teamAssignments = await generateTeams(students, projects, config);
    
    // Calculate statistics
    const statistics = calculateStatistics(teamAssignments, students, projects);
    
    // Validate constraints
    const violations = validateConstraints(teamAssignments, students, projects, config || STUDENT_FIRST_CONFIG);
    
    return {
      success: true,
      teamAssignments,
      statistics,
      constraintViolations: violations.length > 0 ? violations : undefined,
      status: 'optimal',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      status: 'infeasible',
    };
  }
}

/**
 * Calculate statistics about the team assignments
 */
function calculateStatistics(
  teamAssignments: TeamAssignments,
  allStudents: Student[],
  allProjects: Project[]
) {
  let firstChoice = 0, secondChoice = 0, thirdChoice = 0;
  let fourthChoice = 0, fifthChoice = 0, sixthChoice = 0, noMatch = 0;
  let upperFirstChoice = 0, upperTop3 = 0, totalUpper = 0;
  let lowerFirstChoice = 0, lowerTop3 = 0, totalLower = 0;
  let majorTypeMatches = 0, totalStudents = 0;
  
  const teamSizes: number[] = [];
  const softwareMajors = ['Computer Science', 'Software Engineering', 'Data Science'];
  const hardwareMajors = [
    'Electrical Engineering', 'Mechanical Engineering', 
    'Biomedical Engineering', 'Computer Engineering', 'Systems Engineering'
  ];
  
  // Count gender isolation
  let teamsWithIsolation = 0;
  
  for (const [projectName, team] of Object.entries(teamAssignments)) {
    teamSizes.push(team.length);
    
    // Find the project object
    const project = allProjects.find(p => p.name === projectName);
    
    // Check gender isolation
    const maleCount = team.filter(s => s.gender === 'Male').length;
    const femaleCount = team.filter(s => s.gender === 'Female').length;
    if ((maleCount === 1 && femaleCount > 1) || (femaleCount === 1 && maleCount > 1)) {
      teamsWithIsolation++;
    }
    
    for (const student of team) {
      const prefIndex = student.preferences.indexOf(projectName);
      
      // Count preference satisfaction
      if (prefIndex === 0) firstChoice++;
      else if (prefIndex === 1) secondChoice++;
      else if (prefIndex === 2) thirdChoice++;
      else if (prefIndex === 3) fourthChoice++;
      else if (prefIndex === 4) fifthChoice++;
      else if (prefIndex === 5) sixthChoice++;
      else noMatch++;
      
      // Check major type matching
      if (project) {
        totalStudents++;
        const isSWStudent = softwareMajors.includes(student.major);
        const isHWStudent = hardwareMajors.includes(student.major);
        const isSWProject = project.projectType === 'Software';
        const isHWProject = project.projectType === 'Hardware';
        const isBothProject = project.projectType === 'Both';
        
        if ((isSWStudent && (isSWProject || isBothProject)) || 
            (isHWStudent && (isHWProject || isBothProject))) {
          majorTypeMatches++;
        }
      }
      
      // Track by class level
      if (student.classLevel === '3200') {
        totalUpper++;
        if (prefIndex === 0) upperFirstChoice++;
        if (prefIndex >= 0 && prefIndex <= 2) upperTop3++;
      } else {
        totalLower++;
        if (prefIndex === 0) lowerFirstChoice++;
        if (prefIndex >= 0 && prefIndex <= 2) lowerTop3++;
      }
    }
  }
  
  // Count returning students
  const returningStudents = allStudents.filter(s => s.returningToProject);
  const returningMatched = returningStudents.filter(s => {
    for (const [projectName, team] of Object.entries(teamAssignments)) {
      if (team.some(t => t.id === s.id) && projectName === s.returningToProject) {
        return true;
      }
    }
    return false;
  });
  
  return {
    totalStudents: allStudents.length,
    firstChoiceCount: firstChoice,
    secondChoiceCount: secondChoice,
    thirdChoiceCount: thirdChoice,
    fourthChoiceCount: fourthChoice,
    fifthChoiceCount: fifthChoice,
    sixthChoiceCount: sixthChoice,
    noMatchCount: noMatch,
    upper3200FirstChoice: upperFirstChoice,
    upper3200Top3: upperTop3,
    totalUpper3200: totalUpper,
    lower2200FirstChoice: lowerFirstChoice,
    lower2200Top3: lowerTop3,
    totalLower2200: totalLower,
    averageTeamSize: teamSizes.reduce((a, b) => a + b, 0) / teamSizes.length,
    minTeamSize: Math.min(...teamSizes),
    maxTeamSize: Math.max(...teamSizes),
    majorTypeMatches,
    totalStudentsInTeams: totalStudents,
    returningStudentsMatched: returningMatched.length,
    totalReturningStudents: returningStudents.length,
    teamsWithGenderIsolation: teamsWithIsolation,
    totalActiveTeams: Object.keys(teamAssignments).length,
  };
}

/**
 * Validate that all constraints are satisfied
 */
function validateConstraints(
  teamAssignments: TeamAssignments,
  allStudents: Student[],
  allProjects: Project[],
  config: AlgorithmConfig
): string[] {
  const violations: string[] = [];
  
  // Check: all students assigned
  const assignedCount = Object.values(teamAssignments).flat().length;
  if (assignedCount !== allStudents.length) {
    violations.push(`Not all students assigned: ${assignedCount}/${allStudents.length}`);
  }
  
  // Check: no student assigned twice
  const assignedIds = new Set<string>();
  for (const team of Object.values(teamAssignments)) {
    for (const student of team) {
      if (assignedIds.has(student.id)) {
        violations.push(`Student ${student.name} assigned to multiple teams`);
      }
      assignedIds.add(student.id);
    }
  }
  
  // Check: team size constraints
  for (const [projectName, team] of Object.entries(teamAssignments)) {
    // Empty teams (deactivated) are valid
    if (team.length === 0) continue;
    
    if (team.length < config.teamSizeMin) {
      violations.push(`Team "${projectName}" too small (${team.length} < ${config.teamSizeMin})`);
    }
    if (team.length > config.teamSizeHardMax) {
      violations.push(`Team "${projectName}" too large (${team.length} > ${config.teamSizeHardMax})`);
    }
    
    // Check: day matching
    const project = allProjects.find(p => p.name === projectName);
    if (project?.meetingDay) {
      for (const student of team) {
        if (student.availableDay && student.availableDay !== project.meetingDay) {
          violations.push(
            `Student ${student.name} (${student.availableDay}) assigned to "${projectName}" (${project.meetingDay})`
          );
        }
      }
    }
  }
  
  return violations;
}

// Export preset configs for easy access
export {
  STUDENT_FIRST_CONFIG,
  PROJECT_FIRST_CONFIG,
  BALANCED_CONFIG,
  FAIR_DISTRIBUTION_CONFIG,
  getPresetConfig,
};