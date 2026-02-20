<template lang="pug">
  .overlay(v-if="selectedTeam" @click="closeModal")
  .centered-row.shaded-card.p-10.m-10.min-h-screen
    .centered-col.relative.h-full.gap-4
      .flex.flex-wrap.items-center.gap-2.self-start
        NuxtLink.btn(href='/generate-teams') Back

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
    div.mt-4
      .cardSubTitle Members:
      ul.list-disc.pl-5.mt-2
        li.cardText.py-1(v-for="(name, idx) in selectedTeam.students" :key="idx") {{ name }}
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useHead } from 'nuxt/app';
import { FilterMatchMode } from '@primevue/core/api';
import { XCircleIcon } from '@heroicons/vue/24/solid';
import { getDisplayName } from '~/server/services/studentService';
import { getProjectNameFromId } from '~/server/services/projectService';

useHead({ title: 'Teams' });

interface TeamRow {
  projectId: string;
  projectName: string;
  teamSize: number;
  students: string[];
  studentNames: string;
}

const rawAssignments = ref<Record<string, any> | null>(null);
const projects = ref<any[]>([]);
const selectedTeam = ref<TeamRow | null>(null);

const getProjectName = (projectId: string) => {
  const p = projects.value.find(pr => pr.id === projectId);
  if (p && p.name) return p.name;
  try { return getProjectNameFromId(projectId, projects.value as any) }
  catch (e) { return projectId }
};

const rows = computed<TeamRow[]>(() => {
  if (!rawAssignments.value) return [];
  return Object.entries(rawAssignments.value).map(([projectId, students]) => {
    const names = (students as any[]).map(s => getDisplayName(s));
    return {
      projectId,
      projectName: getProjectName(projectId),
      teamSize: (students as any[]).length,
      students: names,
      studentNames: names.join(', ')
    };
  });
});

const filters = ref({
  projectName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  teamSize: { value: null, matchMode: FilterMatchMode.CONTAINS },
  studentNames: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const closeModal = () => { selectedTeam.value = null; };

onMounted(() => {
  try {
    const raw = localStorage.getItem('lastTeamAssignments');
    if (raw) {
      const parsed = JSON.parse(raw);
      rawAssignments.value = parsed.teamAssignments || null;
      projects.value = parsed.projects || [];
    }
  } catch (e) {
    rawAssignments.value = null;
  }
});
</script>

<style scoped>
.centered-row { display:flex; justify-content:center; }
.centered-col { display:flex; flex-direction:column; max-width:1100px; width:100%; }
</style>
