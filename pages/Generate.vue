<script setup lang="ts">
const maxTeamSize = ref(5); // State to store maximum team size
// TODO: componentize inpout & button & text, fix layout
// TODO: needs tailwind, should be renamed to Generate.vue
</script>
<style></style>

<template lang="pug">
.border-solid.rounded-3xl.box-border.m-10(style={ minHeight: '900px', minWidth: '500px' })  
  div  
    Head  
      title Display  
  
  .border-solid.rounded-3xl.box-border(
  style={ minHeight: '150px', minWidth: '500px', margin: '20px', padding: '20px' }
  class="bg-[rgba(48,100,162,0.29)]")
    form
      div.text-lg.text-white.font-medium.flex.flex-col.items-start.space-y-4
        // Row for Attribute Importance
        div.flex.items-center
          h1.backgroundFont.ml-3.mt-5.text-pillText Attribute Importance :
          input(
            v-model="attributeImportance"
            type="text"
            id="attribute_importance"
            class="w-40 bg-[rgba(255,255,255,0.96)] ml-5 border border-gray-300 text-black text-sm rounded-lg p-2.5 placeholder-black-400 dark:text-black mt-5"
            placeholder="Enter value"
            required
          )
        // Row for Maximum Team Size
        div.flex.items-center
          h1.backgroundFont.ml-3.mt-5.text-pillText Maximum Team Size :
          input(
            v-model="maxTeamSize"
            type="text"
            id="max_team_size"
            class="w-40 bg-[rgba(255,255,255,0.96)] ml-5 border border-gray-300 text-black text-sm rounded-lg p-2.5 placeholder-black-400 dark:text-black mt-5"
            placeholder="Enter number"
            required
          )
      div.ml-0.mt-2.mb-0.flex.justify-end
        button(
          type="button"
          @click=handleGenerateTeams
          class="ml-3 text-white bg-[rgba(96,241,135,0.9)] hover:bg-[rgba(128,172,108,0.9)] font-medium rounded-xl text-lg px-5 py-2.5 focus:outline-none backgroundFont"
        ) Generate Teams
    
  
  div(style={ display: 'inline-flex' })  
    div(style={ display: 'flex', flexDirection: 'column', marginTop: '40px' })  
      p.backgroundFont(style={ marginLeft: '25px', fontSize: '20px' }) Team Combos  
      p.backgroundFont(style={ marginLeft: '25px', marginBottom: '5px' }) Count: X  
      div.border-solid.rounded-3xl.box-border(v-if="maxTeamSize" style={ height: '450px', width: '350px', margin: '20px', marginLeft: '20px', marginTop: '0px', overflowY: 'scroll' } class="bg-[rgba(48,100,162,0.29)]")  
        ProjectMatch(myString="Patient Data Collection App")  
        ProjectMatch(myString="Automated Family Page")  
        ProjectMatch(myString="Communication App")  
        ProjectMatch(myString="EPICS TeamBuilder")  
    div(style={ display: 'flex', flexDirection: 'column', marginTop: '40px' })  
      p.backgroundFont(style={ marginLeft: '80px', fontSize: '20px' }) Unassigned Students  
      p.backgroundFont(style={ marginLeft: '80px', marginBottom: '5px' }) Count: X  
      div.border-solid.rounded-3xl.box-border(v-if="maxTeamSize" style={ height: '450px', width: '350px', margin: '20px', marginLeft: '80px', marginTop: '0px', overflowY: 'scroll' } class="bg-[rgba(48,100,162,0.29)]")  
        UnassignedStudents  
        UnassignedStudents  
        UnassignedStudents  
        UnassignedStudents  
        UnassignedStudents  
        UnassignedStudents  
    div(style={ display: 'flex', flexDirection: 'column', marginTop: '40px' })  
      p.backgroundFont(style={ marginLeft: '80px', fontSize: '20px' }) Project Status  
      p.backgroundFont(style={ marginLeft: '80px', marginBottom: '5px' }) Incomplete: X  
      div.border-solid.rounded-3xl.box-border(style={ height: '450px', width: '350px', margin: '20px', marginLeft: '80px', marginTop: '0px', overflowY: 'scroll' } class="bg-[rgba(48,100,162,0.29)]")  
        Link(href="/display")  
          button(style={ marginLeft: '20px' }, className='backgroundFont border-solid border-8 p-2 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl') Export as CSV >>  

</template>