import { ref } from 'vue'
import * as XLSX from 'xlsx'
 
export function useFileUpload() {
  const file = ref(null)
  const isSent = ref(false)
  const isUploading = ref(false)
  const uploadError = ref(null)
 
  // ── File selection ────────────────────────────────────────────────────────
  function onFileSelected(event) {
    const selected = event.target.files[0]
    if (selected) {
      resetUpload()
      file.value = selected
    }
  }
 
  function removeFile() {
    file.value = null
  }
 
  function resetUpload() {
    file.value = null
    isSent.value = false
    uploadError.value = null
  }
 
  // ── Excel parsing helpers ─────────────────────────────────────────────────
  function getColumnMajor(arr) {
    const transpose = []
    for (let c = 0; c < arr[0].length; c++) {
      const col = []
      for (let r = 0; r < arr.length; r++) {
        col.push(arr[r][c])
      }
      transpose.push(col)
    }
    return transpose
  }
 
  function extractCells(worksheet, range) {
    return XLSX.utils.sheet_to_json(worksheet, { header: 1, range })
  }
 
  function extractColumnMajor(worksheet, range) {
    return getColumnMajor(extractCells(worksheet, range))
  }
 
  function determineEndingColumn(worksheet, beginningAddress) {
    const addr = { ...beginningAddress }
    while (worksheet[XLSX.utils.encode_cell(addr)] !== undefined) {
      addr.c += 1
    }
    addr.c -= 2 // last real col is left of total col, which is left of first undefined
    return addr.c
  }
 
  function createSemestersFrom2DArray(arr, courseName) {
    const otherIndexOffset = ['2200', '2100'].includes(courseName) ? 1 : 0
 
    return arr.map(element => {
      const constructedYear = Number('20' + element[0].substring(0, 2))
 
      let otherAmount
      if (['2200', '2100'].includes(courseName)) {
        otherAmount = Number(element[5]) + Number(element[6]) + Number(element[7])
      } else {
        otherAmount = Number(element[5]) + Number(element[6])
      }
 
      let sem = 'Summer'
      const thirdChar = element[0][2]
      if (thirdChar === 'S') sem = 'Spring'
      else if (thirdChar === 'F') sem = 'Fall'
 
      return {
        Name: element[0],
        Course: courseName,
        Year: constructedYear,
        Sem: sem,
        African_American: Number(element[1]) || 0,
        Asian: Number(element[2]) || 0,
        Hispanic: Number(element[3]) || 0,
        International: Number(element[4]) || 0,
        Other: otherAmount || 0,
        White: Number(element[7 + otherIndexOffset]) || 0,
        Male: Number(element[8 + otherIndexOffset]) || 0,
        Female: Number(element[9 + otherIndexOffset]) || 0,
        Total: Number(element[10 + otherIndexOffset]) || 0
      }
    })
  }
 
  // ── Main upload handler ───────────────────────────────────────────────────
  async function sendExtractedData() {
    if (!file.value) return
    isUploading.value = true
    uploadError.value = null
 
    try {
      const workbook = XLSX.read(await file.value.arrayBuffer())
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
 
      const startCol = XLSX.utils.decode_col('L')
      const beginAddr = XLSX.utils.decode_cell('L34')
      const endCol = determineEndingColumn(worksheet, beginAddr)
 
      const range2200 = {
        s: { r: XLSX.utils.decode_row('34'), c: startCol },
        e: { r: XLSX.utils.decode_row('45'), c: endCol }
      }
      const range3200 = {
        s: { r: XLSX.utils.decode_row('47'), c: startCol },
        e: { r: XLSX.utils.decode_row('57'), c: endCol }
      }
      const range2100 = XLSX.utils.decode_range('C34:I45')
      const range3100 = XLSX.utils.decode_range('C47:I57')
 
      const json2200 = createSemestersFrom2DArray(extractColumnMajor(worksheet, range2200), '2200')
      const json3200 = createSemestersFrom2DArray(extractColumnMajor(worksheet, range3200), '3200')
      const json2100 = createSemestersFrom2DArray(extractColumnMajor(worksheet, range2100), '2200')
      const json3100 = createSemestersFrom2DArray(extractColumnMajor(worksheet, range3100), '3200')
 
      let semestersObject = [...json2100, ...json3100, ...json2200, ...json3200]
 
      // Handle current (ongoing) semester in the top-right table
      const topAddr = XLSX.utils.decode_cell('L5')
      const topEndCol = determineEndingColumn(worksheet, topAddr)
      if (topEndCol > endCol) {
        const curRange2200 = {
          s: { r: XLSX.utils.decode_row('5'), c: topEndCol },
          e: { r: XLSX.utils.decode_row('16'), c: topEndCol }
        }
        const curRange3200 = {
          s: { r: XLSX.utils.decode_row('18'), c: topEndCol },
          e: { r: XLSX.utils.decode_row('28'), c: topEndCol }
        }
        const curJson2200 = createSemestersFrom2DArray(extractColumnMajor(worksheet, curRange2200), '2200')
        const curJson3200 = createSemestersFrom2DArray(extractColumnMajor(worksheet, curRange3200), '3200')
        semestersObject = [...semestersObject, ...curJson2200, ...curJson3200]
      }
 
      await $fetch('/api/demographic', {
        method: 'POST',
        body: semestersObject
      })
 
      isSent.value = true
    } catch (err) {
      console.error('File upload failed:', err)
      uploadError.value = err.message ?? 'Upload failed'
    } finally {
      isUploading.value = false
    }
  }
 
  return {
    file,
    isSent,
    isUploading,
    uploadError,
    onFileSelected,
    removeFile,
    resetUpload,
    sendExtractedData
  }
}