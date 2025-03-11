<template lang="pug">
tr.border-b.border-teal.border-2.p-5.max-w-full
  td {{ project.name }}
  td {{ project.description }}
  td.text-center {{ project.targetCS }}
  td.text-center
    .pill.w-20(:class="statusBgColor") {{ project.status.toUpperCase() }}
  td.text-center {{ project.semester }}
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '../types';

const { project } = defineProps<{ project: Project }>();

const statusBgColor = computed(() => ({
  "bg-green": project.status === 'new',
  "bg-orange": project.status === 'returning',
  "bg-red": project.status === 'archived'
}));
</script>

<style scoped>
td {
  max-width: 18vw;
  @apply p-4 truncate
}
</style>