<template>
  <div class="m-10 min-h-screen rounded-lg p-10" style="background: var(--color-utd-orange)">
    <!-- Toast Notification -->
    <transition name="toast">
      <div
        v-if="globalError"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl !bg-red px-5 py-4 text-white shadow-xl"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
        </svg>
        <span class="text-sm font-semibold">{{ globalError }}</span>
        <button @click="globalError = ''" class="ml-2 text-white/70 hover:text-white transition">✕</button>
      </div>
    </transition>
    <div class="mx-auto flex max-w-4xl flex-col gap-6">

      <!-- Page Header -->
      <div class="text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
          Discord Bot Management
        </h1>
        <p class="mt-1 text-white/80">Control and monitor the S.C.I.P.E. Discord bot from here</p>
      </div>

      <!-- SCIPE Control Component -->
      <SCIPEControl />

      <!-- Channel Management -->
      <div class="flex flex-col gap-4 rounded-xl p-6 shadow-md" style="background-color: #d9d9d9">
        <div class="flex items-center gap-2">
          <span class="h-6 w-1 rounded-full bg-black/60"></span>
          <h2 class="text-lg font-bold text-black">Update Discord Channels</h2>
        </div>
        <p class="text-sm text-black/80">
          Create or delete Discord categories and channels for all projects in the database.
        </p>
        <div class="flex flex-wrap gap-3">
          <button
            @click="updateChannels"
            :disabled="loading || deleteLoading || deleteChannelsLoading"
            class="flex items-center gap-2 rounded-lg border-2 border-black/20 bg-[#154734] px-4 py-2 text-sm font-semibold text-white shadow transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            <span v-else>Create All Project Channels</span>
          </button>
          <button
            @click="deleteAllChannels"
            :disabled="loading || deleteLoading || deleteChannelsLoading"
            class="flex items-center gap-2 rounded-lg border-2 border-black/20 !bg-red px-4 py-2 text-sm font-semibold text-white shadow transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="deleteChannelsLoading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            <span v-else>Delete All Project Channels</span>
          </button>
        </div>

        <div v-if="message" class="rounded-lg p-3 text-sm font-semibold" :class="{
          'bg-emerald-100 border border-emerald-400 text-emerald-800': messageType === 'success',
          'bg-red-100 border border-red-400 text-red-800': messageType === 'error',
          'bg-blue-100 border border-blue-400 text-blue-800': messageType === 'info'
        }">
          {{ message }}
          <div v-if="errors.length" class="mt-2 font-bold">
            <div v-for="err in errors" :key="err">{{ err }}</div>
          </div>
        </div>

        <div v-if="deleteChannelsMessage" class="rounded-lg p-3 text-sm font-semibold" :class="{
          'bg-emerald-100 border border-emerald-400 text-emerald-800': deleteChannelsMessageType === 'success',
          'bg-red-100 border border-red-400 text-red-800': deleteChannelsMessageType === 'error',
          'bg-blue-100 border border-blue-400 text-blue-800': deleteChannelsMessageType === 'info'
        }">
          {{ deleteChannelsMessage }}
          <div v-if="deletedChannels.length" class="mt-2">
            <strong>Deleted channels:</strong>
            <ul class="mt-1 list-inside list-disc">
              <li v-for="channel in deletedChannels" :key="channel">{{ channel }}</li>
            </ul>
          </div>
          <div v-if="deleteChannelsErrors.length" class="mt-2">
            <strong>Errors:</strong>
            <div v-for="err in deleteChannelsErrors" :key="err.channel">{{ err.channel }}: {{ err.error }}</div>
          </div>
        </div>
      </div>

      <!-- Bot Diagnostics -->
      <div class="flex flex-col gap-4 rounded-xl p-6 shadow-md" style="background-color: #d9d9d9">
        <div class="flex items-center gap-2">
          <span class="h-6 w-1 rounded-full bg-black/60"></span>
          <h2 class="text-lg font-bold text-black">Bot Diagnostics</h2>
        </div>
        <p class="text-sm text-black/80">Run a health check and inspect the current bot status.</p>
        <div>
          <button
            @click="runDiagnostics"
            :disabled="diagnosticsLoading"
            class="flex items-center gap-2 rounded-lg border-2 border-black/20 bg-[#154734] px-4 py-2 text-sm font-semibold text-white shadow transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="diagnosticsLoading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            <span v-else>Run Diagnostics</span>
          </button>
        </div>
        <div v-if="diagnosticsResult" class="max-h-80 overflow-y-auto rounded-lg bg-black/20 p-4">
          <pre class="whitespace-pre-wrap font-mono text-xs text-white">{{ diagnosticsResult }}</pre>
        </div>
      </div>

      <!-- Role Management -->
      <div class="flex flex-col gap-4 rounded-xl p-6 shadow-md" style="background-color: #d9d9d9">
        <div class="flex items-center gap-2">
          <span class="h-6 w-1 rounded-full bg-black/60"></span>
          <h2 class="text-lg font-bold text-black">Manage Project Roles</h2>
        </div>
        <p class="text-sm text-black/80">
          Delete all Discord roles ending with <span class="font-mono">" - Current"</span> across the server.
        </p>
        <div>
          <button
            @click="deleteAllRoles"
            :disabled="loading || deleteLoading"
            class="flex items-center gap-2 rounded-lg border-2 border-black/20 !bg-red px-4 py-2 text-sm font-semibold text-white shadow transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="deleteLoading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            <span v-else>Delete All Project Roles</span>
          </button>
        </div>

        <div v-if="deleteMessage" class="rounded-lg p-3 text-sm font-semibold" :class="{
          'bg-emerald-100 border border-emerald-400 text-emerald-800': deleteMessageType === 'success',
          'bg-red-100 border border-red-400 text-red-800': deleteMessageType === 'error',
          'bg-blue-100 border border-blue-400 text-blue-800': deleteMessageType === 'info'
        }">
          {{ deleteMessage }}
          <div v-if="deletedRoles.length" class="mt-2">
            <strong>Deleted roles:</strong>
            <ul class="mt-1 list-inside list-disc">
              <li v-for="role in deletedRoles" :key="role">{{ role }}</li>
            </ul>
          </div>
          <div v-if="deleteErrors.length" class="mt-2">
            <strong>Errors:</strong>
            <div v-for="err in deleteErrors" :key="err.role">{{ err.role }}: {{ err.error }}</div>
          </div>
        </div>
      </div>

      <!-- About -->
      <div class="flex flex-col gap-4 rounded-xl p-6 shadow-md" style="background-color: #d9d9d9">
        <div class="flex items-center gap-2">
          <span class="h-6 w-1 rounded-full bg-black/60"></span>
          <h2 class="text-lg font-bold text-black">About S.C.I.P.E.</h2>
        </div>
        <p class="text-sm text-black/80">
          S.C.I.P.E. (Smart Computer Interface for Protocol Execution) is a Discord bot that manages
          project channels, roles, and team communication for the Teambuilder platform.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const globalError = ref('');  // For the discord bot running or not notification
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error' | 'info'>('info');
const errors = ref<string[]>([]);

