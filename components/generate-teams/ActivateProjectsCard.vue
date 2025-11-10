<template lang="pug">
  .text-3xl.font-semibold.mb-4 Step 2: Activate Projects for Semester
  Dropdown(
    v-model="selectedSemester"
    :options="semesters"
    placeholder="Select Semester"
  )
    template(#option="slotProps") {{ displaySemester(slotProps.option) }}
    template(#value="slotProps")
      div(v-if="slotProps.value") {{ displaySemester(slotProps.value) }}
      span(v-else) {{ slotProps.placeholder }}
  .centered-row.gap-20.w-full
    InputText.w-full(v-model="filterInactive" size="small" placeholder="Search for Project")
    InputText.w-full(v-model="filterActive" size="small" placeholder="Search for Project")
  PickList(
    v-model="pickListProjects"
    dataKey="id"
    class="w-full"
    @move-to-source="handleMoveToInactive"
    @move-to-target="handleMoveToActive"
    :showSourceControls="false"
    :showTargetControls="false"
    :moveAllToSourceProps="{ style: 'display: none' }"
    :moveAllToTargetProps="{ style: 'display: none' }"
  )
    template(#sourceheader)
      .text-xl.font-bold Inactive ({{ inactiveProjectCount }})
    template(#targetheader)
      .text-xl.font-bold Active ({{ activeProjectCount }})
    template(#item="slotProps") {{ slotProps.item.name }}
  ClickableButton.mt-5(title="Save Projects" type="success" @click="handleSaveProjects")
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Semester } from '@prisma/client';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';
import Dropdown from 'primevue/dropdown';
import { useToast } from 'primevue/usetoast';
import type { PickListMoveToSourceEvent, PickListMoveToTargetEvent } from 'primevue/picklist';
import { filterProjectsByName, getActiveProjects, getInactiveProjects } from '~/server/services/projectService';
import { displaySemester } from '~/server/services/semesterService';

const { projects, semesters } = defineProps<{
  projects: ProjectWithSemesters[]
  semesters: Semester[]
}>()

const emit = defineEmits<{
  (e: 'fetchProjects'): void
}>()

function usePrimeVueToast() {
  const toast = useToast();
  const successToast = (message: string) => toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
  const errorToast = (message: string) => toast.add({ severity: 'error', summary: 'Error', detail: message, life: 5000 });
  const infoToast = (message: string) => toast.add({ severity: 'info', summary: 'Info', detail: message, life: 3000 });
  return { successToast, errorToast, infoToast };
}

const { successToast, errorToast, infoToast } = usePrimeVueToast();

const selectedSemester = ref<Semester | null>(null);

// filters by string
const filterInactive = ref<string>('');
const filterActive = ref<string>('');

// arrays to store project ids we want to activate or deactivate for the selected semester
let activateProjectsById: string[] = [];
let deactivateProjectsById: string[] = [];

// these store the total inactive and active projects, unfiltered by name
const inactiveProjects = ref<ProjectWithSemesters[]>([]);
const activeProjects = ref<ProjectWithSemesters[]>([]);

// model used by Picklist.  first array corresponds to inactive projects, second to active projects.
const pickListProjects = ref<[ProjectWithSemesters[], ProjectWithSemesters[]]>([[], []]);

watch(selectedSemester, (newValue) => {
  // clear filters
  filterInactive.value = '';
  filterActive.value = '';

  // clear projects-to-be-updated arrays
  activateProjectsById = [];
  deactivateProjectsById = [];

  // TODO: Change getInactiveProjects to getAvailableProjects.  See notes in projectService.
  inactiveProjects.value = getInactiveProjects(projects, newValue);
  activeProjects.value = getActiveProjects(projects, newValue);

  pickListProjects.value = [
    inactiveProjects.value,
    activeProjects.value
  ];
});

watch(filterInactive, (newValue) => {
  pickListProjects.value[0] = filterProjectsByName(inactiveProjects.value, newValue);
})

watch(filterActive, (newValue) => {
  pickListProjects.value[1] = filterProjectsByName(activeProjects.value, newValue);
})

const inactiveProjectCount = computed(() => (
  inactiveProjects.value.length
));

const activeProjectCount = computed(() => (
  activeProjects.value.length
));

const handleMoveToInactive = (event: PickListMoveToSourceEvent) => {
  event.items.forEach((project: ProjectWithSemesters) => {
    // account for if we moved a project and moved it back
    const idxInIds = activateProjectsById.indexOf(project.id);

    if (idxInIds === -1) {
      deactivateProjectsById.push(project.id);
    } else {
      activateProjectsById.splice(idxInIds, 1);
    }

    // also move project from activeProjects to inactiveProjects
    // so we can track project count and filter correctly
    activeProjects.value = activeProjects.value.filter(inactiveProject => inactiveProject.id !== project.id);
    inactiveProjects.value.push(project);
  })
}

const handleMoveToActive = (event: PickListMoveToTargetEvent) => {
  event.items.forEach((project: ProjectWithSemesters) => {
    // account for if we moved a project and moved it back
    const idxInIds = deactivateProjectsById.indexOf(project.id);

    if (idxInIds === -1) {
      activateProjectsById.push(project.id);
    } else {
      deactivateProjectsById.splice(idxInIds, 1);
    }

    // also move project from inactiveProjects to activeProjects
    // so we can track project count and filter correctly
    inactiveProjects.value = inactiveProjects.value.filter(inactiveProject => inactiveProject.id !== project.id);
    activeProjects.value.push(project);
  })
}

const handleSaveProjects = async () => {
  const semesterId = selectedSemester.value?.id;
  let didUpdate = false;

  if (!semesterId) {
    errorToast('Please select semester and move projects before saving.');
    return;
  }

  if (activateProjectsById.length === 0 && deactivateProjectsById.length === 0) {
    infoToast('Select projects to move before saving.');
    return;
  }

  // Activate projects
  if (activateProjectsById.length > 0) {
    const response = await $fetch("/api/teams", {
      method: "POST",
      body: {
        semesterId,
        projectIds: activateProjectsById
      }
    })
    
    if (response.status === 201) {
      didUpdate = true;
      activateProjectsById = [];
      successToast(`${response.data.count} projects activated!`);
    } else {
      errorToast('Error activating projects.  Please try again.');
    }
  }

  // Deactivate projects
  if (deactivateProjectsById.length > 0) {
    const response = await $fetch("/api/teams", {
      method: "DELETE",
      body: {
        semesterId,
        projectIds: deactivateProjectsById
      }
    })

    if (response.status === 200) {
      didUpdate = true;
      deactivateProjectsById = [];
      successToast(`${response.data.count} projects deactivated!`);
    } else {
      errorToast('Error deactivating projects.  Please try again.');
    }
  }

  // Sync projetcs ref with database
  if (didUpdate) {
    emit('fetchProjects');
  }
}
</script>