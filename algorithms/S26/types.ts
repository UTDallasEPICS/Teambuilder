// This file holds all data structures with information about
// UTD majors and configuration presets for team optimization

// Most commonly requested majors
export type Major =
  | "Biomedical Engineering"
  | "Computer Engineering"
  | "Computer Science"
  | "Data Science"
  | "Electrical Engineering"
  | "Mechanical Engineering"
  | "Software Engineering"
  | "Systems Engineering"
  | "Other";

// Software-oriented majors (for project matching logic)
export const SOFTWARE_MAJORS: Major[] = [
  "Computer Science",
  "Software Engineering",
  "Data Science",
];

// Hardware-oriented majors (for project matching logic)

export const HARDWARE_MAJORS: Major[] = [
  "Electrical Engineering",
  "Mechanical Engineering",
  "Biomedical Engineering",
  "Computer Engineering",
  "Systems Engineering",
];

// Student structure, different from main database schema)
export interface Student {
  // Unique identifier 
  id: string;
  
  // Full name 
  name: string;
  
  // Student's major 
  major: Major;
  
  // Course level: 2200 (lower division) or 3200 (upper division) 
  classLevel: "2200" | "3200";
  
  // Academic classification 
  seniority: "Freshman" | "Sophomore" | "Junior" | "Senior";
  
  // Array of project names ranked by preference (1st to 6th choice) 
  preferences: string[];
  
  // Array of student's skills 
  skills?: string[];
  
  // Gender (limited options per client request) 
  gender?: "Male" | "Female";
  
  // Day student is available for project meetings 
  availableDay?: "Wednesday" | "Thursday";
  
  // Project name student is returning to (only for 3200 students) 
  returningToProject?: string;
  
  // FUTURE FEATURE: Personal statements for top choices
  // projectFitScores?: { [projectName: string]: number }; // 1-5 rating
}

// Project structure for the algorithm
 
export interface Project {
  // Unique identifier 
  id: string;
  
  // Project name 
  name: string;
  
  // Type of project work 
  projectType: "Software" | "Hardware" | "Both";
  
  // Day project team meets 
  meetingDay?: "Wednesday" | "Thursday";
  
  // Array of required skills for the project 
  requiredSkills?: string[];
  
  // Array of preferred majors (for soft matching) 
  preferredMajors?: Major[];
  
  // Hard requirements for major counts
  majorRequirements?: { [major: string]: number };
}

// Configurations below

// Optimization mode determines which preset weights to use
 
export type OptimizationMode =
  | "student-first"      // Maximize student preference satisfaction (DEFAULT)
  | "project-first"      // Prioritize project skill/major needs
  | "balanced"           // Compromise between student and project
  | "fair-distribution"; // Minimize variance in outcomes

// Weight configuration for objective function scoring
 
export interface ScoringWeights {
  // Student preference weights
  upper3200FirstChoice: number;
  upper3200SecondChoice: number;
  upper3200ThirdChoice: number;
  lower2200FirstChoice: number;
  lower2200SecondChoice: number;
  lower2200ThirdChoice: number;
  lower2200FourthToSixth: number; // Negative penalty
  
  // Special bonuses/penalties
  returningStudentBonus: number;
  skillMatchBonus: number;
  majorMatchBonus: number;
  genderIsolationPenalty: number; // Negative penalty
  
  // Team size penalties
  teamSizeLightPenalty: number;  // For 7th student (negative)
  teamSizeHeavyPenalty: number;  // For 8th+ students (negative)
  
  // Project management
  projectActivationBonus: number;
}

// Complete configuration for team assignment algorithm
 
export interface AlgorithmConfig {
  // Team size constraints
  teamSizeMin: number;        // Minimum team size (default: 4)
  teamSizeIdeal: number;      // Ideal maximum (default: 6)
  teamSizeSoftMax: number;    // Acceptable with light penalty (default: 7)
  teamSizeHardMax: number;    // Absolute maximum (default: 10)
  
  // Optimization mode
  optimizationMode: OptimizationMode;
  
  // Scoring weights
  weights: ScoringWeights;
}

// ==================== PRESET CONFIGURATIONS ====================

/* PRESET 1: Student-First (DEFAULT)
 * - Maximizes student preference satisfaction
 * - Very high weights for student preferences (especially 3200)
 * - Strong returning student preference
 * - Lower weights for project needs
*/
export const STUDENT_FIRST_CONFIG: AlgorithmConfig = {
  teamSizeMin: 4,
  teamSizeIdeal: 6,
  teamSizeSoftMax: 7,
  teamSizeHardMax: 10,
  optimizationMode: "student-first",
  weights: {
    upper3200FirstChoice: 100000,
    upper3200SecondChoice: 50000,
    upper3200ThirdChoice: 20000,
    lower2200FirstChoice: 5000,
    lower2200SecondChoice: 3000,
    lower2200ThirdChoice: 1500,
    lower2200FourthToSixth: -50000,
    returningStudentBonus: 500000,
    skillMatchBonus: 50,
    majorMatchBonus: 100,
    genderIsolationPenalty: -3000,
    teamSizeLightPenalty: -500,
    teamSizeHeavyPenalty: -5000,
    projectActivationBonus: 5000,
  },
};

