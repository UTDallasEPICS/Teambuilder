<template lang="pug">
button.edge.rounded-xl.cursor-pointer.text-beige.max-w-full.shrink(:class="edgeClass")
  .front.rounded-xl.embossed.whitespace-nowrap(:class="frontClass") {{ title }}
</template>
    
<script setup lang="ts">
const props = defineProps<{ 
  title: string
  type?: 'success' | 'warning' | 'danger';
}>();

const type = props.type || 'default';
const edgeClass = type + 'Edge';
const frontClass = type + 'Front';
</script>

<style>
.edge {
  outline-offset: 4px;
}
.front {
  display: block;
  transform: translateY(-5px);
  text-shadow: 1px 1px 1px #0000008b;
  font-size: clamp(0.75rem, 2.2vw, 1.25rem);
  line-height: 1.2;
  padding: clamp(0.25rem, 1vw, 0.75rem) clamp(0.5rem, 1.6vw, 1.5rem);
}
.defaultEdge {
  background: #c2795d;
}
.defaultFront {
  background: #ffa07a;
}
.warningEdge {
  background: #af5252;
}
.warningFront {
  background: #eb6464;
}
.successEdge {
  background: #003500 !important;
}
.successFront {
  background: #004500 !important;
  color: #ffffff !important;
}
.dangerEdge {
  background: #7a2e2e !important;
}
.dangerFront {
  background: #a94b4b !important;
  color: #ffffff !important;
}
.edge:active .front {
  transform: translateY(-2px);
}
</style>

