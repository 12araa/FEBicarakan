<script setup>
const isSidebarOpen = ref(false);
const sessionsList = ref([]);
const activeSessionId = ref(null);
const loggedInUser = ref(null);

const props = defineProps({
  sessions: {
    type: Array,
    default: () => [] 
  },
  activeSessionId: {
    type: String,
    default: null 
  },
  user: {
    type: Object,
    default: null
  },
  balance: {
    type: Number,
    default: 0
  }
});

onMounted(async () => {

  const userData = localStorage.getItem('app_user');
  if (userData) {
    loggedInUser.value = JSON.parse(userData);
  }
});

defineEmits(['newSession', 'loadSession', 'logout']);
</script>

<template>
  <aside class="flex flex-col h-full bg-white border-r border-slate-100 w-full md:w-80">

    <div class="container mx-auto px-10 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">B
        </div>
        <span class="font-bold text-slate-800 text-lg">Bicarakan<span class="text-teal-600">Konsultan</span></span>
      </NuxtLink>
    </div>
    <div class="p-4 border-b border-slate-50">
      <button @click="$emit('newSession')"
        class="w-full py-3 px-4 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition shadow-md shadow-slate-200 group">
        <span class="text-xl font-light">+</span>
        <span class="font-bold text-sm">Sesi Cerita Baru</span>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-6">

      <div>
        <h3 class="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Riwayat Obrolan</h3>
        <div class="space-y-1">

          <div v-if="sessions.length === 0" class="px-3 py-6 text-center">
            <p class="text-xs text-slate-400 italic">Belum ada riwayat cerita.</p>
          </div>

          <div v-for="session in sessions" :key="session.id" @click="$emit('loadSession', session.id)" :class="[
            'p-3 rounded-xl cursor-pointer border transition group relative flex items-start gap-3',
            activeSessionId === session.id
              ? 'bg-teal-50 border-teal-100' // Style kalau sedang aktif/dipilih
              : 'border-transparent hover:bg-slate-50 opacity-70 hover:opacity-100' // Style normal
          ]">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0', session.personaBg]">
              {{ session.personaIcon }}
            </div>

            <div class="overflow-hidden">
              <h4 :class="[
                'font-bold text-sm truncate',
                activeSessionId === session.id ? 'text-slate-700' : 'text-slate-600'
              ]">
                {{ session.title }}
              </h4>
              <p class="text-xs text-slate-500 truncate mt-0.5">
                {{ session.lastMessage }}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>

    <div class="p-4 border-t border-slate-50">
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition cursor-pointer mb-2">

        <div
          class="w-9 h-9 rounded-full border border-slate-200 overflow-hidden shrink-0 bg-teal-50 flex items-center justify-center text-teal-700 font-bold">
          <img v-if="loggedInUser?.name"
            :src="`https://ui-avatars.com/api/?name=${loggedInUser.name}&background=0D9488&color=fff`"
            :alt="loggedInUser.name" class="w-full h-full object-cover">
          <span v-else>U</span>
        </div>

        <div class="flex-1 overflow-hidden">
          <p class="text-sm font-bold text-slate-700 truncate">{{ loggedInUser?.name || 'User' }}</p>

          <div class="flex items-center gap-1 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              class="w-3 h-3 text-amber-500">
              <path fill-rule="evenodd"
                d="M1.5 7.125c0-1.173 1.053-2.125 2.375-2.125h16.25c1.322 0 2.375.952 2.375 2.125v9.75c0 1.173-1.053 2.125-2.375 2.125H3.875C2.553 19 1.5 18.048 1.5 16.875v-9.75zM8.25 9.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"
                clip-rule="evenodd" />
            </svg>
            <p class="text-[11px] font-medium" :class="balance > 0 ? 'text-teal-600' : 'text-red-500'">
              Sisa Kuota: {{ balance }} Chat
            </p>
          </div>
        </div>

        <button @click="$emit('logout')"
          class="text-slate-400 hover:text-red-500 transition p-2 rounded-md hover:bg-red-50" title="Keluar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>

      </div>
    </div>
  </aside>
</template>