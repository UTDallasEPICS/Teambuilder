// Test file for OR-Tools CP-SAT team generation algorithm
import { generateTeamsORTools } from './ortools';
import type { Student, Project } from './ortools';

// ===================== DATA GENERATORS =====================

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

const majors: Array<"CS" | "SE" | "EE" | "ME" | "BME" | "DS" | "CE" | "Systems" | "Other"> = ['CS', 'SE', 'EE', 'ME', 'CE', 'BME', 'DS'];
const genders: Array<"Male" | "Female" | "Non-binary" | "Prefer not to say"> = ['Male', 'Female'];
const seniorities: Array<"Freshman" | "Sophomore" | "Junior" | "Senior"> = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

const skillsByMajor: Record<string, string[]> = {
  CS: ['Python', 'Java', 'C++', 'JavaScript', 'Machine Learning', 'Algorithms', 'Data Structures', 'React', 'Node.js'],
  SE: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'Agile', 'Testing', 'DevOps', 'CI/CD'],
  EE: ['Circuit Design', 'PCB Design', 'Embedded Systems', 'Signal Processing', 'Arduino', 'Soldering', 'Circuit Analysis'],
  ME: ['CAD', 'Mechanical Design', '3D Printing', 'SolidWorks', 'FEA', 'Thermodynamics', 'Materials'],
  CE: ['C', 'Assembly', 'Networking', 'Operating Systems', 'Computer Architecture', 'Embedded Systems'],
  BME: ['MATLAB', 'Biology', 'Medical Devices', 'Signal Processing', 'CAD', 'Biomechanics'],
  DS: ['Python', 'SQL', 'Data Analysis', 'Statistics', 'Machine Learning', 'Visualization', 'R'],
};

