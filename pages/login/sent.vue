<template>
  <div class="min-h-screen flex items-center justify-center p-6" style="background: var(--color-utd-orange)">
    <div class="w-full max-w-md">

      <!-- Logo / Branding -->
      <div class="text-center mb-8">
        <img alt="EPICS Logo" src="/logo1.png" class="h-16 mx-auto mb-3" />
        <img alt="Team Formation Logo" src="/team-formation-text.png" class="h-10 mx-auto" />
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center">

        <!-- Checkmark icon -->
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg class="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-2">Check your email</h1>
        <p class="text-sm text-gray-500 mb-6">
          If your email is on the approved list, a login link has been sent. 
          It will expire in <span class="font-medium text-gray-700">15 minutes</span>.
        </p>

        <p class="text-xs text-gray-400 mb-6">
          Didn't receive anything? Check your spam folder, or try again.
        </p>

        <NuxtLink
          to="/login"
          class="inline-block w-full rounded-lg py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95"
          style="background: var(--color-utd-orange)"
        >
          Back to Sign In
        </NuxtLink>
      </div>

      <p class="text-center text-white/60 text-xs mt-6">
        Access is restricted. If you need access, contact your team administrator.
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
</script>