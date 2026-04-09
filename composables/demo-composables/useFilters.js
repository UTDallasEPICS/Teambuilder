
import { ref, computed } from 'vue'
 
const DEFAULT_FILTERS = [
  { name: 'Course', options: ['2200', '3200'], selectedOptions: [] },
  {
    name: 'Demographics',
    options: ['Ethnicity', 'Gender', 'Total'],
    selectedOptions: []
  },
  {
    name: 'Ethnicity',
    options: ['African_American', 'Asian', 'Hispanic', 'International', 'Other', 'White'],
    selectedOptions: []
  },
  { name: 'Gender', options: ['Female', 'Male'], selectedOptions: [] },
  {
    name: 'Chart',
    options: ['Bar', 'Pie', 'Line', 'Combined bar and line'],
    selectedOptions: []
  },
  { name: 'Metric Type', options: ['Number', 'Percentages'], selectedOptions: [] }
]
 
export function useFilters() {
  const filters = ref(DEFAULT_FILTERS.map(f => ({ ...f, selectedOptions: [] })))
  const openDropdown = ref(null)
 
  // ── Dropdown helpers ──────────────────────────────────────────────────────
  function toggleDropdown(filterName) {
    openDropdown.value = openDropdown.value === filterName ? null : filterName
  }
 
  function isDropdownOpen(filterName) {
    return openDropdown.value === filterName
  }
 
  function closeDropdown() {
    openDropdown.value = null
  }
 
  // ── Option selection ──────────────────────────────────────────────────────
  function toggleOption(filterName, option) {
    const filter = filters.value.find(f => f.name === filterName)
    if (!filter) return
 
    const idx = filter.selectedOptions.indexOf(option)
 
    // Single-select filters
    if (['Chart', 'Metric Type', 'Demographics'].includes(filterName)) {
      filter.selectedOptions = [option]
    } else {
      // Multi-select filters
      if (idx === -1) filter.selectedOptions.push(option)
      else filter.selectedOptions.splice(idx, 1)
    }
 
    // Demographics side-effects
    if (filterName === 'Demographics') {
      const demographicsFilter = filters.value.find(f => f.name === 'Demographics')
      if (option === 'Ethnicity') {
        demographicsFilter.selectedOptions = ['Ethnicity']
        getFilter('Gender').selectedOptions = []
      } else if (option === 'Gender') {
        demographicsFilter.selectedOptions = ['Gender']
        getFilter('Ethnicity').selectedOptions = []
      } else if (option === 'Total') {
        demographicsFilter.selectedOptions = ['Total']
        getFilter('Gender').selectedOptions = []
        getFilter('Ethnicity').selectedOptions = []
      }
    }
  }
 
  // ── Convenience getters ───────────────────────────────────────────────────
  function getFilter(name) {
    return filters.value.find(f => f.name === name)
  }
 
  function getSelectedOptions(name) {
    return getFilter(name)?.selectedOptions ?? []
  }
 
  function getFilterDisplayText(filter) {
    if (filter.selectedOptions.length > 0) {
      return `${filter.name}: ${filter.selectedOptions.join(', ')}`
    }
    return filter.name
  }
 
  // ── Derived state ─────────────────────────────────────────────────────────
  const selectedChartType = computed(() => getSelectedOptions('Chart')[0] ?? null)
  const selectedMetricType = computed(() => getSelectedOptions('Metric Type')[0] ?? 'Number')
  const selectedCourses = computed(() => getSelectedOptions('Course'))
  const selectedEthnicities = computed(() => getSelectedOptions('Ethnicity'))
  const selectedGenders = computed(() => getSelectedOptions('Gender'))
  const selectedDemographics = computed(() => getSelectedOptions('Demographics'))
 
  const isDemographicsSelected = (type) =>
    computed(() => selectedDemographics.value.includes(type))
 
  const isEthnicityVisible = computed(() =>
    selectedDemographics.value.includes('Ethnicity')
  )
  const isGenderVisible = computed(() =>
    selectedDemographics.value.includes('Gender')
  )
 
  // ── Query params builder ──────────────────────────────────────────────────
  function buildFilterParams(params) {
    filters.value.forEach(filter => {
      if (filter.name === 'Chart') return
      if (filter.selectedOptions.length > 0) {
        params.append(filter.name, filter.selectedOptions.join(','))
      } else {
        params.append(filter.name, 'Empty')
      }
    })
  }
 
  return {
    filters,
    openDropdown,
    toggleDropdown,
    isDropdownOpen,
    closeDropdown,
    toggleOption,
    getFilter,
    getSelectedOptions,
    getFilterDisplayText,
    selectedChartType,
    selectedMetricType,
    selectedCourses,
    selectedEthnicities,
    selectedGenders,
    selectedDemographics,
    isEthnicityVisible,
    isGenderVisible,
    buildFilterParams
  }
}