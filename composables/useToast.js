// composables/useToast.js
import { useState } from '#app';

export const useToast = () => {
  const toastState = useState('toast', () => ({
    isVisible: false,
    message: '',
    type: 'success' 
  }));

  const showToast = (message, type = 'success', duration = 3000) => {
    toastState.value = { isVisible: true, message, type };
    
    setTimeout(() => {
      toastState.value.isVisible = false;
    }, duration);
  };

  return { toastState, showToast };
};