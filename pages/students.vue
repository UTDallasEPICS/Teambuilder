<template lang="pug">
  .centered-row
    .centered-col.shaded-card.m-10.relative(class="max-w-[1200px]")
      .text-7xl.drop-shadow-md Students

      .text-2xl.drop-shadow-md.mt-2 Student Count: {{ studentCount }}

      .flex.absolute.top-5.right-5.gap-2
        HelpIcon

        // Used to be: FileUploadButton(title="Upload Students" @fileSelected="handleParsed")
        // Changed it to match @dataParsed, so it matches what the component emits: 'dataParsed'
        FileUploadButton(title="Upload Students" @dataParsed="handleParsed")

      .grid.grid-cols-4.teal-card.mt-10.gap-3
        StudentCardDisplay(
          v-for="student in students"
          :key="student.id"
          v-bind="student"
        )
</template>

<script lang="ts" setup>
import { useHead } from '@unhead/vue'
import { useStudentStore } from '../stores/studentStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useStudentFilters } from '../composables/student/useStudentFilters';
import type { Student } from '../types';

useHead({ title: 'Students' });

const studentStore = useStudentStore();
const { getAllStudents: students } = storeToRefs(studentStore);
const selectedStudent = ref<Student | null>(null);

const {
    searchQuery,
    filterByNew,
    filterByReturning,
    filteredStudents,
    filteredStudentCount,
    toggleFilterByNew,
    toggleFilterByReturning,
  } = useStudentFilters(students);

const handleParsed = (parsed: any) => {
  console.log('Recieved parsed data', parsed);
  // added message above for clarity
};
</script>