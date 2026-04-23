<template>
  <div class="help-icon-wrap">
    <button class="help-icon-button" type="button" @click="toggleHelp">
      <span>?</span>
    </button>

    <div v-if="showHelp" class="help-popup blue-card" @click="toggleHelp">
      <div class="text-lg mb-1">{{ info }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ info: string }>();

const showHelp = ref(false);

const toggleHelp = () => {
  showHelp.value = !showHelp.value;
};
</script>

<style scoped>
.help-icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
}

.help-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  border: 2px solid var(--color-beige);
  position: relative;
}

.help-popup {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  padding: 1rem;
  z-index: 10;
}

.blue-card {
  width: min(22rem, calc(100vw - 2rem));
  max-width: calc(100vw - 2rem);
  white-space: normal;
  word-break: break-word;
}
</style>