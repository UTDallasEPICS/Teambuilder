<template lang="pug">
  .beige-card.hover-effect.flex.flex-col.gap-2
    .text-xl.font-medium {{ name }}
    .flex.gap-2
      .pill(:class="statusBgColor") {{ status.toUpperCase() }}
      .pill.bg-magenta {{ semester }}
    .text-md {{ description }}
</template>
  
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
  description: string;
  status: string;
  semester: string;
}

const props = defineProps<Props>()

const statusBgColor = computed(() => ({
  "bg-green": props.status === 'new',
  "bg-orange": props.status === 'returning',
  "bg-red": props.status === 'archived'
}));
</script>