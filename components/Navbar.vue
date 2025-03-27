<template lang="pug">
  .flex
    // Sidebar Navigation : (used to be horizontal navbar on top)
    // Below used to be: .sticky.top-0.p-4.z-10.flex.justify-between.items-center.bg-teal
    //.flex
    // Now: wrapped navigation in .sidebar div. flex-col stacks items vertically. fixed on left side. Spacing adjusted.
    // h-full makes it full height. 
    .sidebar.fixed.top-0.left-0.h-full.w-64.bg-teal.p-4.flex.flex-col.items-start  
      img.h-20.w-64(
        alt="EPICS Logo" 
        src="/logo1.png" 
      )
      img.h-20.w-64(
        alt="Team Formation Logo" 
        src="/team-formation-text.png" 
      )
      
      // Used to be: .flex.text-xl.gap-x-6
      // Now: .flex.flex-col.text-xl.gap-y-4 -> now alligned vertically 
      .mt-6.flex.flex-col.text-xl.gap-y-4
        NuxtLink(to="/projects") Projects
        NuxtLink(to="/students") Students
        NuxtLink(to="/generate-teams") Generate Teams
        NuxtLink(to="/demographics") Demographics
        NuxtLink(to="/past-projects") Past Projects

      // Social Media Links
      // Used to be: .centered-row.gap-4.ml-auto.mr-10
      // Now: .mt-auto -> Pushes icons to the bottom of the sidebar
      // .flex.flex-col.gap-y-4 -> Stacks them vertically with spacing 
      .mt-auto.flex.flex-col.gap-y-4
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
    // Main Content Area
    // Wrapped the rest of the page in .content.flex-1.p-4 to prevent overlap:
    .content.flex-1.p-4
      slot 
</template>
