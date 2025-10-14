<template>
<div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-beige rounded-2xl p-6 shadow-md">
      <h1 class="text-3xl font-semibold mb-4 text-teal">Login</h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm text-teal mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="you@school.edu"
            class="w-full p-2 rounded border border-gray-300"
          />
        </div>

        <div>
          <label class="block text-sm text-teal mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full p-2 rounded border border-gray-300"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full p-2 rounded bg-teal text-beige disabled:opacity-60"
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
