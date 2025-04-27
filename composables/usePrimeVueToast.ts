import { useToast } from 'primevue/usetoast';

export const usePrimeVueToast = () => {
  const toast = useToast();

  const successToast = (detail: string) => {
    toast.add({ 
      severity: 'success',
      summary: 'Success!',
      detail,
      life: 3000 
    });
  }

  const errorToast = (detail: string) => {
    toast.add({ 
      severity: 'error', 
      summary: 'Error',
      detail,
      life: 3000 
    });
  }

  const infoToast = (detail: string) => {
    toast.add({ 
      severity: 'info', 
      summary: 'Info',
      detail,
      life: 3000 
    });
  }

  return {
    successToast,
    errorToast,
    infoToast
  }
}