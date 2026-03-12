<template lang="pug">
  Toast
  .flex.flex-row.min-h-screen.w-full.items-start
    button.fixed.top-4.left-4.z-50.px-3.py-2.rounded-md(
      class="md:border md:border-gray-200"
      v-if="$route.name !== 'index'"
      @click="toggleSidebar"
      aria-label="Toggle sidebar"
      style="background: var(--color-nav-bg); color: var(--color-nav-text);"
    ) ☰
    Navbar(
      v-if="$route.name !== 'index'"
      :is-open="sidebarOpen"
      @close="closeSidebar"
    )
    .centered-row.flex-auto.content-area(:class="['ml-0 md:border-l md:border-gray-200', $route.name !== 'index' && sidebarOpen ? 'xl:ml-64' : 'xl:ml-0']")
      NuxtPage
</template>

<script setup lang="ts">
import { ref } from 'vue';

const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};
</script>

<style>
@media (max-width: 767px) {
  .flex-row {
    flex-direction: column;
  }
}
</style>