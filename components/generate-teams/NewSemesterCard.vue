<!-- TODO: add ways to delete semesters? -->

<template lang="pug">
  .text-3xl.embossed Step 1: Start New Semester
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
  ClickableButton.mt-3(title="Create Semester" @click="handleCreateSemester")
</template>

<script setup lang="ts">
import type { Season, Semester } from '@prisma/client';

const { successToast, errorToast, infoToast } = usePrimeVueToast();
const { semesters } = useProjectsAndSemesters();

const seasons = ref([
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
    semesters.value = await $fetch<Semester[]>('/api/semesters');
  } else {
    errorToast('Error creating new semester.  Please try again.');
  }
}
</script>