<template lang="pug">
// TODO: this needs to be redone in tailwind
div
  button(style={marginLeft: '20px', marginTop: '50px'} class='border-solid border-8 p-1 border-transparent rounded-xl bg-[rgba(96,241,135,0.9)] text-xl' @click="handleClick")
    | Student List Upload
  input(type="file" @change="handleChange" ref="hiddenFileInput" style={display: 'none'})
</template>

<script setup lang="ts">
import { ref } from 'vue';

const hiddenFileInput = ref<HTMLInputElement | null>(null);

const handleClick = () => {
  hiddenFileInput.value?.click();
};

const handleChange = (event: Event) => {
  const fileUploaded = (event.target as HTMLInputElement).files?.[0];
  handleFile(fileUploaded!);
};

const handleFile = (file: File | null) => {
  // handle the file
  
};
</script>

<style scoped>
.border-solid {}
</style>
