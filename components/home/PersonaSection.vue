<script setup>
const personalities = ref([]);
const isLoading = ref(true);

const isModalOpen = ref(false);
const selectedPersona = ref(null);

const config = useRuntimeConfig();

onMounted(async () => {
  try {
    const data = await useApiFetch('/personalities');
    if (data.data) {
      personalities.value = data.data;
    } else {
      personalities.value = data;
    }
  } catch (error) {
    console.error("Gagal mengambil data persona:", error);
  } finally {
    isLoading.value = false;
  }
});

const openDetail = (persona) => {
  selectedPersona.value = persona;
  isModalOpen.value = true;
};
</script>

<template>
  <section id="persona" class="py-20 bg-white">
    <div class="container mx-auto px-4 text-center">

      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Pilih Teman Bicaramu</h2>
      <p class="text-slate-500 mb-12 max-w-xl mx-auto">Sesuaikan dengan suasana hatimu hari ini. Pilih kategori yang
        paling pas.</p>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>

      <div v-else class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        <div v-for="persona in personalities" :key="persona.id"
          class="group p-8 rounded-3xl bg-teal-50/50 border border-teal-100 hover:border-teal-300 transition hover:shadow-lg hover:-translate-y-1 relative overflow-hidden text-center">

          <div
            class="w-20 h-20 mx-auto bg-teal-100 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
            {{ persona?.name?.includes('Bunda') ? '👵' : (persona?.name?.includes('Dr') ? '📋' : '🎧') }}
          </div>

          <span
            class="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
            {{ persona?.personality_type?.[0] || 'Umum' }}
          </span>

          <h3 class="text-xl font-bold text-slate-800 mb-2">{{ persona?.name }}</h3>

          <p class="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">
            "{{ persona?.description }}"
          </p>

          <button @click="openDetail(persona)"
            class="w-full py-3 bg-white border-2 border-teal-200 text-teal-600 font-bold rounded-xl group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition inline-block text-center cursor-pointer">
            Lihat Detail
          </button>
        </div>

      </div>
    </div>

    <HomeModalPersona :is-open="isModalOpen" :persona="selectedPersona" @close="isModalOpen = false" />
  </section>
</template>