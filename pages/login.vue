<template>
  <div class="min-h-screen items-center justify-center flex bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-2xl p-6">
      <h1 class="mb-4 text-black font-semibold">Login</h1>

      <!---->

      <!-- login(gpt)  -->
        <div>
          <label class="block text-black mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="AlexQuigley@utd.edu"
            class="w-full p-2 rounded border border-gray-300 text-black"
          />
        </div>

      <!-- password(gpt)  -->
        <div>
          <label class="block text-black mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="enter your password"
            class="w-full p-2 rounded border border-gray-300 text-black"
          />
        </div>

        <p v-if="error" class="text-red">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full p-2 rounded bg-green text-black"
        >
          <span>Sign in</span>
        </button>
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

//gpt
const loading = ref(false);
const error = ref('');



</script>
<style scoped>
input:disabled,
button:disabled 
{
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
