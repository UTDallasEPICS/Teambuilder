import { ref } from "vue";

const user = ref<null | {
  id: string;
  email: string;
  name: string;
  role: string;
  whitelisted: boolean;
  removed: boolean;
}>(null);

export const useAuthState = () => {
  const user = useState<null | {
    id: string;
    email: string;
    name: string;
    role: string;
    whitelisted: boolean;
    removed: boolean;
  }>("auth-user", () => null);

  const fetchUser = async () => {
    try {
      const headers = useRequestHeaders(["cookie"]);
      const data = await $fetch("/api/auth/get-session", {
        headers,
        credentials: "include",
      });
      user.value = (data as any)?.user ?? null;
    } catch {
      user.value = null;
    }
  };

  const clearUser = () => {
    user.value = null;
  };

  return { user, fetchUser, clearUser };
};