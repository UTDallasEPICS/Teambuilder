<template>
  <section class="max-w-3xl mx-auto px-6 py-12 text-slate-900">

    <!-- section links mirror the top-bar dropdown, per the wireframe -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 text-2xl font-bold">
        EPICS Home Page
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
const { locations } = useLocations()
</script>