<template lang="pug">
  .centered-row.p-10.m-10(style="background: white; border-radius: 0.5rem;")
    .centered-col.gap-10(style="background: white;")
      .stepCard.gap-5
        NewSemesterCard(@fetchSemesters="fetchSemesters")
      .stepCard.gap-5
        ActivateProjectsCard(:projects="projects" :semesters="semesters" @fetchProjects="fetchProjects")
      .stepCard.gap-5
        GenerateTeamsCard(:projects="projects" :semesters="semesters" :students="students")
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHead } from 'nuxt/app';
import type { Semester } from '@prisma/client';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';
import type { StudentWithChoices } from '~/server/api/students/index.get';

useHead({ title: 'Generate Teams' });
const semesters = ref<Semester[]>([]);
const projects = ref<ProjectWithSemesters[]>([]);
const students = ref<StudentWithChoices[]>([]);

const fetchSemesters = async () => {
  semesters.value = await $fetch<Semester[]>('/api/semesters');
}

onMounted(async () => {
  await fetchSemesters();
  await fetchProjects();
  await fetchStudents();
});

const fetchProjects = async () => {
  projects.value = await $fetch<ProjectWithSemesters[]>('/api/projects');
}

const fetchStudents = async () => {
  students.value = await $fetch<StudentWithChoices[]>('/api/students?choices=true')
}
</script>

<style scoped>
.stepCard {
  /* Orange card backgrounds */
  background: var(--color-utd-orange);
  @apply flex flex-col justify-center items-center rounded-3xl p-10 w-full shadow-md
}
</style>