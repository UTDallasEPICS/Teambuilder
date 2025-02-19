<template lang="pug">
  .beige-card.hover-effect.flex.flex-col.gap-2
    .flex.justify-between.gap-4
      .flex.flex-col.text-xl.font-medium
        div {{ lastName + ', ' }}
        div {{ firstName }}
      .centered-col
        .pill(:class="statusBgColor") {{ status.toUpperCase() }}
    .text-base Net ID: {{ netID }}
  </template>
  
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  firstName: string;
  lastName: string;
  status: string;
  netID: string;
}

const props = defineProps<Props>();

const statusBgColor = computed(() => ({
  "bg-green": props.status === 'new',
  "bg-orange": props.status === 'returning',
  "bg-red": props.status === 'archived'
}));
</script>

