<template lang="pug">
  .overlay(v-if="selectedPartner" @click="closeModal")
  .centered-row.shaded-card.p-10.m-10.h-full
    .centered-col.relative.h-full.gap-4
      .flex.absolute.top-0.left-0.gap-2
        FileUploadButton(title="Upload Partners" @fileSelected="handleParsed")
        HelpIcon(:info="helpInfo")

      .text-7xl.embossed.drop-shadow-md Partners
      .text-2xl.mt-2 Partner count: {{ partnerCount }}
      
      DataTable.teal-card.px-10.mt-5(
        :value="partners" 
        v-model:filters="filters"
        scrollable 
        scrollHeight="80vh"
        class="h-[80vh]"
        tableStyle="min-width: 50rem;"
        dataKey="id" 
        filterDisplay="row"
        selectionMode="single"
        v-model:selection="selectedPartner"
      )

        Column(field="name" header="Name" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name")

        Column(field="contactName" header="Contact Name" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by contact name")

        Column(field="contactEmail" header="Contact Email" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by contact email")

        Column(field="projectName" header="Projects" :showFilterMenu="false")
          template(#filter="{ filterModel, filterCallback }")
            InputText.text-black(v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by project")

  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { FilterMatchMode } from '@primevue/core/api';
  import type { Partner } from '@prisma/client';
  
  useHead({ title: 'Partners' });
  
  const partners = ref<Partner[]>([]);
  const partnerCount = ref(0);
  
  onMounted(async () => {
    partners.value = await $fetch<Partner[]>("api/partners");
    partnerCount.value = partners.value.length;
  });
  
  const handleParsed = (uploadedPartners: Partner[]) => {
    partners.value.push(...uploadedPartners);
    partnerCount.value = partners.value.length;
  };
  
  const selectedPartner = ref<Partner | null>(null);
  const editedPartner = ref<Partner | null>(null);
  const isEditing = ref(false);
  
  const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    contactName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    contactEmail: { value: null, matchMode: FilterMatchMode.CONTAINS },
    projectName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  
  const closeModal = () => {
    selectedPartner.value = null;
    isEditing.value = false;
  };
  
  const handleEdit = () => {
    if (!selectedPartner.value) return;
    isEditing.value = true;
    editedPartner.value = { ...selectedPartner.value };
  };
  
  const handleSave = async () => {
    if (selectedPartner.value && editedPartner.value && JSON.stringify(editedPartner.value) !== JSON.stringify(selectedPartner.value)) {
      const id = editedPartner.value.id;
      await $fetch(`api/partners/${id}`, {
        method: 'PUT',
        body: editedPartner.value
      });
      const index = partners.value.findIndex(p => p.id === id);
      partners.value[index] = editedPartner.value;
      selectedPartner.value = editedPartner.value;
    }
    isEditing.value = false;
  };
  
  const helpInfo = `Upload partner contact and organization information here.`;
  </script>
  
  <style scoped>
  .overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 98;
  }
  </style>
  