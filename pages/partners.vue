<template lang="pug">
  .overlay(v-if="selectedPartner" @click="closeModal")
  .centered-row.shaded-card.p-5.m-10.min-h-screen
    .centered-col.relative.h-full.gap-4
      .flex.absolute.top-0.left-0.gap-2
        FileUploadButton(title="Upload Partners" @dataParsed="handleParsed")
        ClickableButton(title="Reset to Default Data" type="danger" @click="resetDatabase")
        HelpIcon(:info="helpInfo")

      .mt-20.project-title.embossed.drop-shadow-md Partners
      .text-2xl.mt-2 Partner count: {{ partnerCount }}
      
      DataTable.beige-card.overflow-hidden.px-10.mt-5(
        :value="partners"
        v-model:filters="filters"
        scrollable
        scrollHeight="80vh"
        class="h-[80vh] w-full mt-2 md:mt-5"
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

  .cardRows.relative.orange-card.p-15.modal(v-if="selectedPartner" class="w-[50vw]")
    XCircleIcon.absolute.top-5.right-5.size-8.cursor-pointer(@click="closeModal")
    
    div
      span.cardSubTitle Name:
      span.cardText
        template(v-if="!isEditing") {{ selectedPartner?.name }}
        input.editBox(v-else v-model="editedPartner.name")
    
    div
      span.cardSubTitle Contact Name:
      span.cardText
        template(v-if="!isEditing") {{ selectedPartner?.contactName }}
        input.editBox(v-else v-model="editedPartner.contactName")
    
    div
      span.cardSubTitle Contact Email:
      span.cardText
        template(v-if="!isEditing") {{ selectedPartner?.contactEmail }}
        input.editBox(v-else v-model="editedPartner.contactEmail")
    
    div
      span.cardSubTitle Projects:
      span.cardText {{ selectedPartner?.projectName || 'None' }}
    
    .flex-grow.flex.justify-end.items-end
      ClickableButton(v-if="!isEditing" title="Edit Partner" type="success" @click="handleEdit")
      ClickableButton(v-if="isEditing" title="Save Partner" type="success" @click="handleSave")

  </template>
  
  <script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import { FilterMatchMode } from '@primevue/core/api';
    import type { Partner } from '@prisma/client';
    import { useHead } from '@vueuse/head';
    import { XCircleIcon } from '@heroicons/vue/24/solid';
    
    useHead({ title: 'Partners' });
  
  const partners = ref<Partner[]>([]);
  const partnerCount = ref(0);
  
  onMounted(async () => {
    partners.value = await $fetch<Partner[]>("api/partners");
    partnerCount.value = partners.value.length;
  });
  
  const handleParsed = async (uploadedPartners: Partner[]) => {
    // Delete all existing partners first, then save new ones to database
    try {
      // Clear existing partners from database
      await $fetch('/api/partners', {
        method: 'DELETE'
      });
      
      // Save new partners to database
      await $fetch('/api/partners', {
        method: 'POST',
        body: uploadedPartners
      });
      
      // Refresh from database to get the saved data
      partners.value = await $fetch<Partner[]>('/api/partners');
      partnerCount.value = partners.value.length;
      console.log('Partners saved to database successfully!');
    } catch (error) {
      console.error('Error saving partners to database:', error);
    }
  };
  
  const resetDatabase = async () => {
    const confirmAvailable = typeof globalThis !== 'undefined' && typeof (globalThis as any).confirm === 'function';
    if (confirmAvailable) {
      if (!(globalThis as any).confirm('This will delete ALL data (students, partners, projects, teams) and restore the default generated data. Are you sure?')) {
        return;
      }
    }
    
    try {
      await $fetch('/api/database/reset', {
        method: 'POST'
      });
      
    // Refresh partners from database
          partners.value = await $fetch<Partner[]>('/api/partners');
          partnerCount.value = partners.value.length;
          console.log('Database reset to default data successfully!');
          (globalThis as any).alert('Database has been reset to default generated data.');
        } catch (error) {
      console.error('Error resetting database:', error);
      (globalThis as any).alert('Failed to reset database. Please check the console for details.');
    }
  };
  
  const handleClearAll = async () => {
    if (!(globalThis as any).confirm('Are you sure you want to delete all partners? This cannot be undone.')) {
      return;
    }
    
    try {
      await $fetch('/api/partners', {
        method: 'DELETE'
      });
      
      partners.value = [];
      partnerCount.value = 0;
      console.log('All partners deleted successfully!');
    } catch (error) {
      console.error('Error deleting partners:', error);
    }
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
  /* Projects-like styling for Partners page */
  .cardRows { display:flex; flex-direction:column; gap:1.25rem; }
  .cardTitle { text-shadow:1px 1px 1px rgba(0,0,0,0.55); font-size:3rem; filter:drop-shadow(0 1px 1px rgba(0,0,0,0.25)); }
  .cardSubTitle { text-shadow:1px 1px 1px rgba(0,0,0,0.55); font-size:1.5rem; margin-right:0.5rem; }
  .cardText { font-size:1.25rem; }

  .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 98; }
  .modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); z-index: 99; }
  .editBox { color: #14b8a6; border-radius: 0.375rem; background-color: #f5f5dc; padding: 0.25rem; }

  :deep(.p-datatable-wrapper) { overflow-x: auto !important; }

  @media (min-width: 768px) { :deep(.p-datatable-scrollable .p-datatable-table) { min-width: 50rem !important; } }
  @media (max-width: 767px) { :deep(.p-datatable-scrollable .p-datatable-table) { min-width: 20rem !important; } .project-title { font-size: 1.25rem; } }

  :deep(.p-datatable td) { white-space: normal; word-break: break-word; }

  .project-title { font-size: 2.25rem; font-weight:600; margin-bottom:0.5rem; margin:0 auto; display:inline-block; background:var(--color-utd-orange); color:#fff; padding:0.375rem 0.75rem; border-radius:0.5rem; }
  .pill { display:inline-flex; align-items:center; justify-content:center; padding:0.25rem 0.5rem; border-radius:9999px; font-size:0.875rem; background:rgba(0,0,0,0.06); min-width:5.5rem; white-space:nowrap; line-height:1; }

  .pill.bg-green { background: var(--color-pill-new) !important; color: #ffffff !important; }
  .pill.bg-orange { background: var(--color-pill-returning) !important; color: #ffffff !important; }
  .pill.bg-lightblue { background: var(--color-pill-complete) !important; color: #ffffff !important; }
  .pill.bg-gray { background: var(--color-pill-withdrawn) !important; color: #ffffff !important; }
  .pill.bg-red { background: var(--color-pill-hold) !important; color: #ffffff !important; }

  .centered-row.shaded-card { background: var(--color-utd-orange) !important; padding: 2rem !important; border-radius: 0.5rem; }
  .centered-row.shaded-card > .centered-col { background: var(--color-utd-orange) !important; border-radius: 0.75rem; padding: 1.25rem !important; box-shadow: 0 8px 20px rgba(16,24,40,0.06); width: 100%; }
  </style>
  