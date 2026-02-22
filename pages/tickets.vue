<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const activeTab = ref(route.query.tab || 'offering'); 

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'offering' || newTab === 'your_plan') {
    activeTab.value = newTab;
  }
});

const switchTab = (tabName) => {
  activeTab.value = tabName;
  router.push({ query: { tab: tabName } });
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 pt-8 pb-12 font-sans flex flex-col items-center">
    
    <div class="container mx-auto px-4 max-w-5xl">
      
      <div class="mb-8 w-full flex justify-start">
        <NuxtLink to="/" class="group flex items-center text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Beranda
        </NuxtLink>
      </div>

      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
          Pilih Paket Sesuai Kebutuhanmu
        </h1>
        <p class="text-slate-500">
          Dapatkan akses untuk sesi curhat eksklusif bersama persona AI pilihanmu.
        </p>
      </div>

      <div class="flex justify-center mb-14">
        
        <div class="bg-teal-600 p-1.5 rounded-full flex items-center shadow-lg shadow-teal-600/20 relative isolate w-full max-w-[380px]">
          
          <div
            class="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0"
            :class="activeTab === 'offering' ? 'translate-x-0' : 'translate-x-full'"
          ></div>

          <button 
            @click="switchTab('offering')"
            class="relative z-10 w-1/2 py-3 rounded-full text-sm font-bold transition-colors duration-300 text-center cursor-pointer"
            :class="activeTab === 'offering' ? 'text-teal-700' : 'text-white hover:text-teal-100'"
          >
            Beli Paket
          </button>

          <button 
            @click="switchTab('your_plan')"
            class="relative z-10 w-1/2 py-3 rounded-full text-sm font-bold transition-colors duration-300 text-center cursor-pointer"
            :class="activeTab === 'your_plan' ? 'text-teal-700' : 'text-white hover:text-teal-100'"
          >
            Tiketku
          </button>

        </div>
      </div>
      <div class="transition-all duration-500 w-full flex justify-center">
        <div v-if="activeTab === 'offering'" class="w-full animate-in fade-in zoom-in-95 duration-300">
          <TicketPricingList />
        </div>

        <div v-else-if="activeTab === 'your_plan'" class="animate-in fade-in zoom-in-95 duration-300">
          <TicketBalance />
        </div>
      </div>

    </div>
  </div>
</template>