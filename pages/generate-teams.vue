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
          div.text-lg.text-white.font-medium.flex.items-center 
            // Row for Attribute Importance
            h1.backgroundFont.ml-3.mt-5.text-3xl.text-pillText Attribute Importance :
            div.flex.ml-5
              // Dropdown 1
              h1.backgroundFont.ml-3.mt-5.text-3xl.text-pillText 1
              select(
                v-model="dropdown1"
                class="w-40 pillText ml-2 border border-gray-300 text-black text-sm rounded-lg p-2.5 placeholder-black-400 dark:text-black mt-5"
                required
              )
                option(value="" disabled selected hidden) Skill Match
                option(value="option1") Option 1
                option(value="option2") Option 2
              // Dropdown 2
              h1.backgroundFont.ml-6.mt-5.text-3xl.text-pillText 2
              select(
                v-model="dropdown1"
                id="dropdown_example"
                class="w-40 pillText ml-2 border border-gray-300 text-black text-sm rounded-lg p-2.5 placeholder-black-400 dark:text-black mt-5"
                required
              )  
                option(value="") Project Preference
                option(value="option1") Option 1
                option(value="option2") Option 2
              // Dropdown 3
              h1.backgroundFont.ml-6.mt-5.text-3xl.text-pillText 3
              select(
                v-model="dropdown1"
                id="dropdown_example"
                class="w-40 bg-[rgba(255,255,255,0.96)] ml-2 border border-gray-300 text-black text-sm rounded-lg p-2.5 placeholder-black-400 dark:text-black mt-5"
                required
              )  
                option(value="") Classification
                option(value="option1") Option 1
                option(value="option2") Option 2
  
          // Row for Maximum Team Size
          div.flex.items-center
            h1.backgroundFont.ml-3.mt-5.text-pillText.text-3xl Maximum Team Size :
            input(
              v-model="maxTeamSize"
              type="text"
              id="max_team_size"
              class="w-40 bg-[rgba(255,255,255,0.96)] ml-24 border border-gray-300 text-black text-sm rounded-lg p-2.5 placeholder-black-400 dark:text-black mt-5"
              placeholder="Enter number"
              required
            )
        div.ml-0.mt-2.mb-0.flex.justify-end
          button(
            type="button"
            @click=handleGenerateTeams
            class="ml-3 text-white bg-[rgba(96,241,135,0.9)] hover:bg-[rgba(128,172,108,0.9)] font-medium rounded-xl text-lg px-5 py-2.5 focus:outline-none backgroundFont"
          ) Generate Teams
      
    
    div(style={ display: 'inline-flex' } class="ml-4")  
      div(style={ display: 'flex', flexDirection: 'column', marginTop: '40px' })  
        p.backgroundFont(style={ marginLeft: '25px', fontSize: '20px' }) Team Combos  
        p.backgroundFont(style={ marginLeft: '25px', marginBottom: '5px' }) Count: X  
        div.border-solid.rounded-3xl.box-border(
          style="height: 450px; width: 350px; overflow-y: scroll;" 
          class="bg-[rgba(48,100,162,0.29)] p-4 pt-6 ml-4"
        ) 
          .combination-container(class="space-y-4")  
            CombinationCard(
              :combination= 1
              :sFactor= 8
              :cFactor= 4
              :pFactor= 7
              :tWeight= 7
              :unassignedStudents= 30 
            )
      
      div(style={ display: 'flex', flexDirection: 'column', marginTop: '40px' })  
        p.backgroundFont(style={ marginLeft: '80px', fontSize: '20px' }) Unassigned Students  
        p.backgroundFont(style={ marginLeft: '80px', marginBottom: '5px' }) Count: X  
        div.border-solid.rounded-3xl.box-border.ml-10(
          v-if="maxTeamSize" 
          style="height: 450px; width: 450px; overflow-y: scroll;"
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
          
      
      
      div(style={ display: 'flex', flexDirection: 'column', marginTop: '40px' })  
        p.backgroundFont(style={ marginLeft: '80px', fontSize: '20px' }) Project Status  
        p.backgroundFont(style={ marginLeft: '80px', marginBottom: '5px' }) Incomplete: X  
        div.border-solid.rounded-3xl.box-border(style={ height: '450px', width: '350px', margin: '20px', marginLeft: '80px', marginTop: '0px', overflowY: 'scroll' } class="bg-[rgba(48,100,162,0.29)]")  
      
    
        button(
          type="button"
          style={
            width: '250px',
            bottom: '20px',
            right: '10px',
            zIndex: '999' 
          },
          className='mt-10 ml-64 font-bold backgroundFont border-solid border-8 p-1 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl text-pillText'
        )  Export as CSV >>
  
</template>

<script setup lang="ts">
// TODO: componentize inpout & button & text, fix layout
// TODO: needs tailwind, should be renamed to Generate.vue
import { reactive, ref } from 'vue';

const maxTeamSize = ref(5);
const students = reactive([
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
    }
  ]);

</script>

