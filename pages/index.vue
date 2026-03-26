<template lang="pug">
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter();

// Check if the user has a valid session before sending them anywhere
const { data } = await useFetch('/api/auth/session');

if (data.value?.authenticated) {
  router.push('/projects');
} else {
  router.push('/login');
}
</script>
