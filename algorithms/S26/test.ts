/**
 * Test runner for EPICS Team Assignment Algorithm
 * Generates synthetic test data and evaluates algorithm performance
 */

import { generateTeamsWithMode, generateTeamsWithStats } from './solver-wrapper';
import type { Student, Project, OptimizationMode, TeamAssignments } from './types';

// ==================== TEST DATA GENERATORS ====================

const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William',
  'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander',
  'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'Joseph', 'Avery', 'David',
  'Ella', 'Jackson', 'Scarlett', 'Logan', 'Grace', 'Sebastian', 'Chloe', 'Jack', 'Victoria', 'Samuel',
  'Riley', 'Owen', 'Aria', 'Carter', 'Lily', 'Wyatt', 'Aubrey', 'John', 'Zoey', 'Dylan',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
];

const skillsByMajor: Record<string, string[]> = {
  'Computer Science': ['Python', 'Java', 'C++', 'JavaScript', 'Machine Learning', 'Algorithms', 'Data Structures', 'React', 'Node.js'],
  'Software Engineering': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'Agile', 'Testing', 'DevOps', 'CI/CD'],
  'Electrical Engineering': ['Circuit Design', 'PCB Design', 'Embedded Systems', 'Signal Processing', 'Arduino', 'Soldering', 'Circuit Analysis'],
  'Mechanical Engineering': ['CAD', 'Mechanical Design', '3D Printing', 'SolidWorks', 'FEA', 'Thermodynamics', 'Materials'],
  'Computer Engineering': ['C', 'Assembly', 'Networking', 'Operating Systems', 'Computer Architecture', 'Embedded Systems'],
  'Biomedical Engineering': ['MATLAB', 'Biology', 'Medical Devices', 'Signal Processing', 'CAD', 'Biomechanics'],
  'Data Science': ['Python', 'SQL', 'Data Analysis', 'Statistics', 'Machine Learning', 'Visualization', 'R'],
  'Systems Engineering': ['Systems Design', 'Optimization', 'Modeling', 'Project Management', 'Integration', 'Testing'],
};

