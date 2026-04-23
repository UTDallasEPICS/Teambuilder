<template>
  <FilterButton
    :label="displayText"
    :is-open="isOpen"
    :has-selection="!!timePeriodOption"
    @toggle="$emit('toggle')"
  >
    <!-- Mode radio buttons -->
    <div class="mode-options">
      <label class="radio-label">
        <input type="radio" value="Continuous" v-model="timePeriodOptionModel" />
        Continuous
      </label>
      <label class="radio-label">
        <input type="radio" value="Semester-based" v-model="timePeriodOptionModel" />
        Semester-based
      </label>
    </div>
 
    <!-- Shared year inputs -->
    <div v-if="timePeriodOption" class="inputs-section">
      <label class="input-label">Start Year</label>
      <input
        type="text"
        class="custom-input"
        placeholder="e.g. 2022"
        :value="customYearStart"
        @input="$emit('update:customYearStart', $event.target.value)"
      />
 
      <label class="input-label">End Year</label>
      <input
        type="text"
        class="custom-input"
        placeholder="e.g. 2024"
        :value="customYearEnd"
        @input="$emit('update:customYearEnd', $event.target.value)"
      />
    </div>
 
    <!-- Continuous: semester range dropdowns -->
    <div v-if="timePeriodOption === 'Continuous'" class="inputs-section">
      <label class="input-label">Start Semester</label>
      <select
        class="custom-dropdown"
        :value="customSemesterStart"
        @change="$emit('update:customSemesterStart', $event.target.value)"
      >
        <option disabled value="">Select Semester</option>
        <option v-for="s in SEMESTERS" :key="s" :value="s">{{ s }}</option>
      </select>
 
      <label class="input-label">End Semester</label>
      <select
        class="custom-dropdown"
        :value="customSemesterEnd"
        @change="$emit('update:customSemesterEnd', $event.target.value)"
      >
        <option disabled value="">Select Semester</option>
        <option v-for="s in SEMESTERS" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>
 
    <!-- Semester-based: toggle chips -->
    <div v-if="timePeriodOption === 'Semester-based'" class="inputs-section">
      <label class="input-label">Choose Semesters</label>
      <div class="semester-chips">
        <button
          v-for="s in SEMESTERS"
          :key="s"
          type="button"
          class="chip"
          :class="{ 'chip--selected': selectedSemesters.includes(s) }"
          @click="$emit('toggle-semester', s)"
        >
          {{ s }}
        </button>
      </div>
    </div>
  </FilterButton>
</template>
 
<script setup>
import { computed } from 'vue'
import FilterButton from './FilterButton.vue'
 
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  displayText: { type: String, required: true },
  timePeriodOption: { type: String, default: '' },
  customYearStart: { type: String, default: '' },
  customYearEnd: { type: String, default: '' },
  customSemesterStart: { type: String, default: '' },
  customSemesterEnd: { type: String, default: '' },
  selectedSemesters: { type: Array, default: () => [] },
  SEMESTERS: { type: Array, default: () => ['Fall', 'Spring', 'Summer'] }
})
 
const emit = defineEmits([
  'toggle',
  'update:timePeriodOption',
  'update:customYearStart',
  'update:customYearEnd',
  'update:customSemesterStart',
  'update:customSemesterEnd',
  'toggle-semester'
])
 
const timePeriodOptionModel = computed({
  get: () => props.timePeriodOption,
  set: val => emit('update:timePeriodOption', val)
})
</script>
 
<style scoped>
.mode-options {
  padding: 10px 12px 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
 
.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #006d48;
  cursor: pointer;
  font-weight: 600;
}
 
.inputs-section {
  padding: 4px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
 
.input-label {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-top: 6px;
}
 
.custom-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #006d48;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}
 
.custom-dropdown {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #006d48;
  border-radius: 4px;
  font-size: 14px;
}
 
.semester-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}
 
.chip {
  padding: 5px 12px;
  border: 2px solid #006d48;
  border-radius: 20px;
  background: transparent;
  color: #006d48;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
 
.chip:hover {
  background: #e8f5e9;
}
 
.chip--selected {
  background: #006d48;
  color: #fff;
}
</style>