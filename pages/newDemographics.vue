<template>
  <div class="dashboard-container">
    <!-- ── Sidebar ────────────────────────────────────────────────────── -->
    <SidebarPanel
      :filters="filters"
      :is-dropdown-open="isDropdownOpen"
      :toggle-dropdown="toggleDropdown"
      :toggle-option="toggleOption"
      :get-filter-display-text="getFilterDisplayText"
      :is-ethnicity-visible="isEthnicityVisible"
      :is-gender-visible="isGenderVisible"
      :time-period="timePeriod"
      :upload="upload"
      :is-loading="isLoading"
      @close="handleCloseSidebar"
      @submit="handleSubmit"
    />
 
    <!-- Chart -->
    <DemographicsChart ref="chartComponentRef" :is-empty="chartData.length === 0" />
  </div>
</template>
 
<script setup>
import { ref, onBeforeUnmount } from 'vue'
 
// Composables
import { useFilters } from '@/composables/demo-composables/useFilters'
import { useTimePeriod } from '@/composables/demo-composables/useTimePeriod'
import { useFileUpload } from '@/composables/demo-composables/useFileUpload'
import { useChart } from '@/composables/demo-composables/useChart'
 
// Components
import SidebarPanel from '@/components/demo-components/sidebar-panel.vue'
import DemographicsChart from '@/components/demo-components/demographics-chart.vue'
 
// Composables 
const {
  filters,
  isDropdownOpen,
  toggleDropdown,
  toggleOption,
  getFilterDisplayText,
  selectedChartType,
  selectedMetricType,
  selectedCourses,
  selectedEthnicities,
  selectedGenders,
  isEthnicityVisible,
  isGenderVisible,
  buildFilterParams
} = useFilters()
 
const timePeriod = useTimePeriod()
const upload = useFileUpload()
const { plotChart, cleanup } = useChart()
 
// Local state
const chartData = ref([])
const isLoading = ref(false)
const chartComponentRef = ref(null)
 
// Sidebar close 
function handleCloseSidebar() {
  // TODO: still needs to edited
}
 
// Submit 
async function handleSubmit() {
  if (isLoading.value) return
  isLoading.value = true
 
  const params = new URLSearchParams()
 
  // Metric Type
  if (selectedMetricType.value) {
    params.append('Metric Type', selectedMetricType.value)
  }
 
  // Time Period Parameters
  timePeriod.buildTimePeriodParams(params)
 
  // Filter Parameters
  buildFilterParams(params)
 
  try {
    const response = await fetch(`/api/demographic?${params.toString()}`)
    if (!response.ok) throw new Error('Response was not ok')
 
    const data = await response.json()
    if (!data.success) throw new Error(data.message ?? 'API error')
 
    // Deduplicate by Name + Course
    chartData.value = Array.from(
      new Map(data.data.map(item => [`${item.Name}-${item.Course}`, item])).values()
    )
 
    // Draw the chart on the next tick (canvas must be mounted)
    const canvas = chartComponentRef.value?.canvasRef
    if (canvas) {
      plotChart(canvas, {
        chartData: chartData.value,
        chartType: selectedChartType.value,
        selectedEthnicities: selectedEthnicities.value,
        selectedGenders: selectedGenders.value,
        selectedCourses: selectedCourses.value,
        metricType: selectedMetricType.value
      })
    }
  } catch (err) {
    console.error('[DemographicsPage] submit error:', err)
  } finally {
    isLoading.value = false
  }
}
 
// ── Lifecycle ──────────────────────────────────────────────────────────────
onBeforeUnmount(() => {
  cleanup()
})
</script>
 
<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  padding: 16px;
  gap: 16px;
  background: #f4f7f5;
}
</style>