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
<style></style>
<template lang="pug">
div(class='container')
  div(class='inputgroup')
    label(for='username')  Username: 
    input(type="text" id="username" v-model="data.userName" required)
  div(class='inputgroup')
    label(for='password')  Password: 
    input(type="password" id="password" v-model="data.password" required)
  button(type="submit" class="button" @click="handleSubmit") Login 
</template>