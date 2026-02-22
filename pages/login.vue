<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const config = useRuntimeConfig();
const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Email dan kata sandi wajib diisi ya!';
    return;
  }

  isLoading.value = true;

  try {
    const response = await useApiFetch('/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      }
    });

    const userData = {
      name: response.user.name,
      email: response.user.email,
      token: response.token 
    };

    localStorage.setItem('app_user', JSON.stringify(userData));

    router.push('/');

  } catch (error) {
    console.error('Login Error:', error);
    if (error.response?.status === 401) {
      errorMessage.value = 'Email atau kata sandi salah.';
    } else if (error.response?.status === 422) {
      errorMessage.value = 'Format input tidak valid.';
    } else {
      errorMessage.value = error.data?.message || 'Terjadi kesalahan pada server.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans font-inter">
    
    <div class="mb-8 text-center animate-fade-in-up">
      <div class="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl mx-auto mb-4">
        👋
      </div>
      <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Selamat Datang Kembali</h1>
      <p class="text-slate-500 mt-1 text-sm">Masuk untuk melanjutkan sesi ceritamu.</p>
    </div>

    <div class="bg-white w-full max-w-md rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100 animate-fade-in-up" style="animation-delay: 0.1s;">
      
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
        <span>⚠️</span> {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">

        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email</label>
          <input 
            v-model="form.email"
            type="email" 
            placeholder="nama@email.com"
            class="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
          >
        </div>

        <div>
          <div class="flex justify-between items-center mb-1.5 px-1">
             <label class="block text-sm font-bold text-slate-700">Kata Sandi</label>
             <a href="#" class="text-[11px] font-bold text-teal-600 hover:underline">Lupa Sandi?</a>
          </div>
          <input 
            v-model="form.password"
            type="password" 
            placeholder="Masukkan kata sandimu"
            class="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
          >
        </div>


        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full mt-4 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md shadow-slate-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>Masuk ke Akun</span>
        </button>

      </form>

      <p class="text-center text-sm text-slate-500 mt-8 font-medium">
        Belum punya akun? 
        <NuxtLink to="/register" class="text-teal-600 font-bold hover:underline">Daftar sekarang</NuxtLink>
      </p>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>