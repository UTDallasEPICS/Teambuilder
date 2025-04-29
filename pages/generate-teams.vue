<template lang="pug">
  .centered-col.shaded-card.mt-10.p-10.gap-10
    .stepCard.gap-5
      NewSemesterCard
    .stepCard.gap-5
      ActivateProjectsCard
    .stepCard.gap-5
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