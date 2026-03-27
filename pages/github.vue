<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 github-page">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-extrabold mb-2 tracking-tight">GitHub Bot Management</h1>
        <p class="subtitle">Connect GitHub and create/sync team repositories by semester</p>
      </div>

      <div class="github-card p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="section-title !mb-0">
            <span class="section-accent" aria-hidden="true"></span>
            <h2 class="section-heading">GitHub Connection</h2>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="w-3 h-3 rounded-full"
              :class="{
                'bg-green-500 animate-pulse': status === 'connected',
                'bg-gray-400': status === 'disconnected',
                'bg-yellow-500 animate-pulse': status === 'error',
                'bg-blue-400 animate-pulse': status === 'loading',
              }"
            ></div>
            <span
              class="status-pill capitalize"
              :class="`status-${status}`"
            >
              {{ status }}
            </span>
          </div>
        </div>

        <div
          v-if="statusData && (statusData.status !== 'disconnected' || statusData.username || statusData.error)"
          class="panel mb-4"
        >
          <p><strong>Status:</strong> {{ statusData.status }}</p>
          <p v-if="statusData.username"><strong>Authenticated as:</strong> {{ statusData.username }}</p>
          <p v-if="statusData.error" class="text-red-700"><strong>Error:</strong> {{ statusData.error }}</p>
        </div>

        <div class="flex gap-3 flex-wrap">
          <button
            class="button-create disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading || status === 'connected'"
            @click="connect"
          >
            <span v-if="loading && pendingAction === 'connect'" class="loading-spinner"></span>
            <span v-else>Connect GitHub</span>
          </button>
          <button
            class="button-delete disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading || status === 'disconnected'"
            @click="disconnect"
          >
            <span v-if="loading && pendingAction === 'disconnect'" class="loading-spinner"></span>
            <span v-else>Disconnect</span>
          </button>
        </div>
      </div>

      <div class="github-card p-6 mt-8">
        <div class="section-title">
          <span class="section-accent" aria-hidden="true"></span>
          <h2 class="section-heading">Create / Sync Team Repositories</h2>
        </div>
        <p class="mb-3 text-sm text-gray-700">
          Select a semester, then create private repositories (or sync collaborators for existing repositories).
          Student GitHub usernames are read from the `github` field.
        </p>

        <div class="flex gap-3 flex-wrap items-center">
          <select v-model="selectedSemesterId" class="semester-select" :disabled="loading || semesters.length === 0">
            <option value="">Select semester</option>
            <option v-for="semester in semesters" :key="semester.id" :value="semester.id">
              {{ semester.season }} {{ semester.year }}
            </option>
          </select>

          <button
            class="button-create disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading || !selectedSemesterId || status !== 'connected'"
            @click="createRepos"
          >
            <span v-if="loading && pendingAction === 'create'" class="loading-spinner"></span>
            <span v-else>Create / Sync Repos</span>
          </button>
        </div>

        <div v-if="message" class="result-message mt-4" :class="{
          'result-success': messageType === 'success',
          'result-error': messageType === 'error',
          'result-info': messageType === 'info'
        }">
          {{ message }}
        </div>

        <div v-if="results.length" class="panel mt-4">
          <h3 class="font-semibold mb-2">Per-team result</h3>
          <ul class="space-y-1">
            <li v-for="item in results" :key="item.team">
              <strong>{{ item.team }}</strong>
              <span v-if="item.success">
                — {{ item.created ? 'created' : 'synced' }}
                <a v-if="item.repoUrl" :href="item.repoUrl" target="_blank" rel="noopener" class="underline ml-1">
                  {{ item.repoUrl }}
                </a>
              </span>
              <span v-else class="text-red-700">— {{ item.error }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useHead } from 'nuxt/app';

useHead({ title: 'GitHub Bot' });

interface Semester {
  id: string;
  year: number;
  season: string;
}

interface GitHubStatus {
  status: 'connected' | 'disconnected' | 'error';
  error: string | null;
  username: string | null;
  connectedAt: string | null;
}

interface RepoResult {
  team: string;
  success: boolean;
  repoUrl?: string;
  created?: boolean;
  error?: string;
}

const loading = ref(false);
const pendingAction = ref<'connect' | 'disconnect' | 'create' | ''>('');
const status = ref<'connected' | 'disconnected' | 'error' | 'loading'>('disconnected');
const statusData = ref<GitHubStatus | null>(null);
const semesters = ref<Semester[]>([]);
const selectedSemesterId = ref('');
const message = ref('');
const messageType = ref<'success' | 'error' | 'info'>('info');
const results = ref<RepoResult[]>([]);