function generateProjects(): Project[] {
  // Real EPICS distribution:
  // Wednesday: 7 SW, 4 Both, 1 HW = 12 projects
  // Thursday: 11 SW, 5 Both, 0 HW = 16 projects
  // Total: 28 projects (18 SW, 9 Both, 1 HW)

  const swTemplates = [
    { name: 'AI Research Lab', skills: ['Python', 'Machine Learning', 'Data Analysis'], majors: ['CS', 'DS'] },
    { name: 'Web Platform', skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'], majors: ['CS', 'SE'] },
    { name: 'Mobile App', skills: ['Swift', 'Kotlin', 'React Native', 'Flutter'], majors: ['CS', 'SE'] },
    { name: 'Cloud Infrastructure', skills: ['DevOps', 'Docker', 'Kubernetes', 'AWS'], majors: ['CS', 'SE'] },
    { name: 'Database System', skills: ['SQL', 'Database Design', 'Python', 'Backend'], majors: ['CS', 'SE'] },
    { name: 'ML Pipeline', skills: ['Python', 'TensorFlow', 'Data Analysis', 'ML'], majors: ['CS', 'DS'] },
    { name: 'Gaming Engine', skills: ['C++', 'Graphics', 'Game Design', 'Physics'], majors: ['CS', 'SE'] },
    { name: 'Security Platform', skills: ['Cybersecurity', 'Networking', 'Python', 'Cryptography'], majors: ['CS', 'CE'] },
    { name: 'Data Visualization', skills: ['JavaScript', 'D3.js', 'Data Analysis', 'Visualization'], majors: ['CS', 'DS'] },
    { name: 'Healthcare App', skills: ['React', 'Node.js', 'SQL', 'HIPAA'], majors: ['CS', 'SE'] },
    { name: 'Education Platform', skills: ['JavaScript', 'React', 'Python', 'API Design'], majors: ['CS', 'SE'] },
    { name: 'Finance Dashboard', skills: ['Python', 'SQL', 'Data Analysis', 'Visualization'], majors: ['CS', 'DS'] },
    { name: 'Social Impact App', skills: ['React Native', 'Node.js', 'MongoDB'], majors: ['CS', 'SE'] },
    { name: 'Accessibility Tool', skills: ['JavaScript', 'TypeScript', 'UX Design'], majors: ['CS', 'SE'] },
    { name: 'Climate Data Hub', skills: ['Python', 'Data Analysis', 'Visualization', 'API Design'], majors: ['CS', 'DS'] },
    { name: 'Volunteer Tracker', skills: ['React', 'Node.js', 'SQL', 'TypeScript'], majors: ['CS', 'SE'] },
    { name: 'Smart Campus', skills: ['Python', 'Machine Learning', 'IoT', 'API Design'], majors: ['CS', 'SE'] },
    { name: 'Food Bank System', skills: ['JavaScript', 'React', 'SQL', 'Node.js'], majors: ['CS', 'SE'] },
  ];

  const bothTemplates = [
    { name: 'IoT Platform', skills: ['Embedded Systems', 'Networking', 'Arduino', 'C'], majors: ['EE', 'CE', 'CS'] },
    { name: 'Drone System', skills: ['Mechanical Design', 'Embedded Systems', 'Control Systems'], majors: ['ME', 'EE', 'CE'] },
    { name: 'Autonomous Vehicle', skills: ['Machine Learning', 'Computer Vision', 'Embedded Systems'], majors: ['CS', 'EE', 'ME'] },
    { name: 'Smart Agriculture', skills: ['Sensors', 'Embedded Systems', 'Python', 'Data Analysis'], majors: ['EE', 'CS', 'CE'] },
    { name: 'Wearable Health', skills: ['Circuit Design', 'Embedded Systems', 'Python', 'BLE'], majors: ['BME', 'EE', 'CS'] },
    { name: 'Robot Assistant', skills: ['Mechanical Design', 'Python', 'Computer Vision', 'ROS'], majors: ['ME', 'CS', 'EE'] },
    { name: 'Energy Monitor', skills: ['Circuit Design', 'Python', 'Data Analysis', 'Sensors'], majors: ['EE', 'CS', 'CE'] },
    { name: 'Smart Home', skills: ['Embedded Systems', 'Networking', 'Python', 'Arduino'], majors: ['CE', 'EE', 'CS'] },
    { name: 'Assistive Device', skills: ['Mechanical Design', 'Embedded Systems', 'Sensors'], majors: ['BME', 'ME', 'EE'] },
  ];

  const hwTemplates = [
    { name: 'Robotics System', skills: ['Mechanical Design', 'Circuit Design', 'Embedded Systems'], majors: ['ME', 'EE', 'BME'] },
  ];

  const projects: Project[] = [];
  let id = 1;

  // Wednesday: 7 SW, 4 Both, 1 HW
  const wedSW = swTemplates.slice(0, 7);
  const wedBoth = bothTemplates.slice(0, 4);
  const wedHW = hwTemplates.slice(0, 1);

  for (const t of wedSW) {
    projects.push({ id: `p${id++}`, name: t.name, type: 'SW', requiredSkills: t.skills, preferredMajors: t.majors, day: 'Wednesday' });
  }
  for (const t of wedBoth) {
    projects.push({ id: `p${id++}`, name: t.name, type: 'Both', requiredSkills: t.skills, preferredMajors: t.majors, day: 'Wednesday' });
  }
  for (const t of wedHW) {
    projects.push({ id: `p${id++}`, name: t.name, type: 'HW', requiredSkills: t.skills, preferredMajors: t.majors, day: 'Wednesday' });
  }

  // Thursday: 11 SW, 5 Both, 0 HW
  const thuSW = swTemplates.slice(7, 18);
  const thuBoth = bothTemplates.slice(4, 9);

  for (const t of thuSW) {
    projects.push({ id: `p${id++}`, name: t.name, type: 'SW', requiredSkills: t.skills, preferredMajors: t.majors, day: 'Thursday' });
  }
  for (const t of thuBoth) {
    projects.push({ id: `p${id++}`, name: t.name, type: 'Both', requiredSkills: t.skills, preferredMajors: t.majors, day: 'Thursday' });
  }

  return projects;
}

function generateStudents(count: number, projects: Project[], upperClassCount: number = 37): Student[] {
  const students: Student[] = [];
  
  // EPICS has significantly more SW students than HW students (~75% SW, ~25% HW)
  const swMajors: Array<typeof majors[number]> = ['CS', 'SE', 'DS'];
  const hwMajors: Array<typeof majors[number]> = ['EE', 'ME', 'BME', 'CE'];
  // Weighted major selection: ~75% chance SW major, ~25% chance HW major
  function pickMajor(): typeof majors[number] {
    if (Math.random() < 0.75) {
      return swMajors[Math.floor(Math.random() * swMajors.length)];
    } else {
      return hwMajors[Math.floor(Math.random() * hwMajors.length)];
    }
  }
  
  // Split students across days proportionally to project count
  const wedProjects = projects.filter(p => p.day === 'Wednesday');
  const thuProjects = projects.filter(p => p.day === 'Thursday');
  const wedRatio = wedProjects.length / projects.length;
  
  // Split 3200 students proportionally across days
  const wed3200Count = Math.round(upperClassCount * wedRatio);
  const thu3200Count = upperClassCount - wed3200Count;
  
  // Split 2200 students proportionally
  const lowerClassCount = count - upperClassCount;
  const wed2200Count = Math.round(lowerClassCount * wedRatio);
  const thu2200Count = lowerClassCount - wed2200Count;
  
  // Build students in order: Wed 3200, Thu 3200, Wed 2200, Thu 2200
  const studentConfigs: { day: "Wednesday" | "Thursday"; is3200: boolean }[] = [];
  for (let i = 0; i < wed3200Count; i++) studentConfigs.push({ day: 'Wednesday', is3200: true });
  for (let i = 0; i < thu3200Count; i++) studentConfigs.push({ day: 'Thursday', is3200: true });
  for (let i = 0; i < wed2200Count; i++) studentConfigs.push({ day: 'Wednesday', is3200: false });
  for (let i = 0; i < thu2200Count; i++) studentConfigs.push({ day: 'Thursday', is3200: false });
  
  for (let i = 0; i < studentConfigs.length; i++) {
    const { day, is3200 } = studentConfigs[i];
    const dayProjects = day === 'Wednesday' ? wedProjects : thuProjects;
    const major = pickMajor();
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const seniority = is3200 
      ? (Math.random() > 0.5 ? 'Senior' : 'Junior')
      : (Math.random() > 0.5 ? 'Sophomore' : 'Freshman');
    
    // Generate name
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Generate skills (2-4 skills per student)
    const availableSkills = skillsByMajor[major] || skillsByMajor['CS'];
    const skillCount = 2 + Math.floor(Math.random() * 3);
    const studentSkills: string[] = [];
    for (let j = 0; j < skillCount; j++) {
      const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      if (!studentSkills.includes(skill)) {
        studentSkills.push(skill);
      }
    }
    
    // Generate realistic choices ONLY from projects on the student's day
    // SW students prefer SW/Both projects; HW students prefer Both projects (since HW is scarce)
    const softwareMajors = ['CS', 'SE', 'DS'];
    const hardwareMajors = ['EE', 'ME', 'BME', 'CE'];
    
    const choices: string[] = [];
    
    if (softwareMajors.includes(major)) {
      // SW students: top choices are SW/Both (which is most projects anyway)
      const preferredProjects = dayProjects.filter(p => p.type === 'SW' || p.type === 'Both').sort(() => Math.random() - 0.5);
      const otherProjects = dayProjects.filter(p => p.type === 'HW').sort(() => Math.random() - 0.5);
      
      const topCount = 3 + Math.floor(Math.random() * 2);
      for (let j = 0; j < topCount && j < preferredProjects.length; j++) {
        choices.push(preferredProjects[j].name);
      }
      for (let j = 0; choices.length < 6 && j < otherProjects.length; j++) {
        if (!choices.includes(otherProjects[j].name)) {
          choices.push(otherProjects[j].name);
        }
      }
      for (let j = topCount; choices.length < 6 && j < preferredProjects.length; j++) {
        if (!choices.includes(preferredProjects[j].name)) {
          choices.push(preferredProjects[j].name);
        }
      }
    } else if (hardwareMajors.includes(major)) {
      // HW students: prefer Both and HW projects, but also consider some SW projects
      // On days with few/no HW projects, they shouldn't stack ALL Both as top picks
      // since that creates a bottleneck. Realistically they'd find some SW projects interesting too.
      const hwAndBothProjects = dayProjects.filter(p => p.type === 'HW' || p.type === 'Both').sort(() => Math.random() - 0.5);
      const swProjects = dayProjects.filter(p => p.type === 'SW').sort(() => Math.random() - 0.5);
      
      // Top 3-4 picks from HW/Both
      const topCount = Math.min(3 + Math.floor(Math.random() * 2), hwAndBothProjects.length);
      for (let j = 0; j < topCount; j++) {
        choices.push(hwAndBothProjects[j].name);
      }
      
      // Mix in 1-2 SW projects they find interesting (before remaining Both projects)
      const swMix = Math.min(1 + Math.floor(Math.random() * 2), swProjects.length);
      for (let j = 0; j < swMix && choices.length < 6; j++) {
        choices.push(swProjects[j].name);
      }
      
      // Fill remaining slots with leftover Both/HW projects
      for (let j = topCount; choices.length < 6 && j < hwAndBothProjects.length; j++) {
        if (!choices.includes(hwAndBothProjects[j].name)) {
          choices.push(hwAndBothProjects[j].name);
        }
      }
      
      // Fill any remaining with more SW
      for (let j = swMix; choices.length < 6 && j < swProjects.length; j++) {
        if (!choices.includes(swProjects[j].name)) {
          choices.push(swProjects[j].name);
        }
      }
    } else {
      const allProjects = [...dayProjects].sort(() => Math.random() - 0.5);
      for (let j = 0; j < 6 && j < allProjects.length; j++) {
        choices.push(allProjects[j].name);
      }
    }
    
    // 80% of 3200 students are returning to a previous project (first choice)
    const isReturning = is3200 && Math.random() < 0.8;
    const previousProject = isReturning ? choices[0] : undefined;
    
    students.push({
      id: `s${i + 1}`,
      name,
      major,
      seniority,
      choices,
      choicesString: choices.join(', '),
      class: is3200 ? '3200' : '2200',
      skills: studentSkills,
      gender,
      previousProject,
      day,
    });
  }
  
  return students;
}

// ===================== TEST DATA =====================

const testProjects: Project[] = generateProjects();
const testStudents: Student[] = generateStudents(150, testProjects);

// ===================== TEST FUNCTIONS =====================

async function runTest() {
  console.log('='.repeat(80));
  console.log('OR-TOOLS CP-SAT TEAM BUILDING ALGORITHM TEST');
  console.log('='.repeat(80));
  console.log();

  console.log(`Total Students: ${testStudents.length}`);
  console.log(`  - 3200 level: ${testStudents.filter(s => s.class === '3200').length}`);
  console.log(`  - 2200 level: ${testStudents.filter(s => s.class === '2200').length}`);
  console.log(`Total Projects: ${testProjects.length}`);
  console.log();
  
  const wedStudents = testStudents.filter(s => s.day === 'Wednesday');
  const thuStudents = testStudents.filter(s => s.day === 'Thursday');
  const wedProjects = testProjects.filter(p => p.day === 'Wednesday');
  const thuProjects = testProjects.filter(p => p.day === 'Thursday');
  const swMajorsList = ['CS', 'SE', 'DS'];
  console.log(`Wednesday: ${wedStudents.length} students (${wedStudents.filter(s => s.class === '3200').length} 3200, ${wedStudents.filter(s => s.class === '2200').length} 2200) → ${wedProjects.length} projects (${wedProjects.filter(p => p.type === 'SW').length} SW, ${wedProjects.filter(p => p.type === 'Both').length} Both, ${wedProjects.filter(p => p.type === 'HW').length} HW)`);
  console.log(`Thursday:  ${thuStudents.length} students (${thuStudents.filter(s => s.class === '3200').length} 3200, ${thuStudents.filter(s => s.class === '2200').length} 2200) → ${thuProjects.length} projects (${thuProjects.filter(p => p.type === 'SW').length} SW, ${thuProjects.filter(p => p.type === 'Both').length} Both, ${thuProjects.filter(p => p.type === 'HW').length} HW)`);
  console.log(`Majors: ${testStudents.filter(s => swMajorsList.includes(s.major)).length} SW-track (${(testStudents.filter(s => swMajorsList.includes(s.major)).length / testStudents.length * 100).toFixed(0)}%), ${testStudents.filter(s => !swMajorsList.includes(s.major)).length} HW-track (${(testStudents.filter(s => !swMajorsList.includes(s.major)).length / testStudents.length * 100).toFixed(0)}%)`);
  console.log();

  // Run the algorithm
  const startTime = Date.now();
  const teams = await generateTeamsORTools(testStudents, testProjects);
  const endTime = Date.now();

  console.log();
  console.log('='.repeat(80));
  console.log('RESULTS');
  console.log('='.repeat(80));
  console.log();

  // Display results
  for (const project of testProjects) {
    const team = teams[project.name];
    if (!team || team.length === 0) {
      console.log(`\n📋 ${project.name} (${project.type}) [${project.day}] ⛔ DEACTIVATED`);
      continue;
    }
    console.log(`\n📋 ${project.name} (${project.type}) [${project.day}]`);
    console.log(`   Team Size: ${team.length}`);
    
    // Count 3200 students
    const upperCount = team.filter(s => s.class === '3200').length;
    console.log(`   3200 Students: ${upperCount} ✓`);
    
    // Count majors
    const hwCount = team.filter(s => 
      ['EE', 'ME', 'BME', 'CE'].includes(s.major)
    ).length;
    const swCount = team.filter(s => 
      ['CS', 'SE', 'DS'].includes(s.major)
    ).length;
    console.log(`   Major Distribution: ${hwCount} HW, ${swCount} SW`);
    
    // Count genders
    const genderCounts = team.reduce((acc, s) => {
      const g = s.gender || 'Unknown';
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const genderStr = Object.entries(genderCounts)
      .map(([g, c]) => `${c} ${g}`)
      .join(', ');
    console.log(`   Gender Distribution: ${genderStr}`);
    
    // Count classifications
    const classificationCounts = team.reduce((acc, s) => {
      acc[s.seniority] = (acc[s.seniority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const classStr = Object.entries(classificationCounts)
      .map(([c, n]) => `${n} ${c}`)
      .join(', ');
    console.log(`   Classification: ${classStr}`);
    
    // Show team members (sorted: 3200 first, then 2200)
    console.log('   Members:');
    const sortedTeam = [...team].sort((a, b) => {
      // 3200 comes before 2200
      if (a.class === '3200' && b.class === '2200') return -1;
      if (a.class === '2200' && b.class === '3200') return 1;
      return 0;
    });
    
    for (const student of sortedTeam) {
      const prefIndex = student.choices.indexOf(project.name);
      const prefLabel = prefIndex === -1 
        ? '❌ Not in preferences' 
        : `✓ Choice #${prefIndex + 1}`;
      
      const returningLabel = student.previousProject === project.name 
        ? ' 🔁 RETURNING' 
        : '';
      
      const skillCount = student.skills?.length || 0;
      const skillLabel = skillCount > 0 ? ` [${skillCount} skills]` : '';
      
      console.log(`     • ${student.name} (${student.major}, ${student.seniority}, ${student.class}) ${prefLabel}${returningLabel}${skillLabel}`);
    }
  }

  console.log();
  console.log('='.repeat(80));
  console.log('STATISTICS');
  console.log('='.repeat(80));
  console.log();

  // Calculate statistics
  const stats = calculateStatistics(teams, testStudents);
  
  console.log(`Execution Time: ${endTime - startTime}ms`);
  console.log();
  console.log('Preference Satisfaction:');
  console.log(`  - First Choice:  ${stats.firstChoice} students (${(stats.firstChoice / testStudents.length * 100).toFixed(1)}%)`);
  console.log(`  - Second Choice: ${stats.secondChoice} students (${(stats.secondChoice / testStudents.length * 100).toFixed(1)}%)`);
  console.log(`  - Third Choice:  ${stats.thirdChoice} students (${(stats.thirdChoice / testStudents.length * 100).toFixed(1)}%)`);
  console.log(`  - Fourth Choice: ${stats.fourthChoice} students (${(stats.fourthChoice / testStudents.length * 100).toFixed(1)}%)`);
  console.log(`  - Fifth Choice:  ${stats.fifthChoice} students (${(stats.fifthChoice / testStudents.length * 100).toFixed(1)}%)`);
  console.log(`  - Sixth Choice:  ${stats.sixthChoice} students (${(stats.sixthChoice / testStudents.length * 100).toFixed(1)}%)`);
  console.log(`  - Not in Choices: ${stats.noMatch} students (${(stats.noMatch / testStudents.length * 100).toFixed(1)}%)`);
  console.log();
  
  console.log('3200 Student Satisfaction:');
  console.log(`  - First Choice:  ${stats.upperFirstChoice} / ${stats.totalUpper} (${(stats.upperFirstChoice / stats.totalUpper * 100).toFixed(1)}%)`);
  console.log(`  - Top 3 Choices: ${stats.upperTop3} / ${stats.totalUpper} (${(stats.upperTop3 / stats.totalUpper * 100).toFixed(1)}%)`);
  console.log();
  
  console.log('2200 Student Satisfaction:');
  console.log(`  - First Choice:  ${stats.lowerFirstChoice} / ${stats.totalLower} (${(stats.lowerFirstChoice / stats.totalLower * 100).toFixed(1)}%)`);
  console.log(`  - Top 3 Choices: ${stats.lowerTop3} / ${stats.totalLower} (${(stats.lowerTop3 / stats.totalLower * 100).toFixed(1)}%)`);
  console.log();

  console.log('Team Balance:');
  console.log(`  - Average Team Size: ${stats.avgTeamSize.toFixed(1)}`);
  console.log(`  - Smallest Team: ${stats.minTeamSize}`);
  console.log(`  - Largest Team: ${stats.maxTeamSize}`);
  console.log();
  
  console.log('Major Matching:');
  const majorTypeMatchPercent = stats.totalStudents > 0 
    ? (stats.majorTypeMatches / stats.totalStudents * 100).toFixed(1)
    : 'N/A';
  console.log(`  - Students in Compatible Major Type: ${stats.majorTypeMatches} / ${stats.totalStudents} (${majorTypeMatchPercent}%)`);
  console.log(`    (SW students → SW/Both projects, HW students → HW/Both projects)`);
  console.log();
  
  console.log('Returning Students:');
  const returningStudents = testStudents.filter(s => s.previousProject);
  const returningMatched = returningStudents.filter(s => {
    for (const [projectName, team] of Object.entries(teams)) {
      if (team.some(t => t.id === s.id) && projectName === s.previousProject) {
        return true;
      }
    }
    return false;
  });
  console.log(`  - Returning to Same Project: ${returningMatched.length} / ${returningStudents.length} (${returningStudents.length > 0 ? (returningMatched.length / returningStudents.length * 100).toFixed(1) : 0}%)`);
  console.log();
  
  console.log('Gender Balance:');
  let isolatedGenderCount = 0;
  for (const [projectName, team] of Object.entries(teams)) {
    const maleCount = team.filter(s => s.gender === 'Male').length;
    const femaleCount = team.filter(s => s.gender === 'Female').length;
    if ((maleCount === 1 && femaleCount > 1) || (femaleCount === 1 && maleCount > 1)) {
      isolatedGenderCount++;
    }
  }
  console.log(`  - Teams with Gender Isolation: ${isolatedGenderCount} / ${Object.keys(teams).length}`);
  console.log();

  // Validate constraints
  console.log('='.repeat(80));
  console.log('CONSTRAINT VALIDATION');
  console.log('='.repeat(80));
  console.log();
  
  const violations = validateConstraints(teams, testStudents);
  if (violations.length === 0) {
    console.log('✓ All constraints satisfied!');
  } else {
    console.log('❌ Constraint violations found:');
    violations.forEach(v => console.log(`  - ${v}`));
  }
  
  console.log();
  console.log('='.repeat(80));
}

function calculateStatistics(teams: Record<string, Student[]>, allStudents: Student[]) {
  let firstChoice = 0, secondChoice = 0, thirdChoice = 0, fourthChoice = 0, fifthChoice = 0, sixthChoice = 0, noMatch = 0;
  let upperFirstChoice = 0, upperTop3 = 0, totalUpper = 0;
  let lowerFirstChoice = 0, lowerTop3 = 0, totalLower = 0;
  let majorTypeMatches = 0, totalStudents = 0;
  
  const teamSizes: number[] = [];
  const swMajors = ['CS', 'SE', 'DS'];
  const hwMajors = ['EE', 'ME', 'BME', 'CE'];

  for (const [projectName, team] of Object.entries(teams)) {
    teamSizes.push(team.length);
    
    // Find the project object
    const project = testProjects.find(p => p.name === projectName);

    for (const student of team) {
      const prefIndex = student.choices.indexOf(projectName);
      
      if (prefIndex === 0) firstChoice++;
      else if (prefIndex === 1) secondChoice++;
      else if (prefIndex === 2) thirdChoice++;
      else if (prefIndex === 3) fourthChoice++;
      else if (prefIndex === 4) fifthChoice++;
      else if (prefIndex === 5) sixthChoice++;
      else noMatch++;  // Only counts if truly not in their choices
      
      // Check major TYPE matching (SW student → SW/Both project, HW student → HW/Both project)
      if (project) {
        totalStudents++;
        const isSWStudent = swMajors.includes(student.major);
        const isHWStudent = hwMajors.includes(student.major);
        const isSWProject = project.type === 'SW';
        const isHWProject = project.type === 'HW';
        const isBothProject = project.type === 'Both';
        
        if ((isSWStudent && (isSWProject || isBothProject)) || 
            (isHWStudent && (isHWProject || isBothProject))) {
          majorTypeMatches++;
        }
      }

      if (student.class === '3200') {
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

  return {
    firstChoice,
    secondChoice,
    thirdChoice,
    fourthChoice,
    fifthChoice,
    sixthChoice,
    noMatch,
    upperFirstChoice,
    upperTop3,
    totalUpper,
    lowerFirstChoice,
    lowerTop3,
    totalLower,
    majorTypeMatches,
    totalStudents,
    avgTeamSize: teamSizes.reduce((a, b) => a + b, 0) / teamSizes.length,
    minTeamSize: Math.min(...teamSizes),
    maxTeamSize: Math.max(...teamSizes),
  };
}

function validateConstraints(teams: Record<string, Student[]>, allStudents: Student[]): string[] {
  const violations: string[] = [];
  
  // Check all students assigned
  const assignedCount = Object.values(teams).flat().length;
  if (assignedCount !== allStudents.length) {
    violations.push(`Not all students assigned: ${assignedCount}/${allStudents.length}`);
  }

  // Check no duplicates
  const assignedIds = new Set<string>();
  for (const team of Object.values(teams)) {
    for (const student of team) {
      if (assignedIds.has(student.id)) {
        violations.push(`Student ${student.name} assigned to multiple teams`);
      }
      assignedIds.add(student.id);
    }
  }

  // Check team constraints
  for (const [projectName, team] of Object.entries(teams)) {
    // Check team size against config constraints (min: 4, max: 6)
    const minSize = 4;
    const maxSize = 6;
    
    // Deactivated projects (0 students) are valid
    if (team.length === 0) continue;
    
    if (team.length < minSize) {
      violations.push(`Team "${projectName}" too small (${team.length} < ${minSize})`);
    }
    if (team.length > maxSize) {
      violations.push(`Team "${projectName}" too large (${team.length} > ${maxSize})`);
    }
    
    // Check day matching
    const project = testProjects.find(p => p.name === projectName);
    if (project?.day) {
      for (const student of team) {
        if (student.day && student.day !== project.day) {
          violations.push(`Student ${student.name} (${student.day}) assigned to "${projectName}" (${project.day})`);
        }
      }
    }
  }

  return violations;
}

// Run the test
runTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
