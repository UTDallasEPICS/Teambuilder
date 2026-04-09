<template lang="pug">
  .fixed.inset-0.z-40(v-if="isOpen" class="xl:hidden" @click="$emit('close')")
  aside.fixed.top-0.left-0.h-full.w-64.p-4.flex.flex-col.items-start.z-50.transition-transform.duration-200(
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    style="background:var(--color-nav-bg); color:var(--color-nav-text)"
  )
    button.self-end.mb-2.text-2xl(@click="$emit('close')" aria-label="Close sidebar") ×
    img.h-20(alt="EPICS Logo" src="/logo1.png")
    img.h-20.mt-2.self-center(alt="Team Formation Logo" src="/team-formation-text.png")
    .mt-6.flex.flex-col.text-xl.gap-y-4
      NuxtLink(to="/projects" @click="closeOnMobile" :class="{ 'router-link-active': isActive('/projects') }") Projects
      NuxtLink(to="/partners" @click="closeOnMobile" :class="{ 'router-link-active': isActive('/partners') }") Partners
      NuxtLink(to="/students" @click="closeOnMobile" :class="{ 'router-link-active': isActive('/students') }") Students
      NuxtLink(to="/generate-teams" @click="closeOnMobile" :class="{ 'router-link-active': isActive('/generate-teams') }") Generate Teams
      NuxtLink(to="/teams" @click="closeOnMobile" :class="{ 'router-link-active': isActive('/teams') }") Teams
      NuxtLink(to="/newDemographics" @click="closeOnMobile" :class="{ 'router-link-active': isActive('/newDemographics') }") Demographics
      NuxtLink(to="/SCIPE" @click="closeOnMobile" :class="{ 'router-link-active': isActive('/SCIPE') }") S.C.I.P.E. Bot
      NuxtLink(to="/github" @click="closeOnMobile" :class="{ 'router-link-active': isActive('/github') }") GitHub Bot
    .mt-auto.flex.flex-col.gap-y-4
      NuxtLink(to="https://discord.gg/UyPg3ykKq3")
        img.size-8(alt="Discord Logo" src="/discord.svg")
      NuxtLink(to="https://github.com/UTDallasEPICS/Teambuilder")
        img.size-8(alt="GitHub Logo" src="/github-mark.png")
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();

const isActive = (path: string): boolean => {
  return route.path === path;
};

const closeOnMobile = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 1280) {
    emit('close');
  }
};
</script>

<style scoped>
.router-link-active {
  font-weight: bold;
  color: #004500;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}
</style>