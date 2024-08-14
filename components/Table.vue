<template lang="pug">
// TODO: this needs to be redone in tailwind
.m-0.w-full(style="borderRadius: '10px'" class='bg-[rgba(48,100,162,0.29)]')
  table.table(style="padding: '10px', marginLeft: '15px', marginRight: '10px', display: 'block', overflow: 'hidden', tableLayout: 'auto', borderCollapse: 'collapse', whiteSpace: 'nowrap', maxWidth: '100%', margin: 'auto', overflowX: 'auto' ")
    thead(style="backgroundColor: 'rgb(136, 120, 120)', color: 'white', borderRadius: '10px'")
      tr
        th Project Name
        th.expand Project Partner
        th CS Target #
        th Archived
        th Actions
    tbody
      tr(v-for='(row, i) of rows' :key='i')
        td {{row.Project_name}}
        td.expand {{row.Project_partner}}
        td {{row.CS_target_number}}
        td
          span(class='label') {{row.archive}}
        td
          .actions
            bsfilltrashfill.delete-btn(@click='emit("delete", i)')
          bsfillpencilfill(@click='emit("edit",i)')
</template>

<script setup lang="ts">
const rows = ref([]);
const emit = defineEmits(["edit", "delete"]);
</script>

<style scoped>
.table th,
.table td {
  padding: 0.8rem;
}

.table td {
  border-top: 0.5px solid #ddd;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table tbody tr:hover {
  background-color: #ff0000;
}

.expand {
  width: 100%;
}

.label {
  border-radius: 3px;
  padding: 0.3rem;
  color: white;
}

.label-Yes {
  background-color: green;
}

.label-No {
  background-color: rgb(226, 45, 45);
}

.actions {
  display: flex;
  justify-content: space-around;
}

.actions svg {
  cursor: pointer;
}

.delete-btn {
  color: rgb(214, 13, 13);
}
</style>