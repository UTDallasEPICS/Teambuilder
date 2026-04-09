<template lang="pug">
div.flex.min-h-screen.items-center.justify-center
  div.w-full.max-w-sm.p-8.bg-white.rounded-xl.shadow
    h1.text-2xl.font-bold.mb-2 EPICS Teambuilder
    p.text-sm.text-gray-500.mb-6 Enter your UTD email and we'll send you a sign-in link.
    
    div(v-if="!sent")
      input.w-full.border.rounded.px-3.py-2.mb-4(
        v-model="email"
        type="email"
        placeholder="netid@utdallas.edu"
        @keyup.enter="sendLink"
      )
      p.text-red-500.text-sm.mb-3(v-if="error") {{ error }}
      button.w-full.bg-teal-600.text-white.rounded.px-4.py-2(@click="sendLink" :disabled="loading")
        | {{ loading ? 'Sending...' : 'Send sign-in link' }}
    
    div(v-else)
      p.text-green-700 ✓ Check your UTD email for a sign-in link!
      p.text-sm.text-gray-400.mt-2 (It expires in 15 minutes)
</template>

<script setup lang="ts">
const email = ref("")
const sent = ref(false)
const loading = ref(false)
const error = ref("")

async function sendLink() {
  if (!email.value.endsWith("@utdallas.edu")) {
    error.value = "Must be a @utdallas.edu email."
    return
  }
  loading.value = true
  error.value = ""
  try {
    await $fetch("/api/auth/sign-in/magic-link", {
      method: "POST",
      body: { email: email.value },
    })
    sent.value = true
  } catch (e: any) {
    error.value = e?.data?.message ?? "Something went wrong."
  } finally {
    loading.value = false
  }
}
</script>