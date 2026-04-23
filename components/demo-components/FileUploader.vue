<template>
  <div class="uploader">
    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".xlsx,.xls,.csv,.json"
      style="display: none"
      @change="$emit('file-selected', $event)"
    />
 
    <!-- Trigger button -->
    <button type="button" class="action-button action-button--dark" @click="fileInputRef.click()">
      ⬆ Import File
    </button>
 
    <!-- File selected -->
    <Transition name="slide">
      <div v-if="file && !isSent" class="file-card">
        <span class="file-name">📄 {{ file.name }}</span>
        <div class="file-actions">
          <button
            type="button"
            class="action-button action-button--outline"
            :disabled="isUploading"
            @click="$emit('remove')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="action-button action-button--primary"
            :disabled="isUploading"
            @click="$emit('send')"
          >
            {{ isUploading ? 'Uploading…' : 'Send Data' }}
          </button>
        </div>
      </div>
    </Transition>
 
    <!-- Success state -->
    <Transition name="slide">
      <p v-if="isSent" class="success-message">✅ Data sent successfully!</p>
    </Transition>
 
    <!-- Error state -->
    <Transition name="slide">
      <p v-if="uploadError" class="error-message">⚠ {{ uploadError }}</p>
    </Transition>
  </div>
</template>
 
<script setup>
import { ref } from 'vue'
 
defineProps({
  file: { type: File, default: null },
  isSent: { type: Boolean, default: false },
  isUploading: { type: Boolean, default: false },
  uploadError: { type: String, default: null }
})
 
defineEmits(['file-selected', 'remove', 'send'])
 
const fileInputRef = ref(null)
</script>
 
<style scoped>
.uploader {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}
 
/*  Buttons  */
.action-button {
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  width: 100%;
  text-align: center;
}
 
.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
 
.action-button--dark {
  background-color: #154734;
  color: #fff;
}
 
.action-button--dark:hover:not(:disabled) {
  background-color: #3f4a45;
}
 
.action-button--outline {
  background: transparent;
  color: #154734;
  border: 2px solid #154734;
}
 
.action-button--outline:hover:not(:disabled) {
  background: #e8f5e9;
}
 
.action-button--primary {
  background: #006d48;
  color: #fff;
}
 
.action-button--primary:hover:not(:disabled) {
  background: #005438;
}
 
/*  File card  */
.file-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
 
.file-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  word-break: break-all;
  text-align: center;
}
 
.file-actions {
  display: flex;
  gap: 8px;
  width: 100%;
}
 
.file-actions .action-button {
  flex: 1;
}
 
/*  Messages  */
.success-message {
  color: #a8ffd6;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
}
 
.error-message {
  color: #ffa8a8;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
}
 
/*  Transitions  */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
