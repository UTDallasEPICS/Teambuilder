<template lang="pug">
div
    Navbar(v-if="!isLoginPage")
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
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

// Get the current route
const route = useRoute()

// Computed property to check if the Navbar should be displayed
const shouldShowNavbar = computed(() => {
  // Show navbar only if we are NOT on the login page
  return route.path !== '/'  // Hide Navbar on login page ('/'), show it on all others
})

</script>
<style></style>