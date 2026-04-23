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

  .beige-card.p-4.mt-4
    .text-xl.font-semibold.mb-3.text-teal Algorithm Options
    .grid.grid-cols-1.gap-3(class="md:grid-cols-2")
      label.option-row
        span.option-label Min Team Size
        input.option-input(type="number" min="1" v-model.number="algorithmConfig.min_team_size")
      label.option-row
        span.option-label Max Team Size
        input.option-input(type="number" min="1" v-model.number="algorithmConfig.max_team_size")
      label.option-row
        span.option-label Prioritize Returning Students
        input(type="checkbox" v-model="algorithmConfig.prioritize_returning_students")
      label.option-row
        span.option-label Prioritize 3200 First Choice
        input(type="checkbox" v-model="algorithmConfig.prioritize_3200_first_choice")
      label.option-row
        span.option-label Prefer Major Diversity
        input(type="checkbox" v-model="algorithmConfig.prefer_major_diversity")
      label.option-row
        span.option-label Match Skills
        input(type="checkbox" v-model="algorithmConfig.match_skills")
      label.option-row
        span.option-label Balance Gender
        input(type="checkbox" v-model="algorithmConfig.balance_gender")
      label.option-row
        span.option-label Prefer 2200 Early Choices
        input(type="checkbox" v-model="algorithmConfig.prefer_2200_early_choices")

  .flex.flex-wrap.gap-3.mt-5
    ClickableButton(title="Generate Wednesday Teams" type="success" :loading="loading" @click="handleGenerateTeamAssignments('WEDNESDAY')")
    ClickableButton(title="Generate Thursday Teams" type="success" :loading="loading" @click="handleGenerateTeamAssignments('THURSDAY')")
  .overlay(v-if="showOverlay" @click="closeModal")
  .orange-card.p-15.modal.gap-2.overflow-y-auto.max-h-screen.m-10(v-if="showOverlay")
    .text-5xl.font-bold.mb-5.text-center.text-white Generated Teams

    // Statistics section
    .beige-card.p-6.mb-8(v-if="teamStats")
      .text-2xl.font-bold.text-center.mb-4.text-orange-700 Summary Statistics
      .grid.grid-cols-2.gap-4(class="lg:grid-cols-4")
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
      .grid.grid-cols-2.gap-4(class="lg:grid-cols-3")
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
      div(v-for="(students, teamId) in teamAssignments" :key="teamId" class="mb-8")
        h2.text-xl.font-semibold.text-white {{ getTeamDisplayName(teamId) }} ({{ getProjectTeamSize(teamId) }})
        div(
          v-for="(student, index) in students"
          :key="index"
          :class="getStudentColor(student)"
        ) {{ getDisplayName(student) }} ({{ getProjectRankForStudent(getBaseProjectId(teamId), student) }})
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Project, Semester } from '@prisma/client';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';
import type { StudentWithChoices } from '~/server/api/students/index.get';
import { displaySemester } from '~/server/services/semesterService';
import { getDisplayName, getProjectRankForStudent } from '~/server/services/studentService';
import { usePrimeVueToast } from '~/composables/usePrimeVueToast';

type AlgorithmConfig = {
  min_team_size: number;
  max_team_size: number;
  prioritize_returning_students: boolean;
  prioritize_3200_first_choice: boolean;
  prefer_major_diversity: boolean;
  match_skills: boolean;
  balance_gender: boolean;
  prefer_2200_early_choices: boolean;
}

type MeetingDay = 'WEDNESDAY' | 'THURSDAY';

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
const generatedTeamMeta = ref<Record<string, { projectId: string; meetingDay: 'WEDNESDAY' | 'THURSDAY'; projectName: string }>>({});
const algorithmConfig = ref<AlgorithmConfig>({
  min_team_size: 4,
  max_team_size: 6,
  prioritize_returning_students: true,
  prioritize_3200_first_choice: true,
  prefer_major_diversity: true,
  match_skills: true,
  balance_gender: true,
  prefer_2200_early_choices: true,
});

const closeModal = () => { showOverlay.value = false; };
const router = useRouter();

const validationWarnings = computed<string[]>(() => {
  if (!selectedSemester.value) return [];
  const warnings: string[] = [];
  const semesterId = selectedSemester.value.id;

  const isProjectActiveForDay = (project: ProjectWithSemesters, day: MeetingDay) => {
    const semesterList = project.semesters ?? [];
    const inSelectedSemester = semesterList.some((s: Semester) => s.id === semesterId);
    if (!inSelectedSemester) return false;
    return !project.meetingDay || project.meetingDay === 'BOTH' || project.meetingDay === day;
  };

  const isStudentEligibleForDay = (student: StudentWithChoices, day: MeetingDay) => {
    if (day === 'WEDNESDAY') return student.meetingDay === 'WEDNESDAY' || student.meetingDay === 'BOTH';
    return student.meetingDay === 'THURSDAY' || student.meetingDay === 'BOTH' || student.meetingDay === null;
  };

  const warningsForDay = (day: MeetingDay) => {
    const activeProjectIds = new Set(
      projects.filter(p => isProjectActiveForDay(p, day)).map(p => p.id)
    );
    return students
      .filter(s => isStudentEligibleForDay(s, day))
      .filter(s => {
        const choices = s.choices?.filter(c => activeProjectIds.has(c.projectId)) || [];
        return choices.length === 0;
      })
      // name now comes from person
      .map(s => `${s.person?.firstName ?? ''} ${s.person?.lastName ?? ''}`.trim());
  };

  const projectsWithoutPartner = projects
    .filter(p => p.semesters?.some(s => s.id === semesterId) && !p.partnerId)
    .map(p => p.name);

  if (projectsWithoutPartner.length > 0) {
    warnings.push(`${projectsWithoutPartner.length} project(s) missing partner: ${projectsWithoutPartner.slice(0, 3).join(', ')}${projectsWithoutPartner.length > 3 ? '...' : ''}`);
  }

  const wednesdayWithoutChoices = warningsForDay('WEDNESDAY');
  const thursdayWithoutChoices = warningsForDay('THURSDAY');

  if (wednesdayWithoutChoices.length > 0) {
    warnings.push(`Wednesday: ${wednesdayWithoutChoices.length} student(s) have no valid choices: ${wednesdayWithoutChoices.slice(0, 3).join(', ')}${wednesdayWithoutChoices.length > 3 ? '...' : ''}`);
  }
  if (thursdayWithoutChoices.length > 0) {
    warnings.push(`Thursday: ${thursdayWithoutChoices.length} student(s) have no valid choices: ${thursdayWithoutChoices.slice(0, 3).join(', ')}${thursdayWithoutChoices.length > 3 ? '...' : ''}`);
  }

  return warnings;
});

