<template lang="pug">
div
  div(bg-color='rgb(233,235,238)' class='mt-3 ml-6 mb-3 rounded-md' style='{ width: "300px", minHeight: "100px", display: "flex", flexDirection: "column" }')
    p(backgroundFont class='mt-2 ml-2 font-bold', style='{ color: "#76A5C0" }') {{ props.myString }}

    div(style='{ display: "flex", flexDirection: "column" }')
      div
        div.isNew(style='{ justifyContent: "center", marginTop: "5px", marginLeft: "8px", borderRadius: "5px" }')
          p(style='{ alignItems: "center", marginLeft: "6px", fontSize: "12px" }') NEW
        div.semester(style='{ justifyContent: "center", marginTop: "5px", marginLeft: "10px", borderRadius: "5px" }')
          p(style='{ alignItems: "center", marginLeft: "4px", fontSize: "12px" }') SP2024

      p(backgroundFont class='mt-3 ml-2 mb-3 rounded-md font-bold', style='{ color: "#76A5C0" }') Students:
      div(style='{ display: "inline-flex", marginBottom: "7px", flexWrap: "wrap" }')
        div.student(v-for='n in [1, 2, 3, 4]' :key='n' style='{ justifyContent: "center",  marginLeft: "8px", borderRadius: "5px", minWidth: "20px" }')
          p(style='{ alignItems: "center", marginLeft: "6px", marginRight: "6px", fontSize: "12px" }') JOHN S.
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  myString: String,
});
</script>

<style scoped>
/* background and font - reuseable for all pages*/
* {

  font-family: 'Jura', Arial, sans-serif;
  /* Ensure all text uses Jura */
}

.isNew {
  background: hsl(136, 84%, 66%);
  height: 8px;
}

.semester {
  background: hsl(300, 87%, 73%);
  height: 20px;
  width: 50px;
}

.student {
  background: hsl(41, 91%, 69%);
  height: 20px;
  min-width: 50px;
}
</style>
