<template lang="pug">
div
  ClickableButton(:title="title" @click="handleClick")
  input(type="file" @change="handleFile" ref="fileInput" style={display: 'none'})
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Papa from 'papaparse';

defineProps<{ title: string }>();
const fileInput = ref<HTMLInputElement | null>(null);
const emit = defineEmits(['dataParsed']);

const handleClick = () => {
  fileInput.value?.click();
};

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data;
        emit('dataParsed', parsed)
        console.log('Parsed CSV Data:', parsed);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  }
};
</script>