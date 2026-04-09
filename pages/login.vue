<template lang="pug">
div.min-h-screen.flex.flex-col.items-center.justify-center(style="background-color: #D4610C;")
  
  img.w-40.h-40.rounded-full.mb-4.border-4(src="/logo.png" style="border-color: #f0a05a;")
  
  p.text-white.tracking-widest.text-lg.font-semibold.mb-8(style="letter-spacing: 0.3em;") TEAMBUILDER

  div.bg-white.rounded-2xl.shadow-xl.p-10.w-full(style="max-width: 680px;")
    h1.text-4xl.font-light.mb-2 Sign In
    p.mb-6(style="color: #D4610C;") Enter your UTD email address to receive a one-time login link.

    div(v-if="!sent")
      label.block.text-gray-700.font-medium.mb-2 UTD Email Address
      input.w-full.border.border-gray-300.rounded-lg.px-4.py-3.mb-4.text-lg(
        v-model="email"
        type="email"
        placeholder="netid@utdallas.edu"
        @keyup.enter="sendLink"
      )
      p.text-red-500.text-sm.mb-3(v-if="error") {{ error }}
      button.w-full.text-white.rounded-lg.px-4.py-4.text-lg.font-medium(
        @click="sendLink"
        :disabled="loading"
        style="background-color: #D4610C;"
      ) {{ loading ? 'Sending...' : 'Send Login Link' }}

    div(v-else)
      p.text-green-700.text-lg ✓ Check your UTD email for a sign-in link!
      p.text-sm.text-gray-400.mt-2 (It expires in 15 minutes)

  p.text-white.mt-8.text-sm(style="opacity: 0.8;") Access is restricted to authorized UTD personnel only.
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