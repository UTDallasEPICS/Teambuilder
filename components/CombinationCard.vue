<template lang="pug">
    .combination-card.rounded-2xl.p-4.mb-3.mx-2(class="bg-[#FFF8DC]")
        .flex.items-center.gap-2.mb-1
            h2.text-xl.font-light(class="text-[#7BA7A6]") Combination: {{ combination }}
        
        p.text-sm.mt-2.font-light(class="text-[#7BA7A6]") Skill Factor: {{ sFactor }}/10
        p.text-sm.mt-2.font-light(class="text-[#7BA7A6]") Classification Factor: {{ cFactor }}/10
        p.text-sm.mt-2.font-light(class="text-[#7BA7A6]") Preference Factor: {{ pFactor }}/10
        p.text-sm.mt-2.font-light(class="text-[#7BA7A6]") Team Weight: {{ tWeight }}/10
        .flex.items-center.gap-2.mb-1
            p.text-sm.mt-2.font-light(class="text-[#7BA7A6]") Unassigned students: {{ unassignedStudents }}
            .select-Button(
                class="rounded-full px-3 py-1 text-xs font-light text-white ml-2 bg-[#90EE90]"

            ) SELECT
        
</template>

<script setup lang="ts">
  interface Props {
    combination: Number
    sFactor: Number
    cFactor: Number
    pFactor: Number
    tWeight: Number
    unassignedStudents: Number
  }
  
  defineProps<Props>();
</script>