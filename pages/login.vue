<template>
  <div class="min-h-screen flex items-center justify-center p-6" style="background: var(--color-utd-orange)">
    <div class="w-full max-w-md">

      <!-- Logo / Branding -->
      <div class="text-center mb-8">
        <img alt="EPICS Logo" src="/logo1.png" class="h-16 mx-auto mb-3" />
        <img alt="Team Formation Logo" src="/team-formation-text.png" class="h-10 mx-auto" />
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h1 class="text-2xl font-bold text-black mb-1">Sign In</h1>
        <p class="text-sm text-black mb-6">
          Enter your university email to receive a login link.
        </p>

        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-black mb-1" for="email">
              University Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="netid@utdallas.edu"
              @keyup.enter="submit"
              class="w-full rounded-lg border border-black-300 px-4 py-2.5 text-sm text-black-800 placeholder-black-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
            <p v-if="error" class="mt-2 text-xs text-red-600 font-medium">{{ error }}</p>
          </div>

          <button
            @click="submit"
            :disabled="loading"
            class="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            style="background: var(--color-utd-orange)"
          >
            <span v-if="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2"></span>
            <span>{{ loading ? 'Sending...' : 'Send Login Link' }}</span>
          </button>
        </div>
      </div>

      <p class="text-center text-white/60 text-xs mt-6">
        Access is restricted. If you need access, contact your team administrator.
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({ layout: false });

const router = useRouter();
const email = ref('');
const loading = ref(false);
const error = ref('');

const submit = async () => {
  error.value = '';

  if (!email.value.trim()) {
    error.value = 'Please enter your email address.';
    return;
  }
  if (!email.value.includes('@')) {
    error.value = 'Please enter a valid email address.';
    return;
  }

  loading.value = true;
  try {
    // TODO: wire up to /api/auth/send-magic-link
    // const response = await $fetch('/api/auth/send-magic-link', {
    //   method: 'POST',
    //   body: { email: email.value }
    // });
    await new Promise(resolve => setTimeout(resolve, 800)); // placeholder delay
    router.push('/login/sent');
  } catch (err: any) {
    error.value = err?.data?.message || 'Something went wrong. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>