<template>
  <div class="min-h-screen p-6" style="background: var(--color-utd-orange)">
    <div class="mx-auto w-full max-w-2xl">

      <!-- Logo -->
      <div class="text-center mb-8">
        <img alt="EPICS Logo" src="/logo1.png" class="h-16 mx-auto mb-3" />
        <p class="text-white/70 text-sm">Admin Panel</p>
      </div>

      <!-- Password Gate -->
      <div v-if="!unlocked" class="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-1">Admin Access</h1>
        <p class="text-sm text-gray-500 mb-6">Enter the admin password to continue.</p>

        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              @keyup.enter="unlock"
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
            <p v-if="passwordError" class="mt-2 text-xs text-red-600 font-medium">{{ passwordError }}</p>
          </div>

          <button
            @click="unlock"
            :disabled="unlocking"
            class="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style="background: var(--color-utd-orange)"
          >
            <span v-if="unlocking" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2"></span>
            {{ unlocking ? 'Verifying...' : 'Unlock' }}
          </button>
        </div>
      </div>

      <!-- Admin Panel (shown after unlock) -->
      <div v-else class="flex flex-col gap-6">

        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-white">Approved Users</h1>
          <button
            @click="unlocked = false; password = ''"
            class="text-xs text-white/60 hover:text-white transition"
          >
            Lock & Exit
          </button>
        </div>

        <!-- Add Email -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-base font-bold text-gray-800 mb-4">Add Approved Email</h2>
          <div class="flex gap-3">
            <input
              v-model="newEmail"
              type="email"
              placeholder="netid@utdallas.edu"
              @keyup.enter="addEmail"
              class="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
            <button
              @click="addEmail"
              :disabled="addLoading"
              class="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style="background: #154734"
            >
              Add
            </button>
          </div>
          <p v-if="addError" class="mt-2 text-xs text-red-600 font-medium">{{ addError }}</p>
          <p v-if="addSuccess" class="mt-2 text-xs text-green-600 font-medium">{{ addSuccess }}</p>
        </div>

        <!-- Email List -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-bold text-gray-800">Approved Emails</h2>
            <span class="text-xs text-gray-400">{{ approvedEmails.length }} total</span>
          </div>

          <div v-if="approvedEmails.length === 0" class="text-center py-8 text-gray-400 text-sm">
            No approved emails yet.
          </div>

          <ul v-else class="flex flex-col divide-y divide-gray-100">
            <li
              v-for="entry in approvedEmails"
              :key="entry.email"
              class="flex items-center justify-between py-3"
            >
              <span class="text-sm text-gray-700">{{ entry.email }}</span>
              <button
                @click="removeEmail(entry.email)"
                class="text-xs text-red-500 hover:text-red-700 font-medium transition"
              >
                Remove
              </button>
            </li>
          </ul>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({ layout: false });

// Password gate
const password = ref('');
const passwordError = ref('');
const unlocking = ref(false);
const unlocked = ref(false);

const unlock = async () => {
  passwordError.value = '';
  if (!password.value) {
    passwordError.value = 'Please enter the admin password.';
    return;
  }
  unlocking.value = true;
  try {
    // TODO: wire up to /api/auth/admin-verify
    // const response = await $fetch('/api/auth/admin-verify', {
    //   method: 'POST',
    //   body: { password: password.value }
    // });
    await new Promise(resolve => setTimeout(resolve, 600)); // placeholder
    // Placeholder: any non-empty password works for now
    unlocked.value = true;
  } catch (err: any) {
    passwordError.value = err?.data?.message || 'Incorrect password.';
  } finally {
    unlocking.value = false;
  }
};

// Email management
const newEmail = ref('');
const addError = ref('');
const addSuccess = ref('');
const addLoading = ref(false);

// Placeholder list — will come from /api/auth/approved-emails
const approvedEmails = ref<{ email: string }[]>([
  // TODO: fetch from API on mount
]);

const addEmail = async () => {
  addError.value = '';
  addSuccess.value = '';
  if (!newEmail.value.trim()) {
    addError.value = 'Please enter an email address.';
    return;
  }
  if (!newEmail.value.includes('@')) {
    addError.value = 'Please enter a valid email address.';
    return;
  }
  if (approvedEmails.value.some(e => e.email === newEmail.value.trim())) {
    addError.value = 'That email is already on the list.';
    return;
  }
  addLoading.value = true;
  try {
    // TODO: await $fetch('/api/auth/approved-emails', { method: 'POST', body: { email: newEmail.value } });
    approvedEmails.value.push({ email: newEmail.value.trim() });
    addSuccess.value = `${newEmail.value.trim()} added successfully.`;
    newEmail.value = '';
  } catch (err: any) {
    addError.value = err?.data?.message || 'Failed to add email.';
  } finally {
    addLoading.value = false;
  }
};

const removeEmail = async (email: string) => {
  try {
    // TODO: await $fetch(`/api/auth/approved-emails/${email}`, { method: 'DELETE' });
    approvedEmails.value = approvedEmails.value.filter(e => e.email !== email);
  } catch (err: any) {
    console.error('Failed to remove email:', err);
  }
};
</script>