<template lang="pug">
div(style="min-height: 100vh; display: flex; align-items: center; justify-content: center; blackbackground: var(--color-utd-orange);")
  div(style="background: #f5f5dc; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%; max-width: 420px;")
    div(style="display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem;")
      img(src="/logo.png" alt="EPICS Logo" style="height: 64px; margin-bottom: 1rem;")
      h1(style="font-size: 1.5rem; font-weight: bold; color: #0f4c2a;") EPICS Teambuilder
      p(style="color: #0f4c2a; font-size: 0.875rem; margin-top: 0.25rem;") Sign in with your UTD email

    div(v-if="pending" style="margin-bottom: 1.5rem; padding: 1rem; background: #fefce8; border: 1px solid #fde68a; border-radius: 8px;")
      p(style="color: #0f4c2a; font-size: 0.875rem; text-align: center;")
        | Your account is pending approval from an admin.
        | You'll be able to sign in once you've been whitelisted.

    div(v-if="removed" style="margin-bottom: 1.5rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;")
      p(style="color: #0f4c2a; font-size: 0.875rem; text-align: center;")
        | Your account has been removed. Please contact an admin.

    div(v-if="!sent")
      div(style="margin-bottom: 1rem;")
        label(style="display: block; font-size: 0.875rem; font-weight: 500; color: #0f4c2a; margin-bottom: 0.25rem;") UTD Email
        input(
          v-model="email"
          type="email"
          placeholder="netid@utdallas.edu"
          style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 8px; color: #0f4c2a; box-sizing: border-box;"
          @keyup.enter="sendLink"
        )
      div(v-if="error" style="margin-bottom: 1rem; padding: 0.75rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;")
        p(style="color: #0f4c2a; font-size: 0.875rem;") {{ error }}
      button(
        @click="sendLink"
        :disabled="loading"
        style="width: 100%; padding: 0.5rem 1rem; background: var(--color-utd-orange); color: white; font-weight: 600; border-radius: 8px; border: none; cursor: pointer;"
      )
        span(v-if="loading") Sending...
        span(v-else) Send Magic Link

    div(v-else style="text-align: center;")
      div(style="margin-bottom: 1rem; padding: 1rem; blackbackground: var(--color-utd-orange); border: 1px solid #e5e7eb; border-radius: 8px;")
        p(style="color: #0f4c2a; font-size: 0.875rem;")
          | Magic link sent! Check your inbox at 
          strong {{ email }}
          |  and click the link to sign in.
      button(
        @click="sent = false"
        style="font-size: 0.875rem; color: #0f4c2a; background: none; border: none; cursor: pointer; text-decoration: underline;"
      ) Try a different email
</template>

<script setup lang="ts">
const route = useRoute();
const pending = computed(() => route.query.pending === "true");
const removed = computed(() => route.query.removed === "true");

const email = ref("");
const loading = ref(false);
const sent = ref(false);
const error = ref("");

const sendLink = async () => {
  error.value = "";

  if (!email.value.endsWith("@utdallas.edu")) {
    error.value = "Please use your UTD email address (@utdallas.edu).";
    return;
  }

  loading.value = true;
  try {
    await $fetch("/api/auth/sign-in/magic-link", {
      method: "POST",
      credentials: "include",
      body: { 
        email: email.value,
        callbackURL: "/projects",
      },
    });
    sent.value = true;
  } catch (e: any) {
    error.value = e?.data?.message || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>