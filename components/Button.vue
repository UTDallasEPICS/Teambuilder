<template lang="pug">
button.edge.rounded-xl.cursor-pointer.text-beige(:class="edgeClass")
  .front.px-6.py-3.text-2xl.rounded-xl.embossed(:class="frontClass") {{ title }}
</template>
    
<script setup lang="ts">
const props = defineProps<{ 
  title: string
  type?: 'success' | 'warning';
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
  background: #43944c;
}
.successFront {
  background: #77cf77;
}
.edge:active .front {
  transform: translateY(-2px);
}
</style>

