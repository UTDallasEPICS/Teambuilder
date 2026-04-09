import { ref, watch, computed } from 'vue'
 
export function useTimePeriod() {
  const timePeriodOption = ref('')   // 'Continuous' | 'Semester-based' | ''
  const customYearStart = ref('')
  const customYearEnd = ref('')
  const customSemesterStart = ref('')
  const customSemesterEnd = ref('')
  const selectedSemesters = ref([])
 
  const SEMESTERS = ['Fall', 'Spring', 'Summer']
 
  // Reset sub-fields when mode changes
  watch(timePeriodOption, newVal => {
    if (newVal === 'Continuous') {
      selectedSemesters.value = []
    } else if (newVal === 'Semester-based') {
      customSemesterStart.value = ''
      customSemesterEnd.value = ''
    }
  })
 
  function toggleSemester(semester) {
    const idx = selectedSemesters.value.indexOf(semester)
    if (idx === -1) selectedSemesters.value.push(semester)
    else selectedSemesters.value.splice(idx, 1)
  }
 
  function isSemesterSelected(semester) {
    return selectedSemesters.value.includes(semester)
  }
 
  const displayText = computed(() => {
    if (timePeriodOption.value === 'Continuous') {
      if (customYearStart.value && customYearEnd.value) {
        const semStart = customSemesterStart.value || 'Start'
        const semEnd = customSemesterEnd.value || 'End'
        return `Continuous: ${customYearStart.value}–${customYearEnd.value}, ${semStart} to ${semEnd}`
      }
    }
    if (timePeriodOption.value === 'Semester-based') {
      if (customYearStart.value && customYearEnd.value) {
        const sems = selectedSemesters.value.length
          ? ` (${selectedSemesters.value.join(', ')})`
          : ''
        return `Semester-based: ${customYearStart.value}–${customYearEnd.value}${sems}`
      }
    }
    return 'Time Period'
  })
 
  // ── Query params builder ──────────────────────────────────────────────────
  function buildTimePeriodParams(params) {
    if (timePeriodOption.value === 'Continuous') {
      params.append('Continuous', 'true')
      params.append('Year', `${customYearStart.value},${customYearEnd.value}`)
      if (customSemesterStart.value && customSemesterEnd.value) {
        params.append('Semester', `${customSemesterStart.value},${customSemesterEnd.value}`)
      }
    } else if (timePeriodOption.value === 'Semester-based') {
      params.append('Continuous', 'false')
      params.append('Year', `${customYearStart.value},${customYearEnd.value}`)
      if (selectedSemesters.value.length) {
        params.append('Semester', selectedSemesters.value.join(','))
      }
    }
  }
 
  return {
    SEMESTERS,
    timePeriodOption,
    customYearStart,
    customYearEnd,
    customSemesterStart,
    customSemesterEnd,
    selectedSemesters,
    displayText,
    toggleSemester,
    isSemesterSelected,
    buildTimePeriodParams
  }
}