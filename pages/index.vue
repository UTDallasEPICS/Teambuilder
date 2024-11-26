<script setup lang="ts">
const data = ref({
  userName: '',
  password: '',
});

const handleSubmit = () => {
  if (data.value.userName == 'epics' && data.value.password == 'epicsrocks') {
    window.location.href = '/project';
  }
  else {
    alert('Invalid username or password');
  }
};


</script>

<template lang="pug">
div(class='container')
  div(class='inputgroup')
    label(for='username')  Username: 
    input(type="text" id="username" v-model="data.userName" required class = "mb-4")
  
  div(class='inputgroup')
    label(for='password')  Password: 
    input(class = "ml-1" type="password" id="password" v-model="data.password" required)
  button(type="submit" class="button mt-4" @click="handleSubmit") Login 
</template>

