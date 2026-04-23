<template lang="pug">
  .overlay(v-if="selectedProject" @click="closeModal")
  .centered-row.shaded-card.p-10.m-10.min-h-screen
    .centered-col.relative.h-full.gap-4
      .controls-row.flex.items-center.gap-2.self-start
        span.text-xs.font-semibold.text-white Upload semester:
        Dropdown.upload-semester-dropdown(
          class="control-fixed"
          v-model="selectedUploadSemester"
          :options="semesters"
          placeholder="Semester"
        )
          template(#option="slotProps") {{ displaySemester(slotProps.option) }}
          template(#value="slotProps")
            div(v-if="slotProps.value") {{ displaySemester(slotProps.value) }}
            span(v-else) {{ slotProps.placeholder }}

        template(v-if="selectedDayTab === 'ALL'")
          FileUploadButton.control-fill(title="Upload Projects (Merge)" @dataParsed="handleParsed")
          FileUploadButton.control-fill(title="Replace Projects with CSV" @dataParsed="handleParsedReplace")
        template(v-else-if="selectedDayTab === 'WEDNESDAY'")
          FileUploadButton.control-fill(title="Upload Wednesday Projects (Merge)" @dataParsed="handleParsedWednesday")
          FileUploadButton.control-fill(title="Replace Wednesday Projects with CSV" @dataParsed="handleParsedReplaceWednesday")
        template(v-else)
          FileUploadButton.control-fill(title="Upload Thursday Projects (Merge)" @dataParsed="handleParsedThursday")
          FileUploadButton.control-fill(title="Replace Thursday Projects with CSV" @dataParsed="handleParsedReplaceThursday")
        ClickableButton.control-fill(title="Clear Entire Database" type="danger" @click="resetDatabase")
        HelpIcon.control-fixed(:info="helpInfo")

      .mt-4.project-title.w-full.text-center Projects
      .text-2xl.mt-2 Project count ({{ activeTabLabel }}): {{ visibleProjects.length }}

      .day-tabs
        button.day-tab-btn(
          :class="{ active: selectedDayTab === 'ALL' }"
          @click="selectedDayTab = 'ALL'"
        ) All
        button.day-tab-btn(
          :class="{ active: selectedDayTab === 'WEDNESDAY' }"
          @click="selectedDayTab = 'WEDNESDAY'"
        ) Wednesday
        button.day-tab-btn(
          :class="{ active: selectedDayTab === 'THURSDAY' }"
          @click="selectedDayTab = 'THURSDAY'"
        ) Thursday

      DataTable.beige-card.overflow-hidden(
        :value="visibleProjects"
        v-model:filters="filters"
        scrollable
        scrollHeight="80vh"
        class="w-full mt-2 md:mt-5"
        dataKey="id"
        filterDisplay="row"
        selectionMode="single"
        v-model:selection="selectedProject"
      )
        Column(field="name" header="Name" :showFilterMenu="false" :sortable="true")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" :showClear="true")
        Column(field="description" header="Description" :showFilterMenu="false" :sortable="true")
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by description" :showClear="true")
        // hide this column on small screens (partner is lower priority)
        Column(field="partnerName" header="Partner" :showFilterMenu="false" class="hidden lg:table-cell" :sortable="true")
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by partner" :showClear="true")
        Column(field="meetingDay" header="Day" :showFilterMenu="false" :sortable="true" style="width: 160px")
          template(#body="{ data }")
            .text-center {{ formatMeetingDay(data.meetingDay) }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="meetingDayOptions" placeholder="Any" :maxSelectedLabels="1")
              template(#option="slotProps") {{ formatMeetingDay(slotProps.option) }}
              template(#value="slotProps") {{ formatMeetingDayFilter(slotProps.value) }}
        Column(field="status" header="Status" :showFilterMenu="false" :sortable="true")
          template(#body="{ data }")
            .flex.justify-center
              .pill(:class="statusBgColor(data.status)") {{ data.status.toUpperCase() }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Any" :maxSelectedLabels="0")
              template(#option="slotProps")
                .pill(:class="statusBgColor(slotProps.option)") {{ slotProps.option }}
        // hide type on small screens
        Column(field="type" header="Type" :showFilterMenu="false" class="hidden lg:table-cell" :sortable="true")
          template(#body="{ data }")
            .text-center {{ capitalizeFirst(data.type) }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="types" placeholder="Any" :maxSelectedLabels="1")
              template(#option="slotProps") {{ capitalizeFirst(slotProps.option) }}
              template(#value="slotProps") {{ formatTypesFilter(slotProps.value) }}

        Column(header="Actions" :showFilterMenu="false" :sortable="false" style="width: 110px" headerStyle="white-space: nowrap; min-width: 110px;" bodyStyle="min-width: 110px;")
          template(#body="{ data }")
            .flex.justify-center
              Button.p-button-rounded.p-button-danger.p-button-sm(
                icon="pi pi-trash" 
                @click="handleDeleteProject(data)"
                v-tooltip.top="'Delete project'"
              )

  .cardRows.relative.orange-card.p-15.modal(v-if="selectedProject" class="w-[50vw]")
    XCircleIcon.absolute.top-5.right-5.size-8.cursor-pointer(@click="closeModal")
    .flex.flex-row.justify-between.gap-10
      .cardTitle(v-if="!isEditing") {{ selectedProject?.name }}
      input.editBox.text-5xl(v-else v-model="editedProject.name")

    div
      .cardSubTitle Description:
      .cardText
        template(v-if="!isEditing") {{ selectedProject?.description }}
        input.editBox.w-full(v-else v-model="editedProject.description")

    div
      span.cardSubTitle Status:
      span.cardText
        template(v-if="!isEditing") {{ capitalizeFirst(selectedProject?.status) }}
        select(v-else v-model="editedProject.status")
          option(v-for="status in statuses" :key="status" :value="status") {{ capitalizeFirst(status) }}

    div
      span.cardSubTitle Semesters:
      span.cardText
        template(v-if="!isEditing") {{ selectedProjectSemesters }}

    div
      span.cardSubTitle Type:
      span.cardText
        template(v-if="!isEditing") {{ capitalizeFirst(selectedProject?.type) }}
        select(v-else v-model="editedProject.type")
          option(v-for="type in types" :key="type" :value="type") {{ capitalizeFirst(type) }}

    div
      span.cardSubTitle Meeting Day:
      span.cardText
        template(v-if="!isEditing") {{ formatMeetingDay(selectedProject?.meetingDay) }}
        select(v-else v-model="editedProject.meetingDay")
          option(:value="null") Unspecified
          option(v-for="meetingDay in meetingDayOptions" :key="meetingDay" :value="meetingDay") {{ formatMeetingDay(meetingDay) }}

    div
      span.cardSubTitle Repo:
      span.cardText
        a(v-if="!isEditing" :href="selectedProject?.repoURL" target="_blank") {{ selectedProject?.repoURL }}
        input.editBox(v-else v-model="editedProject.repoURL")

    .flex-grow.flex.justify-end.items-end
      ClickableButton(v-if="!isEditing" title="Edit Project" type="success" @click="handleEdit")
      ClickableButton(v-if="isEditing" title="Save Project" type="success" @click="handleSave")
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import type { ProjectType, Semester } from '@prisma/client';
import { XCircleIcon } from '@heroicons/vue/24/solid';
import { isEqual } from 'lodash';
import { capitalizeFirst } from '@/utils/index';
import type { ProjectWithSemestersAndPartner } from '~/server/api/projects/index.get';
import { displaySemester, stringifySemesters } from '~/server/services/semesterService';
// import { faker } from '@faker-js/faker';
import { useHead } from '@vueuse/head';
import { usePrimeVueToast } from '~/composables/usePrimeVueToast';

useHead({ title: 'Projects' });

const { successToast, errorToast } = usePrimeVueToast();
const projects = ref<ProjectWithSemestersAndPartner[]>([]);
const semesters = ref<Semester[]>([]);
const selectedUploadSemester = ref<Semester | null>(null);

type DayTab = 'ALL' | 'WEDNESDAY' | 'THURSDAY';
type MeetingDay = 'WEDNESDAY' | 'THURSDAY' | 'BOTH';
const selectedDayTab = ref<DayTab>('ALL');

const getMeetingDay = (project: ProjectWithSemestersAndPartner): MeetingDay | null => {
  const day = project.meetingDay as MeetingDay | null | undefined;
  return day ?? null;
};

onMounted(async () => {
  const [projectsResponse, semestersResponse] = await Promise.all([
    $fetch<ProjectWithSemestersAndPartner[]>('api/projects'),
    $fetch<Semester[]>('api/semesters'),
  ]);

  projects.value = projectsResponse;
  semesters.value = semestersResponse;
  selectedUploadSemester.value = semesters.value[0] ?? null;
});

const visibleProjects = computed(() => {
  if (selectedDayTab.value === 'ALL') return projects.value;
  if (selectedDayTab.value === 'THURSDAY') {
    return projects.value.filter(project => {
      const day = getMeetingDay(project);
      return day === 'THURSDAY' || day === 'BOTH' || day == null;
    });
  }
  return projects.value.filter(project => {
    const day = getMeetingDay(project);
    return day === 'WEDNESDAY' || day === 'BOTH';
  });
});

const activeTabLabel = computed(() => {
  if (selectedDayTab.value === 'WEDNESDAY') return 'Wednesday';
  if (selectedDayTab.value === 'THURSDAY') return 'Thursday';
  return 'All';
});

const selectedProject = ref<ProjectWithSemestersAndPartner | null>(null);
const selectedProjectSemesters = computed(() => stringifySemesters(selectedProject.value?.semesters));
const editedProject = ref<ProjectWithSemestersAndPartner | null>(null);
const isEditing = ref(false);

const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.CONTAINS },
  meetingDay: { value: [], matchMode: FilterMatchMode.IN },
  status: { value: [], matchMode: FilterMatchMode.IN },
  semester: { value: [], matchMode: FilterMatchMode.IN },
  partnerName: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const formatTypesFilter = (types: ProjectType[] | undefined) => {
  if (!types || types.length === 0) return 'Any';
  if (types.length !== 1) return `${types.length} items selected`;
  return capitalizeFirst(types[0]);
};

const statuses = ref(['NEW', 'RETURNING', 'COMPLETE', 'WITHDRAWN', 'HOLD']);
const types = ref(['SOFTWARE', 'HARDWARE', 'BOTH']);
const meetingDayOptions = ref<MeetingDay[]>(['WEDNESDAY', 'THURSDAY', 'BOTH']);

const normalizeMeetingDay = (rawValue: unknown, forcedDay?: 'WEDNESDAY' | 'THURSDAY'): MeetingDay | null => {
  if (forcedDay) return forcedDay;
  if (typeof rawValue !== 'string') return null;
  const value = rawValue.trim().toUpperCase().replace(/\s+/g, '');
  if (
    value === 'BOTH' ||
    value === 'WEDNESDAY,THURSDAY' ||
    value === 'THURSDAY,WEDNESDAY' ||
    value === 'WEDNESDAY/THURSDAY' ||
    value === 'THURSDAY/WEDNESDAY' ||
    value === 'WEDNESDAY&THURSDAY' ||
    value === 'THURSDAY&WEDNESDAY' ||
    value === 'WEDTHU' ||
    value === 'THUWED'
  ) return 'BOTH';
  if (value === 'WEDNESDAY' || value === 'WED') return 'WEDNESDAY';
  if (value === 'THURSDAY' || value === 'THU' || value === 'THURS') return 'THURSDAY';
  return null;
};

const formatMeetingDay = (day: MeetingDay | null | undefined) => {
  if (day === 'WEDNESDAY') return 'Wednesday';
  if (day === 'THURSDAY') return 'Thursday';
  if (day === 'BOTH') return 'Wednesday + Thursday';
  return 'Unspecified';
};

const formatMeetingDayFilter = (days: MeetingDay[] | undefined) => {
  if (!days || days.length === 0) return 'Any';
  if (days.length !== 1) return `${days.length} selected`;
  return formatMeetingDay(days[0]);
};

const selectProject = (project: ProjectWithSemestersAndPartner) => { selectedProject.value = project; };
const closeModal = () => { selectedProject.value = null; isEditing.value = false; };

const handleEdit = () => {
  if (!selectedProject.value) return;
  isEditing.value = true;
  editedProject.value = { ...selectedProject.value };
};

const handleSave = async () => {
  if (selectedProject.value && editedProject.value && !isEqual(selectedProject.value, editedProject.value)) {
    const id = editedProject.value.id;
    await $fetch(`api/projects/${id}`, {
      method: 'PUT',
      body: { ...editedProject.value, semesters: undefined, partnerName: undefined }
    });
    selectedProject.value = editedProject.value;
    const index = projects.value.findIndex((p) => p.id === id);
    if (index >= 0) projects.value[index] = editedProject.value;
  }
  isEditing.value = false;
};

const mapProjectsFromCsv = (parsed: any[], forcedDay?: 'WEDNESDAY' | 'THURSDAY') => (
  parsed.map((proj: any) => ({
    name: proj.name || '',
    description: proj.description || '',
    type: proj.type?.toUpperCase() || 'SOFTWARE',
    status: proj.status?.toUpperCase() || 'NEW',
    meetingDay: normalizeMeetingDay(proj.meetingDay ?? proj.day, forcedDay),
    repoURL: proj.repoURL || '',
    partnerName: proj.partnerName || ''
  }))
);

const refreshProjects = async () => {
  projects.value = await $fetch<ProjectWithSemestersAndPartner[]>('/api/projects');
};

const handleParsed = async (parsed: any, forcedDay?: 'WEDNESDAY' | 'THURSDAY') => {
  console.log('Parsed CSV:', parsed);
  const formattedProjects = mapProjectsFromCsv(parsed, forcedDay);

  try {
    await $fetch('/api/projects', {
      method: 'POST',
      body: {
        projects: formattedProjects,
        semesterId: selectedUploadSemester.value?.id ?? null,
      }
    });

    await refreshProjects();
    console.log('Projects saved to database successfully!');
    console.log('Projects table updated! Total projects:', projects.value.length);
    successToast('Projects uploaded successfully.');
  } catch (error) {
    console.error('Error saving projects to database:', error);
    errorToast('Failed to upload projects.');
  }
};

const handleParsedReplace = async (parsed: any, forcedDay?: 'WEDNESDAY' | 'THURSDAY') => {
  console.log('Parsed CSV (replace):', parsed);

  const formattedProjects = mapProjectsFromCsv(parsed, forcedDay);

  try {
    if (forcedDay) {
      const oppositeDay: MeetingDay = forcedDay === 'WEDNESDAY' ? 'THURSDAY' : 'WEDNESDAY';

      // Keep projects that are BOTH by downgrading them to the opposite day.
      const toDowngrade = projects.value.filter(project => getMeetingDay(project) === 'BOTH');
      await Promise.all(
        toDowngrade.map(project =>
          $fetch(`/api/projects/${project.id}`, {
            method: 'PUT',
            body: {
              ...project,
              meetingDay: oppositeDay,
              semesters: undefined,
              partnerName: undefined,
            },
          })
        )
      );

      const toDelete = projects.value.filter(project => getMeetingDay(project) === forcedDay);
      await Promise.all(
        toDelete.map(project => $fetch(`/api/projects/${project.id}`, { method: 'DELETE' }))
      );
    } else {
      await $fetch('/api/projects', {
        method: 'DELETE'
      });
    }

    await $fetch('/api/projects', {
      method: 'POST',
      body: {
        projects: formattedProjects,
        semesterId: selectedUploadSemester.value?.id ?? null,
      }
    });

    await refreshProjects();
    console.log('Projects replaced successfully!');
    successToast('Projects replaced successfully.');
  } catch (error) {
    console.error('Error replacing projects from CSV:', error);
    errorToast('Failed to replace projects from CSV.');
  }
};

const handleParsedWednesday = async (parsed: any) => handleParsed(parsed, 'WEDNESDAY');
const handleParsedThursday = async (parsed: any) => handleParsed(parsed, 'THURSDAY');
const handleParsedReplaceWednesday = async (parsed: any) => handleParsedReplace(parsed, 'WEDNESDAY');
const handleParsedReplaceThursday = async (parsed: any) => handleParsedReplace(parsed, 'THURSDAY');

const handleDeleteProject = async (project: ProjectWithSemestersAndPartner) => {
  const confirmAvailable = typeof globalThis !== 'undefined' && typeof (globalThis as any).confirm === 'function';
  if (confirmAvailable) {
    if (!(globalThis as any).confirm(`Are you sure you want to delete "${project.name}"? This cannot be undone.`)) {
      return;
    }
  }

  try {
    await $fetch(`/api/projects/${project.id}`, {
      method: 'DELETE'
    });

    projects.value = projects.value.filter(p => p.id !== project.id);
    selectedProject.value = null;
    successToast(`Deleted project "${project.name}"`, 3000);
  } catch (error: any) {
    errorToast(error?.data?.message || 'Failed to delete project');
    console.error('Error deleting project:', error);
  }
};

const resetDatabase = async () => {
  const confirmAvailable = typeof globalThis !== 'undefined' && typeof (globalThis as any).confirm === 'function';
  if (confirmAvailable) {
    if (!(globalThis as any).confirm('This will delete ALL data (students, partners, projects, teams) and will not repopulate defaults. Are you sure?')) {
      return;
    }
  }
  
  try {
    await $fetch('/api/database/reset', {
      method: 'POST'
    });
    
    // Refresh projects from database
    projects.value = await $fetch<ProjectWithSemestersAndPartner[]>('/api/projects');
    console.log('Database cleared successfully!');
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).alert === 'function') {
      (globalThis as any).alert('Database has been cleared.');
    }
  } catch (error) {
    console.error('Error resetting database:', error);
    // Show alert only if running in an environment that provides it (browser)
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).alert === 'function') {
      (globalThis as any).alert('Failed to reset database. Please check the console for details.');
    }
  }
};

const handleClearAll = async () => {
  if (!(globalThis as any).confirm('Are you sure you want to delete all projects? This cannot be undone.')) {
    return;
  }
  
  try {
    await $fetch('/api/projects', {
      method: 'DELETE'
    });
    
    projects.value = [];
    console.log('All projects deleted successfully!');
  } catch (error) {
    console.error('Error deleting projects:', error);
  }
};

const statusBgColor = (status: string) => ({
  'bg-green': status === 'NEW',
  'bg-orange': status === 'RETURNING',
  'bg-lightblue': status === 'COMPLETE',
  'bg-gray': status === 'WITHDRAWN',
  'bg-red': status === 'HOLD'
});

const helpInfo = `Upload information for your projects here.
Be sure to enter project name, project partner, target # of CS majors, and whether it is archived.`;
</script>

<style scoped>
.cardRows { display:flex; flex-direction:column; gap:1.25rem; }
.cardTitle { text-shadow:1px 1px 1px rgba(0,0,0,0.55); font-size:3rem; filter:drop-shadow(0 1px 1px rgba(0,0,0,0.25)); }
.cardSubTitle { text-shadow:1px 1px 1px rgba(0,0,0,0.55); font-size:1.5rem; margin-right:0.5rem; }
.cardText { font-size:1.25rem; }

.overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:98; }
.modal { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); box-shadow:0 4px 6px rgba(0,0,0,0.1); z-index:99; }
.editBox { color:#14b8a6; border-radius:0.375rem; background-color:#f5f5dc; padding:0.25rem; }
select { background-color:#f5f5dc; color:#14b8a6; border-radius:0.375rem; padding:0.25rem; }

:deep(.p-datatable-wrapper) { overflow-x: auto !important; }

@media (max-width: 767px) {
  .project-title { font-size: 1.25rem; }
}

:deep(.p-datatable td) {
  white-space: normal;
  word-break: break-word;
}

.project-title {
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin: 0 auto;
  display: inline-block;
  background: var(--color-utd-orange);
  color: #ffffff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
}
.pill { display:inline-flex; align-items:center; justify-content:center; padding:0.25rem 0.5rem; border-radius:9999px; font-size:0.875rem; background:rgba(0,0,0,0.06); min-width:5.5rem; white-space:nowrap; line-height:1; }

/* colors for pills! */
.pill.bg-green { background: var(--color-pill-new) !important; color: #ffffff !important; }
.pill.bg-orange { background: var(--color-pill-returning) !important; color: #ffffff !important; }
.pill.bg-lightblue { background: var(--color-pill-complete) !important; color: #ffffff !important; }
.pill.bg-gray { background: var(--color-pill-withdrawn) !important; color: #ffffff !important; }
.pill.bg-red { background: var(--color-pill-hold) !important; color: #ffffff !important; }

.day-tabs {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 0.65rem;
  padding: 0.25rem;
}

.day-tab-btn {
  border: 0;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.day-tab-btn.active {
  background: var(--color-accent-utd-green);
  color: #ffffff;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25) inset;
}

.upload-semester-dropdown {
  min-width: 160px;
  max-width: 190px;
  flex: 0 0 180px;
}

.control-fixed {
  flex: 0 0 180px;
  min-width: 0;
}

.control-fill {
  flex: 1 1 0;
  min-width: 0;
}

.controls-row {
  flex-wrap: nowrap;
  width: 100%;
  gap: 0.5rem;
}

.controls-row :deep(.front) {
  width: 100%;
  text-align: center;
  font-size: 0.88rem;
  padding: 0.45rem 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: translateY(-4px);
}

/* make the whole shaded card area use the UTD orange and fill surrounding whitespace */
.centered-row.shaded-card {
  background: var(--color-utd-orange) !important;
  padding: 2rem !important; /* widen the orange frame */
  border-radius: 0.5rem;
}

/* keep the primevue DataTable itself white but make the inner area around it orange as well */
.centered-row.shaded-card > .centered-col {
  background: transparent !important;
  border-radius: 0.75rem;
  padding: 1.25rem !important; /* inner inset padding */
  box-shadow: none;
  width: 100%;
}
</style>