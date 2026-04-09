<template>
  <div class="filter-field">
    <button
      type="button"
      class="field-button"
      :class="{ 'has-selection': hasSelection }"
      @click="$emit('toggle')"
    >
      <span class="field-label">{{ label }}</span>
      <span class="chevron" :class="{ 'chevron--open': isOpen }">&#9662;</span>
    </button>
 
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-panel">
        <slot />
      </div>
    </Transition>
  </div>
</template>
 
<script setup>
defineProps({
  label: { type: String, required: true },
  isOpen: { type: Boolean, default: false },
  hasSelection: { type: Boolean, default: false }
})
 
defineEmits(['toggle'])
</script>
 
<style scoped>
.filter-field {
  margin-bottom: 8px;
}
 
.field-button {
  background-color: #ffffff;
  color: #006d48;
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
 
.field-button:hover,
.field-button.has-selection {
  background-color: #e8f5e9;
}
 
.chevron {
  font-size: 12px;
  transition: transform 0.2s ease;
  display: inline-block;
}
 
.chevron--open {
  transform: rotate(180deg);
}
 
/* Dropdown panel */
.dropdown-panel {
  background-color: #ffffff;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
 
/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>