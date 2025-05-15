<template lang="pug">
  .text-3xl.embossed Step 3: Generate Teams
  Dropdown(
    v-model="selectedSemester"
    :options="semesters"
    placeholder="Select Semester"
  )
    template(#option="slotProps") {{ displaySemester(slotProps.option) }}
    template(#value="slotProps")
      div(v-if="slotProps.value") {{ displaySemester(slotProps.value) }}
      span(v-else) {{ slotProps.placeholder }}
  ClickableButton.mt-5(title="Generate Teams", @click="handleGenerateTeams")
  .overlay(v-if="showOverlay" @click="closeModal")
  .teal-card.p-15.modal.gap-2.overflow-y-auto.max-h-screen.m-10(v-if="showOverlay")
    .text-5xl.embossed.mb-5.text-center Generated Teams
    .grid.grid-cols-4
      div(v-for="(studentNames, projectName) in displayTeams" :key="team" class="mb-8")
        h2.text-xl.embossed {{ projectName }}
        div(v-for="(studentName, index) in studentNames" :key="index") {{ studentName }}
</template>

<script setup lang="ts">
import type { Project, Semester } from '@prisma/client';
import { generateTeams } from '~/algorithms/algorithm-S25';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';
import type { StudentWithChoices } from '~/server/api/students/index.get';
import { getActiveProjects } from '~/server/services/projectService';
import { displaySemester } from '~/server/services/semesterService';

interface DisplayTeams {
  [key: string]: string[]
}

const { projects, semesters, students } = defineProps<{
  projects: ProjectWithSemesters[]
  semesters: Semester[]
  students: StudentWithChoices[]
}>()

const selectedSemester = ref<Semester | null>(null);
const showOverlay = ref<boolean>(false);
const displayTeams = ref<DisplayTeams | null>(null);

const closeModal = () => {
  showOverlay.value = false;
}

const handleGenerateTeams = async () => {
  if (!selectedSemester.value) {
    // show error toast prompting semester selection
    // maybe just gray out and disable button if a semester isn't selected
  } else {
    const activeStudents = students.filter(student => student.status === 'ACTIVE');
    const activeProjects = getActiveProjects(projects, selectedSemester.value)
    const teams = generateTeams(activeStudents, activeProjects, selectedSemester.value);
    displayTeams.value = Object.fromEntries(
      Object.entries(teams).map(([projectId, students]) => {
        const projectName = projects.find(project => project.id === projectId)?.name || 'Not Found';
        const studentNames = students.map(student => `${student.lastName}, ${student.firstName}`);
        return [projectName, studentNames]
      })
    )

    showOverlay.value = true;
  }
}
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
}
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 99;
}
</style>