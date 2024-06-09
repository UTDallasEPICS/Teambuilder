<script lang="ts" setup>
const modalOpen = ref(false); // set ref of Modal to be closed  
const rows = ref([]); // set ref of Rows of Projects to be empty  
const rowToEdit = ref(null); // set ref of editing a project to null as you aren't editing a project  

const handleDeleteRow = (targetIndex) => {
  rows.value = rows.value.filter((_, idx) => idx !== targetIndex);  //filters throw the Projects to find the Project to delete based on index
};

//handles project editing and opens Modal
const handleEditRow = (idx) => {
  rowToEdit.value = idx;
  modalOpen.value = true;
};
// this needs a rework.
const handleSubmit = (newRow) => {
  if (rowToEdit === null) {
    rows.value = [...rows.value, newRow]; // Add a new row
  } else {
    // Update the specific row
    rows.value = rows.value.map((currRow, idx) => (idx === rowToEdit.value ? newRow : currRow));
  }
  // Reset rowToEdit state after submission
  rowToEdit.value = null;
};
const closeModal = () => {
  rowToEdit.value = null;
  modalOpen.value = false;
};
</script>
<template lang="pug">
div(style={ minHeight: "780px", borderRadius: "24px" }, class="h-screen border-solid rounded-t-3xl box-border m-10 bg-[rgba(90,91,88,0.49)] pl-4 pt-7")  
  div.box-border.border-solid.rounded-3xl.min-h-28.mt-1.mr-9.ml-5.mb-3.flex.flex-col(class="bg-[rgba(48,100,162,0.29)]")
    h1.ml-4.mt-3.text-xl Instruction  
    h2.ml-4.mt-2.mr-3  
      | Upload your project information here.Be sure to enter project name,  
      | project partner, target # of CS majors, and whether it is an archived project.  
      | Once you are ready, click Submit.  
  div(style={ marginLeft: "0px" }, class="flex")  
    div.flex-col  
      h1(style={ fontSize: "30px" }, class="ml-8.mt-3") Projects  
      Table(:rows="rows", :deleteRow="handleDeleteRow", :editRow="handleEditRow")  
      button(style={ display: "block", margin: "auto", marginTop: "1rem", border: "none", backgroundColor: "aqua", color: "white", padding: "0.5rem 1rem", borderRadius: "10px", cursor: "pointer", boxShadow: "0px 5px 5px #ccc" }, @click="() => setModalOpen(true)") Add  
    div.flex-col  
      h1(style={ fontSize: "30px" }, class="ml-16.mt-3") Edit Project  
      div(style={ marginLeft: "50px", minWidth: "395px", minHeight: "300px", marginRight: "25px" }, class="customMargin box-border border-solid rounded-3xl bg-[rgba(48,100,162,0.29)].flex.flex-col")  
Modal(v-if="modalOpen", @closeModal="closeModal", @onSubmit="handleSubmit", :defaultValue="rowToEdit !== null && rows[rowToEdit]")  
</template>