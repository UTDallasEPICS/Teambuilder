<template lang="pug">
  div
    Navbar(v-if="$route.name !== 'index'")
    NuxtPage
</template>

<script setup lang="ts">
// TODO: check login status, do other top level things
// TODO: if not logged in, navigate to /login - need a route guard+

// TODO: nav should be: projects, students, partners, generate, github, discord
// projects and students need buttons for importing from CSV
// CSV imports should be their own page, and should display what was imported for editing BEFORE saving to DB
// then navigate back to their main pages
// CSV imports should detect and ignore duplicates
// also need partner and teams UI - dont need CSV import
// students need github/discord usernames
import { useProjectStore } from './stores/projectStore';
import { useStudentStore } from './stores/studentStore';

// Seed frontend state
const projectStore = useProjectStore();
const studentStore = useStudentStore();

projectStore.createDummyData();
studentStore.createDummyData();
</script>
<style></style>