<template lang="pug">
  Toast
  .flex.flex-row.min-h-screen.w-full.items-start
    Navbar(v-if="$route.name !== 'index'")
    .centered-row.flex-auto.content-area(class="ml-0 xl:ml-64 md:border-l md:border-gray-200")
      NuxtPage
</template>

<script setup lang="ts">
</script>

<style>
@media (max-width: 767px) {
  .flex-row {
    flex-direction: column;
  }
}
</style>