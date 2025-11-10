<template lang="pug">
  .overlay(v-if="selectedStudent" @click="closeModal")
  .centered-row.shaded-card.p-10.m-10.h-full
    .centered-col.relative.h-full.gap-4
      .flex.absolute.top-0.left-0.gap-2
        FileUploadButton(title="Upload Students" @dataParsed="handleParsed") <!--parsing happens HERE thru FileUploadButton.vue-->
        //-changed from fileSelected to dataParsed - successful change, handleParsed now runs
        HelpIcon(:info="helpInfo")

      .project-title Students
      .text-2xl.mt-2 Student count: {{ studentCount }}

      DataTable.beige-card.overflow-hidden(
        :value="studentsWithFullName"
        v-model:filters="filters"
        scrollable
        scrollHeight="80vh"
        class="h-[80vh] w-full mt-2 md:mt-5"
        dataKey="id"
        filterDisplay="row"
        selectionMode="single"
        v-model:selection="selectedStudent"
      )
        Column(field="fullName" header="Name" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" :showClear="true")

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

        Column(field="status" header="Status" :showFilterMenu="false" headerClass="text-center" bodyClass="text-center" style="width: 8rem")
          template(#body="{ data }") 
            .flex.justify-center
              .pill.w-20(:class="statusBgColor(data.status)") {{ data.status }}
          template(#filter="{ filterModel, filterCallback }")
            .flex.justify-center
              MultiSelect.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Any" :maxSelectedLabels="1")
                template(#option="slotProps")
                  .pill.w-20(:class="statusBgColor(slotProps.option)") {{ slotProps.option }}

  .cardRows.relative.orange-card.p-15.modal(v-if="selectedStudent" class="w-[50vw]")
    XCircleIcon.absolute.top-5.right-5.size-8.cursor-pointer(@click="closeModal")

    div
      span.cardSubTitle First Name:
      span.cardText
        template(v-if="!isEditing") {{ selectedStudent?.firstName }}
        input.editBox(v-else v-model="editedStudent.firstName")

    div
      span.cardSubTitle Last Name:
      span.cardText
        template(v-if="!isEditing") {{ selectedStudent?.lastName }}
        input.editBox(v-else v-model="editedStudent.lastName")

    div
      span.cardSubTitle netID:
      span.cardText
        template(v-if="!isEditing") {{ selectedStudent?.netID }}
        input.editBox(v-else v-model="editedStudent.netID")

    div
      span.cardSubTitle Class:
      span.cardText
        template(v-if="!isEditing") {{ selectedStudent?.class }}
        input.editBox(v-else v-model="editedStudent.class")

    div
      span.cardSubTitle Status:
      span.cardText
        template(v-if="!isEditing") {{ capitalizeFirst(selectedStudent?.status) }}
        select(v-else v-model="editedStudent.status")
          option(v-for="status in statuses" :key="status" :value="status") {{ capitalizeFirst(status) }}

    div
      span.cardSubTitle Year:
      span.cardText
        template(v-if="!isEditing") {{ capitalizeFirst(selectedStudent?.year) }}
        select(v-else v-model="editedStudent.year")
          option(v-for="year in years" :key="year" :value="year") {{ capitalizeFirst(year) }}

    div
      span.cardSubTitle Major:
      span.cardText
        template(v-if="!isEditing") {{ selectedStudent?.major }}
        select(v-else v-model="editedStudent.major")
          option(v-for="major in majors" :key="major" :value="major") {{ major }}

    .flex-grow.flex.justify-end.items-end
      ClickableButton(v-if="!isEditing" title="Edit Project" type="success" @click="handleEdit")
      ClickableButton(v-if="isEditing" title="Save Project" type="success" @click="handleSave")

</template>

<script lang="ts" setup>
//import { PrismaClient } from "@prisma/client" //added
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { XCircleIcon } from '@heroicons/vue/24/solid';
import { isEqual } from 'lodash';
import type { Student, Year } from '@prisma/client';
import { useHead } from '@vueuse/head';

useHead({ title: 'Students' });

const students = ref<Student[]>([]);
const studentCount = ref(0);
const studentsWithFullName = computed(() => (
  students.value.map((student) => {
    return {
      ...student,
      fullName: student.lastName + ', ' + student.firstName
    }
  })
))

onMounted(async () => { //adds dummy data, students.value is what holds frontend table data
  students.value = await $fetch<Student[]>("api/students"); //loads in random starting data
  studentCount.value = students.value.length; 
});

const handleParsed = (parsed: any) => { //when it reaches here it's already parsed through FileUploadButtonVue. 
  //Dummy data already generates stuff as separate fields (first name and last name separately) whereas we have to parse them
    const formattedStudents = parsed.map((stu : any) =>{
    const[lastName, firstName] = stu.name.split(', ');
    return{  //maybe put in FileUploadButton instead, what stu returns for EACH element of students (what it does to each student)
      netID : stu.id,
      firstName : firstName,
      lastName: lastName,
      email: null,
      github: null,
      discord: null,
      major: stu.major,
      year: stu.seniority,
      class: stu.class,
     // enrollment: null, // not sure what enrollment is
      status: null
    }
  });
  students.value = formattedStudents;
  studentCount.value = students.value.length; 
  console.log(students.value); 
  console.log('Table updated! :)');
//database comes later, send it locally to tables to populate the website
};

const selectedStudent = ref<Student | null>(null);
const editedStudent = ref<Student | null>(null);
const isEditing = ref(false);

const filters = ref({
  fullName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  netID: { value: null, matchMode: FilterMatchMode.CONTAINS },
  major: { value: [], matchMode: FilterMatchMode.IN },
  year: { value: [], matchMode: FilterMatchMode.IN },
  status: { value: [], matchMode: FilterMatchMode.IN },
});

const capitalizeFirst = (s: string | undefined | null) => {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

const formatYearsFilter = (years: Year[] | undefined) => {
  if (!years || years.length === 0) return 'Any';
  if (years.length !== 1) return `${years.length} items selected`
  return capitalizeFirst(years[0]);
}

const statuses = ref(['ACTIVE', 'INACTIVE']);
const majors = ref(['CS', 'SE', 'EE', 'ME', 'BME', 'DS', 'CE', 'Systems', 'Other']);
const years = ref(['FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR']);

const selectStudent = (student: Student) => {
  selectedStudent.value = student;
}

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
      body: {
        ...editedStudent.value,
        fullName: undefined
      }
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
.editBox {
  @apply text-teal rounded-md bg-beige p-1
}
/* TODO: move this styling to primevue's tokens in nuxt.config.ts */
select {
  @apply bg-beige text-teal rounded-md p-1
}

/* Make DataTable wrapper scrollable horizontally */
:deep(.p-datatable-wrapper) { 
  overflow-x: auto !important; 
}

/* Set minimum width for DataTable on larger screens */
@media (min-width: 768px) {
  :deep(.p-datatable-scrollable .p-datatable-table) { 
    min-width: 50rem !important; 
  }
}

@media (max-width: 767px) {
  :deep(.p-datatable-scrollable .p-datatable-table) { 
    min-width: 20rem !important; 
  }
}

/* Allow text wrapping in table cells */
:deep(.p-datatable td) {
  white-space: normal;
  word-break: break-word;
}

/* colors for pills! */
.pill.bg-green { background: #77cf77 !important; color: #ffffff !important; }
.pill.bg-red { background: #eb6464 !important; color: #ffffff !important; }
</style>