<template lang="pug">
  div(class="w-full sticky top-0 mx-auto p-4 h-full flex justify-between items-center bg-[#629e91]")
    div(class="flex")
      img(
        width="100" 
        alt="EPICS Logo" 
        src="/logo1.png" 
        class="h-20 w-64"
      )
      img(
        width="150" 
        alt="Team Formation Logo" 
        src="/team-formation-text.png" 
        class="h-20 w-64"
      )
    ul(class="hidden md:flex gap-x-6 text-white backgroundFont")
      li
        NuxtLink(to="/project") Project
      li
        NuxtLink(to="/Upload") Student Upload
      li
        NuxtLink(to="/generate") Generate
      li
        NuxtLink(to="visual") Visualizer
      li
        NuxtLink(to="/PastProject") Past Project View
      
    div(class="flex items-center gap-x-4 ml-[auto] mr-10")
      NuxtLink(to="https://discord.gg/UyPg3ykKq3")
        img(
          width="100"
          alt="Discord Logo"
          src="/discord.svg"
          class="h-6 w-6"
        )
      NuxtLink(to="https://github.com/UTDallasEPICS/Teambuilder")
        img(
          width="100"
          alt="GitHub Logo"
          src="/github-mark.png"
          class="h-6 w-6"
        ) 
</template>

<script setup lang="ts">
</script>

<style scoped>
/* background and font - reuseable for all pages*/
.backgroundFont {

  font-family: 'Jura', Arial, sans-serif;
  /* Ensure all text uses Jura */
}

.container {
  max-width: 100%;
  /* Adjust according to your layout */
  padding-left: 0;
  /* Remove padding on the left */
}

.flex {
  justify-content: flex-start;
  /* Aligns children (logos) to the start (left) */
}

/* Ensure no left padding or margin that can push content away from the edge */
.pb-5,
.pt-4 {
  padding-bottom: 0;
  padding-top: 0;
}
</style>