<script setup>
import { ref, onMounted } from 'vue';

const isDropdownOpen = ref(false);
const isLoggedIn = ref(false);
const user = ref('');

onMounted(() => {
  const userData = localStorage.getItem('app_user');
  if (userData) {
    isLoggedIn.value = true;
    user.value = JSON.parse(userData);
  }
});

const handleLogout = () => {
  localStorage.removeItem('app_user');
  window.location.reload();
};
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">

      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">B</div>
        <span class="font-bold text-slate-800 text-lg">Bicarakan<span class="text-teal-600">Konsultan</span></span>
      </NuxtLink>

      <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
        <a href="#fitur" class="hover:text-teal-600 transition">Fitur</a>
        <a href="#persona" class="hover:text-teal-600 transition">Pilihan Teman</a>
        <a href="#faq" class="hover:text-teal-600 transition">FAQ</a>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="!isLoggedIn">
          <NuxtLink to="/login" class="hidden md:block px-5 py-2 text-slate-600 font-bold hover:text-teal-600 transition">
            Masuk
          </NuxtLink>
          <NuxtLink to="/register" class="px-5 py-2 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition">
            Daftar
          </NuxtLink>
        </template>

        <template v-else>
          <div class="relative">
            <button @click="isDropdownOpen = !isDropdownOpen"
              class="flex items-center gap-2 hover:bg-slate-50 p-2 rounded-full transition-all">
              <div class="text-right hidden sm:block">
                <p class="text-xs text-slate-400">Halo,</p>
                <p class="text-sm font-bold text-slate-800">{{ user?.name || 'User' }}</p>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" 
                  class="w-4 h-4 text-slate-400 transition-transform duration-200" 
                  :class="{ 'rotate-180': isDropdownOpen }">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>

            <div v-if="isDropdownOpen"
              class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
              <div class="px-4 py-3 border-b border-slate-50 mb-1">
                <p class="text-sm font-bold text-slate-800">{{ user?.name }}</p>
                <p class="text-xs text-slate-500 truncate">{{ user?.email }}</p>
              </div>

              <!-- <NuxtLink to="/profile" class="block px-4 py-2.5 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                👤 Profil Saya
              </NuxtLink> -->

              <NuxtLink to="/kuota?tab=your_plan" class="block px-4 py-2.5 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-colors">
                💬 Kuota Chat
              </NuxtLink>

              <div class="border-t border-slate-50 mt-1 pt-1">
                <button @click="handleLogout" class="w-full text-left px-4 py-2.5 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors">
                  🚪 Keluar
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>

    </div>
  </nav>
</template>