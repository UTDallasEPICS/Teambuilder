export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const { data: session } = await useFetch('/api/auth/get-session')
  if (!session.value) {
    return navigateTo('/login')
  }
})