<template>
  <div class="p-4 bg-white border-t border-slate-100 sticky bottom-0 z-20">
    <div class="max-w-4xl mx-auto relative flex items-end gap-2 bg-slate-50 p-2 rounded-3xl border border-slate-200 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
      
      <textarea 
        v-model="inputText"
        @keydown.enter.prevent="handleSend"
        placeholder="Ceritakan apa yang kamu rasakan..." 
        class="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 py-3 px-4 text-slate-700 placeholder:text-slate-400 text-sm md:text-base scrollbar-hide"
        rows="1"
      ></textarea>

      <button 
        @click="handleSend"
        :disabled="!inputText.trim()"
        class="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition shadow-lg shadow-teal-200 mb-1 disabled:opacity-50 disabled:cursor-not-allowed">
        ➤
      </button>
    </div>
    
    <p class="text-center text-[10px] text-slate-400 mt-2">
      AI fokus pada kategori <span class="font-bold text-teal-600">{{ activeCategory }}</span>. Hubungi profesional jika darurat.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['activeCategory']);
const emit = defineEmits(['sendMessage']);

const inputText = ref('');

const handleSend = () => {
  if (!inputText.value.trim()) return;
  emit('sendMessage', inputText.value);
  inputText.value = ''; 
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>