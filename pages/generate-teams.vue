<template lang="pug">
  .centered-row.mt-10
    .centered-col.gap-10
      .shaded-card.centered-row.gap-10.p-10
        .text-3xl.centered-col.teal-card.p-10
          div Rank
          div Attributes
          ol.list-decimal.centered-col.gap-3.mt-5(ref="parent")
            li.cursor-move.beige-card.text-xl(v-for="option in options" :key="option") {{ option }}
        form.text-3xl.gap-4.centered-col
          div Team Size:
          input(
            v-model="maxTeamSize"
            type="text"
            id="max_team_size"
            class="w-40 bg-[rgba(255,255,255,0.96)] border border-gray-300 text-black text-sm rounded-lg p-2.5"
            placeholder="Enter number"
            required
          )
          Button(title="Generate Teams" @click="handleGenerateTeams")
        
      .centered-row.gap-10
        .centered-col.shaded-card.p-4.text-xl
          div Team Combos
          .mb-3 Count: X  
          CombinationCard(
            :combination= 1
            :sFactor= 8
            :cFactor= 4
            :pFactor= 7
            :tWeight= 7
            :unassignedStudents= 30 
          )
        
        .centered-col.shaded-card.p-4.text-xl.gap-2
          div Unassigned Students  
          | Count: X  
          div.gap-3.overflow-y-auto.h-full
            StudentCardDisplay(
              v-for="student in students"
              :key="student.id"
              v-bind="student"
            )

        .centered-col.shaded-card.p-4.text-xl.gap-2
          div Projects
          | Incomplete: X 
          div.gap-3.overflow-y-auto.h-full
        
      Button(title="Export as CSV")
  
</template>

<script setup lang="ts">
// TODO: componentize inpout & button & text, fix layout
// TODO: needs tailwind, should be renamed to Generate.vue
import { ref } from 'vue';
import { useDragAndDrop } from '@formkit/drag-and-drop/vue';

useHead({ title: 'Generate Teams' });

const [parent, options] = useDragAndDrop([
  'Option A',
  'Option B',
  'Option C'
]);
const maxTeamSize = ref(5);
</script>

<style scoped>
ol li::marker {
  font-size: 1.875rem;
  color: rgb(253,245,217);
  padding-right: 100px;
}
</style>