<template lang="pug">
  .fixed.top-0.left-0.h-full.w-64.p-4.flex.flex-col.items-start(class="hidden xl:flex" style="background:var(--color-nav-bg); color:var(--color-nav-text)")
    img.h-20(alt="EPICS Logo" src="/logo1.png")
    img.h-20.mt-2(alt="Team Formation Logo" src="/team-formation-text.png")
    .mt-6.flex.flex-col.text-xl.gap-y-4
      NuxtLink(to="/projects") Projects
      NuxtLink(to="/partners") Partners
      NuxtLink(to="/students") Students
      NuxtLink(to="/generate-teams") Generate Teams
      NuxtLink(to="/teams") Teams
      NuxtLink(to="/demographics") Demographics
      NuxtLink(to="/SCIPE") S.C.I.P.E. Bot
    .mt-auto.flex.flex-col.gap-y-4
      //- Logged-in user email
      .flex.items-center.gap-2.text-xs.text-gray-500(v-if="userEmail")
        svg.h-4.w-4.shrink-0(fill="none" stroke="currentColor" viewBox="0 0 24 24")
          path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196M15 11a3 3 0 11-6 0 3 3 0 016 0z")
        span.truncate {{ userEmail }}
      //- Logout button
      button.flex.items-center.gap-2.text-sm.font-medium.text-gray-500.transition-colors(class="hover:text-red-600"
        @click="logout"
        :disabled="loggingOut"
      )
        svg.h-5.w-5(fill="none" stroke="currentColor" viewBox="0 0 24 24")
          path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1")
        span {{ loggingOut ? 'Signing out...' : 'Sign out' }}
      //- Social links
      .flex.flex-row.gap-x-4
        NuxtLink(to="https://discord.gg/UyPg3ykKq3")
          img.size-8(alt="Discord Logo" src="/discord.svg")
        NuxtLink(to="https://github.com/UTDallasEPICS/Teambuilder")
          img.size-8(alt="GitHub Logo" src="/github-mark.png")
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userEmail = ref<string | null>(null);
const loggingOut = ref(false);

onMounted(async () => {
  try {
    const data = await $fetch<{ authenticated: boolean; email: string | null }>('/api/auth/session');
    if (data.authenticated) {
      userEmail.value = data.email;
    }
  } catch {
    // silently ignore — if session check fails, just don't show the email
  }
});

const logout = async () => {
  loggingOut.value = true;
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // continue to redirect even if the server call fails
  } finally {
    loggingOut.value = false;
    router.push('/login');
  }
};
</script>

<style scoped>
</style>

