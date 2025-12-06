<template>
  <div class="min-h-screen items-center justify-center flex bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-2xl p-15">
      <h1 class="mb-4 text-black font-semibold">Login</h1>

      <!---->
      
      <!-- login  -->
       <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-black mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="JackSparrow@potc.edu"
            class="w-full p-5 rounded border border-gray-300 text-black"
          />
        </div>

      <!-- password  -->
        <div>
          <label class="block text-black mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="enter your password"
            class="w-full p-5 rounded border border-gray-300 text-black"
          />
        </div>
      
        <p v-if="error" class="text-red">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full max-w-md p-2 rounded bg-green text-black"
        >
           <span v-if="loading">Signing in...</span>
           <span v-else>Sign in</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
//import type { Login } from '@prisma/client';

useHead({ title: 'Login' });

const router = useRouter();
const form = reactive({ email: '', password: '' });

const loading = ref(false);
const error = ref('');

const handleSubmit = async () => 
{
  if (form.email === 'epics@utd.edu' && form.password === 'epicsrocks') 
  {
    localStorage.setItem('isLoggedIn', 'true');
    router.push('/projects');
  } 
  else 
  {
    // preserve the original behavior
    alert('Invalid username or password');
  }
};
</script>
<style scoped>
  input:disabled,
  button:disabled 
  {
    cursor: not-allowed;
  }
</style>