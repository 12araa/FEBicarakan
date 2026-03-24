<script setup>
import { ref, onMounted } from 'vue';

const chatBalance = ref(0);
const isLoading = ref(true);

onMounted(async () => {
  const userData = localStorage.getItem('app_user');
  const token = userData ? JSON.parse(userData).token : null;

  if (!token) {
    isLoading.value = false;
    return;
  }

  try {
    const response = await useApiFetch('/chat/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response && response.balance !== undefined) {
      chatBalance.value = response.balance;
    }
  } catch (error) {
    console.error("Gagal mengambil sisa kuota:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div
    class="bg-gradient-to-br from-teal-500 to-teal-700 rounded-[2rem] p-6 text-white shadow-xl shadow-teal-200/50 relative overflow-hidden max-w-sm">

    <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    <div class="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

    <div class="relative z-10 flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <div
          class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm border border-white/20 shadow-inner">
          💬
        </div>
        <div>
          <p class="text-teal-100 text-xs font-bold uppercase tracking-widest mb-1">Sisa Kuota Chat</p>
          <div class="flex items-baseline gap-1">
            <h3 class="text-4xl font-black leading-none">
              {{ isLoading ? '...' : chatBalance }}
            </h3>
            <span class="text-teal-100 font-medium">Pesan</span>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-10 bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
      <p class="text-sm text-teal-50 mb-5 leading-relaxed">
        1 Kuota terpakai untuk setiap pesan balasan dari AI. Bebas cerita kapan saja tanpa dikejar batasan waktu.
      </p>

      <div class="flex gap-3">
        <NuxtLink :to="{ path: '/kuota', query: { tab: 'offering' } }"
          class=" w-full flex-1 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 hover:scale-[1.02] active:scale-95 transition shadow-sm text-center flex justify-center items-center">
          Tambah Kuota
        </NuxtLink>
      </div>
    </div>

  </div>
</template>