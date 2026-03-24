<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  personas: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close', 'select']);
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity">
    <div class="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl transform transition-all">
      <h3 class="text-2xl font-extrabold text-slate-900 mb-2">Pilih Teman Cerita</h3>
      <p class="text-sm text-slate-500 mb-6">Siapa yang ingin kamu ajak ngobrol untuk sesi curhat kali ini?</p>
      
      <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <button v-for="persona in personas" :key="persona.id" @click="$emit('select', persona.id)"
          class="w-full flex items-center p-4 border-2 border-slate-100 rounded-2xl hover:bg-teal-50 hover:border-teal-200 transition text-left group cursor-pointer">
          <div class="text-4xl mr-4 group-hover:scale-110 transition-transform">
            {{ persona.name.includes('Bunda') ? '👵' : (persona.name.includes('Dr') ? '📋' : '🎧') }}
          </div>
          <div>
            <h4 class="font-bold text-slate-800 text-lg group-hover:text-teal-700">{{ persona.name }}</h4>
            <p class="text-xs text-slate-500 capitalize font-medium">{{ persona.personality_type?.[0] || 'Teman Ngobrol' }}</p>
          </div>
        </button>
      </div>
      
      <button @click="$emit('close')" class="mt-6 w-full py-3.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition">
        Batal
      </button>
    </div>
  </div>
</template>