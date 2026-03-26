// Global route guard — runs on every client-side navigation.
// Protected pages redirect unauthenticated users to /login.

const PUBLIC_PAGES = ['/login', '/login/sent'];

export default defineNuxtRouteMiddleware(async (to) => {
  // Always allow public pages through
  if (PUBLIC_PAGES.some(p => to.path.startsWith(p))) return;

  // Skip on the server side (the server middleware handles API protection;
  // page auth is a client-side concern here)
  if (import.meta.server) return;

  try {
    const data = await $fetch<{ authenticated: boolean }>('/api/auth/session');
    if (!data.authenticated) {
      return navigateTo('/login');
    }
  } catch {
    return navigateTo('/login');
  }
});
