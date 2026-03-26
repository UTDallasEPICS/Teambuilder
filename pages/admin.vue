<template>
  <div class="min-h-screen w-full" style="background: var(--color-utd-orange)">
    <div class="min-h-screen flex flex-col items-center justify-center px-6 py-12">

      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center rounded-full bg-white/20 ring-4 ring-white/60 p-3 mb-4">
          <img alt="EPICS Logo" src="/logo1.png" class="h-28 w-28 object-contain" />
        </div>
        <h2 class="text-white/80 text-sm font-medium tracking-widest uppercase mt-2">Admin Panel</h2>
      </div>

      <!-- Password Gate -->
      <div v-if="!unlocked" class="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-xl">
        <h1 class="text-3xl font-bold text-black mb-2">Admin Access</h1>
        <p class="text-sm text-gray-500 mb-8">Enter the admin password to manage approved users.</p>

        <div class="flex flex-col gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
              Admin Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              @keyup.enter="unlock"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
            <p v-if="passwordError" class="mt-2 text-xs text-red-600 font-medium">{{ passwordError }}</p>
          </div>

          <button
            @click="unlock"
            :disabled="unlocking"
            class="w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style="background: var(--color-utd-orange)"
          >
            <span v-if="unlocking" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            {{ unlocking ? 'Verifying...' : 'Unlock' }}
          </button>
        </div>
      </div>

      <!-- Admin Panel -->
      <div v-else class="flex flex-col gap-6 w-full max-w-2xl">

        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-white">Approved Users</h1>
          <button
            @click="unlocked = false; password = ''"
            class="text-xs text-white/60 hover:text-white transition font-medium"
          >
            Lock &amp; Exit
          </button>
        </div>

        <!-- Add Email -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-lg font-bold text-black mb-1">Add Approved Email</h2>
          <p class="text-xs text-gray-400 mb-4">Only @utdallas.edu addresses are accepted.</p>
          <div class="flex gap-3">
            <input
              v-model="newEmail"
              type="email"
              placeholder="netid@utdallas.edu"
              @keyup.enter="addEmail"
              class="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
            <button
              @click="addEmail"
              :disabled="addLoading"
              class="rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style="background: #154734"
            >
              <span v-if="addLoading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              <span v-else>Add</span>
            </button>
          </div>
          <p v-if="addError" class="mt-2 text-xs text-red-600 font-medium">{{ addError }}</p>
          <p v-if="addSuccess" class="mt-2 text-xs text-green-600 font-medium">{{ addSuccess }}</p>
        </div>

        <!-- Email List -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-black">Approved Emails</h2>
            <span class="text-xs text-gray-400 font-medium">{{ approvedEmails.length }} total</span>
          </div>

          <div v-if="listLoading" class="text-center py-8 text-gray-400 text-sm">
            Loading...
          </div>
          <div v-else-if="approvedEmails.length === 0" class="text-center py-8 text-gray-400 text-sm">
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

      <p class="text-center text-white/50 text-xs mt-8">
        Access is restricted to authorized UTD personnel only.
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({ layout: false });

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
    await $fetch('/api/auth/admin-verify', {
      method: 'POST',
      body: { password: password.value }
    });
    unlocked.value = true;
    await fetchEmails();
  } catch (err: any) {
    passwordError.value = err?.data?.message || 'Incorrect password.';
  } finally {
    unlocking.value = false;
  }
};

const newEmail = ref('');
const addError = ref('');
const addSuccess = ref('');
const addLoading = ref(false);
const listLoading = ref(false);
const approvedEmails = ref<{ email: string }[]>([]);

const fetchEmails = async () => {
  listLoading.value = true;
  try {
    const response = await $fetch('/api/auth/approved-emails') as any;
    approvedEmails.value = response.emails || [];
  } catch (err) {
    console.error('Failed to fetch emails:', err);
  } finally {
    listLoading.value = false;
  }
};

const addEmail = async () => {
  addError.value = '';
  addSuccess.value = '';

  if (!newEmail.value.trim()) {
    addError.value = 'Please enter an email address.';
    return;
  }
  if (!newEmail.value.endsWith('@utdallas.edu')) {
    addError.value = 'Only @utdallas.edu email addresses are allowed.';
    return;
  }
  if (approvedEmails.value.some(e => e.email === newEmail.value.trim().toLowerCase())) {
    addError.value = 'That email is already on the list.';
    return;
  }

  addLoading.value = true;
  try {
    await $fetch('/api/auth/approved-emails', {
      method: 'POST',
      body: { email: newEmail.value.trim().toLowerCase() }
    });
    addSuccess.value = `${newEmail.value.trim()} added successfully.`;
    newEmail.value = '';
    await fetchEmails();
  } catch (err: any) {
    addError.value = err?.data?.message || 'Failed to add email.';
  } finally {
    addLoading.value = false;
  }
};

const removeEmail = async (email: string) => {
  try {
    await $fetch('/api/auth/approved-emails', {
      method: 'DELETE',
      body: { email }
    });
    approvedEmails.value = approvedEmails.value.filter(e => e.email !== email);
  } catch (err: any) {
    console.error('Failed to remove email:', err);
  }
};
</script>