<template lang="pug">
</template>

<script setup lang="ts">
const { data: session } = await useFetch('/api/auth/get-session')
if (!session.value) {
  await navigateTo('/login')
} else {
  await navigateTo('/projects')
}
</script>