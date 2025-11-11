<template>
  <div class="discord-bot-control scipe-card bg-white rounded-lg shadow-md p-6 max-w-2xl">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-gray-800">SCIPE Discord Bot Control</h2>
      <div class="flex items-center gap-2">
        <div 
          class="w-3 h-3 rounded-full"
          :class="{
            'bg-green-500 animate-pulse': botStatus === 'running',
            'bg-red-500': botStatus === 'stopped',
            'bg-yellow-500 animate-pulse': botStatus === 'error',
            'bg-gray-400': botStatus === 'loading'
          }"
        ></div>
        <span class="text-sm font-medium text-gray-600 capitalize">{{ botStatus }}</span>
      </div>
    </div>

    <!-- Bot Info -->
    <div v-if="statusData" class="bg-gray-50 rounded-lg p-4 mb-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">Status</p>
          <p class="font-semibold text-gray-800 capitalize">{{ statusData.status }}</p>
        </div>
        <div v-if="statusData.uptimeFormatted">
          <p class="text-sm text-gray-600">Uptime</p>
          <p class="font-semibold text-gray-800">{{ statusData.uptimeFormatted }}</p>
        </div>
      </div>
      
      <div v-if="statusData.error" class="mt-3 p-3 bg-red-50 border border-red-200 rounded">
        <p class="text-sm text-red-800">
          <span class="font-semibold">Error:</span> {{ statusData.error }}
        </p>
      </div>
    </div>

    <!-- Control Buttons -->
    <div class="flex gap-3">
      <button
        @click="startBot"
        :disabled="loading || botStatus === 'running'"
        class="flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        style="background-color: #154734; border: 2px solid black;"
        :style="{ backgroundColor: (loading || botStatus === 'running') ? '#9CA3AF' : '#154734' }"
      >
        <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span v-if="loading" class="loading-spinner"></span>
        Start Bot
      </button>

      <button
        @click="stopBot"
        :disabled="loading || botStatus === 'stopped'"
        class="flex-1 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        :style="{ 
          backgroundColor: (loading || botStatus === 'stopped') ? '#DC2626' : '#DC2626',
          border: '2px solid black',
          cursor: (loading || botStatus === 'stopped') ? 'not-allowed' : 'pointer'
        }"
      >
        <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        <span v-if="loading" class="loading-spinner"></span>
        Stop Bot
      </button>

      <button
        @click="restartBot"
        :disabled="loading"
        class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        style="border: 2px solid black;"
      >
        <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span v-if="loading" class="loading-spinner"></span>
        Restart Bot
      </button>
    </div>

    <!-- Message Toast -->
    <transition name="fade">
      <div 
        v-if="message"
        class="mt-4 p-4 rounded-lg"
        :class="{
          'bg-green-50 border border-green-200 text-green-800': messageType === 'success',
          'bg-red-50 border border-red-200 text-red-800': messageType === 'error',
          'bg-blue-50 border border-blue-200 text-blue-800': messageType === 'info'
        }"
      >
        {{ message }}
      </div>
    </transition>

    <!-- Refresh Status Button -->
    <button
      @click="fetchStatus"
      :disabled="loading"
      class="mt-4 w-full text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
      :style="{ 
        backgroundColor: loading ? '#F3F4F6' : '#D1D5DB',
        border: '2px solid black',
        cursor: loading ? 'not-allowed' : 'pointer'
      }"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Refresh Status
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface BotStatus {
  status: string;
  error: string | null;
  uptime: number | null;
  uptimeFormatted: string | null;
}

const botStatus = ref<'running' | 'stopped' | 'error' | 'loading'>('loading');
const statusData = ref<BotStatus | null>(null);
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error' | 'info'>('info');

let statusInterval: NodeJS.Timeout | null = null;

// Fetch bot status
const fetchStatus = async () => {
  try {
    const response = await $fetch('/api/discord/status') as any;
    if (response.success && response.data) {
      statusData.value = response.data;
      botStatus.value = response.data.status as any;
    }
  } catch (error) {
    console.error('Error fetching bot status:', error);
    botStatus.value = 'error';
    showMessage('Failed to fetch bot status', 'error');
  }
};

// Start bot
const startBot = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/discord/start', { method: 'POST' }) as any;
    if (response.success) {
      showMessage(response.message, 'success');
      await fetchStatus();
    } else {
      showMessage(response.message, 'error');
    }
  } catch (error: any) {
    showMessage(error?.data?.message || 'Failed to start bot', 'error');
  } finally {
    loading.value = false;
  }
};

// Stop bot
const stopBot = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/discord/stop', { method: 'POST' }) as any;
    if (response.success) {
      showMessage(response.message, 'success');
      await fetchStatus();
    } else {
      showMessage(response.message, 'error');
    }
  } catch (error: any) {
    showMessage(error?.data?.message || 'Failed to stop bot', 'error');
  } finally {
    loading.value = false;
  }
};

// Restart bot
const restartBot = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/discord/restart', { method: 'POST' }) as any;
    if (response.success) {
      showMessage(response.message, 'success');
      await fetchStatus();
    } else {
      showMessage(response.message, 'error');
    }
  } catch (error: any) {
    showMessage(error?.data?.message || 'Failed to restart bot', 'error');
  } finally {
    loading.value = false;
  }
};

// Show message helper
const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 5000);
};

// Auto-refresh status every 10 seconds
onMounted(() => {
  fetchStatus();
  statusInterval = setInterval(fetchStatus, 10000);
});

onUnmounted(() => {
  if (statusInterval) {
    clearInterval(statusInterval);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
</style>
<style scoped>
.discord-bot-control,
.discord-bot-control * {
  color: #0f172a !important;
}
</style>
