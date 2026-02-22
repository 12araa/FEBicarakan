<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const config = useRuntimeConfig();
const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
});

const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  errorMessage.value = '';

  if (!form.value.name || !form.value.email || !form.value.password || !form.value.passwordConfirmation) {
    errorMessage.value = 'Semua kolom wajib diisi ya!';
    return;
  }

  if (form.value.password !== form.value.passwordConfirmation) {
    errorMessage.value = 'Kata sandi tidak cocok!';
    return;
  }

  isLoading.value = true;

  try {
    const response = await useApiFetch('/register', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        password_confirmation: form.value.passwordConfirmation
      }
    });

    const userData = {
      name: response.user.name,
      email: response.user.email,
      token: response.token
    };

    localStorage.setItem('app_user', JSON.stringify(userData));
    router.push('/');

    isLoading.value = false;
  } catch (error) {
    console.error('Register Error:', error);

    if (error.response?.status === 422) {

      const responseBody = error.response._data;

      if (responseBody && responseBody.errors) {
        if (responseBody.errors.email) {
          errorMessage.value = responseBody.errors.email[0];
        }
        else {
          const firstField = Object.keys(responseBody.errors)[0];
          errorMessage.value = responseBody.errors[firstField][0];
        }
      } else {
        errorMessage.value = responseBody.message || 'Data tidak valid.';
      }

    } else {
      errorMessage.value = 'Terjadi kesalahan pada server. Coba lagi nanti.';
    }

  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans font-inter">

    <div class="mb-8 text-center animate-fade-in-up">
      <div
        class="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl mx-auto mb-4">
        🌿
      </div>
      <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Mulai Perjalananmu</h1>
      <p class="text-slate-500 mt-1 text-sm">Buat akun untuk ruang cerita yang aman.</p>
    </div>

    <div
      class="bg-white w-full max-w-md rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100 animate-fade-in-up"
      style="animation-delay: 0.1s;">

      <div v-if="errorMessage"
        class="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
        <span>⚠️</span> {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">

        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nama Panggilan</label>
          <input v-model="form.name" type="text" placeholder="Mau dipanggil apa?"
            class="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-slate-700 placeholder:text-slate-400">
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email</label>
          <input v-model="form.email" type="email" placeholder="nama@email.com"
            class="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-slate-700 placeholder:text-slate-400">
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Kata Sandi</label>
          <input v-model="form.password" type="password" placeholder="Minimal 6 karakter"
            class="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-slate-700 placeholder:text-slate-400">
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Konfirmasi Kata Sandi</label>
          <input v-model="form.passwordConfirmation" type="password" placeholder="Masukkan ulang kata sandi"
            class="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-slate-700 placeholder:text-slate-400">
        </div>

        <button type="submit" :disabled="isLoading"
          class="w-full mt-4 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md shadow-slate-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
          <span v-if="isLoading"
            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>Buat Akun Sekarang</span>
        </button>

      </form>

      <p class="text-center text-sm text-slate-500 mt-8 font-medium">
        Sudah punya akun?
        <NuxtLink to="/login" class="text-teal-600 font-bold hover:underline">Masuk di sini</NuxtLink>
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