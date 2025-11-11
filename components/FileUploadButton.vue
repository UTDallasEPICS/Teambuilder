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
        // Sanitize parsed rows to avoid dangerous keys that shadow Object.prototype methods
        // (e.g. a CSV header named "hasOwnProperty" would create an own property that is
        // not a function and break Pinia/SSR hydration checks).
        const sanitizeRow = (row: Record<string, any>) => {
          const reserved = ['hasOwnProperty', '__proto__', 'constructor'];
          const out: Record<string, any> = {};
          for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(row, key)) {
              if (reserved.includes(key)) {
                // rename reserved keys to avoid collisions
                out[`_${key}`] = row[key];
              }
              else {
                out[key] = row[key];
              }
            }
          }
          return out;
        };

        const parsed = results.data.map((r: any) => sanitizeRow(r));
        emit('dataParsed', parsed);
        console.log('Parsed CSV Data:', parsed);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  }
};
</script>