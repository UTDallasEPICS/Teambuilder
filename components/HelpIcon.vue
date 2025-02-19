<template lang="pug">
button.flex.items-center.justify-center.size-6.rounded-full.border-2.border-beige.relative(@click="toggleHelp")
  span ?

  div.absolute.top-10.p-4.-right-40.rounded-lg.bg-blue-400.border-2.border-beige.shadow-lg.z-10(class="w-[10vw]" v-if="showHelp" @click="toggleHelp")
    div.text-lg.mb-1 {{ info }}

</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ info: string }>();

const showHelp = ref(false);

const toggleHelp = () => {
  showHelp.value = !showHelp.value;
};
</script>