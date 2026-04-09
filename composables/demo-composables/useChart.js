import { ref, shallowRef } from 'vue'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
 
Chart.register(ChartDataLabels)
 
// ── Color maps ────────────────────────────────────────────────────────────────
const ETHNICITY_COLORS = {
  African_American: 'rgba(0, 109, 72, 0.7)',
  Asian: 'rgba(75, 192, 192, 0.7)',
  Hispanic: 'rgba(255, 99, 132, 0.7)',
  International: 'rgba(153, 102, 255, 0.7)',
  Other: 'rgba(255, 159, 64, 0.7)',
  White: 'rgba(54, 162, 235, 0.7)'
}
 
const GENDER_COLORS = {
  Male: 'rgba(0, 123, 255, 0.7)',
  Female: 'rgba(255, 99, 132, 0.7)'
}
 
function getColorForEthnicity(e) { return ETHNICITY_COLORS[e] ?? 'rgba(0,0,0,0.7)' }
function getColorForGender(g) { return GENDER_COLORS[g] ?? 'rgba(0,0,0,0.7)' }
 
function getColor(category, isGenderMode) {
  return isGenderMode ? getColorForGender(category) : getColorForEthnicity(category)
}
 
// ── Chart factory functions ────────────────────────────────────────────────────
function buildTotalConfig(chartData, chartType) {
  const xValues = [...new Set(chartData.map(item => item.Name))]
  const courses = [...new Set(chartData.map(item => item.Course))]
  const grandTotal = chartData.reduce((s, i) => s + i.Total, 0)
 
  const datasets = courses.map(course => ({
    label: `Course ${course}`,
    data: chartData.filter(i => i.Course === course).map(i => i.Total),
    backgroundColor: course === '2200' ? 'rgba(0,109,72,0.7)' : 'rgba(75,192,192,0.7)',
    borderColor: course === '2200' ? 'rgb(0,109,72)' : 'rgb(75,192,192)',
    borderWidth: 1
  }))
 
  const config = {
    type: chartType === 'Bar' ? 'bar' : chartType.toLowerCase(),
    data: { labels: xValues, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Total Students per Semester by Course' },
        tooltip: {
          callbacks: {
            label: ctx => {
              const pct = ((ctx.raw / grandTotal) * 100).toFixed(1)
              return `${ctx.dataset.label}: ${ctx.raw} students (${pct}% of total)`
            }
          }
        },
        datalabels: {
          display: ctx => ctx.dataset.data[ctx.dataIndex] > 10,
          color: 'black',
          anchor: 'end',
          align: 'top',
          formatter: v => v
        }
      },
      scales: {
        y: { beginAtZero: true, grace: '5%', title: { display: true, text: 'Number of Students' } },
        x: { title: { display: true, text: 'Semester' }, ticks: { minRotation: 45, maxRotation: 45 } }
      }
    }
  }
 
  if (chartType === 'Pie') {
    config.data.labels = chartData.map(i => `${i.Name} - Course ${i.Course}`)
    config.data.datasets = [{
      data: chartData.map(i => i.Total),
      backgroundColor: chartData.map(i =>
        i.Course === '2200' ? 'rgba(0,109,72,0.7)' : 'rgba(75,192,192,0.7)'
      )
    }]
    config.options.plugins.tooltip.callbacks.label = ctx => {
      const pct = ((ctx.raw / grandTotal) * 100).toFixed(1)
      return `${ctx.label}: ${ctx.raw} students (${pct}% of total)`
    }
  } else if (chartType === 'Line') {
    datasets.forEach(d => { d.fill = false; d.tension = 0.4 })
  } else if (chartType === 'Combined bar and line') {
    config.type = 'bar'
    config.data.datasets = [
      ...datasets,
      ...datasets.map(d => ({ ...d, type: 'line', borderWidth: 2, fill: false, tension: 0.4, order: 1 }))
    ]
  }
 
  return config
}
 
