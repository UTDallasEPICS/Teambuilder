<template lang="pug">
  Toast
  .flex.flex-row.min-h-screen.w-full.items-start
    Navbar(v-if="showNavbar")
    .centered-row.flex-auto.content-area(:class="showNavbar ? 'xl:ml-64 md:border-l md:border-gray-200' : ''")
      NuxtPage
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const noNavRoutes = ['login', 'login-sent', 'admin'];
const showNavbar = computed(() => !noNavRoutes.includes(route.name as string));
</script>

<style>
@media (max-width: 767px) {
  .flex-row {
    flex-direction: column;
  }
}
</style>