<template lang="pug">
  .overlay(v-if="showMetrics" @click="showMetrics = false")
  .overlay(v-if="selectedTeam" @click="closeModal")
  .centered-row.shaded-card.p-10.m-10.min-h-screen
    .centered-col.relative.h-full.gap-4
      .flex.flex-wrap.items-center.gap-2.self-start
        ClickableButton(v-if="rows.length > 0" title="Export Teams to CSV" type="success" @click="exportTeamsToCSV")
        ClickableButton(
          v-if="assignmentMetrics"
          title="Show Metrics"
          type="success"
          @click="showMetrics = true"
        )

      .mt-4.project-title.w-full.text-center Teams
      .text-2xl.mt-2 Team count: {{ rows.length }}

      template(v-if="rows.length === 0")
        .beige-card.p-6.text-center.mt-4 No generated teams found. Generate teams on the Generate Teams page first.

      DataTable.beige-card.overflow-hidden(
        v-else
        :value="rows"
        v-model:filters="filters"
        scrollable
        scrollHeight="80vh"
        class="w-full mt-2 md:mt-5"
        dataKey="projectId"
        filterDisplay="row"
        selectionMode="single"
        v-model:selection="selectedTeam"
      )
        Column(field="projectName" header="Project" :showFilterMenu="false" :sortable="true")
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by project" :showClear="true")
        Column(field="teamSize" header="Team Size" :showFilterMenu="false" style="width:130px" :sortable="true")
          template(#body="{ data }")
            .text-center {{ data.teamSize }}
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Size" :showClear="true")
        Column(field="studentNames" header="Members" :showFilterMenu="false" :sortable="true")
          template(#body="{ data }")
            span.text-sm.text-gray-700 {{ data.studentNames }}
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by member" :showClear="true")

  .cardRows.relative.orange-card.p-8.modal.metrics-modal(v-if="showMetrics && assignmentMetrics")
    XCircleIcon.absolute.top-4.right-4.size-7.cursor-pointer(@click="showMetrics = false")
    .text-2xl.font-semibold.mb-4 Assignment Metrics
    .metrics-grid
      .metric-item
        .metric-label Students Assigned
        .metric-value {{ assignmentMetrics.studentsAssigned }}
      .metric-item
        .metric-label Top 1
        .metric-value {{ assignmentMetrics.top1Count }} ({{ assignmentMetrics.top1Pct }}%)
      .metric-item
        .metric-label Top 2
        .metric-value {{ assignmentMetrics.top2Count }} ({{ assignmentMetrics.top2Pct }}%)
      .metric-item
        .metric-label Top 3
        .metric-value {{ assignmentMetrics.top3Count }} ({{ assignmentMetrics.top3Pct }}%)
      .metric-item
        .metric-label Top 4
        .metric-value {{ assignmentMetrics.top4Count }} ({{ assignmentMetrics.top4Pct }}%)
      .metric-item
        .metric-label No Valid Choices
        .metric-value {{ assignmentMetrics.noValidChoices }}

    .mt-4(v-if="assignmentMetrics.underMinTeams.length > 0")
      .text-base.font-semibold.text-red-700 Teams below 4 members:
      ul.list-disc.pl-5.mt-1
        li(v-for="team in assignmentMetrics.underMinTeams" :key="team.projectId")
          | {{ team.projectName }} ({{ team.teamSize }})

  .cardRows.relative.orange-card.p-15.modal(v-if="selectedTeam" class="w-[50vw]")
    XCircleIcon.absolute.top-5.right-5.size-8.cursor-pointer(@click="closeModal")
    .cardTitle {{ selectedTeam.projectName }}
    .text-lg.mt-1.text-gray-500 Team size: {{ selectedTeam.teamSize }}
    .flex.items-center.justify-between.mt-2
      ClickableButton(:title="isEditing ? 'Done Editing' : 'Edit Members'" type="success" @click="toggleEditMode")
    div.mt-4
      .cardSubTitle Members:
      ul.list-disc.pl-5.mt-2
        li.cardText.py-1(v-for="(member, idx) in selectedTeam.students" :key="idx")
          template(v-if="!isEditing")
            .member-details
              span {{ member.name }} - {{ member.major }} - {{ member.yearLabel }} - {{ member.choiceLabel }}
              .member-extra(v-if="member.github || member.discord")
                span(v-if="member.github") GitHub: {{ member.github }}
                span(v-if="member.github && member.discord") •
                span(v-if="member.discord") Discord: {{ member.discord }}
          .member-row(v-else)
            .member-details
              span {{ member.name }} - {{ member.major }} - {{ member.yearLabel }} - {{ member.choiceLabel }}
              .member-extra(v-if="member.github || member.discord")
                span(v-if="member.github") GitHub: {{ member.github }}
                span(v-if="member.github && member.discord") •
                span(v-if="member.discord") Discord: {{ member.discord }}
            .member-actions
              select.member-select(v-model="moveTargets[member.id]")
                option(value="") Select destination
                option(v-for="project in destinationProjects" :key="project.id" :value="project.id") {{ project.name }}
              button.member-move-btn(@click="moveMember(member.id)") Move
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useHead } from 'nuxt/app';
import { FilterMatchMode } from '@primevue/core/api';
import { XCircleIcon } from '@heroicons/vue/24/solid';
import { getDisplayName } from '~/server/services/studentService';
import { getProjectNameFromId } from '~/server/services/projectService';
import { usePrimeVueToast } from '~/composables/usePrimeVueToast';

declare const document: any;

useHead({ title: 'Teams' });

interface TeamRow {
  projectId: string;
  projectName: string;
  teamSize: number;
  students: Array<{
    id: string;
    name: string;
    major: string;
    yearLabel: string;
    choiceRank: number | null;
    choiceLabel: string;
    github?: string | null;
    discord?: string | null;
  }>;
  studentNames: string;
}

interface AssignmentMetrics {
  studentsAssigned: number;
  noValidChoices: number;
  top1Count: number;
  top2Count: number;
  top3Count: number;
  top4Count: number;
  top1Pct: number;
  top2Pct: number;
  top3Pct: number;
  top4Pct: number;
  underMinTeams: Array<{ projectId: string; projectName: string; teamSize: number }>;
}

const { successToast, errorToast } = usePrimeVueToast();
const rawAssignments = ref<Record<string, any> | null>(null);
const projects = ref<any[]>([]);
const selectedTeam = ref<TeamRow | null>(null);
const isEditing = ref(false);
const moveTargets = ref<Record<string, string>>({});
const savedSemester = ref<any | null>(null);
const showMetrics = ref(false);

const formatYearLabel = (year: unknown): string => {
  const y = typeof year === 'string' ? year.toUpperCase() : '';
  if (y === 'FRESHMAN') return 'Freshman';
  if (y === 'SOPHOMORE') return 'Sophomore';
  if (y === 'JUNIOR') return 'Junior';
  if (y === 'SENIOR') return 'Senior';
  return 'Unknown year';
};

const getChoiceInfo = (student: any, assignedProjectId: string, activeProjectIds: Set<string>) => {
  const rankedChoices = (student?.choices ?? [])
    .slice()
    .sort((a: any, b: any) => (a?.rank ?? 999) - (b?.rank ?? 999))
    .filter((choice: any) => activeProjectIds.has(choice?.projectId));

  if (rankedChoices.length === 0) {
    return { choiceRank: null as number | null, choiceLabel: 'No valid choices' };
  }

  const assignedIndex = rankedChoices.findIndex((choice: any) => choice?.projectId === assignedProjectId);
  if (assignedIndex === -1) {
    return { choiceRank: null as number | null, choiceLabel: 'Not in listed choices' };
  }

  return { choiceRank: assignedIndex + 1, choiceLabel: `Choice #${assignedIndex + 1}` };
};

const getProjectName = (projectId: string) => {
  const p = projects.value.find(pr => pr.id === projectId);
  if (p && p.name) return p.name;
  try { return getProjectNameFromId(projectId, projects.value as any) }
  catch (e) { return projectId }
};

const rows = computed<TeamRow[]>(() => {
  if (!rawAssignments.value) return [];
  const activeProjectIds = new Set(Object.keys(rawAssignments.value));

  return Object.entries(rawAssignments.value).map(([projectId, students]) => {
    const members = (students as any[]).map(s => ({
      ...getChoiceInfo(s, projectId, activeProjectIds),
      id: s?.id ?? '',
      name: getDisplayName(s),
      major: s?.major ?? 'Unknown',
      yearLabel: formatYearLabel(s?.year),
      github: s?.github ?? null,
      discord: s?.discord ?? null,
    }));
    return {
      projectId,
      projectName: getProjectName(projectId),
      teamSize: (students as any[]).length,
      students: members,
      studentNames: members.map(m => m.name).join(', ')
    };
  });
});

const assignmentMetrics = computed<AssignmentMetrics | null>(() => {
  if (!rawAssignments.value) return null;

  const activeProjectIds = new Set(Object.keys(rawAssignments.value));
  let studentsAssigned = 0;
  let noValidChoices = 0;
  let top1Count = 0;
  let top2Count = 0;
  let top3Count = 0;
  let top4Count = 0;

  for (const [projectId, assignedStudents] of Object.entries(rawAssignments.value)) {
    for (const student of assignedStudents as any[]) {
      studentsAssigned += 1;
      const rankedChoices = (student?.choices ?? [])
        .slice()
        .sort((a: any, b: any) => (a?.rank ?? 999) - (b?.rank ?? 999))
        .filter((choice: any) => activeProjectIds.has(choice?.projectId));

      if (rankedChoices.length === 0) {
        noValidChoices += 1;
        continue;
      }

      const assignedIndex = rankedChoices.findIndex((choice: any) => choice?.projectId === projectId);
      if (assignedIndex === 0) top1Count += 1;
      if (assignedIndex >= 0 && assignedIndex <= 1) top2Count += 1;
      if (assignedIndex >= 0 && assignedIndex <= 2) top3Count += 1;
      if (assignedIndex >= 0 && assignedIndex <= 3) top4Count += 1;
    }
  }

  const pct = (count: number) =>
    studentsAssigned > 0 ? Number(((count / studentsAssigned) * 100).toFixed(2)) : 0;

  const underMinTeams = rows.value
    .filter(row => row.teamSize > 0 && row.teamSize < 4)
    .map(row => ({ projectId: row.projectId, projectName: row.projectName, teamSize: row.teamSize }));

  return {
    studentsAssigned,
    noValidChoices,
    top1Count,
    top2Count,
    top3Count,
    top4Count,
    top1Pct: pct(top1Count),
    top2Pct: pct(top2Count),
    top3Pct: pct(top3Count),
    top4Pct: pct(top4Count),
    underMinTeams,
  };
});

const filters = ref({
  projectName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  teamSize: { value: null, matchMode: FilterMatchMode.CONTAINS },
  studentNames: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const closeModal = () => { selectedTeam.value = null; };

const destinationProjects = computed(() => {
  if (!selectedTeam.value) return [];
  return rows.value
    .filter(row => row.projectId !== selectedTeam.value?.projectId)
    .map(row => ({ id: row.projectId, name: row.projectName }));
});

const persistAssignments = () => {
  if (!process.client || !rawAssignments.value) return;
  localStorage.setItem('lastTeamAssignments', JSON.stringify({
    teamAssignments: rawAssignments.value,
    projects: projects.value,
    semester: savedSemester.value,
  }));
};

const refreshSelectedTeam = () => {
  if (!selectedTeam.value) return;
  const updatedTeam = rows.value.find(row => row.projectId === selectedTeam.value?.projectId) || null;
  selectedTeam.value = updatedTeam;
};

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    moveTargets.value = {};
  }
};

const moveMember = async (studentId: string) => {
  if (!rawAssignments.value || !selectedTeam.value) return;
  const destinationProjectId = moveTargets.value[studentId];
  const sourceProjectId = selectedTeam.value.projectId;

  if (!destinationProjectId) {
    errorToast('Select a destination team first.');
    return;
  }
  if (destinationProjectId === sourceProjectId) {
    errorToast('Destination must be a different team.');
    return;
  }

  const sourceStudents = (rawAssignments.value[sourceProjectId] || []) as any[];
  const destinationStudents = (rawAssignments.value[destinationProjectId] || []) as any[];
  const sourceIndex = sourceStudents.findIndex((s: any) => s.id === studentId);

  if (sourceIndex < 0) {
    errorToast('Could not find that member in this team.');
    return;
  }

  const [student] = sourceStudents.splice(sourceIndex, 1);
  destinationStudents.push(student);
  rawAssignments.value[destinationProjectId] = destinationStudents;
  rawAssignments.value[sourceProjectId] = sourceStudents;

  persistAssignments();
  refreshSelectedTeam();
  moveTargets.value[studentId] = '';

  // Persist move to database
  if (savedSemester.value?.id) {
    try {
      await Promise.all([
        $fetch('/api/teams/assign', {
          method: 'POST',
          body: {
            semesterId: savedSemester.value.id,
            projectId: sourceProjectId,
            studentIds: (rawAssignments.value[sourceProjectId] as any[]).map((s: any) => s.id),
          },
        }),
        $fetch('/api/teams/assign', {
          method: 'POST',
          body: {
            semesterId: savedSemester.value.id,
            projectId: destinationProjectId,
            studentIds: (rawAssignments.value[destinationProjectId] as any[]).map((s: any) => s.id),
          },
        }),
      ]);
      successToast('Member moved and saved successfully.');
    } catch (e) {
      successToast('Member moved locally. Database save failed — changes are in localStorage only.');
    }
  } else {
    successToast('Member moved successfully.');
  }
};

watch(selectedTeam, (newTeam) => {
  if (!newTeam) {
    isEditing.value = false;
    moveTargets.value = {};
  }
});

const exportTeamsToCSV = async () => {
  try {
    if (!rawAssignments.value) {
      errorToast('No team assignments to export.');
      return;
    }

    // Call export API
    const csv = await $fetch<string>(
      '/api/teams/export',
      {
        method: 'POST',
        body: {
          teamAssignments: rawAssignments.value,
          projects: projects.value
        }
      }
    );

    // Trigger download on client side
    if (process.client) {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `team-assignments-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      successToast('Teams exported to CSV successfully!', 5000);
    }
  } catch (err: any) {
    errorToast(err?.data?.message || 'Failed to export teams.');
  }
};

onMounted(async () => {
  // First, restore semester/project metadata from localStorage
  try {
    const raw = localStorage.getItem('lastTeamAssignments');
    if (raw) {
      const parsed = JSON.parse(raw);
      rawAssignments.value = parsed.teamAssignments || null;
      projects.value = parsed.projects || [];
      savedSemester.value = parsed.semester || null;
    }
  } catch (e) {
    rawAssignments.value = null;
  }

  // Then, load authoritative assignments from the database
  if (savedSemester.value?.id) {
    try {
      const result = await $fetch<{ teamAssignments: Record<string, any[]>, projects: any[] }>(
        `/api/teams?semesterId=${savedSemester.value.id}`
      );
      // Only override if the DB actually has student assignments saved
      const hasAssignments = Object.values(result.teamAssignments).some(s => s.length > 0);
      if (hasAssignments) {
        rawAssignments.value = result.teamAssignments;
        projects.value = result.projects;
        persistAssignments();
      }
    } catch (e) {
      // DB fetch failed — fall back to localStorage data already loaded above
    }
  }
});
</script>

<style scoped>
.centered-row { display:flex; justify-content:center; }
.centered-col { display:flex; flex-direction:column; max-width:1100px; width:100%; }
.cardRows {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.metrics-modal {
  width: min(92vw, 760px);
  max-height: 85vh;
  overflow: auto;
  color: #ffffff;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.75rem;
}
.metric-item {
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: #ffffff;
  color: #111827;
}
.metric-label {
  font-size: 0.82rem;
  color: #334155;
}
.metric-value {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
}
.metric-item .metric-label,
.metric-item .metric-value {
  color: #111827;
}
.cardTitle {
  text-shadow: 1px 1px 1px #0000008b;
  font-size: 3rem;
  line-height: 1;
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));
}
.cardSubTitle {
  text-shadow: 1px 1px 1px #0000008b;
  font-size: 1.5rem;
  margin-right: 0.5rem;
}
.cardText {
  font-size: 1.25rem;
}
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
  z-index: 99;
}
.member-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.member-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.member-extra {
  font-size: 0.95rem;
  opacity: 0.9;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.member-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.member-select {
  min-width: 12rem;
  border: 1px solid var(--color-teal);
  border-radius: 0.375rem;
  padding: 0.3rem 0.5rem;
  background: var(--color-beige);
  color: var(--color-teal);
}
.member-move-btn {
  border: 0;
  border-radius: 0.375rem;
  padding: 0.35rem 0.7rem;
  background: var(--color-teal);
  color: #fff;
  cursor: pointer;
}

@media (max-width: 1024px) {
  :deep(.p-datatable) {
    font-size: 0.92rem;
  }

  :deep(.p-datatable th),
  :deep(.p-datatable td) {
    padding: 0.5rem 0.625rem !important;
  }
}

@media (max-width: 767px) {
  .project-title {
    font-size: 1.25rem;
  }

  :deep(.p-datatable) {
    font-size: 0.85rem;
  }

  :deep(.p-datatable-scrollable .p-datatable-table) {
    min-width: 100% !important;
  }

  :deep(.p-datatable th),
  :deep(.p-datatable td) {
    padding: 0.375rem 0.5rem !important;
  }
}
</style>
