<script setup>
import { ref, onMounted } from 'vue';

const loggedInUser = ref(null);

onMounted(() => {
  const userData = localStorage.getItem('app_user');
  if (userData) {
    loggedInUser.value = JSON.parse(userData);
  }
});
</script>

<template>
  <section class="min-h-[85vh] flex items-center pt-16 pb-16 md:pt-32 md:pb-24 overflow-hidden ">
    <div class="container mx-auto px-4 max-w-6xl animate-fade-in-up">

      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        <div class="text-center lg:text-left">

          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-600 font-medium text-xs md:text-sm mb-4 md:mb-6 border border-teal-100 shadow-sm">
            Ruang Aman & Privat Untukmu
          </div>

          <h1
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-4 md:mb-6">
            Ruang Untuk <br class="hidden lg:block" />
            <span class="text-teal-600">Setiap Cerita</span>
          </h1>

          <p class="text-base md:text-lg text-slate-500 mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Temukan lawan bicara yang pas untuk setiap topikmu. Mulai percakapan baru dan dapatkan sudut pandang yang
            berbeda bersama AI kami.
          </p>

          <div class="mt-8 flex flex-wrap items-center  gap-4">

            <NuxtLink to="#pilih-teman"
              class="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-block">
              Cari Teman Cerita ↓
            </NuxtLink>

            <NuxtLink v-if="loggedInUser" to="/chat"
              class="bg-white border-2 border-teal-600 text-teal-700 hover:bg-teal-50 px-8 py-3.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2">
              Lanjut Ngobrol <span class="text-lg">💬</span>
            </NuxtLink>

          </div>

        </div>

        <div class="relative hidden lg:flex justify-center lg:justify-end mt-8 lg:mt-0">

          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-teal-200/40 rounded-full blur-3xl -z-10">
          </div>

          <img src="/texting.svg" alt="Ilustrasi Curhat AI Bicarakan"
            class="w-3/4 sm:w-full max-w-xs sm:max-w-md lg:max-w-xl object-contain drop-shadow-xl transition-transform duration-500" />

        </div>

      </div>
    </div>
  </section>
</template>
