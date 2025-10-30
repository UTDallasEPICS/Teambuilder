<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 scipe-page">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-extrabold mb-2 tracking-tight">Discord Bot Management</h1>
        <p class="subtitle">Control and monitor the SCIPE Discord bot from here</p>
      </div>

      <SCIPEControl />

      <div class="mt-8 scipe-card p-6">
        <div class="section-title">
          <span class="section-accent" aria-hidden></span>
          <h2 class="section-heading">Update Discord Channels</h2>
        </div>
        <div class="flex gap-3 flex-wrap">
          <button
            @click="updateChannels"
            :disabled="loading || deleteLoading || deleteChannelsLoading"
            class="button-create disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="loading-spinner"></span>
            <span v-else>Create All Project Channels</span>
          </button>
          <button
            @click="deleteAllChannels"
            :disabled="loading || deleteLoading || deleteChannelsLoading"
            class="button-delete disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="deleteChannelsLoading" class="loading-spinner"></span>
            <span v-else>Delete All Project Channels</span>
          </button>
        </div>
        <p class="text-sm mt-2" style="color: #4B5563 !important;">
          Create or delete Discord categories and channels for all projects in the database
        </p>
        <div v-if="message" class="mt-4 p-4 rounded-lg result-message" :class="{
          'result-success': messageType === 'success',
          'result-error': messageType === 'error',
          'result-info': messageType === 'info'
        }">
          {{ message }}
          <div v-if="errors.length" class="mt-2 result-error-list">
            <div v-for="err in errors" :key="err">{{ err }}</div>
          </div>
        </div>
        <div v-if="deleteChannelsMessage" class="mt-4 p-4 rounded-lg result-message" :class="{
          'result-success': deleteChannelsMessageType === 'success',
          'result-error': deleteChannelsMessageType === 'error',
          'result-info': deleteChannelsMessageType === 'info'
        }">
          {{ deleteChannelsMessage }}
          <div v-if="deletedChannels.length" class="mt-2 text-sm">
            <strong>Deleted channels:</strong>
            <ul class="list-disc list-inside mt-1">
              <li v-for="channel in deletedChannels" :key="channel">{{ channel }}</li>
            </ul>
          </div>
          <div v-if="deleteChannelsErrors.length" class="mt-2 result-error-list">
            <strong>Errors:</strong>
            <div v-for="err in deleteChannelsErrors" :key="err.channel">{{ err.channel }}: {{ err.error }}</div>
          </div>
        </div>

        <div class="section-title mt-8">
          <span class="section-accent" aria-hidden></span>
          <h2 class="section-heading">Bot Diagnostics</h2>
        </div>
        <button
          @click="runDiagnostics"
          :disabled="diagnosticsLoading"
          class="button-diagnostics disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="diagnosticsLoading" class="loading-spinner"></span>
          <span v-else>Run Diagnostics</span>
        </button>
        <div v-if="diagnosticsResult" class="mt-4 p-4 rounded-lg bg-gray-50 text-sm">
          <pre class="whitespace-pre-wrap text-gray-900">{{ diagnosticsResult }}</pre>
        </div>

        <div class="section-title mt-8">
          <span class="section-accent" aria-hidden></span>
          <h2 class="section-heading">Manage Project Roles</h2>
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
        <div v-if="deleteMessage" class="mt-4 p-4 rounded-lg result-message" :class="{
          'result-success': deleteMessageType === 'success',
          'result-error': deleteMessageType === 'error',
          'result-info': deleteMessageType === 'info'
        }">
          {{ deleteMessage }}
          <div v-if="deletedRoles.length" class="mt-2 text-sm">
            <strong>Deleted roles:</strong>
            <ul class="list-disc list-inside mt-1">
              <li v-for="role in deletedRoles" :key="role">{{ role }}</li>
            </ul>
          </div>
          <div v-if="deleteErrors.length" class="mt-2 result-error-list">
            <strong>Errors:</strong>
            <div v-for="err in deleteErrors" :key="err.role">{{ err.role }}: {{ err.error }}</div>
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">About SCIPE</h2>
        <p class="text-gray-700 mb-4">
          SCIPE (Smart Computer Interface for Protocol Execution) is a Discord bot that manages
          project channels, roles, and team communication for the Teambuilder platform.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
    message.value = error?.data?.message || 'Failed to update Discord channels';
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
    deleteMessage.value = error?.data?.message || 'Failed to delete roles';
    deleteMessageType.value = 'error';
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
    diagnosticsResult.value = `Error: ${error?.data?.message || error?.message || 'Failed to run diagnostics'}`;
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
    deleteChannelsMessage.value = error?.data?.message || 'Failed to delete channels';
    deleteChannelsMessageType.value = 'error';
  } finally {
    deleteChannelsLoading.value = false;
  }
};

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

.scipe-page p {
  color: #4B5563 !important;
}

/* Button Styles with !important to override global styles */
.button-create {
  background-color: #4F46E5 !important;
  color: white !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
}

.button-create:hover:not(:disabled) {
  background-color: #4338CA !important;
}

.button-delete {
  background-color: #EA580C !important;
  color: white !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
}

.button-delete:hover:not(:disabled) {
  background-color: #C2410C !important;
}

.button-diagnostics {
  background-color: #2563EB !important;
  color: white !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
}

.button-diagnostics:hover:not(:disabled) {
  background-color: #1D4ED8 !important;
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
  border: none;
  cursor: pointer;
}

.button-delete-roles:hover:not(:disabled) {
  background-color: #B91C1C !important;
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
  /* Use fully opaque white to maximize contrast against global background */
  background: #ffffff !important;
  border-radius: 1rem !important;
  box-shadow: 0 8px 20px rgba(16,24,40,0.08) !important;
  border: 1px solid rgba(16,24,40,0.06) !important;
}

/* Force readable, dark text inside the card (overrides global beige text) */
.scipe-card,
.scipe-card * {
  color: #0f172a !important; /* dark slate */
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