function generateTestProjects(): Project[] {
  const projects: Project[] = [];
  let id = 1;
  
  // Real EPICS distribution:
  // Wednesday: 7 SW, 4 Both, 1 HW = 12 projects
  // Thursday: 11 SW, 5 Both, 0 HW = 16 projects
  
  const swTemplates = [
    { name: 'AI Research Lab', skills: ['Python', 'Machine Learning', 'Data Analysis'], majors: ['Computer Science', 'Data Science'] },
    { name: 'Web Platform', skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Mobile App', skills: ['Swift', 'Kotlin', 'React Native'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Cloud Infrastructure', skills: ['DevOps', 'Docker', 'Kubernetes', 'AWS'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Database System', skills: ['SQL', 'Database Design', 'Python'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'ML Pipeline', skills: ['Python', 'TensorFlow', 'Data Analysis'], majors: ['Computer Science', 'Data Science'] },
    { name: 'Gaming Engine', skills: ['C++', 'Graphics', 'Game Design'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Security Platform', skills: ['Cybersecurity', 'Networking', 'Python'], majors: ['Computer Science', 'Computer Engineering'] },
    { name: 'Data Visualization', skills: ['JavaScript', 'D3.js', 'Data Analysis'], majors: ['Computer Science', 'Data Science'] },
    { name: 'Healthcare App', skills: ['React', 'Node.js', 'SQL'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Education Platform', skills: ['JavaScript', 'React', 'Python'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Finance Dashboard', skills: ['Python', 'SQL', 'Data Analysis'], majors: ['Computer Science', 'Data Science'] },
    { name: 'Social Impact App', skills: ['React Native', 'Node.js', 'MongoDB'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Accessibility Tool', skills: ['JavaScript', 'TypeScript', 'UX Design'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Climate Data Hub', skills: ['Python', 'Data Analysis', 'Visualization'], majors: ['Computer Science', 'Data Science'] },
    { name: 'Volunteer Tracker', skills: ['React', 'Node.js', 'SQL'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Smart Campus', skills: ['Python', 'Machine Learning', 'IoT'], majors: ['Computer Science', 'Software Engineering'] },
    { name: 'Food Bank System', skills: ['JavaScript', 'React', 'SQL'], majors: ['Computer Science', 'Software Engineering'] },
  ];
  
  const bothTemplates = [
    { name: 'IoT Platform', skills: ['Embedded Systems', 'Networking', 'Arduino', 'C'], majors: ['Electrical Engineering', 'Computer Engineering', 'Computer Science'] },
    { name: 'Drone System', skills: ['Mechanical Design', 'Embedded Systems', 'Control Systems'], majors: ['Mechanical Engineering', 'Electrical Engineering', 'Computer Engineering'] },
    { name: 'Autonomous Vehicle', skills: ['Machine Learning', 'Computer Vision', 'Embedded Systems'], majors: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering'] },
    { name: 'Smart Agriculture', skills: ['Sensors', 'Embedded Systems', 'Python', 'Data Analysis'], majors: ['Electrical Engineering', 'Computer Science', 'Computer Engineering'] },
    { name: 'Wearable Health', skills: ['Circuit Design', 'Embedded Systems', 'Python'], majors: ['Biomedical Engineering', 'Electrical Engineering', 'Computer Science'] },
    { name: 'Robot Assistant', skills: ['Mechanical Design', 'Python', 'Computer Vision'], majors: ['Mechanical Engineering', 'Computer Science', 'Electrical Engineering'] },
    { name: 'Energy Monitor', skills: ['Circuit Design', 'Python', 'Data Analysis', 'Sensors'], majors: ['Electrical Engineering', 'Computer Science', 'Computer Engineering'] },
    { name: 'Smart Home', skills: ['Embedded Systems', 'Networking', 'Python', 'Arduino'], majors: ['Computer Engineering', 'Electrical Engineering', 'Computer Science'] },
    { name: 'Assistive Device', skills: ['Mechanical Design', 'Embedded Systems', 'Sensors'], majors: ['Biomedical Engineering', 'Mechanical Engineering', 'Electrical Engineering'] },
  ];
  
  const hwTemplates = [
    { name: 'Robotics System', skills: ['Mechanical Design', 'Circuit Design', 'Embedded Systems'], majors: ['Mechanical Engineering', 'Electrical Engineering', 'Biomedical Engineering'] },
  ];
  
  // Wednesday projects
  const wedSW = swTemplates.slice(0, 7);
  const wedBoth = bothTemplates.slice(0, 4);
  const wedHW = hwTemplates.slice(0, 1);
  
  for (const t of wedSW) {
    projects.push({
      id: `p${id++}`,
      name: t.name,
      projectType: 'Software',
      requiredSkills: t.skills,
      preferredMajors: t.majors as any,
      meetingDay: 'Wednesday',
    });
  }
  for (const t of wedBoth) {
    projects.push({
      id: `p${id++}`,
      name: t.name,
      projectType: 'Both',
      requiredSkills: t.skills,
      preferredMajors: t.majors as any,
      meetingDay: 'Wednesday',
    });
  }
  for (const t of wedHW) {
    projects.push({
      id: `p${id++}`,
      name: t.name,
      projectType: 'Hardware',
      requiredSkills: t.skills,
      preferredMajors: t.majors as any,
      meetingDay: 'Wednesday',
    });
  }
  
  // Thursday projects
  const thuSW = swTemplates.slice(7, 18);
  const thuBoth = bothTemplates.slice(4, 9);
  
  for (const t of thuSW) {
    projects.push({
      id: `p${id++}`,
      name: t.name,
      projectType: 'Software',
      requiredSkills: t.skills,
      preferredMajors: t.majors as any,
      meetingDay: 'Thursday',
    });
  }
  for (const t of thuBoth) {
    projects.push({
      id: `p${id++}`,
      name: t.name,
      projectType: 'Both',
      requiredSkills: t.skills,
      preferredMajors: t.majors as any,
      meetingDay: 'Thursday',
    });
  }
  
  return projects;
}

function generateTestStudents(count: number, projects: Project[]): Student[] {
  const students: Student[] = [];
  
  // Calculate day distribution
  const wedProjects = projects.filter(p => p.meetingDay === 'Wednesday');
  const thuProjects = projects.filter(p => p.meetingDay === 'Thursday');
  const wedRatio = wedProjects.length / projects.length;
  
  // Split students: 37 upper (3200), rest lower (2200)
  const total3200 = 37;
  const total2200 = count - total3200;
  
  const wed3200 = Math.round(total3200 * wedRatio);
  const thu3200 = total3200 - wed3200;
  const wed2200 = Math.round(total2200 * wedRatio);
  const thu2200 = total2200 - wed2200;
  
  // Build student config array
  const configs: Array<{ day: 'Wednesday' | 'Thursday'; is3200: boolean }> = [];
  for (let i = 0; i < wed3200; i++) configs.push({ day: 'Wednesday', is3200: true });
  for (let i = 0; i < thu3200; i++) configs.push({ day: 'Thursday', is3200: true });
  for (let i = 0; i < wed2200; i++) configs.push({ day: 'Wednesday', is3200: false });
  for (let i = 0; i < thu2200; i++) configs.push({ day: 'Thursday', is3200: false });
  
  for (let i = 0; i < configs.length; i++) {
    const { day, is3200 } = configs[i];
    const dayProjects = day === 'Wednesday' ? wedProjects : thuProjects;
    
    // Pick major (75% software, 25% hardware)
    const swMajors = ['Computer Science', 'Software Engineering', 'Data Science'];
    const hwMajors = ['Electrical Engineering', 'Mechanical Engineering', 'Biomedical Engineering', 'Computer Engineering', 'Systems Engineering'];
    const major = (Math.random() < 0.75)
      ? swMajors[Math.floor(Math.random() * swMajors.length)]
      : hwMajors[Math.floor(Math.random() * hwMajors.length)];
    
    // Pick gender
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    
    // Pick seniority
    const seniority = is3200
      ? (Math.random() > 0.5 ? 'Senior' : 'Junior')
      : (Math.random() > 0.5 ? 'Sophomore' : 'Freshman');
    
    // Generate name
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Generate skills
    const availableSkills = skillsByMajor[major] || skillsByMajor['Computer Science'];
    const skillCount = 2 + Math.floor(Math.random() * 3);
    const studentSkills: string[] = [];
    while (studentSkills.length < skillCount) {
      const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      if (!studentSkills.includes(skill)) {
        studentSkills.push(skill);
      }
    }
    
    // Generate preferences (realistic based on major)
    const choices: string[] = [];
    const isSWMajor = swMajors.includes(major);
    
    if (isSWMajor) {
      // SW students prefer SW/Both
      const preferred = dayProjects.filter(p => p.projectType === 'Software' || p.projectType === 'Both')
        .sort(() => Math.random() - 0.5);
      const others = dayProjects.filter(p => p.projectType === 'Hardware')
        .sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < 4 && j < preferred.length; j++) choices.push(preferred[j].name);
      for (let j = 0; choices.length < 6 && j < others.length; j++) {
        if (!choices.includes(others[j].name)) choices.push(others[j].name);
      }
      for (let j = 4; choices.length < 6 && j < preferred.length; j++) {
        if (!choices.includes(preferred[j].name)) choices.push(preferred[j].name);
      }
    } else {
      // HW students prefer Both/HW but mix in some SW
      const hwBoth = dayProjects.filter(p => p.projectType === 'Hardware' || p.projectType === 'Both')
        .sort(() => Math.random() - 0.5);
      const sw = dayProjects.filter(p => p.projectType === 'Software')
        .sort(() => Math.random() - 0.5);
      
      const topCount = Math.min(3, hwBoth.length);
      for (let j = 0; j < topCount; j++) choices.push(hwBoth[j].name);
      
      const swMix = Math.min(2, sw.length);
      for (let j = 0; j < swMix && choices.length < 6; j++) choices.push(sw[j].name);
      
      for (let j = topCount; choices.length < 6 && j < hwBoth.length; j++) {
        if (!choices.includes(hwBoth[j].name)) choices.push(hwBoth[j].name);
      }
      for (let j = swMix; choices.length < 6 && j < sw.length; j++) {
        if (!choices.includes(sw[j].name)) choices.push(sw[j].name);
      }
    }
    
    // 80% of 3200 students are returning
    const isReturning = is3200 && Math.random() < 0.8;
    const returningToProject = isReturning ? choices[0] : undefined;
    
    students.push({
      id: `s${i + 1}`,
      name,
      major: major as any,
      classLevel: is3200 ? '3200' : '2200',
      seniority: seniority as any,
      preferences: choices,
      skills: studentSkills,
      gender: gender as any,
      availableDay: day,
      returningToProject,
    });
  }
  
  return students;
}

// ==================== DISPLAY FUNCTIONS ====================

function displayResults(teams: TeamAssignments, students: Student[], projects: Project[]) {
  console.log('\n' + '='.repeat(80));
  console.log('TEAM ASSIGNMENTS');
  console.log('='.repeat(80));
  
  for (const project of projects) {
    const team = teams[project.name];
    
    if (!team) {
      console.log(`\n📋 ${project.name} (${project.projectType}) [${project.meetingDay}]`);
      console.log(`   ⚠️  ERROR: No team assigned (solver may have failed)`);
      continue;
    }
    
    console.log(`\n📋 ${project.name} (${project.projectType}) [${project.meetingDay}]`);
    console.log(`   Team Size: ${team.length}`);
    
    // Count 3200 students
    const upperCount = team.filter(s => s.classLevel === '3200').length;
    console.log(`   3200 Students: ${upperCount}`);
    
    // Count majors
    const majorCounts: Record<string, number> = {};
    team.forEach(s => {
      majorCounts[s.major] = (majorCounts[s.major] || 0) + 1;
    });
    const majorStr = Object.entries(majorCounts)
      .map(([m, c]) => `${c} ${m}`)
      .join(', ');
    console.log(`   Majors: ${majorStr}`);
    
    // Count genders
    const maleCount = team.filter(s => s.gender === 'Male').length;
    const femaleCount = team.filter(s => s.gender === 'Female').length;
    console.log(`   Gender: ${maleCount} Male, ${femaleCount} Female`);
    
    // List members
    console.log('   Members:');
    const sorted = [...team].sort((a, b) => 
      a.classLevel === '3200' && b.classLevel === '2200' ? -1 : 
      a.classLevel === '2200' && b.classLevel === '3200' ? 1 : 0
    );
    
    for (const student of sorted) {
      const prefIndex = student.preferences.indexOf(project.name);
      const prefLabel = prefIndex === -1 ? '❌ Not in preferences' : `✓ Choice #${prefIndex + 1}`;
      const returningLabel = student.returningToProject === project.name ? ' 🔁 RETURNING' : '';
      
      console.log(`     • ${student.name} (${student.major}, ${student.seniority}, ${student.classLevel}) ${prefLabel}${returningLabel}`);
    }
  }
}

// ==================== MAIN TEST FUNCTION ====================

async function runTest() {
  console.log('='.repeat(80));
  console.log('EPICS TEAM ASSIGNMENT ALGORITHM - TEST');
  console.log('University of Texas at Dallas');
  console.log('='.repeat(80));
  console.log();
  
  // Generate test data
  const projects = generateTestProjects();
  const students = generateTestStudents(150, projects);
  
  console.log(`Generated ${students.length} students and ${projects.length} projects`);
  console.log(`  3200 Students: ${students.filter(s => s.classLevel === '3200').length}`);
  console.log(`  2200 Students: ${students.filter(s => s.classLevel === '2200').length}`);
  console.log();
  
  // Test with student-first mode (default)
  console.log('Running algorithm with STUDENT-FIRST optimization...\n');
  
  try {
    const result = await generateTeamsWithStats(students, projects);
    
    if (result.success && result.teamAssignments && result.statistics) {
      displayResults(result.teamAssignments, students, projects);
      
      console.log('\n' + '='.repeat(80));
      console.log('STATISTICS');
      console.log('='.repeat(80));
      console.log();
      
      const stats = result.statistics;
      
      console.log('Preference Satisfaction:');
      console.log(`  1st Choice: ${stats.firstChoiceCount} (${(stats.firstChoiceCount / stats.totalStudents * 100).toFixed(1)}%)`);
      console.log(`  2nd Choice: ${stats.secondChoiceCount} (${(stats.secondChoiceCount / stats.totalStudents * 100).toFixed(1)}%)`);
      console.log(`  3rd Choice: ${stats.thirdChoiceCount} (${(stats.thirdChoiceCount / stats.totalStudents * 100).toFixed(1)}%)`);
      console.log(`  4th Choice: ${stats.fourthChoiceCount} (${(stats.fourthChoiceCount / stats.totalStudents * 100).toFixed(1)}%)`);
      console.log(`  5th Choice: ${stats.fifthChoiceCount} (${(stats.fifthChoiceCount / stats.totalStudents * 100).toFixed(1)}%)`);
      console.log(`  6th Choice: ${stats.sixthChoiceCount} (${(stats.sixthChoiceCount / stats.totalStudents * 100).toFixed(1)}%)`);
      console.log();
      
      console.log('3200 Student Satisfaction:');
      console.log(`  First Choice: ${stats.upper3200FirstChoice}/${stats.totalUpper3200} (${(stats.upper3200FirstChoice / stats.totalUpper3200 * 100).toFixed(1)}%)`);
      console.log(`  Top 3: ${stats.upper3200Top3}/${stats.totalUpper3200} (${(stats.upper3200Top3 / stats.totalUpper3200 * 100).toFixed(1)}%)`);
      console.log();
      
      console.log('2200 Student Satisfaction:');
      console.log(`  First Choice: ${stats.lower2200FirstChoice}/${stats.totalLower2200} (${(stats.lower2200FirstChoice / stats.totalLower2200 * 100).toFixed(1)}%)`);
      console.log(`  Top 3: ${stats.lower2200Top3}/${stats.totalLower2200} (${(stats.lower2200Top3 / stats.totalLower2200 * 100).toFixed(1)}%)`);
      console.log();
      
      console.log('Team Balance:');
      console.log(`  Average Size: ${stats.averageTeamSize.toFixed(1)}`);
      console.log(`  Range: ${stats.minTeamSize} - ${stats.maxTeamSize}`);
      console.log();
      
      console.log('Constraint Validation:');
      if (result.constraintViolations && result.constraintViolations.length > 0) {
        console.log('  ❌ Violations found:');
        result.constraintViolations.forEach(v => console.log(`    - ${v}`));
      } else {
        console.log('  ✅ All constraints satisfied!');
      }
      
      console.log();
      console.log('='.repeat(80));
      console.log('TEST COMPLETE');
      console.log('='.repeat(80));
    } else {
      console.error('Algorithm failed:', result.error);
    }
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
runTest();