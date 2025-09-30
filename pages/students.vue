<template lang="pug">
  // Overlay that appears when a student is selected and modal is active
  .overlay(v-if="selectedStudent" @click="closeModal")

  // Main student section container
  .centered-row.shaded-card.p-10.m-10.h-full
    .centered-col.relative.h-full.gap-4

      // Top-left corner controls: file upload + help icon
      .flex.absolute.top-0.left-0.gap-2
        FileUploadButton(title="Upload Students" @fileSelected="handleParsed")
        HelpIcon(:info="helpInfo")

      // Header text
      .text-7xl.embossed.drop-shadow-md Students
      .text-2xl.mt-2 Student count: {{ studentCount }}
      
      // Scrollable student data table with filters
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
        // Name filter
        Column(field="name" header="Name" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" :showClear="true")

        // NetID filter
        Column(field="netid" header="NetID" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by NetID" :showClear="true")

        // Course filter
        Column(field="course" header="Course" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="course" placeholder="Any" :maxSelectedLabels="1")

        // Major filter
        Column(field="major" header="Major" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="majors" placeholder="Any" :maxSelectedLabels="1")

        // Year filter
        Column(field="year" header="Year" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="years" placeholder="Any" :maxSelectedLabels="1")

        // Status filter and pill-style display
        Column(field="status" header="Status" :showFilterMenu="false")
          template(#body="{ data }") 
            .pill.w-20(:class="statusBgColor(data.status)") {{ data.status.toUpperCase() }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Any" :maxSelectedLabels="1")
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { isEqual } from 'lodash';

useHead({ title: 'Students' }); // Set browser tab title

// Reactive data
const students = ref([]);
const studentCount = ref(0);

// Load initial student list on page load
onMounted(async () => {
  students.value = await $fetch("api/students");
  studentCount.value = students.value.length;
});

// Add uploaded students and update count
const handleParsed = (uploadedStudents) => {
  students.value.push(...uploadedStudents);
  studentCount.value = students.value.length;
};

// Selected and edited student tracking
const selectedStudent = ref(null);
const editedStudent = ref(null);
const isEditing = ref(false);

// Table filters
const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  netid: { value: null, matchMode: FilterMatchMode.CONTAINS },
  major: { value: [], matchMode: FilterMatchMode.IN },
  year: { value: [], matchMode: FilterMatchMode.IN },
  status: { value: [], matchMode: FilterMatchMode.IN },
  course: { value: [], matchMode: FilterMatchMode.IN },
});

// Filter options
const statuses = ref(['ACTIVE', 'INACTIVE', 'GRADUATED']);
const majors = ref(['CS', 'SE', 'EE', 'ME', 'BME', 'DS', 'CE', 'Systems', 'Other']);
const years = ref(['Freshman', 'Sophomore', 'Junior', 'Senior']);
const course = ref(['2200', '3200']);

// Close modal and stop editing
const closeModal = () => {
  selectedStudent.value = null;
  isEditing.value = false;
};

// Begin editing the selected student
const handleEdit = () => {
  if (!selectedStudent.value) return;
  isEditing.value = true;
  editedStudent.value = { ...selectedStudent.value };
};

// Save changes to student if edits were made
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
};

// Tooltip help message
const helpInfo = `Upload student information here.`;
</script>

<style scoped>
/* Optional reusable styles */
.cardRows {
  @apply flex flex-col gap-5;
}
.cardTitle {
  text-shadow: 1px 1px 1px #0000008b;
  @apply text-5xl drop-shadow-sm;
}
.cardSubTitle {
  text-shadow: 1px 1px 1px #0000008b;
  @apply text-2xl mr-2;
}
.cardText {
  @apply text-xl;
}

/* Modal overlay background */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
}

/* Modal center positioning */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
</style>
