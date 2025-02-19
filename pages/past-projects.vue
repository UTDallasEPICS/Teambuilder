<template lang="pug">
  .centered-row.shaded-card.p-10.mx-96.mt-10.gap-10(class="h-[80vh]")
    .centered-col.relative.size-full
      .text-7xl.drop-shadow-md Past Projects
      .text-2xl.drop-shadow-md.mt-2 Project Count: {{ filteredProjectCount }}

      .grid.grid-cols-3.teal-card.p-10.mt-10.gap-3.h-full.w-full.overflow-y-auto.no-scrollbar(style="grid-template-rows: repeat(auto-fill, 165px);")
        ProjectCardDisplay(
          v-for="project in filteredProjects"
          :key="project.id"
          v-bind="project"
          @click="selectProject(project)"
          style="height: 165px;"
        )
    .flex.flex-col(class="w-1/2").h-full.gap-10
      .teal-card.p-5(class="h-2/5")
        .cardRows
          .cardTitle Filters
          .flex.flex-col.gap-2
            .cardSubTitle Search by Name
            input(
              v-model="searchQuery"
              type="text"
              class="border text-teal p-2 rounded w-full mb-4"
            )
          .flex.gap-10
            div
              .cardSubTitle Semester
              .grid.grid-flow-col.grid-rows-3.gap-2.mt-1
                button.pill.w-fit(
                  v-for="semester in Object.keys(semesterFilters)" 
                  @click="toggleSemesterFilter(semester)" 
                  :class="semesterBgColor(semester)"
                ) {{ semester.toUpperCase() }}

      .teal-card.p-5.flex-auto
        .cardRows.h-full
          .cardTitle Project Details
          div
            span.cardSubTitle Name:
            span.cardText {{ selectedProject?.name }}
          div
            span.cardSubTitle Description:
            span.cardText {{ selectedProject?.description }}
          div
            span.cardSubTitle Status:
            span.cardText {{ capitalize(selectedProject?.status) }}
          div
            span.cardSubTitle Semester:
            span.cardText {{ selectedProject?.semester }}
          div
            span.cardSubTitle Repo:
            a.cardText(:href="selectedProject?.repoURL" target="_blank") {{ selectedProject?.repoURL }}
          .flex-grow.flex.justify-end.items-end
            Button(v-if="selectedProject" title="Restore Project" type="success" @click="handleRestore")

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Project } from '../types';
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia';
import { useProjectFilters } from '../composables/project/useProjectFilters';
import { useProjectStore } from '../stores/projectStore';

useHead({ title: 'Projects' });

const projectStore = useProjectStore();
const { getArchivedProjects: projects } = storeToRefs(projectStore);
const selectedProject = ref<Project | null>(null);

const {
  searchQuery,
  semesterFilters,
  filteredProjects,
  toggleSemesterFilter,
  filteredProjectCount
} = useProjectFilters(projects);

const selectProject = (project: Project) => {
  selectedProject.value = project;
}

const semesterBgColor = (semester: string) => 
  semesterFilters[semester] ? "bg-magenta" : "bg-gray-500";

const handleRestore = () => {
  const id = selectedProject.value?.id;
  if (id) projectStore.restoreProject(id);
}
</script>

<style scoped>
.cardRows {
  @apply flex flex-col gap-5
}
.cardTitle {
  text-shadow: 1px 1px 1px #0000008b;
  @apply text-4xl
}
.cardSubTitle {
  text-shadow: 1px 1px 1px #0000008b;
  @apply text-2xl mr-2
}
.cardText {
  @apply text-xl
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>