<template lang="pug">
  .overlay(v-if="selectedProject" @click="closeModal")
  .centered-row.shaded-card.p-10.m-10.h-full
    .centered-col.relative.h-full.gap-4
      .flex.absolute.top-0.left-0.gap-2
        FileUploadButton(title="Upload Projects" @fileSelected="handleParsed")
        HelpIcon(:info="helpInfo")

      .text-7xl.embossed.drop-shadow-md Projects
      
      DataTable.teal-card.px-10.mt-5(
        :value="projects" 
        v-model:filters="filters"
        scrollable 
        scrollHeight="80vh"
        class="h-[80vh]"
        tableStyle="min-width: 50rem;"
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
        Column(field="status" header="Status" :showFilterMenu="false")
          template(#body="{ data }") 
            .pill.w-20(:class="statusBgColor(data.status)") {{ data.status.toUpperCase() }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Any" :maxSelectedLabels="0")
              template(#option="slotProps")
                .pill.w-20(:class="statusBgColor(slotProps.option)") {{ slotProps.option }}
        Column(field="type" header="Type" :showFilterMenu="false")
          template(#body="{ data }")
            .text-center {{ capitalizeFirst(data.type) }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="types" placeholder="Any" :maxSelectedLabels="1")
  
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
        //- select(v-else v-model="editedProject.semester")
        //-   option(v-for="semester in semesters" :key="semester" :value="semester") {{ semester }}

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
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import type { Semester } from '@prisma/client';
import { XCircleIcon } from '@heroicons/vue/24/solid';
import { isEqual } from 'lodash';
import { capitalizeFirst } from '@/utils/index';
import type { ProjectWithSemesters } from '~/server/api/projects/index.get';
import { stringifySemesters } from '@/utils/index';

useHead({ title: 'Projects' });

const projects = ref<ProjectWithSemesters[]>([]);
onMounted(async () => {
  projects.value = await $fetch<ProjectWithSemesters[]>("api/projects");
  console.log(projects.value[0])
})
const selectedProject = ref<ProjectWithSemesters | null>(null);
const selectedProjectSemesters = computed(() => (
  stringifySemesters(selectedProject.value?.teams.map(team => team.semester))
));
// const selectedProjectSemesters: Semester[] | undefined = selectedProject.value?.teams.map(team => team.semester);
const editedProject = ref<ProjectWithSemesters | null>(null);
const isEditing = ref(false);

const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: [], matchMode: FilterMatchMode.IN },
});

const statuses = ref(['NEW', 'RETURNING', 'COMPLETE', 'WITHDRAWN', 'HOLD']);
const semesters = ref(['S2023', 'F2023', 'S2024', 'F2024', 'S2025']);
const types = ref(['Software', 'Hardware', 'Both']);

const selectProject = (project: ProjectWithSemesters) => {
  selectedProject.value = project;
}

const closeModal = () => {
  selectedProject.value = null;
  isEditing.value = false;
}

const handleEdit = () => {
  if (!selectedProject.value) return;

  isEditing.value = true;
  editedProject.value = { ...selectedProject.value };
}

const handleSave = async () => {
  if (
    selectedProject.value && 
    editedProject.value && 
    !isEqual(selectedProject.value, editedProject.value)
  ) {
    const id = editedProject.value.id;
    await $fetch(`api/projects/${id}`, {
      method: 'PUT',
      body: editedProject.value
    });
    selectedProject.value = editedProject.value;
    const index = projects.value.findIndex((project) => project.id === id);
    projects.value[index] = editedProject.value;
  }
  isEditing.value = false;
}

const handleArchive = () => {
  const id = selectedProject.value?.id;
}

const handleParsed = (parsed: any) => {
  console.log(parsed)
};
  
const statusBgColor = (status: string) => ({
  "bg-green": status === "NEW",
  "bg-orange": status === "RETURNING",
  "bg-lightblue": status === "COMPLETE",
  "bg-gray": status === "WITHDRAWN",
  "bg-red": status === "HOLD",
});

const helpInfo = `Upload information for your projects here.  
  Be sure to enter project name, project partner, target # of CS majors, 
  and whether it is an archived project.`
</script>

<style scoped>
.cardRows {
  @apply flex flex-col gap-5
}
.cardTitle {
  text-shadow: 1px 1px 1px #0000008b;
  @apply text-5xl drop-shadow-sm
}
.cardSubTitle {
  text-shadow: 1px 1px 1px #0000008b;
  @apply text-2xl mr-2
}
.cardText {
  @apply text-xl
}
.overlay {
  position: absolute;
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
.editBox {
  @apply text-teal rounded-md bg-beige p-1
}
select {
  @apply bg-beige text-teal rounded-md border-red p-1
}
</style>

<!-- Top Row: Name, Email, NETID, Major, Status, Year -->