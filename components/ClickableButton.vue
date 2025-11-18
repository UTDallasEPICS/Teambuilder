<template lang="pug">
button.edge.rounded-xl.cursor-pointer.text-beige(:class="edgeClass")
  .front.px-6.py-3.text-2xl.rounded-xl.embossed(:class="frontClass") {{ title }}
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
  background: #0f3f2c !important; /* stronger UTD darker edge */
}
.successFront {
  background: #154734 !important; /* UTD green (ensure exact color) */
  color: #ffffff !important; /* ensure white text despite inherited .text-beige */
}
.dangerEdge {
  background: #991B1B !important; /* darker red edge */
}
.dangerFront {
  background: #DC2626 !important; /* red for delete/danger actions */
  color: #ffffff !important; /* white text */
}
.edge:active .front {
  transform: translateY(-2px);
}
</style>

