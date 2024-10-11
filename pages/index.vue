<template lang="pug">
// this all needs to be a students page, not on the index - index should be demographics display
.div.backgroundFont
  .div(style='minHeight: "820px"' class='pt-10 h-screen border-solid rounded-3xl box-border m-10 bg-[rgba(90,91,88,0.33)]')
    .div(class='box-border border-solid rounded-3xl min-h-28 mt-1 mr-9 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col')
      h1.ml-4.mt-3.text-xl Instruction
      h2.ml-4.mt-2.mr-3 Upload your student list here as an excel sheet. Make sure you have these columns in your CSV file: Student ID, First Name, Last Name, Major, Seniority, and Project Preferences.

      .div(style='marginTop: "50px"' class='flex flex-inline')
        .div
          input(type='file'.accept='text/csv' style='display: "none"')
          FileUploader(:handleFile='handleFile')
          .div(style='maxWidth: "210px", minHeight: "30px", padding:"3px"' class='bg-[rgb(102,103,104)] mt-3 ml-6 mb-3 rounded-md') 
            p(v-if='fileName' style='color: "white", fontSize: "11px", margin: "3px", wordWrap: "break-word", width: "100%"') {{ fileName }}

        .div(style='marginLeft: "100px"' class='flex')
          .div(class='flex-col')
            h1(style='fontSize: "30px"' class='ml-8 mt-3') Projects
            .div(style='marginLeft: "25px" , width: "270px", height: "400px", overflowY: "auto"' class='customMargin box-border border-solid rounded-3xl  bg-[rgba(48,100,162,0.29)]  flex flex-col')
              ProjectCardDisplay(myString="Patient Data Collection App")
              ProjectCardDisplay(myString="Automated Family Page")
              ProjectCardDisplay(myString="Communication App")
              ProjectCardDisplay(myString="EPICS TeamBuilder")

        .div(class='flex-col')
          h1(style='fontSize: "30px"' class='ml-16 mt-3 mb-3 text-xl') Student List Preview
          .div(v-if="uploaded" style='marginLeft: "50px" , minWidth: "600px", height: "400px" , overflowY: "auto"' class='customMargin  border-solid rounded-3xl  bg-[rgba(48,100,162,0.29)]  flex flex-col')
            StudentCardDisplay(v-for="student in students")

      div
        NuxtLink(to='/display')
          button(style='marginLeft: "20px"' class='border-solid border-8 p-2 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl') Form Teams &gt;&gt;
</template>

//Impement API handler calls in index later
<script setup lang="ts">
  const { data } = await useFetch('/api/partner.delete.ts')
</script>
<script setup lang="ts">
  const { data } = await useFetch('/api/partner.get.ts')
</script>
<script setup lang="ts">
  const { data } = await useFetch('/api/partner.post.ts')
</script>
<script setup lang="ts">
  const { data } = await useFetch('/api/partner.put.ts')
</script>

<script setup lang="ts">
const fileName = ref("");
const uploaded = ref(false);
const students = ref([]);
const handleFile = (file: File) => {
  // Trigger file input click when the button is clicked
  fileName.value = file.name;
  uploaded.value = true;
};

</script>