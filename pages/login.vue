<template>
  <section class="max-w-3xl mx-auto px-6 py-12 text-black-600">
    <h1 class="text-2xl font-bold mb-4">Welcome to EPICS Teambuilder</h1>

    <!-- section links mirror the top-bar dropdown, per the wireframe -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      <NuxtLink
        v-for="loc in locations"
        :key="loc.path"
        :to="loc.path"
        class="block rounded border p-4 hover:shadow"
      >
        <span class="font-medium">{{ loc.label }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocations } from '~/composables/useLocations'
const { locations } = useLocations()
</script>