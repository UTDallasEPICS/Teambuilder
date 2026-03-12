<template lang="pug">
  .fixed.inset-0.z-40(v-if="isOpen" class="xl:hidden" @click="$emit('close')")
  aside.fixed.top-0.left-0.h-full.w-64.p-4.flex.flex-col.items-start.z-50.transition-transform.duration-200(
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    style="background:var(--color-nav-bg); color:var(--color-nav-text)"
  )
    button.self-end.mb-2.text-2xl(@click="$emit('close')" aria-label="Close sidebar") ×
    img.h-20(alt="EPICS Logo" src="/logo1.png")
    img.h-20.mt-2(alt="Team Formation Logo" src="/team-formation-text.png")
    .mt-6.flex.flex-col.text-xl.gap-y-4
      NuxtLink(to="/projects" @click="closeOnMobile") Projects
      NuxtLink(to="/partners" @click="closeOnMobile") Partners
      NuxtLink(to="/students" @click="closeOnMobile") Students
      NuxtLink(to="/generate-teams" @click="closeOnMobile") Generate Teams
      NuxtLink(to="/teams" @click="closeOnMobile") Teams
      NuxtLink(to="/demographics" @click="closeOnMobile") Demographics
      NuxtLink(to="/SCIPE" @click="closeOnMobile") S.C.I.P.E. Bot
    .mt-auto.flex.flex-col.gap-y-4
      NuxtLink(to="https://discord.gg/UyPg3ykKq3")
        img.size-8(alt="Discord Logo" src="/discord.svg")
      NuxtLink(to="https://github.com/UTDallasEPICS/Teambuilder")
        img.size-8(alt="GitHub Logo" src="/github-mark.png")
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const closeOnMobile = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 1280) {
    emit('close');
  }
};
</script>

<style scoped>
</style>