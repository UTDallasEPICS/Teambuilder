<template lang="pug">
div
  ClickableButton(:title="title" type="success" @click="handleClick")
  input(type="file" @change="handleFile" ref="fileInput" style={display: 'none'})
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Papa from 'papaparse';

defineProps<{ title: string }>();
const fileInput = ref<any>(null);
const emit = defineEmits(['dataParsed']);

const handleClick = () => {
  fileInput.value?.click();
};

const handleFile = (event: Event) => {
  // Use a safe any cast because DOM lib types like HTMLInputElement may not be available
  const target = event.target as any;
  const file = target?.files?.[0];

  if (file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      /*transform: function(value, header){
        switch (header){
          case "id":{
            return value;
            break;
          }
          case "name":{
            return value;
           /*let fullName = value.split(',') 
            fullName[0] = fullName[0].trim(); //last name
            fullName[1] = fullName[1].trim(); //first name
            return fullName;
            break;
         }
          default: {return value;
            break;
         }
        }
      },*/
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