/* PRESET 2: Project-First
 * Ensures projects get required skills and majors
 * - Lower weights for student preferences
 * - Much higher weights for skills and major matching
 * - Strong gender balance
*/
export const PROJECT_FIRST_CONFIG: AlgorithmConfig = {
  teamSizeMin: 4,
  teamSizeIdeal: 6,
  teamSizeSoftMax: 7,
  teamSizeHardMax: 10,
  optimizationMode: "project-first",
  weights: {
    upper3200FirstChoice: 50000,
    upper3200SecondChoice: 30000,
    upper3200ThirdChoice: 15000,
    lower2200FirstChoice: 2000,
    lower2200SecondChoice: 1500,
    lower2200ThirdChoice: 1000,
    lower2200FourthToSixth: -10000,
    returningStudentBonus: 100000,
    skillMatchBonus: 5000,      // 100x higher than student-first
    majorMatchBonus: 5000,      // 50x higher than student-first
    genderIsolationPenalty: -10000,
    teamSizeLightPenalty: -200,
    teamSizeHeavyPenalty: -2000,
    projectActivationBonus: 20000,
  },
};

/* PRESET 3: Balanced
 * Middle ground between student satisfaction and project needs
 * - Moderate weights for everything
*/
export const BALANCED_CONFIG: AlgorithmConfig = {
  teamSizeMin: 4,
  teamSizeIdeal: 6,
  teamSizeSoftMax: 7,
  teamSizeHardMax: 10,
  optimizationMode: "balanced",
  weights: {
    upper3200FirstChoice: 75000,
    upper3200SecondChoice: 40000,
    upper3200ThirdChoice: 18000,
    lower2200FirstChoice: 3500,
    lower2200SecondChoice: 2250,
    lower2200ThirdChoice: 1250,
    lower2200FourthToSixth: -25000,
    returningStudentBonus: 250000,
    skillMatchBonus: 1000,
    majorMatchBonus: 1000,
    genderIsolationPenalty: -5000,
    teamSizeLightPenalty: -350,
    teamSizeHeavyPenalty: -3500,
    projectActivationBonus: 10000,
  },
};

/* PRESET 4: Fair Distribution
 * Minimizes variance - tries to give everyone similar quality
 * - Flatter preference curve (smaller gaps between 1st/2nd/3rd)
 * - Heavy penalties for bad assignments (avoid 4th-6th at all costs)
 * - Strong gender balance for fairness
*/
export const FAIR_DISTRIBUTION_CONFIG: AlgorithmConfig = {
  teamSizeMin: 4,
  teamSizeIdeal: 6,
  teamSizeSoftMax: 7,
  teamSizeHardMax: 10,
  optimizationMode: "fair-distribution",
  weights: {
    upper3200FirstChoice: 80000,
    upper3200SecondChoice: 70000,  // Closer to first
    upper3200ThirdChoice: 60000,   // Closer to second
    lower2200FirstChoice: 4000,
    lower2200SecondChoice: 3500,   // Closer to first
    lower2200ThirdChoice: 3000,    // Closer to second
    lower2200FourthToSixth: -80000, // Very heavy penalty
    returningStudentBonus: 300000,
    skillMatchBonus: 500,
    majorMatchBonus: 500,
    genderIsolationPenalty: -8000,
    teamSizeLightPenalty: -400,
    teamSizeHeavyPenalty: -4000,
    projectActivationBonus: 8000,
  },
};

// Get preset configuration based on selected/assigned mode
 
export function getPresetConfig(mode: OptimizationMode): AlgorithmConfig {
  switch (mode) {
    case "student-first":
      return STUDENT_FIRST_CONFIG;
    case "project-first":
      return PROJECT_FIRST_CONFIG;
    case "balanced":
      return BALANCED_CONFIG;
    case "fair-distribution":
      return FAIR_DISTRIBUTION_CONFIG;
    default:
      return STUDENT_FIRST_CONFIG; // Default fallback, discussed in meeting(?)
  }
}

// Results formatting below

// Team assignments result structure
export interface TeamAssignments {
  [projectName: string]: Student[];
}

// Statistics about the generated assignments
 
export interface AssignmentStatistics {
  totalStudents: number;
  
  // Preference satisfaction breakdown
  firstChoiceCount: number;
  secondChoiceCount: number;
  thirdChoiceCount: number;
  fourthChoiceCount: number;
  fifthChoiceCount: number;
  sixthChoiceCount: number;
  noMatchCount: number;
  
  // Class-level statistics
  upper3200FirstChoice: number;
  upper3200Top3: number;
  totalUpper3200: number;
  
  lower2200FirstChoice: number;
  lower2200Top3: number;
  totalLower2200: number;
  
  // Team balance
  averageTeamSize: number;
  minTeamSize: number;
  maxTeamSize: number;
  
  // Major matching
  majorTypeMatches: number;
  totalStudentsInTeams: number;
  
  // Returning students
  returningStudentsMatched: number;
  totalReturningStudents: number;
  
  // Gender balance
  teamsWithGenderIsolation: number;
  totalActiveTeams: number;
}

// Complete result from the chosen algorithm
 
export interface AlgorithmResult {
  success: boolean;
  teamAssignments?: TeamAssignments;
  deactivatedProjects?: string[];
  statistics?: AssignmentStatistics;
  score?: number;
  solveTime?: number;
  status?: "optimal" | "feasible" | "infeasible";
  error?: string;
  constraintViolations?: string[];
}