<template lang="pug">
</template>

<script setup lang="ts">
const { refresh, data: session } = await useFetch('/api/auth/get-session')
await refresh()
if (!session.value) {
  await navigateTo('/login')
} else {
  await navigateTo('/projects')
}
</script>