const deleteLoading = ref(false);
const deleteMessage = ref('');
const deleteMessageType = ref<'success' | 'error' | 'info'>('info');
const deletedRoles = ref<string[]>([]);
const deleteErrors = ref<Array<{ role: string; error: string }>>([]);

const deleteChannelsLoading = ref(false);
const deleteChannelsMessage = ref('');
const deleteChannelsMessageType = ref<'success' | 'error' | 'info'>('info');
const deletedChannels = ref<string[]>([]);
const deleteChannelsErrors = ref<Array<{ channel: string; error: string }>>([]);

const diagnosticsLoading = ref(false);
const diagnosticsResult = ref('');

const showError = (msg: string) => {
  globalError.value = msg;
  setTimeout(() => { globalError.value = ''; }, 5000);
};

const updateChannels = async () => {
  loading.value = true;
  message.value = '';
  errors.value = [];
  try {
    const response = await $fetch('/api/discord/update-channels', { method: 'POST' }) as any;
    if (response.success) {
      message.value = response.message || 'Discord channels updated';
      messageType.value = 'success';
      errors.value = response.errors || [];
    } else {
      message.value = response.message || 'Failed to update Discord channels';
      messageType.value = 'error';
      errors.value = response.errors || [];
    }
  } catch (error: any) {
    showError(error?.data?.message || 'Failed to update Discord channels');
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const deleteAllRoles = async () => {
  deleteLoading.value = true;
  deleteMessage.value = '';
  deletedRoles.value = [];
  deleteErrors.value = [];
  try {
    const response = await $fetch('/api/discord/delete-roles', { method: 'POST' }) as any;
    if (response.success) {
      deleteMessage.value = response.message;
      deleteMessageType.value = 'success';
      deletedRoles.value = response.deletedRoles || [];
      deleteErrors.value = response.errors || [];
    } else {
      deleteMessage.value = response.message;
      deleteMessageType.value = 'error';
      deleteErrors.value = response.errors || [];
    }
  } catch (error: any) {
    showError(error?.data?.message || 'Failed to delete roles');
  } finally {
    deleteLoading.value = false;
  }
};

const runDiagnostics = async () => {
  diagnosticsLoading.value = true;
  diagnosticsResult.value = '';
  try {
    const response = await $fetch('/api/discord/diagnostics') as any;
    diagnosticsResult.value = JSON.stringify(response, null, 2);
  } catch (error: any) {
    showError(error?.data?.message || error?.message || 'Failed to run diagnostics');
  } finally {
    diagnosticsLoading.value = false;
  }
};

const deleteAllChannels = async () => {
  deleteChannelsLoading.value = true;
  deleteChannelsMessage.value = '';
  deletedChannels.value = [];
  deleteChannelsErrors.value = [];
  try {
    const response = await $fetch('/api/discord/delete-channels', { method: 'POST' }) as any;
    if (response.success) {
      deleteChannelsMessage.value = response.message;
      deleteChannelsMessageType.value = 'success';
      deletedChannels.value = response.channels || [];
    } else {
      deleteChannelsMessage.value = response.message;
      deleteChannelsMessageType.value = 'error';
    }
    deleteChannelsErrors.value = response.errors || [];
  } catch (error: any) {
    showError(error?.data?.message || 'Failed to delete Discord channels');
    deleteChannelsMessageType.value = 'error';
  } finally {
    deleteChannelsLoading.value = false;
  }
};

</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(1rem); }
</style>