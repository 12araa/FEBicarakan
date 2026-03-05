<template>
  <div class="flex gap-4 max-w-3xl mb-6" :class="{ 'ml-auto flex-row-reverse': isUser }">
    
    <div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm"
      :class="isUser ? 'bg-slate-200' : personaColor">
      {{ isUser ? '👤' : personaIcon }}
    </div>

    <div class="flex flex-col gap-1 min-w-[200px]" :class="{ 'items-end': isUser, 'items-start': !isUser }">
      
      <div class="px-5 py-3 shadow-sm text-sm md:text-base leading-relaxed"
        :class="[
          isUser 
            ? 'bg-teal-600 text-white rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl' 
            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'
        ]">
        {{ message.text }}
      </div>

      <div v-if="message.suggestion" class="mt-2 animate-fade-in-up">
        
        <div v-if="message.suggestion.type === 'switch'" class="p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-3 items-start max-w-sm shadow-sm">
          <span class="text-xl mt-0.5">💡</span>
          <div>
            <p class="text-[11px] text-slate-500 mb-0.5 font-bold uppercase tracking-wider">Saran AI</p>
            <p class="text-xs text-slate-700 mb-2.5 leading-relaxed">{{ message.suggestion.text }}</p>
            <button @click="$emit('switchPersona', message.suggestion.targetId)" 
              class="text-xs bg-white border-2 border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-700 hover:border-slate-400 transition w-full text-center">
              Pindah ke {{ message.suggestion.targetName }} →
            </button>
          </div>
        </div>

        <div v-else-if="message.suggestion.type === 'sos'" class="p-3 bg-red-50 border border-red-200 rounded-xl flex gap-3 items-start max-w-sm shadow-sm">
          <span class="text-xl mt-0.5 animate-pulse">🚨</span>
          <div>
            <p class="text-[11px] text-red-600 mb-0.5 font-bold uppercase tracking-wider">Peringatan Darurat</p>
            <p class="text-xs text-red-800 mb-2.5 leading-relaxed">{{ message.suggestion.text }}</p>
            <a :href="'tel:' + message.suggestion.hotline" 
              class="block w-full text-center text-xs bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow-sm">
              Hubungi {{ message.suggestion.hotlineName }} ({{ message.suggestion.hotline }})
            </a>
          </div>
        </div>

      </div>

      <span class="text-[10px] text-slate-400 px-1">
        {{ message.time }}
      </span>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  message: Object,      
  personaIcon: String,  
  personaColor: String, 
  isUser: Boolean       
});

defineEmits(['switchPersona']);
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>