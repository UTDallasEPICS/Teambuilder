<template lang="pug">
  // this all needs to be a students page, not on the index - index should be demographics display
  .div.backgroundFont.text-pillText
    .div(style='padding-top: 10px; margin: 10px;' class='pt-10 h-screen border-solid rounded-3xl box-border m-10 bg-[rgba(90,91,88,0.33)]')
      .div(class='box-border border-solid rounded-3xl min-h-28 mt-1 mr-9 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col text-pillText')
        h1.ml-4.mt-3.text-xl Instruction

        h2.ml-4.mt-2.mr-3 Upload your student list here as an excel sheet. Make sure you have these columns in your CSV file: Student ID, First Name, Last Name, Major, Seniority, and Project Preferences.
  
        
      .div(style='marginTop: "50px"' class='flex flex-inline')
        .div(class = "flex flex-col")
          FileUploader(title="Student List Upload" @fileSelected="handleFile" ref="fileUploader")

          .div(style='maxWidth: "210px", minHeight: "30px", padding:"3px"' class='bg-[rgb(102,103,104)] mt-3 ml-6 mb-3 rounded-md') 
            p(v-if='fileName' style='color: "white", fontSize: "11px", margin: "3px", wordWrap: "break-word", width: "100%"') {{ fileName }}
            
          .div(class="flex justify-start mt-32 ml-10")
            NuxtLink(to='/generate')
              button(
                class='border-solid border-8 p-2 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl'
              ) Form Teams &gt;&gt;
        
        //This is the parts where I need to add a list component to them
        .div(style={ display: 'flex', flexDirection: 'column', marginLeft: '100px' } class='flex')
          // Header Row
          .div(style={ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' })
            h1(class='text-white text-3xl ml-24') Project List
            h1(class='text-white text-3xl ml-48') Student List Preview
            p(class='text-white text-xl') Student Count: {{ studentCount }}

          // Scrollable Components Row
          .div(style={ display: 'flex', gap: '20px' }) 
            // Projects Scroll Component
            .div.border-solid.rounded-3xl.box-border(
              style="height: 450px; width: 350px; overflow-y: scroll;" 
              class="bg-[rgba(48,100,162,0.29)] p-4 pt-6"
            )
              .project-container(class="space-y-4")
                ProjectCardDisplay(
                  v-for="project in projects" 
                  :title="project.title"
                  :content="project.content"
                  :indicator="project.indicator"
                  :sem="project.sem"
                )
            
            // Student List Scroll Component
            .div.border-solid.rounded-3xl.box-border.ml-10(
              v-if="maxTeamSize" 
              style="height: 450px; width: 600px; overflow-y: scroll;"
              class="bg-[rgba(48,100,162,0.29)] p-4 pt-6"
            )
              .student-container(class="space-y-4")
                StudentCardDisplay(
                  v-for="student in students"
                  :lname="student.lname"
                  :fname="student.fname"
                  :indicator="student.indicator"
                  :netID="student.netID"
                  :isAssigned="student.isAssigned"
                )

            //.div
              ListComponent(:items="itemsList")
        
  </template>
  
  <script setup lang="ts">
  const maxTeamSize = ref(5); 
  import ProjectCardDisplay from '~/components/ProjectCardDisplay.vue';
  import StudentCardDisplay from '~/components/StudentCardDisplay.vue';
  
  const fileName = ref("");
  const uploaded = ref(false);

  const fileUploader = ref<FileUploaderInstance | null>(null);

  interface FileUploaderInstance {
    handleClick: () => void;
  }

  const handleFile = (file: File) => {
    // Trigger file input click when the button is clicked
    fileName.value = file.name;
    uploaded.value = true;
  };
  const triggerFileUpload = () => {
  // Call the handleClick method of the FileUploader
    fileUploader.value?.handleClick(); // This will trigger the file input in FileUploader
  };

  const projects = ref([
    {
      title: 'Patient Data Collection App',
      content: 'A new app for collecting patient data.',
      indicator: 'New',
      sem: 'S2024'
    },
    {
      title: 'Automated Family Page',
      content: 'A project to automate the generation of family pages.',
      indicator: 'returning',
      sem: 'S2024'
    },
    {
      title: 'Communication App',
      content: 'A real-time communication app for team collaboration.',
      indicator: 'new',
      sem: 'F2023'
    },
    {
      title: 'Data Collection App',
      content: 'A new app for collecting patient data.',
      indicator: 'New',
      sem: 'S2024'
    }
  ]);

  const students = ref([
    {
      lname: 'Dan',
      fname: 'Martin',
      indicator: 'new',
      netID: 'dxm220546',
      isAssigned: true
    },
    {
      lname: 'Chris',
      fname: 'Colman',
      indicator: 'returning',
      netID: 'cxc220546',
      isAssigned: false
    },
    {
      lname: 'Subrahmanya',
      fname: 'Mohanasundar',
      indicator: 'new',
      netID: 'sxm220546',
      isAssigned: false
    },
    {
      lname: 'Subrahmanya',
      fname: 'Mohanasundar',
      indicator: 'new',
      netID: 'sxm220546',
      isAssigned: false
    },
    {
      lname: 'Subrahmanya',
      fname: 'Mohanasundar',
      indicator: 'new',
      netID: 'sxm220546',
      isAssigned: false
    },
    {
      lname: 'Subrahmanya',
      fname: 'Mohanasundar',
      indicator: 'new',
      netID: 'sxm220546',
      isAssigned: false
    }
  ]);
  const studentCount = computed(() => students.value.length);
  </script>

