<template lang="pug">
  .overlay(v-if="selectedTeam" @click="closeModal")
  .centered-row.shaded-card.p-10.m-10.min-h-screen
    .centered-col.relative.h-full.gap-4
      .flex.flex-wrap.items-center.gap-2.self-start
        ClickableButton(v-if="rows.length > 0" title="Export Teams to CSV" type="success" @click="exportTeamsToCSV")

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
        class="h-[80vh] w-full mt-2 md:mt-5"
        dataKey="projectId"
        filterDisplay="row"
        selectionMode="single"
        v-model:selection="selectedTeam"
      )
        Column(field="projectName" header="Project" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by project" :showClear="true")
        Column(field="teamSize" header="Team Size" :showFilterMenu="false" style="width:130px")
          template(#body="{ data }")
            .text-center {{ data.teamSize }}
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Size" :showClear="true")
        Column(field="studentNames" header="Members" :showFilterMenu="false")
          template(#body="{ data }")
            span.text-sm.text-gray-700 {{ data.studentNames }}
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by member" :showClear="true")

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
          template(v-if="!isEditing") {{ member.name }} - {{ member.major }}
          .member-row(v-else)
            span {{ member.name }} - {{ member.major }}
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
  students: Array<{ id: string; name: string; major: string }>;
  studentNames: string;
}

const { successToast, errorToast } = usePrimeVueToast();
const rawAssignments = ref<Record<string, any> | null>(null);
const projects = ref<any[]>([]);
const selectedTeam = ref<TeamRow | null>(null);
const isEditing = ref(false);
const moveTargets = ref<Record<string, string>>({});
const savedSemester = ref<any | null>(null);

const getProjectName = (projectId: string) => {
  const p = projects.value.find(pr => pr.id === projectId);
  if (p && p.name) return p.name;
  try { return getProjectNameFromId(projectId, projects.value as any) }
  catch (e) { return projectId }
};

const rows = computed<TeamRow[]>(() => {
  if (!rawAssignments.value) return [];
  return Object.entries(rawAssignments.value).map(([projectId, students]) => {
    const members = (students as any[]).map(s => ({
      id: s?.id ?? '',
      name: getDisplayName(s),
      major: s?.major ?? 'Unknown'
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

const moveMember = (studentId: string) => {
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
  successToast('Member moved successfully.');
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

onMounted(() => {
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
</style>
