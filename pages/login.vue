<template lang="pug">
div.flex.flex-col.items-center.justify-center(style="background-color: #D4610C; min-height: 100vh; width: 100%;")
  
  img.rounded-full.mb-4.border-4(src="/logo.png" style="border-color: #f0a05a; background-color: #f5f0e8; width: 160px; height: 160px; object-fit: contain; padding: 12px;")
  
  p.text-white.tracking-widest.text-lg.font-semibold.mb-8(style="letter-spacing: 0.3em;") TEAMBUILDER

  div.bg-white.rounded-2xl.shadow-xl.p-10.w-full(style="max-width: 680px;")
    h1.text-4xl.font-light.mb-2(style="color: #000000;") Sign In
    p.mb-6(style="color: #000000;") Enter your UTD email address to receive a one-time login link.

    div(v-if="!sent")
      label.block.font-medium.mb-2(style="color: #000000;") UTD Email Address
      input.w-full.border.border-gray-300.rounded-lg.px-4.py-3.mb-4.text-lg(
        v-model="email"
        type="email"
        placeholder="netid@utdallas.edu"
        @keyup.enter="sendLink"
      )
      p.text-sm.mb-3(v-if="error" style="color: #000000;") {{ error }}
      button.w-full.text-white.rounded-lg.px-4.py-4.text-lg.font-medium(
        @click="sendLink"
        :disabled="loading"
        style="background-color: #D4610C;"
      ) {{ loading ? 'Sending...' : 'Send Login Link' }}

    div(v-else)
      p.text-lg(style="color: #15803d;") ✓ Check your UTD email for a sign-in link!
      p.text-sm.mt-2(style="color: #000000;") (It expires in 15 minutes)

  p.text-white.mt-8.text-sm Access is restricted to authorized UTD personnel only.
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