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
</template>

<script setup lang="ts">
import type { Project, Semester } from '@prisma/client';
import { generateTeams } from '~/algorithms/newAlgorithm';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';
import type { StudentWithChoices } from '~/server/api/students/index.get';
import { getActiveProjects } from '~/server/services/projectService';
import { displaySemester } from '~/server/services/semesterService';

const { projects, semesters, students } = defineProps<{
  projects: ProjectWithSemesters[]
  semesters: Semester[]
  students: StudentWithChoices[]
}>()

const selectedSemester = ref<Semester | null>(null);

const handleGenerateTeams = async () => {
  const activeStudents = students.filter(student => student.status === 'ACTIVE');
  const activeProjects = getActiveProjects(projects, selectedSemester.value)
  const teams = generateTeams(activeStudents, activeProjects);
}
</script>