const handleGenerateTeamAssignments = async (day: MeetingDay) => {
  if (!selectedSemester.value) {
    errorToast('Please select a semester before generating teams.');
    return;
  }
  if (algorithmConfig.value.min_team_size > algorithmConfig.value.max_team_size) {
    errorToast('Min team size cannot be greater than max team size.');
    return;
  }

  loading.value = true;
  try {
    const result = await $fetch<{
      teamAssignments: Record<string, StudentWithChoices[]>;
      projects: Project[];
      teamMeta?: Record<string, { projectId: string; meetingDay: 'WEDNESDAY' | 'THURSDAY'; projectName: string }>;
    }>('/api/teams/generate', {
      method: 'POST',
      body: {
        semesterId: selectedSemester.value.id,
        day,
        config: algorithmConfig.value,
      }
    });

    teamAssignments.value = result.teamAssignments;
    activeProjects.value = result.projects;
    generatedTeamMeta.value = result.teamMeta || {};

    try {
      localStorage.setItem('lastTeamAssignments', JSON.stringify({
        teamAssignments: result.teamAssignments,
        projects: result.projects,
        semester: selectedSemester.value,
        day,
        teamMeta: result.teamMeta || {},
      }));
    } catch (e) {
      // ignore storage errors
    }

    await router.push('/teams');
  } catch (err: any) {
    errorToast(err?.data?.message || err?.message || `Failed to generate ${day.toLowerCase()} teams.`);
  } finally {
    loading.value = false;
  }
};

const getProjectTeamSize = (projectId: string) => teamAssignments.value?.[projectId]?.length ?? 0;
const getBaseProjectId = (teamId: string): string => generatedTeamMeta.value[teamId]?.projectId ?? teamId;
const getTeamDisplayName = (teamId: string): string => {
  const meta = generatedTeamMeta.value[teamId];
  if (!meta) return teamId;
  const dayLabel = meta.meetingDay === 'WEDNESDAY' ? 'Wednesday' : 'Thursday';
  return `${meta.projectName} (${dayLabel})`;
};

const getStudentColor = (student: StudentWithChoices) => {
  if (student.class === '3200') return 'text-amber-500';
};

const teamStats = computed(() => {
  if (!teamAssignments.value) return null;
  const allStudents: StudentWithChoices[] = [];
  const teamSizes: number[] = [];
  let topChoiceCount = 0;

  for (const [projectId, students] of Object.entries(teamAssignments.value)) {
    const stus = students as StudentWithChoices[];
    allStudents.push(...stus);
    teamSizes.push(stus.length);
    for (const student of stus) {
      const rank = getProjectRankForStudent(projectId, student);
      if (rank && rank <= 3) topChoiceCount++;
    }
  }

  const totalStudents = allStudents.length;
  const avgSize = totalStudents > 0 ? (totalStudents / teamSizes.length).toFixed(1) : '0';
  const minSize = teamSizes.length > 0 ? Math.min(...teamSizes) : 0;
  const maxSize = teamSizes.length > 0 ? Math.max(...teamSizes) : 0;
  const juniorCount = allStudents.filter(s => s.class === '3200').length;
  const seniorCount = totalStudents - juniorCount;
  const choiceQualityPct = totalStudents > 0 ? Math.round((topChoiceCount / totalStudents) * 100) : 0;

  return { totalTeams: teamSizes.length, totalStudents, avgTeamSize: avgSize, minTeamSize: minSize, maxTeamSize: maxSize, juniorCount, seniorCount, choiceQualityPct };
});
</script>

<style scoped>
.overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5); z-index: 98;
}
.modal {
  position: fixed; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); z-index: 99;
}
.stat-box {
  display: flex; flex-direction: column; align-items: center;
  padding: 1rem; border-radius: 0.5rem;
  background: var(--color-beige); color: var(--color-teal);
  border: 2px solid currentColor;
}
.stat-number { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; margin-bottom: 0.5rem; }
.stat-label { font-size: 0.875rem; line-height: 1.25rem; font-weight: 600; color: #6b7280; text-align: center; }
.option-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.option-label { font-weight: 600; color: var(--color-teal); }
.option-input {
  width: 6rem; padding: 0.35rem 0.5rem;
  border: 1px solid var(--color-teal); border-radius: 0.375rem;
  background: var(--color-beige); color: var(--color-teal);
}
</style>