<template>
  <div class="min-h-screen w-full" style="background: var(--color-utd-orange)">
    <div class="min-h-screen flex flex-col items-center justify-center px-6 py-12">

      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center rounded-full bg-white/20 ring-4 ring-white/60 p-3 mb-4">
          <img alt="EPICS Logo" src="/logo1.png" class="h-28 w-28 object-contain" />
        </div>
        <h2 class="text-white/80 text-sm font-medium tracking-widest uppercase mt-2">Teambuilder</h2>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-xl text-center">
        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-3">Check your email</h1>
        <p class="text-sm text-gray-500 mb-2">
          If your email is on the approved list, a login link has been sent.
        </p>
        <p class="text-sm text-gray-500 mb-8">
          The link will expire in <span class="font-semibold text-gray-700">15 minutes</span>.
        </p>

        <p class="text-xs text-gray-400 mb-8">
          Didn't receive anything? Check your spam folder, or try again.
        </p>

        <NuxtLink
          to="/login"
          class="inline-block w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95"
          style="background: var(--color-utd-orange)"
        >
          Back to Sign In
        </NuxtLink>
      </div>

      <p class="text-center text-white/50 text-xs mt-8">
        Access is restricted to authorized UTD personnel only.
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
</script>