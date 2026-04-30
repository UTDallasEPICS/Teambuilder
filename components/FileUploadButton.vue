<template lang="pug">
div.file-upload-trigger
  ClickableButton(:title="title" type="success" @click="handleClick")
  input(type="file" accept=".csv,.xlsx,.xls" @change="handleFile" ref="fileInput" style={display: 'none'})
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

defineProps<{ title: string }>();
const fileInput = ref<any>(null);
const emit = defineEmits(['dataParsed']);

const handleClick = () => {
  fileInput.value?.click();
};

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

const normalizeHeader = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');

const scoreHeaders = (headers: string[]) => {
  let score = 0;
  if (headers.includes('ssoid')) score += 6;
  if (headers.includes('studentemail')) score += 4;
  if (headers.includes('netid')) score += 6;
  if (headers.includes('firstname')) score += 2;
  if (headers.includes('lastname')) score += 2;
  if (headers.includes('name')) score += 1;
  if (headers.includes('description')) score += 1;
  if (headers.includes('partnername')) score += 1;
  if (headers.some((h) => h.startsWith('choice'))) score += 4;
  return score;
};

const findHeaderRowIndex = (rows: unknown[][]) => {
  const maxRowsToScan = Math.min(rows.length, 25);
  let bestIndex = 0;
  let bestScore = -1;

  for (let index = 0; index < maxRowsToScan; index++) {
    const row = rows[index] ?? [];
    const headers = row.map(normalizeHeader).filter(Boolean);
    if (headers.length === 0) continue;

    const score = scoreHeaders(headers);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  return bestScore > 0 ? bestIndex : 0;
};

const parseWorkbook = async (file: File) => {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  if (!workbook.SheetNames.length) {
    emit('dataParsed', []);
    return;
  }

  let bestSheetName = workbook.SheetNames[0];
  let bestHeaderRowIndex = 0;
  let bestScore = -1;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: '',
      raw: false,
      blankrows: false,
    });

    const headerRowIndex = findHeaderRowIndex(matrix);
    const headerValues = (matrix[headerRowIndex] ?? []).map(normalizeHeader).filter(Boolean);
    const score = scoreHeaders(headerValues);

    if (score > bestScore) {
      bestScore = score;
      bestSheetName = sheetName;
      bestHeaderRowIndex = headerRowIndex;
    }
  }

  const bestSheet = workbook.Sheets[bestSheetName];
  const parsed = XLSX.utils.sheet_to_json<Record<string, any>>(bestSheet, {
    range: bestHeaderRowIndex,
    defval: '',
    raw: false,
  }).map((row) => sanitizeRow(row));

  emit('dataParsed', parsed);
  console.log(`Parsed Excel Data (${bestSheetName}):`, parsed);
};

const parseCsv = (file: File) => {
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
      const parsed = results.data.map((r: any) => sanitizeRow(r));
      emit('dataParsed', parsed);
      console.log('Parsed CSV Data:', parsed);
    },
    error: (error) => {
      console.error('Error parsing CSV:', error);
    }
  });
};

const handleFile = async (event: Event) => {
  // Use a safe any cast because DOM lib types like HTMLInputElement may not be available
  const target = event.target as any;
  const file = target?.files?.[0];

  if (file) {
    const lowerName = String(file.name ?? '').toLowerCase();
    if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
      try {
        await parseWorkbook(file);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
      }
      return;
    }

    parseCsv(file);
  }
};
</script>

<style scoped>
.file-upload-trigger {
  width: 100%;
  height: 100%;
  display: flex;
}

.file-upload-trigger :deep(button.edge) {
  width: 100%;
  height: 100%;
}
</style>