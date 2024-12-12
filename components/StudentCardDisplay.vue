<template lang="pug">
  .student-card.rounded-2xl.p-4.mb-3.mx-2(class="bg-[#FFF8DC]")
    .flex.items-center.gap-2.mb-1
      h2.text-xl.font-light(class="text-[#7BA7A6]") {{ lname + ', ' + fname }}
      .indicator(
        class="rounded-full px-3 py-1 text-xs font-light text-white ml-2"
        :class="indicator.toLowerCase() === 'new' ? 'bg-[#90EE90]' : 'bg-[#FFA07A]'"
      ) {{ indicator.toUpperCase() }}
    h2.text-xl.font-light(class="text-[#7BA7A6]") Net ID: {{ netID }}
  </template>
  
  <script setup lang="ts">
  interface Props {
    lname: string
    fname: string
    indicator: string
    netID: string
  }
  
  defineProps<Props>();
  </script>

