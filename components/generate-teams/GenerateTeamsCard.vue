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
  
  // Validation warnings
  .beige-card.p-4.mt-4.border-l-4.border-amber-500(v-if="selectedSemester && validationWarnings.length > 0")
    .font-semibold.text-amber-700.mb-2 ⚠️ Data Issues Found:
    ul.list-disc.pl-5.gap-1
      li.text-sm.text-amber-600(v-for="(warning, idx) in validationWarnings" :key="idx") {{ warning }}
  
  ClickableButton.mt-5(title="Generate Teams" type="success" :loading="loading" @click="handleGenerateTeamAssignments")
  .overlay(v-if="showOverlay" @click="closeModal")
  .orange-card.p-15.modal.gap-2.overflow-y-auto.max-h-screen.m-10(v-if="showOverlay")
    .text-5xl.font-bold.mb-5.text-center.text-white Generated Teams
    
    // Statistics section
    .beige-card.p-6.mb-8(v-if="teamStats")
      .text-2xl.font-bold.text-center.mb-4.text-orange-700 Summary Statistics
      .grid.grid-cols-2.gap-4.lg:grid-cols-4
        .stat-box
          .stat-number {{ teamStats.totalTeams }}
          .stat-label Total Teams
        .stat-box
          .stat-number {{ teamStats.totalStudents }}
          .stat-label Total Assigned
        .stat-box
          .stat-number {{ teamStats.avgTeamSize }}
          .stat-label Avg Team Size
        .stat-box
          .stat-number {{ teamStats.minTeamSize }}-{{ teamStats.maxTeamSize }}
          .stat-label Team Size Range
      .border-t.border-gray-300.mt-4.pt-4
      .grid.grid-cols-2.gap-4.lg:grid-cols-3
        .stat-box
          .stat-number {{ teamStats.juniorCount }}
          .stat-label 2200
        .stat-box
          .stat-number {{ teamStats.seniorCount }}
          .stat-label 3200
        .stat-box
          .stat-number {{ teamStats.choiceQualityPct }}%
          .stat-label Top-3 Preference
    
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
import { computed } from 'vue';

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

const validationWarnings = computed<string[]>(() => {
  if (!selectedSemester.value) return [];

  const warnings: string[] = [];
  const semesterId = selectedSemester.value.id;

  // Check for projects with no partner assigned
  const projectsWithoutPartner = projects
    .filter(p => {
      const isActive = p.semesters?.some(s => s.id === semesterId);
      return isActive && !p.partnerId;
    })
    .map(p => p.name);

  if (projectsWithoutPartner.length > 0) {
    warnings.push(`${projectsWithoutPartner.length} project(s) missing partner assignment: ${projectsWithoutPartner.slice(0, 3).join(', ')}${projectsWithoutPartner.length > 3 ? '...' : ''}`);
  }

  // Check for students with zero valid choices
  const studentsWithoutChoices = students
    .filter(s => {
      const choices = s.choices?.filter(c => {
        const project = projects.find(p => p.id === c.projectId);
        const isActive = project?.semesters?.some(ps => ps.id === semesterId);
        return isActive;
      }) || [];
      return choices.length === 0;
    })
    .map(s => `${s.firstName} ${s.lastName}`);

  if (studentsWithoutChoices.length > 0) {
    warnings.push(`${studentsWithoutChoices.length} student(s) have no valid project choices: ${studentsWithoutChoices.slice(0, 3).join(', ')}${studentsWithoutChoices.length > 3 ? '...' : ''}`);
  }

  return warnings;
});

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
};

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

const teamStats = computed(() => {
  if (!teamAssignments.value) return null;

  const allStudents: StudentWithChoices[] = [];
  const teamSizes: number[] = [];
  let topChoiceCount = 0;

  // Flatten all students from all teams
  for (const [projectId, students] of Object.entries(teamAssignments.value)) {
    const stus = students as StudentWithChoices[];
    allStudents.push(...stus);
    teamSizes.push(stus.length);

    // Count how many got this project in their top 3 choices
    for (const student of stus) {
      const projectRank = getProjectRankForStudent(projectId, student);
      if (projectRank && (projectRank === 1 || projectRank === 2 || projectRank === 3)) {
        topChoiceCount++;
      }
    }
  }

  const totalStudents = allStudents.length;
  const avgSize = totalStudents > 0 ? (totalStudents / teamSizes.length).toFixed(1) : '0';
  const minSize = teamSizes.length > 0 ? Math.min(...teamSizes) : 0;
  const maxSize = teamSizes.length > 0 ? Math.max(...teamSizes) : 0;
  
  const juniorCount = allStudents.filter(s => s.class === '3200').length;
  const seniorCount = totalStudents - juniorCount;
  const choiceQualityPct = totalStudents > 0 ? Math.round((topChoiceCount / totalStudents) * 100) : 0;

  return {
    totalTeams: teamSizes.length,
    totalStudents,
    avgTeamSize: avgSize,
    minTeamSize: minSize,
    maxTeamSize: maxSize,
    juniorCount,
    seniorCount,
    choiceQualityPct
  };
});
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
.stat-box {
  @apply flex flex-col items-center p-4 rounded-lg bg-orange-50 border-2 border-orange-200;
}
.stat-number {
  @apply text-3xl font-bold text-orange-700 mb-2;
}
.stat-label {
  @apply text-sm font-semibold text-gray-700 text-center;
}
</style>
