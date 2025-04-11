<template lang="pug">
  .overlay(v-if="selectedStudent" @click="closeModal")
  .centered-row.shaded-card.p-10.m-10.h-full
    .centered-col.relative.h-full.gap-4
      .flex.absolute.top-0.left-0.gap-2
        FileUploadButton(title="Upload Students" @fileSelected="handleParsed")
        HelpIcon(:info="helpInfo")

      .text-7xl.embossed.drop-shadow-md Students
      .text-2xl.mt-2 Student count: {{ studentCount }}
      
      DataTable.teal-card.px-10.mt-5(
        :value="students" 
        v-model:filters="filters"
        scrollable 
        scrollHeight="80vh"
        class="h-[80vh]"
        tableStyle="min-width: 50rem;"
        dataKey="id" 
        filterDisplay="row"
        selectionMode="single"
        v-model:selection="selectedStudent"
      )
        Column(field="lastName" header="Last Name" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by last" :showClear="true")

        Column(field="firstName" header="First Name" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by first" :showClear="true")

        Column(field="netID" header="NetID" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by NetID" :showClear="true")

        Column(field="major" header="Major" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="majors" placeholder="Any" :maxSelectedLabels="1")

        Column(field="year" header="Year" :showFilterMenu="false")
          template(#body="{ data }") {{ capitalizeFirst(data.year) }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="years" placeholder="Any" :maxSelectedLabels="1")
              // dropdown options
              template(#option="slotProps") {{ capitalizeFirst(slotProps.option) }}
              // selected value
              template(#value="slotProps") {{ formatYearsFilter(slotProps.value) }}

        Column(field="status" header="Status" :showFilterMenu="false")
          template(#body="{ data }") 
            .pill.w-20(:class="statusBgColor(data.status)") {{ data.status }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Any" :maxSelectedLabels="1")
              template(#option="slotProps")
                .pill.w-20(:class="statusBgColor(slotProps.option)") {{ slotProps.option }}
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { XCircleIcon } from '@heroicons/vue/24/solid';
import { isEqual } from 'lodash';
import type { Student, Year } from '@prisma/client';

useHead({ title: 'Students' });

const students = ref<Student[]>([]);
const studentCount = ref(0);

onMounted(async () => {
  students.value = await $fetch<Student[]>("api/students");
  studentCount.value = students.value.length;
});

const handleParsed = (uploadedStudents: Student[]) => {
  students.value.push(...uploadedStudents);
  studentCount.value = students.value.length;
};

const selectedStudent = ref<Student | null>(null);
const editedStudent = ref<Student | null>(null);
const isEditing = ref(false);

const filters = ref({
  lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  netID: { value: null, matchMode: FilterMatchMode.CONTAINS },
  major: { value: [], matchMode: FilterMatchMode.IN },
  year: { value: [], matchMode: FilterMatchMode.IN },
  status: { value: [], matchMode: FilterMatchMode.IN },
});

const formatYearsFilter = (years: Year[] | undefined) => {
  if (!years || years.length === 0) return 'Any';
  if (years.length !== 1) return `${years.length} items selected`
  return capitalizeFirst(years[0]);
}

const statuses = ref(['ACTIVE', 'INACTIVE']);
const majors = ref(['CS', 'SE', 'EE', 'ME', 'BME', 'DS', 'CE', 'Systems', 'Other']);
const years = ref(['FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR']);

const statusBgColor = (status: string) => ({
  "bg-green": status === "ACTIVE",
  "bg-red": status === "INACTIVE",
});

const closeModal = () => {
  selectedStudent.value = null;
  isEditing.value = false;
}

const handleEdit = () => {
  if (!selectedStudent.value) return;
  isEditing.value = true;
  editedStudent.value = { ...selectedStudent.value };
}

const handleSave = async () => {
  if (selectedStudent.value && editedStudent.value && !isEqual(selectedStudent.value, editedStudent.value)) {
    const id = editedStudent.value.id;
    await $fetch(`api/students/${id}`, {
      method: 'PUT',
      body: editedStudent.value
    });
    selectedStudent.value = editedStudent.value;
    const index = students.value.findIndex((student) => student.id === id);
    students.value[index] = editedStudent.value;
  }
  isEditing.value = false;
}

const helpInfo = `Upload student information here.`
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
  z-index: 99;
}
</style>
