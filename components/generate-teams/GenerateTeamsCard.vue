<template lang="pug">
  .text-3xl.font-semibold.mb-4 Step 3: Generate Teams
  Dropdown(
    v-model="selectedSemester"
    :options="semesters"
    placeholder="Select Semester"
  )
    template(#option="slotProps") {{ displaySemester(slotProps.option) }}
    template(#value="slotProps")
      div(v-if="slotProps.value") {{ displaySemester(slotProps.value) }}
      span(v-else) {{ slotProps.placeholder }}
  ClickableButton.mt-5(title="Generate Teams" type="success" :loading="loading" @click="handleGenerateTeamAssignments")
  .overlay(v-if="showOverlay" @click="closeModal")
  .orange-card.p-15.modal.gap-2.overflow-y-auto.max-h-screen.m-10(v-if="showOverlay")
    .text-5xl.font-bold.mb-5.text-center.text-white Generated Teams
    .grid.grid-cols-4
      div(v-for="(students, projectId) in teamAssignments" :key="projectId" class="mb-8")
        h2.text-xl.font-semibold.text-white {{ getProjectNameFromId(projectId, activeProjects) }} ({{ getProjectTeamSize(projectId) }})
        div(
          v-for="(student, index) in students" 
          :key="index"
          :class="getStudentColor(student)"
        ) {{ getDisplayName(student) }} ({{ getProjectRankForStudent(projectId, student) }})
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Project, Semester } from '@prisma/client';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';
import type { StudentWithChoices } from '~/server/api/students/index.get';
import { getProjectNameFromId } from '~/server/services/projectService';
import { displaySemester } from '~/server/services/semesterService';
import { getDisplayName, getProjectRankForStudent } from '~/server/services/studentService';
import { usePrimeVueToast } from '~/composables/usePrimeVueToast';

const { projects, semesters, students } = defineProps<{
  projects: ProjectWithSemesters[]
  semesters: Semester[]
  students: StudentWithChoices[]
}>()

const { errorToast } = usePrimeVueToast();
const selectedSemester = ref<Semester | null>(null);
const showOverlay = ref<boolean>(false);
const loading = ref(false);
const teamAssignments = ref<Record<string, StudentWithChoices[]> | null>(null);
const activeProjects = ref<Project[]>([]);

const closeModal = () => {
  showOverlay.value = false;
}

const router = useRouter();

const handleGenerateTeamAssignments = async () => {
  if (!selectedSemester.value) {
    errorToast('Please select a semester before generating teams.');
    return;
  }

  loading.value = true;
  try {
    const result = await $fetch<{ teamAssignments: Record<string, StudentWithChoices[]>, projects: Project[] }>(
      '/api/teams/generate',
      { method: 'POST', body: { semesterId: selectedSemester.value.id } }
    );

    teamAssignments.value = result.teamAssignments;
    activeProjects.value = result.projects;

    // persist results for Teams page
    try {
      localStorage.setItem('lastTeamAssignments', JSON.stringify({
        teamAssignments: result.teamAssignments,
        projects: result.projects,
        semester: selectedSemester.value
      }));
    } catch (e) {
      // ignore storage errors
    }

    // navigate to Teams page to view assignments
    await router.push('/teams');
  } catch (err: any) {
    errorToast(err?.data?.message || err?.message || 'Failed to generate teams. Make sure Python and OR-Tools are installed.');
  } finally {
    loading.value = false;
  }
}

const getProjectTeamSize = (projectId: string) => {
  if (teamAssignments.value) {
    return teamAssignments.value[projectId]?.length ?? 0
  }
}

const getStudentColor = (student: StudentWithChoices) => {
  if (student.class === '3200') {
    return 'text-amber-500'
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
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