import { useToast } from 'primevue/usetoast';

export const usePrimeVueToast = () => {
  const toast = useToast();

  const successToast = (detail: string, life = 3000) => {
    toast.add({ 
      severity: 'success',
      summary: 'Success!',
      detail,
      life
    });
  }

  const errorToast = (detail: string, life = 3000) => {
    toast.add({ 
      severity: 'error', 
      summary: 'Error',
      detail,
      life
    });
  }

  const infoToast = (detail: string, life = 3000) => {
    toast.add({ 
      severity: 'info', 
      summary: 'Info',
      detail,
      life
    });
  }

  return {
    successToast,
    errorToast,
    infoToast
  }
}