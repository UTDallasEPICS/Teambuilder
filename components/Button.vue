<template lang="pug">
button.edge.rounded-xl.cursor-pointer
  span.front.px-6.py-3.text-xl.rounded-xl {{ title }}
</template>
    
<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<style>
.edge {
  background: #c2795d;
  outline-offset: 4px;
}
.front {
  display: block;
  background: #FFA07A;
  transform: translateY(-5px);
}

.edge:active .front {
  transform: translateY(-2px);
}
</style>

