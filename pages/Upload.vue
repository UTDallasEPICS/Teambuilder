<template lang="pug">
  // this all needs to be a students page, not on the index - index should be demographics display
  .div.backgroundFont
    .div(style='minHeight: "820px"' class='pt-10 h-screen border-solid rounded-3xl box-border m-10 bg-[rgba(90,91,88,0.33)]')
      .div(class='box-border border-solid rounded-3xl min-h-28 mt-1 mr-9 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col text-pillText')
        h1.ml-4.mt-3.text-xl Instruction

        h2.ml-4.mt-2.mr-3 Upload your student list here as an excel sheet. Make sure you have these columns in your CSV file: Student ID, First Name, Last Name, Major, Seniority, and Project Preferences.
  
        
      .div(style='marginTop: "50px"' class='flex flex-inline')
        .div
          FileUploader(title="Student List Upload" @fileSelected="handleFile" ref="fileUploader")

          .div(style='maxWidth: "210px", minHeight: "30px", padding:"3px"' class='bg-[rgb(102,103,104)] mt-3 ml-6 mb-3 rounded-md') 
            p(v-if='fileName' style='color: "white", fontSize: "11px", margin: "3px", wordWrap: "break-word", width: "100%"') {{ fileName }}
  
        .div(style='marginLeft: "100px"' class='flex')
          .div(class='flex-col')
            h1(class='mt-3 justify-center ml-80 text-pillText text-3xl') Projects
            .div.border-solid.rounded-3xl.box-border(v-if="maxTeamSize" style={ height: '450px', width: '350px', margin: '20px', marginLeft: '20px', marginTop: '0px', overflowY: 'scroll' } class="bg-[rgba(48,100,162,0.29)]")
              ProjectCardDisplay(title="Patient Data Collection App", content = "Hello World", indicator = "New", sem = "S2024")
              //ProjectCardDisplay(myString="Automated Family Page")
              //ProjectCardDisplay(myString="Communication App")
              //ProjectCardDisplay(myString="EPICS TeamBuilder")
  
          .div(class='flex-col')
            h1(class='ml-32 mt-3 mb-3 text-3xl text-pillText') Student List Preview
            .div.border-solid.rounded-3xl.box-border(v-if="maxTeamSize" style={ height: '450px', width: '350px', margin: '20px', marginLeft: '20px', marginTop: '0px', overflowY: 'scroll' } class="bg-[rgba(48,100,162,0.29)]")
                StudentCardDisplay(v-for="student in students")
          .div(class='flex-col')
            p(class= 'ml-3 mt-3 text-pillText text-xl') Student Count: 

          .div
            ListComponent(:items="itemsList")
          .div(class="flex mt-auto")
            NuxtLink(to='/generate')
              button(
                class='border-solid border-8 p-2 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl mt-32'
              ) Form Teams &gt;&gt;
  </template>
  
  <script setup lang="ts">
  import ProjectCardDisplay from '~/components/ProjectCardDisplay.vue';
  
  const fileName = ref("");
  const uploaded = ref(false);
  const students = ref([]);
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
  
  
  
  </script>

