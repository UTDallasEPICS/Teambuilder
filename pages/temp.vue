

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

useHead({ title: 'Login' });

const router = useRouter();

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    // POST to your auth endpoint (adjust path/shape if needed)
    await $fetch('/api/auth/login', { method: 'POST', body: { ...form } });
    // on success navigate to projects (adjust destination as desired)
    router.push('/projects');
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
input:disabled,
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
