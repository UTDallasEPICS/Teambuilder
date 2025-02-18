<template lang="pug">
  .centered-rows.shaded-card.p-10.mx-96.mt-10.gap-10(class="h-[80vh]")
    .centered-cols.relative.size-full
      .flex.absolute.top-0.left-5.gap-2
        FileUploadButton(title="Upload Projects" @fileSelected="handleParsed")
        HelpIcon(:info="helpInfo")

      .text-7xl.drop-shadow-md Projects
      .text-2xl.drop-shadow-md.mt-2 Project Count: {{ filteredProjectCount }}

      .grid.grid-cols-3.teal-card.p-10.mt-10.gap-3.size-full.overflow-y-auto.no-scrollbar(style="grid-template-rows: repeat(auto-fill, 165px);")
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
            input.text-teal.p-2.rounded(
              v-model="searchQuery"
              type="text"
            )
          .flex.gap-10
            div
              .cardSubTitle Status
              .flex.flex-col.gap-2.mt-1
                button.pill.w-fit(@click="toggleFilterByNew" :class="newStatusBgColor") NEW
                button.pill.w-fit(@click="toggleFilterByReturning" :class="returningStatusBgColor") RETURNING
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
            Button(v-if="selectedProject" title="Archive Project" type="warning" @click="handleArchive")
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { Project } from '../types';
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia';
import { useProjectStore } from '../stores/projectStore';
import { useProjectFilters } from '../composables/project/useProjectFilters';

useHead({ title: 'Projects' });

const projectStore = useProjectStore();
const { getActiveProjects: projects } = storeToRefs(projectStore);
const selectedProject = ref<Project | null>(null);

const {
  searchQuery,
  filterByNew,
  filterByReturning,
  semesterFilters,
  filteredProjects,
  toggleSemesterFilter,
  toggleFilterByNew,
  toggleFilterByReturning,
  filteredProjectCount
} = useProjectFilters(projects);

const selectProject = (project: Project) => {
  selectedProject.value = project;
}

const handleArchive = () => {
  const id = selectedProject.value?.id;
  if (id) projectStore.archiveProject(id);
}

const handleParsed = (parsed: any) => {
  console.log(parsed)
};

const newStatusBgColor = computed(() => 
  filterByNew.value ? "bg-green" : "bg-gray-500"
)

const returningStatusBgColor = computed(() => 
  filterByReturning.value ? "bg-orange" : "bg-gray-500"
)

const semesterBgColor = (semester: string) => 
  semesterFilters[semester] ? "bg-magenta" : "bg-gray-500";

const helpInfo = `Upload information for your projects here.  
  Be sure to enter project name, project partner, target # of CS majors, 
  and whether it is an archived project.`
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