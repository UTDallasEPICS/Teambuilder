You said:
similarly to how you modified my $fetch to usefetch code in my partners.vue, change it for the following generate-teams.vue page. check this code and see if any of the $fetch statments need to be converted into useFetch. If you need more code in order to make a proper judgement, please let me know instead of guessing. make it functional and working with less changes from main if possible. 


<template lang="pug">
  .centered-col.shaded-card.mt-10.p-10.gap-10
    .stepCard.gap-5
      NewSemesterCard(@fetchSemesters="fetchSemesters")
    .stepCard.gap-5
      ActivateProjectsCard(:projects="projects" :semesters="semesters" @fetchProjects="fetchProjects")
    .stepCard.gap-5
      GenerateTeamsCard(:projects="projects" :semesters="semesters" :students="students")
</template>

<script setup lang="ts">
import type { Semester } from '@prisma/client';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';
import type { StudentWithChoices } from '~/server/api/students/index.get';
import { onMounted } from 'vue';

useHead({ title: 'Generate Teams' });

const semesters = ref<Semester[]>([]);
const projects = ref<ProjectWithSemesters[]>([]);
const students = ref<StudentWithChoices[]>([]);

onMounted(async () => {
  fetchSemesters();
  fetchProjects();
  fetchStudents();
});

const fetchSemesters = async () => {
  semesters.value = await $fetch<Semester[]>('/api/semesters');
}

const fetchProjects = async () => {
  projects.value = await $fetch<ProjectWithSemesters[]>('/api/projects');
}

const fetchStudents = async () => {
  students.value = await $fetch<StudentWithChoices[]>('/api/students?choices=true')
}
</script>

<style scoped>
.stepCard {
  /* centered-col teal-card p-10 w-full */
  @apply flex flex-col justify-center items-center bg-teal rounded-3xl p-10 w-full
}
</style>