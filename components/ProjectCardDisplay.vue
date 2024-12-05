<template lang="pug">
  .project-card.rounded-2xl.p-4.mb-3.mx-2(class="bg-[#FFF8DC]")
    h2.text-xl.font-light(class="text-[#7BA7A6]") {{ title }}
    .indicators.flex.gap-2.mt-2
      .indicator(
        class="rounded-full px-3 py-1 text-xs font-light text-white"
        :class="indicator.toLowerCase() === 'new' ? 'bg-[#90EE90]' : 'bg-[#FFA07A]'"
      ) {{ indicator.toUpperCase() }}
      .semester(class="bg-[#87CEEB] rounded-full px-3 py-1 text-xs font-light text-white") {{ sem }}
    p.text-sm.mt-2.font-light(class="text-[#7BA7A6]") {{ content }}
  </template>
  
  <script setup lang="ts">
  interface Props {
    title: string
    content: string
    indicator: string
    sem: string
  }
  
  defineProps<Props>()
  </script>