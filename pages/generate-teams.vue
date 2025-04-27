<template lang="pug">
  .centered-col.shaded-card.mt-10.p-10.gap-10
    .stepCard
      .cardTitle Step 1: Start New Semester
    .stepCard.gap-5
      .cardTitle Step 2: Activate Projects for Semester
      Dropdown(
        v-model="selectedSemester"
        :options="semesters"
        placeholder="Select Semester"
      )
        template(#option="slotProps")
          div(v-if="slotProps.option") {{ displaySemester(slotProps.option) }}
          span(v-else) {{ slotProps.placeholder }}
        template(#value="slotProps")
          div(v-if="slotProps.value") {{ displaySemester(slotProps.value) }}
          span(v-else) {{ slotProps.placeholder }}
      .centered-row.gap-20.w-full
        InputText(v-model="filterInactive" class="filterBox" size="small" placeholder="Search for Project")
        InputText(v-model="filterActive" class="filterBox" size="small" placeholder="Search for Project")
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
      ClickableButton.mt-5(title="Save Projects" @click="handleSaveProjects")
    .stepCard
      .cardTitle Step 3: Generate Teams
</template>

<script setup lang="ts">
import type { Semester } from '@prisma/client';
import { displaySemester } from '@/utils/index';
import Dropdown from 'primevue/dropdown';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';
import type { PickListMoveToSourceEvent, PickListMoveToTargetEvent } from 'primevue/picklist';
import { filterProjectsByName, getActiveProjects, getAvailableProjects } from '~/server/services/projectService';

useHead({ title: 'Generate Teams' });
const { successToast, errorToast, infoToast } = usePrimeVueToast();

const semesters = ref<Semester[]>([]);
const projects = ref<ProjectWithSemesters[]>([]);
const selectedSemester = ref<Semester | null>(null);

// these store the total inactive and active projects, unfiltered by name
const inactiveProjects = ref<ProjectWithSemesters[]>([]);
const activeProjects = ref<ProjectWithSemesters[]>([]);

// filter strings
const filterInactive = ref<string>('');
const filterActive = ref<string>('');

// model used by Picklist.  first array corresponds to inactive projects, second to active projects.
const pickListProjects = ref<[ProjectWithSemesters[], ProjectWithSemesters[]]>([[], []]);

// arrays to store project ids we want to activate or deactivate for the selected semester
let activateProjectsById: string[] = [];
let deactivateProjectsById: string[] = [];

onMounted(async () => {
  semesters.value = await $fetch<Semester[]>("api/semesters");
  projects.value = await $fetch<ProjectWithSemesters[]>("api/projects");
});

watch(selectedSemester, (newValue) => {
  // clear filters
  filterInactive.value = '';
  filterActive.value = '';

  // clear projects-to-be-updated arrays
  activateProjectsById = [];
  deactivateProjectsById = [];

  inactiveProjects.value = getAvailableProjects(projects.value, newValue);
  activeProjects.value = getActiveProjects(projects.value, newValue);

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

  if (!semesterId) {
    errorToast('Please select semester and move projects before saving.');
    return;
  }

  if (activateProjectsById.length === 0 && deactivateProjectsById.length === 0) {
    infoToast('Select projects to move before saving.');
    return;
  }

  if (activateProjectsById.length > 0) {
    const response = await $fetch("/api/teams", {
      method: "POST",
      body: {
        semesterId,
        projectIds: activateProjectsById
      }
    })
    
    if (response.status === 201) {
      activateProjectsById = [];
      successToast(`${response.data.count} projects activated!`);
    } else {
      errorToast('Error activating projects.  Please try again.');
    }
  }

  if (deactivateProjectsById.length > 0) {
    const response = await $fetch("/api/teams", {
      method: "DELETE",
      body: {
        semesterId,
        projectIds: deactivateProjectsById
      }
    })

    if (response.status === 200) {
      deactivateProjectsById = [];
      successToast(`${response.data.count} projects deactivated!`);
    } else {
      errorToast('Error deactivating projects.  Please try again.');
    }
  }
}
</script>

<style scoped>
.stepCard {
  /* centered-col teal-card */
  @apply flex flex-col justify-center items-center bg-teal rounded-3xl p-10 w-full
}
.cardTitle {
  text-shadow: 1px 1px 1px #0000008b;
  @apply text-3xl
}
.filterBox {
  @apply w-full
}
</style>