function buildCombinedCourseConfig(chartData, chartType, selectedCategories, isGenderMode, metricType) {
  const combinedData = {}
 
  chartData.forEach(item => {
    const key = `${item.Name}-2200/3200`
    if (!combinedData[key]) {
      combinedData[key] = { total2200: 0, total3200: 0, data2200: {}, data3200: {} }
    }
    const d = combinedData[key]
    const courseKey = item.Course === '2200' ? 'data2200' : 'data3200'
    const totalKey = item.Course === '2200' ? 'total2200' : 'total3200'
 
    d[totalKey] += item.Total
    selectedCategories.forEach(cat => {
      d[courseKey][cat] = (d[courseKey][cat] || 0) + (item[cat] || 0)
    })
  })
 
  const xValues = Object.keys(combinedData)
  const isPercentage = metricType === 'Percentages'
 
  const config = {
    type: chartType === 'Bar' ? 'bar' : chartType.toLowerCase(),
    data: {
      labels: xValues,
      datasets: selectedCategories.map(cat => ({
        label: cat,
        data: xValues.map(key => {
          const d = combinedData[key]
          const val = (d.data2200[cat] || 0) + (d.data3200[cat] || 0)
          const total = d.total2200 + d.total3200
          return isPercentage ? (val / total) * 100 : val
        }),
        backgroundColor: getColor(cat, isGenderMode),
        borderColor: getColor(cat, isGenderMode),
        fill: false,
        tension: chartType === 'Line' ? 0.4 : undefined
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Total Students per Semester by Demographics (2200 and 3200)' },
        tooltip: {
          callbacks: {
            label: ctx => {
              const key = xValues[ctx.dataIndex]
              const d = combinedData[key]
              const val = (d.data2200[ctx.dataset.label] || 0) + (d.data3200[ctx.dataset.label] || 0)
              const total = d.total2200 + d.total3200
              const pct = ((val / total) * 100).toFixed(1)
              return isPercentage
                ? `${ctx.dataset.label}: ${val} students (${pct}%)`
                : `${ctx.dataset.label}: ${val} students (${pct}%)`
            }
          }
        },
        datalabels: {
          display: ctx => ctx.dataset.data[ctx.dataIndex] > 10,
          color: 'black',
          anchor: 'end',
          align: 'top',
          formatter: v => v.toFixed(2)
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: isPercentage ? 100 : undefined,
          title: { display: true, text: isPercentage ? 'Percentage of Students' : 'Number of Students' }
        },
        x: { title: { display: true, text: 'Semester-Course' }, ticks: { minRotation: 45, maxRotation: 45 } }
      }
    }
  }
 
  return config
}
 
function buildDemographicConfig(chartData, chartType, selectedCategories, isGenderMode, metricType) {
  const isPercentage = metricType === 'Percentages'
  const xValues = chartData.map(i => `${i.Name}-${i.Course}`)
 
  const config = {
    type: chartType === 'Bar' ? 'bar' : chartType.toLowerCase(),
    data: {
      labels: xValues,
      datasets: selectedCategories.map(cat => ({
        label: cat,
        data: chartData.map(item =>
          isPercentage ? (item[cat] / item.Total) * 100 : item[cat]
        ),
        backgroundColor: getColor(cat, isGenderMode),
        borderColor: getColor(cat, isGenderMode),
        fill: false,
        tension: chartType === 'Line' ? 0.4 : undefined
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: `Demographic Data by ${isGenderMode ? 'Gender' : 'Ethnicity'}` },
        legend: { display: true, position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => {
              const value = ctx.raw
              const total = chartData[ctx.dataIndex]?.Total ?? 1
              const rawVal = isPercentage ? Math.round((value / 100) * total) : Math.round(value)
              const pct = isPercentage
                ? `${value.toFixed(1)}%`
                : `${((value / total) * 100).toFixed(1)}%`
              return `${ctx.dataset.label}: ${rawVal} students (${pct})`
            }
          }
        },
        datalabels: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: isPercentage ? 100 : undefined,
          title: { display: true, text: isPercentage ? 'Percentage of Students' : 'Number of Students' }
        },
        x: { title: { display: true, text: 'Year-Semester-Course' }, ticks: { minRotation: 45, maxRotation: 45 } }
      }
    }
  }
 
  if (chartType === 'Pie') {
    const pieData = selectedCategories.map(cat =>
      chartData.reduce((sum, item) => sum + (item[cat] || 0), 0)
    )
    const total = pieData.reduce((s, v) => s + v, 0)
 
    config.data.labels = selectedCategories
    config.data.datasets = [{
      data: pieData,
      backgroundColor: selectedCategories.map(cat => getColor(cat, isGenderMode)),
      hoverOffset: 4
    }]
    config.options.plugins.tooltip.callbacks.label = ctx => {
      const pct = ((ctx.raw / total) * 100).toFixed(1)
      return `${ctx.label}: ${ctx.raw} students (${pct}% of total)`
    }
  }
 
  return config
}
 
// ── Composable ────────────────────────────────────────────────────────────────
export function useChart() {
  const chart = shallowRef(null)
 
  function destroyChart() {
    if (chart.value) {
      chart.value.destroy()
      chart.value = null
    }
  }
 
  function plotChart(canvasEl, { chartData, chartType, selectedEthnicities, selectedGenders, selectedCourses, metricType }) {
    destroyChart()
 
    if (!chartData.length || !chartType) return
 
    const isGenderMode = selectedGenders?.length > 0
    const selectedCategories = isGenderMode ? selectedGenders : selectedEthnicities
    const isTotalView = !selectedGenders?.length && !selectedEthnicities?.length
    const isBothCourses = selectedCourses.includes('2200') && selectedCourses.includes('3200')
 
    let config
 
    if (isTotalView) {
      config = buildTotalConfig(chartData, chartType)
    } else if (isBothCourses) {
      config = buildCombinedCourseConfig(chartData, chartType, selectedCategories, isGenderMode, metricType)
    } else {
      config = buildDemographicConfig(chartData, chartType, selectedCategories, isGenderMode, metricType)
    }
 
    const ctx = canvasEl.getContext('2d')
    chart.value = new Chart(ctx, config)
  }
 
  function cleanup() {
    destroyChart()
  }
 
  return { chart, plotChart, destroyChart, cleanup }
}