<template lang="pug">
  .fixed.top-0.left-0.h-full.w-64.bg-teal.p-4.flex.flex-col.items-start(class="hidden xl:flex")
    img.h-20(alt="EPICS Logo" src="/logo1.png")
    img.h-20.mt-2(alt="Team Formation Logo" src="/team-formation-text.png")
    .mt-6.flex.flex-col.text-xl.gap-y-4
      NuxtLink(to="/projects") Projects
      NuxtLink(to="/partners") Partners
      NuxtLink(to="/students") Students
      NuxtLink(to="/generate-teams") Generate Teams
      NuxtLink(to="/demographics") Demographics
      NuxtLink(to="/login") Login
    .mt-auto.flex.flex-col.gap-y-4
      NuxtLink(to="https://discord.gg/UyPg3ykKq3")
        img.size-8(alt="Discord Logo" src="/discord.svg")
      NuxtLink(to="https://github.com/UTDallasEPICS/Teambuilder")
        img.size-8(alt="GitHub Logo" src="/github-mark.png")
</template>

<style scoped>
</style>