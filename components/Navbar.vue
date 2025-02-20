<template lang="pug">
  .sticky.top-0.p-4.z-10.flex.justify-between.items-center.bg-teal
    .flex
      img.h-20.w-64(
        alt="EPICS Logo" 
        src="/logo1.png" 
      )
      img.h-20.w-64(
        alt="Team Formation Logo" 
        src="/team-formation-text.png" 
      )
    .flex.text-xl.gap-x-6
      NuxtLink(to="/projects") Projects
      NuxtLink(to="/students") Students
      NuxtLink(to="/generate-teams") Generate Teams
      NuxtLink(to="/demographics") Demographics
      NuxtLink(to="/past-projects") Past Projects
      
    .centered-row.gap-4.ml-auto.mr-10
      NuxtLink(to="https://discord.gg/UyPg3ykKq3")
        img.size-8(
          alt="Discord Logo"
          src="/discord.svg"
        )
      NuxtLink(to="https://github.com/UTDallasEPICS/Teambuilder")
        img.size-8(
          alt="GitHub Logo"
          src="/github-mark.png"
        ) 
</template>