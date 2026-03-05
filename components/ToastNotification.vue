<script setup>
const { toastState } = useToast();
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-5 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-5 opacity-0"
    >
      <div 
        v-if="toastState.isVisible" 
        class="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center px-5 py-3 rounded-full shadow-lg border backdrop-blur-md min-w-[280px]"
        :class="{
          'bg-teal-50/90 border-teal-200 text-teal-800': toastState.type === 'success',
          'bg-red-50/90 border-red-200 text-red-800': toastState.type === 'error',
          'bg-amber-50/90 border-amber-200 text-amber-800': toastState.type === 'warning'
        }"
      >
        <svg v-if="toastState.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
        
        <svg v-if="toastState.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
        
        <svg v-if="toastState.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>

        <span class="text-sm font-medium">{{ toastState.message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>