<script setup>
const props = defineProps({
  isOpen: Boolean,
  persona: Object
});

const emit = defineEmits(['close']);
const router = useRouter();
const isLoggedIn = ref(false);

onMounted(() => {
  const userData = localStorage.getItem('app_user');
  if (userData) {
    isLoggedIn.value = true;
  }
});

const handleStartChat = () => {
  if (!isLoggedIn.value) {
    window.Swal.fire({
      title: 'Login Dulu Yuk!',
      text: 'Kamu harus masuk ke akunmu untuk mulai curhat dan dapat kuota gratis.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0D9488',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Ke Halaman Login',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        emit('close');
        router.push('/login');
      }
    });

    return;
  }

  emit('close');
  router.push(`/chat?persona_id=${props.persona.id}`);
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && persona" class="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">

        <div @click="closeModal" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>

        <div
          class="modal-box relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh]">

          <div class="p-8">
            <div class="flex justify-between items-start mb-6">
              <div class="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                {{ persona?.name?.includes('Bunda') ? '👵' : (persona?.name?.includes('Dr') ? '📋' : '🎧') }}
              </div>
              <button @click="closeModal" class="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition">
                <span class="text-2xl">&times;</span>
              </button>
            </div>

            <h3 class="text-2xl font-bold text-slate-800 mb-1">{{ persona?.name }}</h3>
            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="tag in persona.personality_type" :key="tag"
                class="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wide">
                {{ tag }}
              </span>
            </div>

            <div class="space-y-6 mb-8 text-left">
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tentang Persona</p>
                <p class="text-slate-600 text-sm leading-relaxed">{{ persona?.description }}</p>
              </div>

              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Keahlian Utama</p>
                <ul class="grid grid-cols-1 gap-2">
                  <li v-for="spec in persona.specializatiion" :key="spec"
                    class="text-sm text-slate-600 flex items-center gap-3">
                    <span class="text-teal-500 font-bold">✓</span> {{ spec }}
                  </li>
                </ul>
              </div>
            </div>

            <NuxtLink @click="handleStartChat"
              class="block w-full py-4 bg-teal-600 text-white text-center rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200 transition active:scale-95 cursor-pointer">
              Mulai Cerita Sekarang
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
</style>