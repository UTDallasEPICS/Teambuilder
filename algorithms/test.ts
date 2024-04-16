//dummy student nad project data to test with

 const studentData = [
    {
        name: 'Michael Johnson',
        major: 'Electrical Engineering',
        choices: ['SP24 TH - ATC: Patient Data Collection App', 'SP24 TH - Carson\'s Village: Automated Family Page', 'SP24 TH - Office of Sustainability: Water Bottle Counter', 'SP24 TH - GDYO: Communication App', 'SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration'],
        class: '3200',
    },
    {
        name: 'Jessica Davis',
        major: 'Software Engineering',
        choices: ['SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - WCOA: Coordination App', 'SP24 TH - Legacy: Quality Control App', 'SP24 TH - Office of Sustainability: Eco Hub Greenhouse Solar Panels', 'SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - GDYO: Communication App'],
        class: '2200',
    },
    {
        name: 'David Martinez',
        major: 'Industrial Design',
        choices: ['SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - Legacy: Safer Stairs', 'SP24 TH - GDYO: Communication App', 'SP24 TH - WCOA: Coordination App', 'SP24 TH - Office of Sustainability: Water Bottle Counter', 'SP24 TH - Carson\'s Village: Automated Family Page'],
        class: '3200',
    },
    {
        name: 'Emily Rodriguez',
        major: 'Graphic Design',
        choices: ['SP24 TH - ATC: Sensory Devices', 'SP24 TH - KidsU: Donor/Volunteer Database', 'SP24 TH - Carson\'s Village: Automated Family Page', 'SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - Legacy: Quality Control App', 'SP24 TH - GDYO: Communication App'],
        class: '3200',
    },
    {
        name: 'Daniel Brown',
        major: 'Computer Science',
        choices: ['SP24 TH - WCOA: Coordination App', 'SP24 TH - GDYO: Communication App', 'SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - Office of Sustainability: Eco Hub Greenhouse Solar Panels', 'SP24 TH - ATC: Patient Data Collection App'],
        class: '2200',
    },
    {
        name: 'Sarah Garcia',
        major: 'Renewable Energy',
        choices: ['SP24 TH - Office of Sustainability: Water Bottle Counter', 'SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - ATC: Patient Data Collection App', 'SP24 TH - WCOA: Coordination App', 'SP24 TH - GDYO: Communication App', 'SP24 TH - Legacy: Safer Stairs'],
        class: '2200',
    },
    {
        name: 'Christopher Smith',
        major: 'Civil Engineering',
        choices: ['SP24 TH - GDYO: Communication App', 'SP24 TH - Legacy: Safer Stairs', 'SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - Carson\'s Village: Automated Family Page', 'SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - Office of Sustainability: Eco Hub Greenhouse Solar Panels'],
        class: '3200',
    },
    {
        name: 'Jane Jones',
        major: 'Healthcare Administration',
        choices: ['SP24 TH - ATC: Sensory Devices', 'SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - GDYO: Communication App', 'SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - Legacy: Quality Control App', 'SP24 TH - Office of Sustainability: Water Bottle Counter'],
        class: '2200',
    },
    {
        name: 'Ashley Miller',
        major: 'Information Technology',
        choices: ['SP24 TH - Legacy: Safer Stairs', 'SP24 TH - GDYO: Communication App', 'SP24 TH - Carson\'s Village: Automated Family Page', 'SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - Office of Sustainability: Water Bottle Counter'],
        class: '2200',
    },
    {
        name: 'John Rodriguez',
        major: 'Human-Computer Interaction',
        choices: ['SP24 TH - GDYO: Communication App', 'SP24 TH - Office of Sustainability: Water Bottle Counter', 'SP24 TH - Carson\'s Village: Automated Family Page', 'SP24 TH - Legacy: Safer Stairs', 'SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - WCOA: Coordination App'],
        class: '3200',
    },
    {
        name: 'Jessica Davis',
        major: 'Biomedical Engineering',
        choices: ['SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - WCOA: Coordination App', 'SP24 TH - Legacy: Quality Control App', 'SP24 TH - Office of Sustainability: Eco Hub Greenhouse Solar Panels', 'SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - GDYO: Communication App'],
        class: '2200',
    },
    {
        name: 'Daniel Smith',
        major: 'Nonprofit Management',
        choices: ['SP24 TH - Legacy: Safer Stairs', 'SP24 TH - GDYO: Communication App', 'SP24 TH - Carson\'s Village: Automated Family Page', 'SP24 TH - TheLab.ms Makerspace: Access Control Manager', 'SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - Office of Sustainability: Water Bottle Counter'],
        class: '3200',
    },
    {
        name: 'Jessica Williams',
        major: 'Data Science',
        choices: ['SP24 TH - GDYO: Communication App', 'SP24 TH - Office of Sustainability: Water Bottle Counter', 'SP24 TH - Carson\'s Village: Automated Family Page', 'SP24 TH - Legacy: Safer Stairs', 'SP24 TH - Texas Osteoporosis Foundation: Volunteering and Event Registration', 'SP24 TH - WCOA: Coordination App'],
        class: '2200',
    },
];
  

  
  const projectData: Project[] = [
    {
      name: 'SP24 TH - ATC: Patient Data Collection App',
      requiredMajors: ['Computer Science', 'Software Engineering', 'Information Technology'],
    },
    {
      name: 'SP24 TH - ATC: Sensory Devices',
      requiredMajors: ['Electrical Engineering', 'Mechanical Engineering', 'Biomedical Engineering'],
    },
    {
      name: "Carson's Village: Automated Family Page",
      requiredMajors: ['Computer Science', 'Web Development', 'Graphic Design'],
    },
    {
      name: 'GDYO: Communication App',
      requiredMajors: ['Graphic Design', 'Human-Computer Interaction', 'Software Engineering'],
    },
    {
      name: 'Legacy: Quality Control App',
      requiredMajors: ['Computer Science', 'Industrial Engineering', 'Operations Management'],
    },
    {
      name: 'TheLab.ms Makerspace: Access Control Manager',
      requiredMajors: ['Electrical Engineering', 'Computer Engineering', 'Information Security'],
    },
    {
      name: 'KidsU: Donor/Volunteer Database',
      requiredMajors: ['Computer Science', 'Information Systems', 'Nonprofit Management'],
    },
    {
      name: 'Texas Osteoporosis Foundation: Volunteering and Event Registration',
      requiredMajors: ['Public Health', 'Nutrition', 'Healthcare Administration'],
    },
    {
      name: 'Office of Sustainability: Eco Hub Greenhouse Solar Panels',
      requiredMajors: ['Environmental Engineering', 'Renewable Energy', 'Sustainable Design'],
    },
    {
      name: 'Office of Sustainability: Water Bottle Counter',
      requiredMajors: ['Environmental Science', 'Civil Engineering', 'Data Science'],
    },
    {
      name: 'UTDesigns: EPICS Team Formation',
      requiredMajors: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering'],
    },
    {
      name: 'WCOA: Coordination App',
      requiredMajors: ['Information Systems', 'Business Administration', 'Project Management'],
    },
    {
      name: 'Legacy: Safer Stairs',
      requiredMajors: ['Civil Engineering', 'Industrial Design', 'Architecture'],
    },
  ];
  
  
  
  
  // Output the dummy data
  console.log('Dummy Student Data:');
  console.log(studentData);
  console.log('\nDummy Project Data:');
  console.log(projectData);
  