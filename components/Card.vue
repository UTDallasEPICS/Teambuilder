<template lang="pug">
.mt-3.ml-6.mb-3.rounded-md(
  class="bg-[rgb(233,235,238)]" 
  style="width: 550px; minHeight: 100px;"
  )
  .flex
    p.mt-4.ml-2.font-bold(style="color: #76A5C0") Student Name
    .isNew(style="justifyContent:center; marginTop:17px; marginLeft:12px; borderRadius:3px")
      p(style="alignItems:center; marginLeft:2px; marginBottom:8px") NEW
  .flex.flex-col(style="marginLeft:8px; color:#76A5C0")
    p(style="marginTop:8px") NET ID: abc123456
</template>

<script setup lang="ts">
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

</script>

<style scoped>
.isNew {
  background: hsl(136, 84%, 66%);
  height: 20px;
  width: 40px;
}
</style>