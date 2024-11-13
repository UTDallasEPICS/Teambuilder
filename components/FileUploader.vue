<template lang="pug">

div
  MyButton(:title = "title" @click="handleClick")
  input(type="file" @change="handleChange" ref="hiddenFileInput" style={display: 'none'})
</template>

<script setup lang="ts">
import { ref , defineEmits, defineProps} from 'vue';
import MyButton from './Button.vue';


const props = defineProps<{ title: string }>();

const hiddenFileInput = ref<HTMLInputElement | null>(null);
const emit = defineEmits(['fileSelected']);

const handleClick = () => {
  hiddenFileInput.value?.click();
};

const handleChange = (event: Event) => {
  const fileUploaded = (event.target as HTMLInputElement).files?.[0];
  
  if(fileUploaded) {
    emit('fileSelected', fileUploaded);
  }
  
};


</script>

<style scoped>
.ml-5 { margin-left: 20px; }
.mt-12 { margin-top: 50px; }
</style>
