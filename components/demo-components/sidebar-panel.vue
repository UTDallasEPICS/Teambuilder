<template>
  <aside class="sidebar">
    <!-- Close -->
    <button type="button" class="close-btn" aria-label="Close sidebar" @click="$emit('close')">
      ✕
    </button>
 
    <!-- Time Period -->
    <TimePeriodFilter
      :is-open="isDropdownOpen('timePeriod')"
      :display-text="timePeriod.displayText.value"
      :time-period-option="timePeriod.timePeriodOption.value"
      :custom-year-start="timePeriod.customYearStart.value"
      :custom-year-end="timePeriod.customYearEnd.value"
      :custom-semester-start="timePeriod.customSemesterStart.value"
      :custom-semester-end="timePeriod.customSemesterEnd.value"
      :selected-semesters="timePeriod.selectedSemesters.value"
      :semesters="timePeriod.SEMESTERS"
      @toggle="toggleDropdown('timePeriod')"
      @update:timePeriodOption="timePeriod.timePeriodOption.value = $event"
      @update:customYearStart="timePeriod.customYearStart.value = $event"
      @update:customYearEnd="timePeriod.customYearEnd.value = $event"
      @update:customSemesterStart="timePeriod.customSemesterStart.value = $event"
      @update:customSemesterEnd="timePeriod.customSemesterEnd.value = $event"
      @toggle-semester="timePeriod.toggleSemester"
    />
 
    <!-- Regular filters -->
    <template v-for="filter in visibleFilters" :key="filter.name">
      <FilterButton
        :label="getFilterDisplayText(filter)"
        :is-open="isDropdownOpen(filter.name)"
        :has-selection="filter.selectedOptions.length > 0"
        @toggle="toggleDropdown(filter.name)"
      >
        <DropdownItem
          v-for="option in filter.options"
          :key="option"
          :label="option"
          :selected="filter.selectedOptions.includes(option)"
          @select="toggleOption(filter.name, option)"
        />
      </FilterButton>
    </template>
 
    <!-- Submit -->
    <button
      type="button"
      class="submit-btn"
      :disabled="isLoading"
      @click="$emit('submit')"
    >
      {{ isLoading ? 'Loading…' : 'Submit' }}
    </button>
 
    <!-- File Upload -->
    <FileUploader
      :file="upload.file.value"
      :is-sent="upload.isSent.value"
      :is-uploading="upload.isUploading.value"
      :upload-error="upload.uploadError.value"
      @file-selected="upload.onFileSelected"
      @remove="upload.removeFile"
      @send="upload.sendExtractedData"
    />
  </aside>
</template>
 
<script setup>
import { computed } from 'vue'
import FilterButton from './FilterButton.vue'
import DropdownItem from './DropdownItem.vue'
import TimePeriodFilter from './TimePeriodFilter.vue'
import FileUploader from './FileUploader.vue'
 
const props = defineProps({
  // From useFilters
  filters: { type: Array, required: true },
  isDropdownOpen: { type: Function, required: true },
  toggleDropdown: { type: Function, required: true },
  toggleOption: { type: Function, required: true },
  getFilterDisplayText: { type: Function, required: true },
  isEthnicityVisible: { type: Boolean, default: false },
  isGenderVisible: { type: Boolean, default: false },
 
  // From useTimePeriod (passed as the whole composable return object)
  timePeriod: { type: Object, required: true },
 
  // From useFileUpload (passed as the whole composable return object)
  upload: { type: Object, required: true },
 
  isLoading: { type: Boolean, default: false }
})
 
defineEmits(['close', 'submit'])
 
// Only show Ethnicity / Gender filters when Demographics has them selected
const visibleFilters = computed(() =>
  props.filters.filter(f => {
    if (f.name === 'Ethnicity') return props.isEthnicityVisible
    if (f.name === 'Gender') return props.isGenderVisible
    return true
  })
)
</script>
 
<style scoped>
.sidebar {
  background-color: #e87500;
  padding: 16px;
  display: flex;
  flex-direction: column;
  width: 260px;
  min-width: 220px;
  border-radius: 8px;
  height: fit-content;
  gap: 0;
}
 
.close-btn {
  color: #fff;
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  text-align: left;
  margin-bottom: 12px;
  padding: 0;
  line-height: 1;
}
 
.close-btn:hover {
  opacity: 0.7;
}
 
.submit-btn {
  background-color: #006d48;
  color: #ffffff;
  filter:drop-shadow(1 1px 1px rgba(0,0,0,0.25));
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  margin-top: 16px;
  margin-bottom: 4px;
}
 
.submit-btn:hover:not(:disabled) {
  background-color: #e8f5e9;
}
 
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>