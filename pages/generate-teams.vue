<template lang="pug">
  .centered-col.shaded-card.mt-10.p-10.gap-10
    .stepCard
      .cardTitle Step 1: Start New Semester
      //- .centered-row
      //-   Dropdown(
      //-     v-model=""
      //-   )
    .stepCard.gap-5
      ActivateProjectsCard
    .stepCard
      .cardTitle Step 3: Generate Teams
</template>

<script setup lang="ts">
useHead({ title: 'Generate Teams' });
</script>

<style scoped>
.stepCard {
  /* centered-col teal-card p-10 w-full */
  @apply flex flex-col justify-center items-center bg-teal rounded-3xl p-10 w-full
}
</style>