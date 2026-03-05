<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      @click="$emit('close')"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
    >
      <div 
        @click.stop 
        class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all"
      >
        <div class="bg-red-50 p-6 text-center relative">
          <div class="w-16 h-16 mx-auto bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-extrabold text-slate-800 mb-1">Butuh Bantuan Mendesak?</h3>
          <p class="text-sm text-slate-600">Tarik napas dalam-dalam. Kamu tidak sendirian, kami ada di sini.</p>
          
          <button @click="$emit('close')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4 bg-white">
          
          <a href="tel:119" class="flex items-center p-4 border border-slate-200 rounded-2xl hover:border-red-300 hover:bg-red-50 transition-colors group">
            <div class="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-red-100 flex items-center justify-center text-slate-500 group-hover:text-red-500 mr-4 shrink-0 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clip-rule="evenodd" /></svg>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-slate-800 text-sm">Layanan SEJIWA (Kemenkes)</h4>
              <p class="text-xs text-slate-500">Panggilan Darurat, Tekan Ekstensi 8</p>
            </div>
            <span class="text-red-500 font-bold text-sm">119</span>
          </a>

          <a href="tel:08113855472" class="flex items-center p-4 border border-slate-200 rounded-2xl hover:border-red-300 hover:bg-red-50 transition-colors group">
            <div class="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-red-100 flex items-center justify-center text-slate-500 group-hover:text-red-500 mr-4 shrink-0 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clip-rule="evenodd" /></svg>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-slate-800 text-sm">Layanan LISA</h4>
              <p class="text-xs text-slate-500">Dukungan Psikososial & Kesehatan Mental</p>
            </div>
            <span class="text-red-500 font-bold text-sm">Panggil</span>
          </a>

        </div>

        <div class="bg-slate-50 p-4 text-center">
          <p class="text-[11px] text-slate-400">Panggilan ke nomor darurat mungkin dikenakan tarif operator reguler.</p>
        </div>

      </div>
    </div>
  </Teleport>
</template>