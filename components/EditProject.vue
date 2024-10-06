<template lang="pug">
// TODO: this needs to be redone in tailwind
.modal-container
  .modal
    button.exit-btn(@click="closeModal") Exit
    form
      .project-inputs
        label(for="Project_name") 
        input(name="Project_name" v-model="formState.Project_name")
      .project-inputs
        // TODO: needs to be a selection from partners that are in the db
        label(for="Project_partner") Project Partner
        textarea(name="Project_partner" v-model="formState.Project_partner")
      .project-inputs
        label(for="CS_target_number") CS Target #
        textarea(name="CS_target_number" v-model="formState.CS_target_number")
      .project-inputs
        label(for="archive") Archived
        select(name="archive" v-model="formState.archive")
          option(value="Yes") Yes
          option(value="No") No
      .error(v-if="errors") Please include: {{ errors }}
      button.submit-btn(type="submit" @click="handleSubmit") Submit
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
const defaultValue = {
  Project_name: '',
  Project_partner: '',
  CS_target_number: 0,
  archive: 'No',
};

const closeModal = () => {
  // close modal logic here
};

const onSubmit = (projectData: any) => {
  // submit logic here
};

const formState = ref(defaultValue);
const errors = ref('');

const validateForm = () => {
  if (
    formState.value.Project_name &&
    formState.value.Project_partner &&
    formState.value.CS_target_number &&
    formState.value.archive
  ) {
    errors.value = '';
    return true;
  } else {
    const errorFields: string[] = [];
    for (const [key, value] of Object.entries(formState.value)) {
      if (!value) {
        errorFields.push(key);
      }
    }
    errors.value = errorFields.join(', ');
    return false;
  }
};

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  formState.value = {
    ...formState.value,
    [target.name]: target.value,
  };
};
const handleSubmit = (e: Event) => {
  e.preventDefault();

  if (!validateForm()) return;

  onSubmit(formState.value);

  closeModal();
};
</script>

<style scoped>
.modal-container {
  position: auto;

  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

}

.exit-btn {
  display: flex;
  flex-direction: row;
  color: red;
  background-color: gray;
  border: black;
  border-radius: 4px;
  padding: 4px;
}

.modal {
  border-radius: 5px;
  padding: 2rem;

  width: 100%;
  color: white;
}

.modal .submit-btn {
  display: block;
  margin: auto;
  margin-top: 1rem;
  border: none;
  background-color: aqua;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0px 5px 5px #ccc;
}

.project-inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.project-inputs input,
textarea,
select {
  border: 1px solid white;
  color: black;
  background-color: white;
  border-radius: 0.3rem;
  padding: 0.3rem;
  font-size: 1rem;
}

.project-inputs label {
  margin-bottom: 0.2rem;
}

.error {
  background-color: pink;
  color: red;
  padding: 0.5rem;
  border-radius: 0.3rem;
  margin-bottom: 1rem;
}
</style>
