<!-- TODO: add ways to delete semesters? -->

<template lang="pug">
  .text-3xl.font-semibold.mb-4 Step 1: Start New Semester
  .centered-row.gap-5
    Dropdown(
      v-model="selectedSeason"
      :options="seasons"
      placeholder="Select Season"
    )
      template(#option="slotProps") {{ capitalizeFirst(slotProps.option) }}
      template(#value="slotProps")
        div(v-if="slotProps.value") {{ capitalizeFirst(slotProps.value) }}
        span(v-else) {{ slotProps.placeholder }}
    InputText.w-36(
      type="text"
      v-model="selectedYear"
      placeholder="Enter Year"
    )
  ClickableButton.mt-3(title="Create Semester" type="success" @click="handleCreateSemester")
</template>

<script setup lang="ts">
import type { Season, Semester } from '@prisma/client';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const emit = defineEmits<{
  (e: 'fetchSemesters'): void
}>()
const toast = useToast();

const successToast = (summary: string, detail = '') => {
  toast.add({ severity: 'success', summary, detail, life: 3000 });
};

const errorToast = (summary: string, detail = '') => {
  toast.add({ severity: 'error', summary, detail, life: 5000 });
};

const seasons = ref<Season[]>([
  'SPRING',
  'SUMMER',
  'FALL'
]);

const selectedSeason = ref<Season | null>(null);
const selectedYear = ref<string | null>(null)

const handleCreateSemester = async () => {
  const response = await $fetch("/api/semesters", {
    method: "POST",
    body: {
      season: selectedSeason.value,
      year: Number(selectedYear.value)
    }
  })

  if (response.status === 201) {
    successToast('New semester created!');
    emit('fetchSemesters');
  } else {
    errorToast('Error creating new semester.  Please try again.');
  }
}
</script>