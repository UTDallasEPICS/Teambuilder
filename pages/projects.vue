<template lang="pug">
  .overlay(v-if="selectedProject" @click="closeModal")
  .centered-row.shaded-card.p-10.m-10.h-full
    .centered-col.relative.h-full.gap-4
      .flex.absolute.top-0.left-0.gap-2
        FileUploadButton(title="Upload Projects" @dataParsed="handleParsed")
        HelpIcon(:info="helpInfo")

      .project-title Projects

      DataTable.beige-card.overflow-hidden(
        :value="projects"
        v-model:filters="filters"
        scrollable
        scrollHeight="80vh"
        class="h-[80vh] w-full mt-2 md:mt-5"
        dataKey="id"
        filterDisplay="row"
        selectionMode="single"
        v-model:selection="selectedProject"
      )
        Column(field="name" header="Name" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" :showClear="true")
        Column(field="description" header="Description" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by description" :showClear="true")
        // hide this column on small screens (partner is lower priority)
        Column(field="partnerName" header="Partner" :showFilterMenu="false" class="hidden lg:table-cell")
          template(#filter="{ filterModel, filterCallback }")
            InputText(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by partner" :showClear="true")
        Column(field="status" header="Status" :showFilterMenu="false")
          template(#body="{ data }")
            .flex.justify-center
              .pill(:class="statusBgColor(data.status)") {{ data.status.toUpperCase() }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Any" :maxSelectedLabels="0")
              template(#option="slotProps")
                .pill(:class="statusBgColor(slotProps.option)") {{ slotProps.option }}
        // hide type on small screens
        Column(field="type" header="Type" :showFilterMenu="false" class="hidden lg:table-cell")
          template(#body="{ data }")
            .text-center {{ capitalizeFirst(data.type) }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="types" placeholder="Any" :maxSelectedLabels="1")
              template(#option="slotProps") {{ capitalizeFirst(slotProps.option) }}
              template(#value="slotProps") {{ formatTypesFilter(slotProps.value) }}

  .cardRows.relative.teal-card.p-15.modal(v-if="selectedProject" class="w-[50vw]")
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
      span.cardSubTitle Repo:
      span.cardText
        a(v-if="!isEditing" :href="selectedProject?.repoURL" target="_blank") {{ selectedProject?.repoURL }}
        input.editBox(v-else v-model="editedProject.repoURL")

    .flex-grow.flex.justify-end.items-end
      ClickableButton(v-if="!isEditing" title="Edit Project" @click="handleEdit")
      ClickableButton(v-if="isEditing" title="Save Project" type="success" @click="handleSave")
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import type { ProjectType } from '@prisma/client';
import { XCircleIcon } from '@heroicons/vue/24/solid';
import { isEqual } from 'lodash';
import { capitalizeFirst } from '@/utils/index';
import type { ProjectWithSemestersAndPartner } from '~/server/api/projects/index.get';
import { stringifySemesters } from '~/server/services/semesterService';
import { faker } from '@faker-js/faker';
import {type ProjectStatus} from '@prisma/client';
import { useHead } from '@vueuse/head';

useHead({ title: 'Projects' });

const projects = ref<ProjectWithSemestersAndPartner[]>([]);
onMounted(async () => {
  projects.value = await $fetch<ProjectWithSemestersAndPartner[]>("api/projects");
});

const selectedProject = ref<ProjectWithSemestersAndPartner | null>(null);
const selectedProjectSemesters = computed(() => stringifySemesters(selectedProject.value?.semesters));
const editedProject = ref<ProjectWithSemestersAndPartner | null>(null);
const isEditing = ref(false);

const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

const handleParsed = (parsed: any) => { console.log(parsed); };

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

@media (min-width: 768px) {
  :deep(.p-datatable-scrollable .p-datatable-table) { min-width: 50rem !important; }
}
@media (max-width: 767px) {
  :deep(.p-datatable-scrollable .p-datatable-table) { min-width: 20rem !important; }
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

/* make the whole shaded card area use the UTD orange and fill surrounding whitespace */
.centered-row.shaded-card {
  background: var(--color-utd-orange) !important;
  padding: 2rem !important; /* widen the orange frame */
  border-radius: 0.5rem;
}

/* keep the primevue DataTable itself white but make the inner area around it orange as well */
.centered-row.shaded-card > .centered-col {
  background: var(--color-utd-orange) !important;
  border-radius: 0.75rem;
  padding: 1.25rem !important; /* inner inset padding */
  box-shadow: 0 8px 20px rgba(16,24,40,0.06);
  width: 100%;
}
</style>