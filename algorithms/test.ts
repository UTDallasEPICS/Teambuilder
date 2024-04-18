//dummy student nad project data to test with
import { Student, Project } from './algorithm';
import { generateTeams } from './algorithm';


const studentData: Student[] = [
  {
      name: 'Michael Johnson',
      major: 'Electrical Engineering',
      choices: ['ATC: Patient Data Collection App', 'Carson\'s Village: Automated Family Page', 'Office of Sustainability: Water Bottle Counter', 'GDYO: Communication App', 'TheLab.ms Makerspace: Access Control Manager', 'Texas Osteoporosis Foundation: Volunteering and Event Registration'],
      class: '3200',
  },
  {
      name: 'Jessica Davis',
      major: 'Software Engineering',
      choices: ['Texas Osteoporosis Foundation: Volunteering and Event Registration', 'WCOA: Coordination App', 'Legacy: Quality Control App', 'Office of Sustainability: Eco Hub Greenhouse Solar Panels', 'TheLab.ms Makerspace: Access Control Manager', 'GDYO: Communication App'],
      class: '2200',
  },
  {
      name: 'David Martinez',
      major: 'Industrial Design',
      choices: ['TheLab.ms Makerspace: Access Control Manager', 'Legacy: Safer Stairs', 'GDYO: Communication App', 'WCOA: Coordination App', 'Office of Sustainability: Water Bottle Counter', 'Carson\'s Village: Automated Family Page'],
      class: '3200',
  },
  {
      name: 'Emily Rodriguez',
      major: 'Graphic Design',
      choices: ['ATC: Sensory Devices', 'KidsU: Donor/Volunteer Database', 'Carson\'s Village: Automated Family Page', 'TheLab.ms Makerspace: Access Control Manager', 'Legacy: Quality Control App', 'GDYO: Communication App'],
      class: '3200',
  },
  {
      name: 'Daniel Brown',
      major: 'Computer Science',
      choices: ['WCOA: Coordination App', 'GDYO: Communication App', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'TheLab.ms Makerspace: Access Control Manager', 'Office of Sustainability: Eco Hub Greenhouse Solar Panels', 'ATC: Patient Data Collection App'],
      class: '2200',
  },
  {
      name: 'Sarah Garcia',
      major: 'Renewable Energy',
      choices: ['Office of Sustainability: Water Bottle Counter', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'ATC: Patient Data Collection App', 'WCOA: Coordination App', 'GDYO: Communication App', 'Legacy: Safer Stairs'],
      class: '2200',
  },
  {
      name: 'Christopher Smith',
      major: 'Civil Engineering',
      choices: ['GDYO: Communication App', 'Legacy: Safer Stairs', 'TheLab.ms Makerspace: Access Control Manager', 'Carson\'s Village: Automated Family Page', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'Office of Sustainability: Eco Hub Greenhouse Solar Panels'],
      class: '3200',
  },
  {
      name: 'Jane Jones',
      major: 'Healthcare Administration',
      choices: ['ATC: Sensory Devices', 'TheLab.ms Makerspace: Access Control Manager', 'GDYO: Communication App', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'Legacy: Quality Control App', 'Office of Sustainability: Water Bottle Counter'],
      class: '2200',
  },
  {
      name: 'Ashley Miller',
      major: 'Information Technology',
      choices: ['Legacy: Safer Stairs', 'GDYO: Communication App', 'Carson\'s Village: Automated Family Page', 'TheLab.ms Makerspace: Access Control Manager', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'Office of Sustainability: Water Bottle Counter'],
      class: '2200',
  },
  {
      name: 'John Rodriguez',
      major: 'Human-Computer Interaction',
      choices: ['GDYO: Communication App', 'Office of Sustainability: Water Bottle Counter', 'Carson\'s Village: Automated Family Page', 'Legacy: Safer Stairs', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'WCOA: Coordination App'],
      class: '3200',
  },
  {
      name: 'Jessica Davis',
      major: 'Biomedical Engineering',
      choices: ['Texas Osteoporosis Foundation: Volunteering and Event Registration', 'WCOA: Coordination App', 'Legacy: Quality Control App', 'Office of Sustainability: Eco Hub Greenhouse Solar Panels', 'TheLab.ms Makerspace: Access Control Manager', 'GDYO: Communication App'],
      class: '2200',
  },
  {
      name: 'Daniel Smith',
      major: 'Nonprofit Management',
      choices: ['Legacy: Safer Stairs', 'GDYO: Communication App', 'Carson\'s Village: Automated Family Page', 'TheLab.ms Makerspace: Access Control Manager', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'Office of Sustainability: Water Bottle Counter'],
      class: '3200',
  },
  {
      name: 'Jessica Williams',
      major: 'Data Science',
      choices: ['GDYO: Communication App', 'Office of Sustainability: Water Bottle Counter', 'Carson\'s Village: Automated Family Page', 'Legacy: Safer Stairs', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'WCOA: Coordination App'],
      class: '2200',
  },
  {
      name: 'Michelle Lee',
      major: 'Chemical Engineering',
      choices: ['TheLab.ms Makerspace: Access Control Manager', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'GDYO: Communication App', 'Legacy: Quality Control App', 'ATC: Sensory Devices', 'Office of Sustainability: Water Bottle Counter'],
      class: '3200',
  },
  {
      name: 'Ryan Brown',
      major: 'Mechanical Engineering',
      choices: ['Carson\'s Village: Automated Family Page', 'WCOA: Coordination App', 'Legacy: Safer Stairs', 'Office of Sustainability: Water Bottle Counter', 'GDYO: Communication App', 'TheLab.ms Makerspace: Access Control Manager'],
      class: '2200',
  },
  {
      name: 'Sophia Garcia',
      major: 'Physics',
      choices: ['ATC: Patient Data Collection App', 'TheLab.ms Makerspace: Access Control Manager', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'WCOA: Coordination App', 'Office of Sustainability: Water Bottle Counter', 'GDYO: Communication App'],
      class: '2200',
  },
  {
      name: 'Brian Martinez',
      major: 'Aerospace Engineering',
      choices: ['Legacy: Quality Control App', 'Office of Sustainability: Eco Hub Greenhouse Solar Panels', 'GDYO: Communication App', 'Carson\'s Village: Automated Family Page', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'TheLab.ms Makerspace: Access Control Manager'],
      class: '3200',
  },
  {
      name: 'Emma Rodriguez',
      major: 'Biomedical Sciences',
      choices: ['GDYO: Communication App', 'ATC: Patient Data Collection App', 'Legacy: Safer Stairs', 'TheLab.ms Makerspace: Access Control Manager', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'Office of Sustainability: Water Bottle Counter'],
      class: '2200',
  },
  {
      name: 'Matthew Nguyen',
      major: 'Mathematics',
      choices: ['WCOA: Coordination App', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'GDYO: Communication App', 'TheLab.ms Makerspace: Access Control Manager', 'Legacy: Safer Stairs', 'Office of Sustainability: Water Bottle Counter'],
      class: '3200',
  },
  {
      name: 'Olivia Taylor',
      major: 'Environmental Science',
      choices: ['Office of Sustainability: Water Bottle Counter', 'Texas Osteoporosis Foundation: Volunteering and Event Registration', 'Carson\'s Village: Automated Family Page', 'WCOA: Coordination App', 'GDYO: Communication App', 'Legacy: Safer Stairs'],
      class: '2200',
  },
];

  
const projectData: Project[] = [
  {
    name: 'ATC: Patient Data Collection App',
    requiredMajors: ['Computer Science', 'Software Engineering', 'Information Technology'],
  },
  {
    name: 'ATC: Sensory Devices',
    requiredMajors: ['Electrical Engineering', 'Mechanical Engineering', 'Biomedical Engineering'],
  },
  {
    name: "Carson's Village: Automated Family Page",
    requiredMajors: ['Computer Science', 'Web Development', 'Graphic Design'],
  },
];
  
  
// Output the dummy data
console.log('Dummy Student Data:');
console.log(studentData);
console.log('\nDummy Project Data:');
console.log(projectData);
console.log('\nTeams:');
console.log(generateTeams(studentData, projectData, 6, 8))
