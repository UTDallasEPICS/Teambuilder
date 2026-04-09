<template>
  <div
    class="dropdown-item"
    :class="{ selected }"
    role="option"
    :aria-selected="selected"
    @click="$emit('select')"
  >
    <span class="item-check">{{ selected ? '✓' : '' }}</span>
    {{ label }}
  </div>
</template>
 
<script setup>
defineProps({
  label: { type: String, required: true },
  selected: { type: Boolean, default: false }
})
 
defineEmits(['select'])
</script>
 
<style scoped>
.dropdown-item {
  padding: 8px 12px;
  color: #006d48;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.15s ease;
  font-size: 14px;
}
 
.dropdown-item:hover {
  background-color: #e8f5e9;
}
 
.dropdown-item.selected {
  background-color: #e8f5e9;
  font-weight: bold;
}
 
.item-check {
  width: 14px;
  font-size: 12px;
  color: #006d48;
}
</style>