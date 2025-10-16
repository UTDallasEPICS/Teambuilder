<template lang="pug">
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter();
router.push('/login');
</script>

<!-- Disabling the Login page for now, leaving the original code hrer for later:

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const data = ref({
  userName: '',
  password: '',
});

const handleSubmit = () => {
  if (data.value.userName == 'epics' && data.value.password == 'epicsrocks') {
    localStorage.setItem('isLoggedIn', 'true')
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

-->