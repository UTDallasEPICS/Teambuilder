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
      <div class="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-xl">
        <h1 class="text-3xl font-bold text-black mb-2">Sign In</h1>
        <p class="text-sm text-black mb-8">
          Enter your UTD email address to receive a one-time login link.
        </p>

        <!-- Token error banner -->
        <div v-if="tokenError" class="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <svg class="h-5 w-5 shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-red-700 font-medium">{{ tokenError }}</p>
        </div>

        <div class="flex flex-col gap-5">
          <div>
            <label class="block text-sm font-medium text-black mb-1" for="email">
              UTD Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="netid@utdallas.edu"
              @keyup.enter="submit"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
            <p v-if="error" class="mt-2 text-xs text-red-600 font-medium">{{ error }}</p>
          </div>

          <button
            @click="submit"
            :disabled="loading"
            class="w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            style="background: var(--color-utd-orange)"
          >
            <span v-if="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            <span>{{ loading ? 'Sending...' : 'Send Login Link' }}</span>
          </button>
        </div>
      </div>

      <p class="text-center text-white/50 text-xs mt-8">
        Access is restricted to authorized UTD personnel only.
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

definePageMeta({ layout: false });

const router = useRouter();
const route = useRoute();
const email = ref('');
const loading = ref(false);
const error = ref('');

// Map URL error params to friendly messages
const tokenErrorMessages: Record<string, string> = {
  'missing-token':  'The login link is invalid. Please request a new one.',
  'invalid-token':  'That login link was not recognised. Please request a new one.',
  'token-used':     'That login link has already been used. Please request a new one.',
  'token-expired':  'That login link has expired (links are valid for 15 minutes). Please request a new one.',
};

const tokenError = computed(() => {
  const err = route.query.error as string | undefined;
  return err ? (tokenErrorMessages[err] ?? 'Something went wrong with your login link. Please try again.') : null;
});

const submit = async () => {
  error.value = '';

  if (!email.value.trim()) {
    error.value = 'Please enter your email address.';
    return;
  }
  if (!email.value.endsWith('@utdallas.edu')) {
    error.value = 'Only @utdallas.edu email addresses are allowed.';
    return;
  }

  loading.value = true;
  try {
    await $fetch('/api/auth/send-magic-link', {
      method: 'POST',
      body: { email: email.value.trim().toLowerCase() }
    });
    router.push('/login/sent');
  } catch (err: any) {
    error.value = err?.data?.message || 'Something went wrong. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
