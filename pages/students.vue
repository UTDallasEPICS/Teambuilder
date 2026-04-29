<template lang="pug">
  .overlay(v-if="selectedStudent" @click="closeModal")
  .centered-row.shaded-card.p-5.m-10.min-h-screen
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

        template(v-if="selectedDayTab === 'WEDNESDAY'")
          FileUploadButton.control-fill(title="Upload Wednesday Students (Merge)" @dataParsed="handleParsedWednesday")
          FileUploadButton.control-fill(title="Replace Wednesday Students with CSV" @dataParsed="handleParsedReplaceWednesday")
        template(v-else-if="selectedDayTab === 'THURSDAY'")
          FileUploadButton.control-fill(title="Upload Thursday Students (Merge)" @dataParsed="handleParsedThursday")
          FileUploadButton.control-fill(title="Replace Thursday Students with CSV" @dataParsed="handleParsedReplaceThursday")
        template(v-else)
          FileUploadButton.control-fill(title="Upload Students (Merge)" @dataParsed="handleParsed")
          FileUploadButton.control-fill(title="Replace Students with CSV" @dataParsed="handleParsedReplace")
        ClickableButton.control-fill(v-if="studentsWithFullName.length > 0" title="Export Students to CSV" type="success" @click="exportStudentsToCSV")
        ClickableButton.control-fill(title="Download Template" type="success" @click="downloadTemplate")
        ClickableButton.control-fill(title="Clear Students" type="danger" @click="handleClearAll")
        HelpIcon.control-fixed(:info="helpInfo")

      .mt-4.project-title.w-full.text-center Students
      .text-2xl.mt-2 Student count ({{ activeTabLabel }}): {{ studentCount }}

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

      DataTable.beige-card.overflow-hidden.px-10.mt-5(
        :value="studentsWithFullName"
        v-model:filters="filters"
        selectionMode="single"
        v-model:selection="selectedStudent"
        dataKey="id"
        filterDisplay="row"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5,10, 20, 25]"
        class="w-full mt-2 md:mt-5"
      )
        Column(field="fullName" header="Name" :showFilterMenu="false" :sortable="true")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" :showClear="true")

        Column(field="netID" header="NetID" :showFilterMenu="false" :sortable="true")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by NetID" :showClear="true")

        Column(field="major" header="Major" :showFilterMenu="false" :sortable="true")
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="majors" placeholder="Any" :maxSelectedLabels="1")

        Column(field="year" header="Year" :showFilterMenu="false" :sortable="true")
          template(#body="{ data }") {{ capitalizeFirst(data.year) }}
          template(#filter="{ filterModel, filterCallback }")
            MultiSelect.w-full.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="years" placeholder="Any" :maxSelectedLabels="1")
              // dropdown options
              template(#option="slotProps") {{ capitalizeFirst(slotProps.option) }}
              // selected value
              template(#value="slotProps") {{ formatYearsFilter(slotProps.value) }}

        Column(field="meetingDay" header="Day" :showFilterMenu="false" :sortable="true" style="width: 10rem")
          template(#body="{ data }") {{ formatStudentDay(data.meetingDay) }}

        Column(field="status" header="Status" :showFilterMenu="false" headerClass="text-center" bodyClass="text-center" style="width: 8rem" :sortable="true")
          template(#body="{ data }") 
            .flex.justify-center
              .pill.w-20(:class="statusBgColor(data.status)") {{ data.status }}
          template(#filter="{ filterModel, filterCallback }")
            .flex.justify-center
              MultiSelect.font-normal(v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Any" :maxSelectedLabels="1")
                template(#option="slotProps")
                  .pill.w-20(:class="statusBgColor(slotProps.option)") {{ slotProps.option }}

        Column(header="Actions" :showFilterMenu="false" :sortable="false" style="width: 110px" headerStyle="white-space: nowrap; min-width: 110px;" bodyStyle="min-width: 110px;")
          template(#body="{ data }")
            .flex.justify-center
              Button.p-button-rounded.p-button-danger.p-button-sm(
                icon="pi pi-trash" 
                @click="handleDeleteStudent(data)"
                v-tooltip.top="'Delete student'"
              )

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

    div(v-if="selectedStudent?.github || isEditing")
      span.cardSubTitle GitHub:
      span.cardText
        template(v-if="!isEditing") {{ selectedStudent?.github }}
        input.editBox(v-else v-model="editedStudent.github" placeholder="GitHub username")

    div(v-if="selectedStudent?.discord || isEditing")
      span.cardSubTitle Discord:
      span.cardText
        template(v-if="!isEditing") {{ selectedStudent?.discord }}
        input.editBox(v-else v-model="editedStudent.discord" placeholder="Discord username")

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

    div
      span.cardSubTitle Day:
      span.cardText
        template(v-if="!isEditing") {{ formatStudentDay(selectedStudent?.meetingDay) }}
        select(v-else v-model="editedStudent.meetingDay")
          option(:value="null") Unassigned
          option(:value="'BOTH'") Wednesday + Thursday
          option(v-for="day in studentDays" :key="day" :value="day") {{ formatStudentDay(day) }}

    .flex-grow.flex.justify-end.items-end
      ClickableButton(v-if="!isEditing" title="Edit Student" type="success" @click="handleEdit")
      ClickableButton(v-if="isEditing" title="Save Student" type="success" @click="handleSave")

</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watchEffect } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { XCircleIcon } from '@heroicons/vue/24/solid';
import { isEqual } from 'lodash-es';
import Papa from 'papaparse';
import type { Semester, Student, Year } from '@prisma/client';
import { useHead } from '@vueuse/head';
import { usePrimeVueToast } from '~/composables/usePrimeVueToast';
import { displaySemester } from '~/server/services/semesterService';

declare const document: any;

useHead({ title: 'Students' });

const { successToast, errorToast, infoToast } = usePrimeVueToast();

type DayTab = 'ALL' | 'WEDNESDAY' | 'THURSDAY';
type MeetingDay = 'WEDNESDAY' | 'THURSDAY' | 'BOTH';
type TabMeetingDay = 'WEDNESDAY' | 'THURSDAY';
type StudentRow = Student & { meetingDay?: MeetingDay | null };

const students = ref<StudentRow[]>([]);
const semesters = ref<Semester[]>([]);
const selectedUploadSemester = ref<Semester | null>(null);
const studentCount = ref(0);
const selectedDayTab = ref<DayTab>('ALL');
const studentDays: TabMeetingDay[] = ['WEDNESDAY', 'THURSDAY'];

const getStudentMeetingDay = (student: StudentRow | null | undefined): MeetingDay | null => {
  const day = student?.meetingDay as MeetingDay | null | undefined;
  return day ?? null;
};

const visibleStudents = computed<StudentRow[]>(() => {
  if (selectedDayTab.value === 'ALL') return students.value;

  return students.value.filter((student) => {
    const day = getStudentMeetingDay(student);

    if (selectedDayTab.value === 'WEDNESDAY') {
      return day === 'WEDNESDAY' || day === 'BOTH';
    }

    return day === 'THURSDAY' || day === 'BOTH' || day == null;
  });
});

const activeTabLabel = computed(() => {
  if (selectedDayTab.value === 'WEDNESDAY') return 'Wednesday';
  if (selectedDayTab.value === 'THURSDAY') return 'Thursday';
  return 'All';
});

const studentsWithFullName = computed(() => (
  visibleStudents.value.map((student) => {
    return {
      ...student,
      fullName: student.lastName + ', ' + student.firstName
    }
  })
))

watchEffect(() => {
  studentCount.value = visibleStudents.value.length;
});

onMounted(async () => { //adds dummy data, students.value is what holds frontend table data
  const [studentsResponse, semestersResponse] = await Promise.all([
    $fetch<StudentRow[]>('api/students'),
    $fetch<Semester[]>('api/semesters'),
  ]);

  students.value = studentsResponse; //loads in random starting data
  semesters.value = semestersResponse;
  selectedUploadSemester.value = semesters.value[0] ?? null;
  studentCount.value = students.value.length; 
});

const isBidResponseRow = (row: Record<string, any>) => {
  const keys = Object.keys(row).map((key) => key.trim().toLowerCase());
  return keys.includes('sso id') || keys.includes('student email') || keys.some((key) => key.startsWith('choice '));
};

const uploadBidResponses = async (parsed: any, forcedDay?: TabMeetingDay) => {
  if (!parsed?.length) return;

  try {
    const result = await $fetch<{
      studentsImported: number;
      choicesCreated: number;
      skippedStudents: string[];
      unmatchedProjects: string[];
    }>('/api/bids', {
      method: 'POST',
      body: parsed,
      query: {
        merge: 'true',
        ...(forcedDay ? { meetingDay: forcedDay } : {}),
      },
    });

    students.value = await $fetch<StudentRow[]>('/api/students');
    studentCount.value = students.value.length;

    let msg = `Imported ${result.studentsImported} students, ${result.choicesCreated} choices.`;
    if (result.skippedStudents.length)
      msg += ` Skipped ${result.skippedStudents.length} rows (no SSO ID).`;
    if (result.unmatchedProjects.length)
      msg += ` ${result.unmatchedProjects.length} project name(s) not found in DB: ${result.unmatchedProjects.join('; ')}.`;

    result.unmatchedProjects.length ? infoToast(msg, 10000) : successToast(msg, 7000);
  } catch (e: any) {
    errorToast(e?.data?.message ?? e?.message ?? 'Failed to import bid responses.');
  }
};

const handleParsed = async (parsed: any, forcedDay?: TabMeetingDay) => {
  if (Array.isArray(parsed) && parsed.length > 0 && isBidResponseRow(parsed[0])) {
    await uploadBidResponses(parsed, forcedDay);
    return;
  }

  const formattedStudents = parsed.map((stu : any) =>{
    // Handle both CSV formats:
    // 1. New format: netID, firstName, lastName (separate fields)
    // 2. Old format: id, name (comma-separated "lastName, firstName")
    let firstName, lastName, netID;
    
    if (stu.firstName && stu.lastName) {
      // New CSV format with separate first/last names
      firstName = stu.firstName;
      lastName = stu.lastName;
      netID = stu.netID;
    } else if (stu.name) {
      // Old CSV format with combined name
      const[parsedLastName, parsedFirstName] = stu.name.split(', ');
      firstName = parsedFirstName;
      lastName = parsedLastName;
      netID = stu.id;
    }

    return{
      netID : netID,
      firstName : firstName,
      lastName: lastName,
      email: null,
      github: null,
      discord: null,
      major: stu.major,
      year: stu.year || stu.seniority, // Support both 'year' and 'seniority' fields
      class: stu.class,
      meetingDay: normalizeMeetingDay(stu.meetingDay ?? stu.day ?? stu.meeting_day, forcedDay),
      status: stu.status || null
    }
  });
  
  // Merge students (API upserts by netID)
  try {
    await $fetch('/api/students', {
      method: 'POST',
      body: {
        students: formattedStudents,
        semesterId: selectedUploadSemester.value?.id ?? null,
      }
    });
    
    // Refresh from database to get the saved data
    students.value = await $fetch<StudentRow[]>('/api/students');
    studentCount.value = students.value.length; 
    console.log('Students saved to database successfully!');
    console.log(students.value); 
  } catch (error) {
    console.error('Error saving students to database:', error);
  }
//database comes later, send it locally to tables to populate the website
};

const handleParsedReplace = async (parsed: any, forcedDay?: TabMeetingDay) => {
  const formattedStudents = parsed.map((stu : any) => {
    let firstName, lastName, netID;

    if (stu.firstName && stu.lastName) {
      firstName = stu.firstName;
      lastName = stu.lastName;
      netID = stu.netID;
    } else if (stu.name) {
      const [parsedLastName, parsedFirstName] = stu.name.split(', ');
      firstName = parsedFirstName;
      lastName = parsedLastName;
      netID = stu.id;
    }

    return {
      netID : netID,
      firstName : firstName,
      lastName: lastName,
      email: null,
      github: null,
      discord: null,
      major: stu.major,
      year: stu.year || stu.seniority,
      class: stu.class,
      meetingDay: normalizeMeetingDay(stu.meetingDay ?? stu.day ?? stu.meeting_day, forcedDay),
      status: stu.status || null
    }
  });

  try {
    await $fetch('/api/students', {
      method: 'DELETE',
      query: forcedDay ? { meetingDay: forcedDay } : undefined
    });

    await $fetch('/api/students', {
      method: 'POST',
      body: {
        students: formattedStudents,
        semesterId: selectedUploadSemester.value?.id ?? null,
      }
    });

    students.value = await $fetch<StudentRow[]>('/api/students');
    studentCount.value = students.value.length;
    console.log('Students replaced from CSV successfully!');
  } catch (error) {
    console.error('Error replacing students from CSV:', error);
  }
};

const handleParsedWednesday = async (parsed: any) => handleParsed(parsed, 'WEDNESDAY');
const handleParsedThursday = async (parsed: any) => handleParsed(parsed, 'THURSDAY');
const handleParsedReplaceWednesday = async (parsed: any) => handleParsedReplace(parsed, 'WEDNESDAY');
const handleParsedReplaceThursday = async (parsed: any) => handleParsedReplace(parsed, 'THURSDAY');

const normalizeMeetingDay = (rawValue: unknown, forcedDay?: TabMeetingDay): MeetingDay | null => {
  if (forcedDay) return forcedDay;
  if (rawValue == null) return null;

  const value = String(rawValue).trim().toUpperCase();

  if (value === 'BOTH' || value === 'WEDNESDAY/THURSDAY' || value === 'THURSDAY/WEDNESDAY' || value === 'WEDNESDAY,THURSDAY' || value === 'THURSDAY,WEDNESDAY') return 'BOTH';
  if (value === 'WEDNESDAY' || value === 'WED') return 'WEDNESDAY';
  if (value === 'THURSDAY' || value === 'THU' || value === 'THURS') return 'THURSDAY';

  return null;
};

const formatStudentDay = (day: MeetingDay | null | undefined) => {
  if (day === 'WEDNESDAY') return 'Wednesday';
  if (day === 'THURSDAY') return 'Thursday';
  if (day === 'BOTH') return 'Wednesday + Thursday';
  return 'Unassigned';
};

const loadStudents = async () => {
  students.value = await $fetch<StudentRow[]>('/api/students');
  studentCount.value = students.value.length;
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
    
    // Refresh students from database
    students.value = await $fetch<StudentRow[]>('/api/students');
    studentCount.value = students.value.length;
    console.log('Database cleared successfully!');
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).alert === 'function') {
      (globalThis as any).alert('Database has been cleared.');
    } else {
      console.log('Database has been cleared.');
    }
  } catch (error) {
    console.error('Error resetting database:', error);
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).alert === 'function') {
      (globalThis as any).alert('Failed to reset database. Please check the console for details.');
    } else {
      console.log('Failed to reset database. Please check the console for details.');
    }
  }
};

const handleClearAll = async () => {
  const confirmAvailable = typeof globalThis !== 'undefined' && typeof (globalThis as any).confirm === 'function';
  if (confirmAvailable) {
    if (!(globalThis as any).confirm('Are you sure you want to delete all students? This cannot be undone.')) {
      return;
    }
  }
  
  try {
    await $fetch('/api/students', {
      method: 'DELETE'
    });
    
    students.value = [];
    studentCount.value = 0;
    console.log('All students deleted successfully!');
  } catch (error) {
    console.error('Error deleting students:', error);
  }
};

const handleDeleteStudent = async (student: StudentRow) => {
  const confirmAvailable = typeof globalThis !== 'undefined' && typeof (globalThis as any).confirm === 'function';
  if (confirmAvailable) {
    if (!(globalThis as any).confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}? This cannot be undone.`)) {
      return;
    }
  }

  try {
    await $fetch(`/api/students/${student.id}`, {
      method: 'DELETE'
    });

    students.value = students.value.filter(s => s.id !== student.id);
    studentCount.value = students.value.length;
    selectedStudent.value = null;
    successToast(`Deleted ${student.firstName} ${student.lastName}`, 3000);
  } catch (error: any) {
    errorToast(error?.data?.message || 'Failed to delete student');
    console.error('Error deleting student:', error);
  }
};

const selectedStudent = ref<StudentRow | null>(null);
const editedStudent = ref<StudentRow | null>(null);
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

const selectStudent = (student: StudentRow) => {
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

const exportStudentsToCSV = () => {
  try {
    if (!studentsWithFullName.value.length) {
      errorToast('No students to export.');
      return;
    }

    const csvRows = studentsWithFullName.value.map(student => ({
      Name: student.fullName,
      NetID: student.netID,
      Major: student.major,
      Year: capitalizeFirst(student.year),
      Day: formatStudentDay(student.meetingDay),
      Status: capitalizeFirst(student.status),
      Class: student.class,
      Email: student.email ?? '',
      GitHub: student.github ?? '',
      Discord: student.discord ?? ''
    }));

    const csv = Papa.unparse(csvRows);

    if (process.client) {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `students-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      successToast('Students exported to CSV successfully!', 5000);
    }
  } catch (error: any) {
    errorToast(error?.message || 'Failed to export students.');
  }
}

const downloadTemplate = () => {
  const csv = 'netID,firstName,lastName,email,major,year,class,meetingDay,status,github,discord\n';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'students_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const helpInfo = `Use the Wednesday and Thursday tabs to upload or replace day-specific student CSVs.`
</script>

<style scoped>
.cardRows {
  @apply flex flex-col gap-5
}
.day-tabs {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 0.65rem;
  padding: 0.25rem;
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

/* Allow text wrapping in table cells */
:deep(.p-datatable td) {
  white-space: normal;
  word-break: break-word;
}

/* colors for pills! */
.pill.bg-green { background: #77cf77 !important; color: #ffffff !important; }
.pill.bg-red { background: #eb6464 !important; color: #ffffff !important; }
</style>