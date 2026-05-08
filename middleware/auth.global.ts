import { useAuthState } from "~/composables/useAuthState";

export default defineNuxtRouteMiddleware(async (to: ReturnType<typeof useRoute>) => {
  if (to.path === "/login") return;
  if (to.path.startsWith("/api/auth")) return;

  const { user, fetchUser } = useAuthState();

  if (!user.value) {
    await fetchUser();
  }

  if (!user.value) {
    return navigateTo("/login");
  }

  if (!user.value.whitelisted) {
    return navigateTo("/login?pending=true");
  }

  if (user.value.removed) {
    return navigateTo("/login?removed=true");
  }

  if (to.path.startsWith("/admin") && user.value.role !== "admin") {
    return navigateTo("/");
  }
});