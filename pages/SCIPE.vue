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
        <button
          @click="runDiagnostics"
          :disabled="diagnosticsLoading"
          class="button-diagnostics disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="diagnosticsLoading" class="loading-spinner"></span>
          <span v-else>Run Diagnostics</span>
        </button>
        <div v-if="diagnosticsResult" class="mt-4 p-4 rounded-lg bg-gray-50 text-sm text-gray-900 space-y-3">
          <div v-if="diagnosticsResult.error" class="text-red-600 font-semibold">{{ diagnosticsResult.error }}</div>
          <template v-else>
            <div class="flex flex-wrap gap-6">
              <div>
                <p class="font-semibold text-gray-500 uppercase tracking-wide text-xs mb-1">Bot</p>
                <p>{{ diagnosticsResult.bot?.tag }}</p>
                <p :class="diagnosticsResult.bot?.isReady ? 'text-green-600' : 'text-red-600'">{{ diagnosticsResult.bot?.isReady ? 'Ready' : 'Not Ready' }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-500 uppercase tracking-wide text-xs mb-1">Guild</p>
                <p>{{ diagnosticsResult.guild?.name }}</p>
                <p>{{ diagnosticsResult.guild?.memberCount }} members</p>
              </div>
              <div>
                <p class="font-semibold text-gray-500 uppercase tracking-wide text-xs mb-1">Channels</p>
                <p>{{ diagnosticsResult.channels?.total }} total ({{ diagnosticsResult.channels?.remaining }} remaining)</p>
                <p>{{ diagnosticsResult.channels?.categories }} categories · {{ diagnosticsResult.channels?.text }} text · {{ diagnosticsResult.channels?.voice }} voice</p>
              </div>
              <div>
                <p class="font-semibold text-gray-500 uppercase tracking-wide text-xs mb-1">Roles</p>
                <p>{{ diagnosticsResult.roles?.total }} total · {{ diagnosticsResult.roles?.projectRoles }} project roles</p>
                <p :class="diagnosticsResult.roles?.hasAdminRole ? 'text-green-600' : 'text-yellow-600'">Admin role {{ diagnosticsResult.roles?.hasAdminRole ? 'present' : 'missing' }}</p>
              </div>
            </div>
            <div>
              <p class="font-semibold text-gray-500 uppercase tracking-wide text-xs mb-1">Permissions</p>
              <div class="flex gap-4">
                <span :class="diagnosticsResult.permissions?.manageChannels ? 'text-green-600' : 'text-red-600'">Manage Channels: {{ diagnosticsResult.permissions?.manageChannels ? '✓' : '✗' }}</span>
                <span :class="diagnosticsResult.permissions?.manageRoles ? 'text-green-600' : 'text-red-600'">Manage Roles: {{ diagnosticsResult.permissions?.manageRoles ? '✓' : '✗' }}</span>
                <span :class="diagnosticsResult.permissions?.viewChannel ? 'text-green-600' : 'text-red-600'">View Channels: {{ diagnosticsResult.permissions?.viewChannel ? '✓' : '✗' }}</span>
              </div>
            </div>
          </template>
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
        <div class="flex gap-3 flex-wrap items-center">
          <select v-model="selectedSemesterId" class="semester-select" :disabled="assignRolesLoading || loading || deleteLoading">
            <option value="">Latest semester</option>
            <option v-for="semester in semesters" :key="semester.id" :value="semester.id">
              {{ semester.season }} {{ semester.year }}
            </option>
          </select>
          <button
            @click="assignProjectRoles"
            :disabled="assignRolesLoading || loading || deleteLoading"
            class="button-create disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="assignRolesLoading" class="loading-spinner"></span>
            <span v-else>Assign Project Roles from Discord Usernames</span>
          </button>
        </div>
        <div v-if="assignRolesMessage" class="mt-4 p-4 rounded-lg result-message" :class="{
          'result-success': assignRolesMessageType === 'success',
          'result-error': assignRolesMessageType === 'error',
          'result-info': assignRolesMessageType === 'info'
        }">
          {{ assignRolesMessage }}
          <div v-if="assignRolesErrors.length" class="mt-2 result-error-list">
            <div v-for="err in assignRolesErrors" :key="err">{{ err }}</div>
          </div>
        </div>
        <button
          @click="deleteAllRoles"
          :disabled="loading || deleteLoading"
          class="button-delete-roles disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="deleteLoading" class="loading-spinner"></span>
          <span v-else>Delete All Project Roles</span>
        </button>
        <p class="text-sm text-gray-600 mt-2">
          This will delete all Discord roles ending with " - Current"
        </p>

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
import { onMounted, ref } from 'vue';

