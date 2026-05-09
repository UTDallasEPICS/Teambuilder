<template lang="pug">
div(style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--color-utd-orange); padding: 2rem;")
  
  //- Logo
  div(style="display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem;")
    div(style="width: 120px; height: 120px; border-radius: 50%; background: white; border: 4px solid rgba(255,255,255,0.6); display: flex; align-items: center; justify-content: center; overflow: hidden;")
      img(src="/logo.png" alt="EPICS Logo" style="width: 90px; height: 90px; object-fit: contain;")
    p(style="margin-top: 1rem; color: white; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.2em;") TEAMBUILDER

  //- Card
  div(style="background: white; padding: 2.5rem; border-radius: 1rem; width: 100%; max-width: 460px;")
    
    div(v-if="pending" style="margin-bottom: 1.5rem; padding: 1rem; background: #fefce8; border: 1px solid #fde68a; border-radius: 8px;")
      p(style="color: #713f12; font-size: 0.875rem; text-align: center;")
        | Your account is pending approval from an admin.
        | You'll be able to sign in once you've been whitelisted.

    div(v-if="removed" style="margin-bottom: 1.5rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;")
      p(style="color: #7f1d1d; font-size: 0.875rem; text-align: center;")
        | Your account has been removed. Please contact an admin.

    div(v-if="!sent")
      h1(style="font-size: 1.75rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem;") Sign In
      p(style="color: #666; font-size: 0.9rem; margin-bottom: 1.5rem;") Enter your UTD email address to receive a one-time login link.

      div(style="margin-bottom: 1rem;")
        label(style="display: block; font-size: 0.875rem; font-weight: 500; color: #333; margin-bottom: 0.4rem;") UTD Email Address
        input(
          v-model="email"
          type="email"
          placeholder="netid@utdallas.edu"
          style="width: 100%; padding: 0.65rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; color: #1a1a1a; font-size: 0.95rem; box-sizing: border-box; outline: none;"
          @keyup.enter="sendLink"
        )

      div(v-if="error" style="margin-bottom: 1rem; padding: 0.75rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;")
        p(style="color: #7f1d1d; font-size: 0.875rem;") {{ error }}

      button(
        @click="sendLink"
        :disabled="loading"
        style="width: 100%; padding: 0.75rem 1rem; background: var(--color-utd-orange); color: white; font-weight: 700; font-size: 1rem; border-radius: 0.5rem; border: none; cursor: pointer;"
      )
        span(v-if="loading") Sending...
        span(v-else) Send Login Link

    div(v-else style="text-align: center;")
      h1(style="font-size: 1.75rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem;") Check your inbox
      p(style="color: #666; font-size: 0.9rem; margin-bottom: 1.5rem;")
        | Magic link sent to
        strong  {{ email }}
        | . Click the link to sign in.
      button(
        @click="sent = false"
        style="font-size: 0.875rem; color: #666; background: none; border: none; cursor: pointer; text-decoration: underline;"
      ) Try a different email

  //- Footer
  p(style="margin-top: 1.5rem; color: rgba(255,255,255,0.7); font-size: 0.8rem;") Access is restricted to authorized UTD personnel only.
</template>