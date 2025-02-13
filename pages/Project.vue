<template lang="pug">
  div(class="font-jura h-screen min-h-[780px] rounded-[24px] border-solid rounded-t-3xl box-border m-10 bg-[rgba(90,91,88,0.49)] pl-4 pt-7")  
    div.box-border.border-solid.rounded-3xl.min-h-28.mt-1.mr-9.ml-5.mb-3.flex.flex-col.text-pillText(class="bg-[rgba(48,100,162,0.29)]")
      h1.ml-4.mt-3.text-xl Instruction  
      h2.ml-4.mt-2.mr-3   
        | Upload your project information here.
        br
        | Be sure to enter project name,  
        | project partner, target # of CS majors, and whether it is an archived project.  
        | Once you are ready, click Submit.  
    
    
    
    .div(style={ display: 'flex', flexDirection: 'column', marginLeft: '100px' } class='flex') 
  
      .div(
        style={ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px', gap: '50px'}
      ) 
        FileUploader(title="Upload Project List" @fileSelected="handleFile") 
        h1(class="text-5xl ml-52 text-pillText") Projects:  
        h1(class="text-5xl ml-40 text-pillText") Edit Project:  
      
      .div(
        style={ display: 'flex', gap: '20px' }
      ) 
        // Projects Scroll Component
        .div.border-solid.rounded-3xl.box-border(
          style="height: 450px; width: 350px; overflow-y: scroll;" 
          class="bg-[rgba(48,100,162,0.29)] p-4 pt-6 ml-96"
        )
          .project-container(class="space-y-4")
            ProjectCardDisplay(
              v-for="project in projects" 
              :title="project.title"
              :content="project.content"
              :indicator="project.indicator"
              :sem="project.sem"
            )
          
        .div.border-solid.rounded-3xl.box-border(
          style="height: 450px; width: 350px; " 
          class="bg-[rgba(48,100,162,0.29)] p-4 pt-6 ml-20"
        )
          


          

        
        
          div
            
            //div(class="ml-50 mr-25 min-w-395 min-h-300 customMargin box-border border-solid rounded-3xl bg-[rgba(48,100,162,0.29)] flex flex-col")  
            //Modal(v-if="modalOpen", @closeModal="closeModal", @onSubmit="handleSubmit", :defaultValue="rowToEdit !== null && rows[rowToEdit]")
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue';
import Papa from 'papaparse';
import ProjectCardDisplay from '~/components/ProjectCardDisplay.vue';

const modalOpen = ref(false); // Modal visibility state
const rows = ref([]); // Rows of Projects
const rowToEdit = ref<number | null>(null); // Row index to edit
const context = getCurrentInstance();

const handleDeleteRow = (targetIndex: number) => {
  rows.value = rows.value.filter((_, idx) => idx !== targetIndex); // Filter rows to find the target index
};

// Handles project editing and opens Modal
const handleEditRow = (idx: number) => {
  rowToEdit.value = idx;
  modalOpen.value = true;
};

const handleSubmit = (newRow: { [key: string]: any }) => { // Specify type for newRow if possible
  if (rowToEdit.value === null) {
    rows.value = [...rows.value, newRow]; // Add a new row
  } else {
    // Update the specific row
    rows.value = rows.value.map((currRow, idx) => (idx === rowToEdit.value ? newRow : currRow));
  }
  // Reset rowToEdit state after submission
  rowToEdit.value = null;
  modalOpen.value = false;
};

const closeModal = () => {
  rowToEdit.value = null;
  modalOpen.value = false;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null; // Get the uploaded file

  if (file) {
    // Use PapaParse to parse the file
    Papa.parse(file, {
      header: true, // Treat the first row as header
      skipEmptyLines: true, // Skip empty lines
      complete: (results) => {
        rows.value = results.data; // Store parsed data
        console.log('Parsed CSV Data:', rows.value); // Log for debugging
      },
      error: (error) => {
        console.error('Error parsing CSV:', error); // Handle errors
      }
    });
  }
};

const openFileDialog = () => {
  const fileInput = context?.refs?.fileInput;  // Safely access fileInput
  if (fileInput) {
    (fileInput as HTMLInputElement).click();  // Type assertion
  } else {
    console.error('fileInput ref is not defined');
  }
};
  
interface FileUploaderInstance {
  handleClick: () => void;
}

const fileName = ref("");
const uploaded = ref(false);
//const students = ref([]);
const fileUploader = ref<FileUploaderInstance | null>(null);

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

</script>