interface Semester {
  id: string;
  year: number;
  season: string;
}

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
const diagnosticsResult = ref<any>(null);
const semesters = ref<Semester[]>([]);
const selectedSemesterId = ref('');
const assignRolesLoading = ref(false);
const assignRolesMessage = ref('');
const assignRolesMessageType = ref<'success' | 'error' | 'info'>('info');
const assignRolesErrors = ref<string[]>([]);

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
  diagnosticsResult.value = null;
  try {
    diagnosticsResult.value = await $fetch('/api/discord/diagnostics') as any;
  } catch (error: any) {
    diagnosticsResult.value = { error: error?.data?.message || error?.message || 'Failed to run diagnostics' };
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

const assignProjectRoles = async () => {
  assignRolesLoading.value = true;
  assignRolesMessage.value = '';
  assignRolesErrors.value = [];
  try {
    const response = await $fetch('/api/discord/assign-project-roles', {
      method: 'POST',
      body: {
        semesterId: selectedSemesterId.value || undefined,
      },
    }) as any;

    assignRolesMessage.value = response.message || 'Role assignment completed.';
    assignRolesMessageType.value = response.success ? 'success' : 'error';
    assignRolesErrors.value = response.errors || [];
  } catch (error: any) {
    assignRolesMessage.value = error?.data?.message || 'Failed to assign project roles.';
    assignRolesMessageType.value = 'error';
  } finally {
    assignRolesLoading.value = false;
  }
};

onMounted(async () => {
  try {
    semesters.value = await $fetch<Semester[]>('/api/semesters');
  } catch {
    semesters.value = [];
  }
});

</script>

<style scoped>
/* Override global beige text color */
.scipe-page * {
  color: inherit !important;
}

.scipe-page h1,
.scipe-page h2,
.scipe-page h3 {
  color: #1F2937 !important;
}

.scipe-page p.subtitle {
  color: #4B5563 !important;
}

/* Button Styles with !important to override global styles */
.button-create {
  background-color: #154734 !important;
  color: white !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid black !important;
  cursor: pointer;
}

.button-create:hover:not(:disabled) {
  background-color: #0f3f2c !important;
}

.button-delete {
  background-color: #DC2626 !important;
  color: white !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid black !important;
  cursor: pointer;
}

.button-delete:hover:not(:disabled) {
  background-color: #C2410C !important;
}

.button-diagnostics {
  background-color: #154734 !important;
  color: white !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid black !important;
  cursor: pointer;
}

.button-diagnostics:hover:not(:disabled) {
  background-color: #0f3f2c !important;
}

.button-delete-roles {
  background-color: #DC2626 !important;
  color: white !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid black !important;
  cursor: pointer;
}

.button-delete-roles:hover:not(:disabled) {
  background-color: #B91C1C !important;
}

.semester-select {
  border: 1px solid #9ca3af;
  border-radius: 0.375rem;
  padding: 0.45rem 0.6rem;
  min-width: 14rem;
  background: #ffffff !important;
  color: #111827 !important;
}

.semester-select option {
  color: #111827 !important;
}

.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.result-message {
  font-weight: 600;
  font-size: 1.1rem;
}

.result-success {
  background: #d1fae5 !important;
  border: 2px solid #10b981 !important;
  color: #065f46 !important;
}

.result-error {
  background: #fee2e2 !important;
  border: 2px solid #ef4444 !important;
  color: #7f1d1d !important;
}

.result-info {
  background: #dbeafe !important;
  border: 2px solid #3b82f6 !important;
  color: #1e3a8a !important;
}

.result-error-list {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #7f1d1d !important;
  font-weight: bold;
}

/* SCIPE page specific polish */
.scipe-card {
  /* Use UTD orange background */
  background: var(--color-utd-orange) !important;
  border-radius: 1rem !important;
  box-shadow: 0 8px 20px rgba(16,24,40,0.08) !important;
  border: 1px solid rgba(16,24,40,0.06) !important;
}

/* Force white text inside the card for contrast on orange background */
.scipe-card,
.scipe-card * {
  color: #ffffff !important; /* white text */
}

/* Keep semester dropdown readable inside the white-text card. */
.scipe-card .semester-select,
.scipe-card .semester-select option {
  color: #111827 !important;
  background: #ffffff !important;
}

.subtitle {
  color: #4B5563 !important;
  font-size: 1.05rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.section-accent {
  width: 0.5rem;
  height: 2rem;
  background: linear-gradient(180deg,#06b6d4,#4f46e5);
  border-radius: 0.25rem;
  box-shadow: 0 2px 6px rgba(79,70,229,0.12);
}

.section-heading {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827 !important;
}

/* Make primary action buttons a consistent height and add subtle elevation */
.button-create, .button-delete, .button-diagnostics, .button-delete-roles {
  min-height: 2.4rem;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  box-shadow: 0 6px 14px rgba(15,23,42,0.06);
}

.result-message {
  font-weight: 600;
  font-size: 1rem;
}
</style>
