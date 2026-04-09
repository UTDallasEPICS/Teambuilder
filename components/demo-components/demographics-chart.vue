<template>
  <div class="chart-wrapper">
    <canvas ref="canvasRef" />
    <div v-if="isEmpty" class="empty-state">
      <p>Select filters and press <strong>Submit</strong> to visualise data.</p>
    </div>
  </div>
</template>
 
<script setup>
import { ref } from 'vue'
 
defineProps({
  isEmpty: { type: Boolean, default: true }
})
 
const canvasRef = ref(null)
 
defineExpose({ canvasRef })
</script>
 
<style scoped>
.chart-wrapper {
  position: relative;
  flex: 1;
  padding: 20px;
  height: 650px;
  margin: 5px;
  overflow: auto;
}
 
canvas {
  width: 100% !important;
  height: 100% !important;
}
 
.empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color:black;
  background-color: #C0C0C0;
  font-size: 15px;
  pointer-events: none;
  border-radius: 10px;
}
</style>