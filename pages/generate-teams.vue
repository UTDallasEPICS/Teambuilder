<template lang="pug">
  .centered-col.shaded-card.mt-10.p-10.gap-10
    .stepCard.gap-5
      NewSemesterCard(@fetchSemesters="fetchSemesters")
    .stepCard.gap-5
      ActivateProjectsCard(:projects="projects" :semesters="semesters" @fetchProjects="fetchProjects")
    .stepCard.gap-5
      GenerateTeamsCard
</template>

<script setup lang="ts">
useHead({ title: 'Generate Teams' });

const semesters = ref<Semester[]>([]);
const projects = ref<ProjectWithSemesters[]>([]);

onMounted(async () => {
  fetchSemesters();
  fetchProjects();
});

const fetchSemesters = async () => {
  semesters.value = await $fetch<Semester[]>('/api/semesters');
}

const fetchProjects = async () => {
  projects.value = await $fetch<ProjectWithSemesters[]>('/api/projects');
}
</script>

<style scoped>
.stepCard {
  /* centered-col teal-card p-10 w-full */
  @apply flex flex-col justify-center items-center bg-teal rounded-3xl p-10 w-full
}
</style>