const refreshStatus = async () => {
  try {
    const res = await $fetch<{ success: boolean; data: GitHubStatus }>('/api/github/status');
    statusData.value = res.data;
    status.value = res.data.status;
  } catch {
    status.value = 'disconnected';
    statusData.value = null;
  }
};

const connect = async () => {
  loading.value = true;
  pendingAction.value = 'connect';
  message.value = '';
  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/github/connect', { method: 'POST' });
    message.value = res.message;
    messageType.value = res.success ? 'success' : 'error';
    await refreshStatus();
  } catch (error: any) {
    message.value = error?.data?.message || 'Failed to connect to GitHub';
    messageType.value = 'error';
  } finally {
    loading.value = false;
    pendingAction.value = '';
  }
};

const disconnect = async () => {
  loading.value = true;
  pendingAction.value = 'disconnect';
  message.value = '';
  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/github/disconnect', { method: 'POST' });
    message.value = res.message;
    messageType.value = res.success ? 'success' : 'error';
    await refreshStatus();
  } catch (error: any) {
    message.value = error?.data?.message || 'Failed to disconnect';
    messageType.value = 'error';
  } finally {
    loading.value = false;
    pendingAction.value = '';
  }
};

const createRepos = async () => {
  if (!selectedSemesterId.value) return;
  loading.value = true;
  pendingAction.value = 'create';
  message.value = '';
  results.value = [];

  try {
    const res = await $fetch<{
      success: boolean;
      message: string;
      results: RepoResult[];
    }>('/api/github/create-repos', {
      method: 'POST',
      body: { semesterId: selectedSemesterId.value },
    });

    message.value = res.message;
    messageType.value = res.success ? 'success' : 'error';
    results.value = res.results || [];
  } catch (error: any) {
    message.value = error?.data?.message || 'Failed to create/sync repositories';
    messageType.value = 'error';
  } finally {
    loading.value = false;
    pendingAction.value = '';
  }
};

onMounted(async () => {
  await refreshStatus();
  try {
    semesters.value = await $fetch<Semester[]>('/api/semesters');
  } catch {
    semesters.value = [];
  }
});
</script>

<style scoped>
.github-page {
  color: #111827;
}

.github-card {
  background: var(--color-utd-orange);
  border: 1px solid rgba(16, 24, 40, 0.06);
  border-radius: 0.75rem;
  box-shadow: 0 8px 20px rgba(16, 24, 40, 0.08);
}

.subtitle {
  color: #4B5563;
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
  color: #111827;
}

.github-card,
.github-card h2,
.github-card h3,
.github-card p,
.github-card li,
.github-card strong {
  color: #ffffff;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.35rem 0.55rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

.status-connected {
  background: #14532d;
}

.status-disconnected {
  background: #374151;
}

.status-error {
  background: #7f1d1d;
}

.status-loading {
  background: #1e3a8a;
}

.panel {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: #111827;
}

.panel p,
.panel li,
.panel strong,
.panel h3,
.panel span,
.panel a {
  color: #111827 !important;
}

.semester-select {
  border: 1px solid #9ca3af;
  border-radius: 0.375rem;
  padding: 0.45rem 0.6rem;
  min-width: 14rem;
  background: #ffffff;
  color: #111827;
}

.button-create,
.button-delete {
  border-radius: 0.5rem;
  border: 2px solid black !important;
  color: #fff !important;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.4rem;
  box-shadow: 0 6px 14px rgba(15,23,42,0.06);
  cursor: pointer;
}

.button-create {
  background: #154734;
}

.button-create:hover:not(:disabled) {
  background: #0f3f2c;
}

.button-delete {
  background: #DC2626;
}

.button-delete:hover:not(:disabled) {
  background: #C2410C;
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
  border-radius: 0.5rem;
  padding: 0.65rem 0.8rem;
  font-weight: 600;
}

.result-success {
  background: #d1fae5;
  color: #065f46;
  border: 2px solid #10b981;
}

.result-error {
  background: #fee2e2;
  color: #991b1b;
  border: 2px solid #ef4444;
}

.result-info {
  background: #dbeafe;
  color: #1e3a8a;
  border: 2px solid #3b82f6;
}
</style>
