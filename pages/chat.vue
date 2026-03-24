<script setup>
import { ref, nextTick, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChatSidebar from '~/components/chat/ChatSidebar.vue';
import ChatBubble from '~/components/chat/ChatBubble.vue';
import SosModal from '~/components/chat/SosModal.vue';
import PilihPersona from '~/components/chat/PilihPersona.vue';
import { useChat } from '~/composables/useChat';


const {
  messages, isTyping, userBalance, sessionsList, activeSessionId,
  allPersonas, currentPersona, loadSession, sendChatMessage, loadInitialData
} = useChat();

const route = useRoute();
const router = useRouter();
const { showToast } = useToast();
const chatContainer = ref(null);
const textareaRef = ref(null);
const newMessageText = ref('');
const isSidebarOpen = ref(false);
const isSosModalOpen = ref(false);
const isPersonaModalOpen = ref(false);
const loggedInUser = ref(null);
const isQuotaModalOpen = ref(false);

const activePersonaId = computed(() => route.query.persona_id);
const activeSessionIdUrl = computed(() => route.query.session_id);

onMounted(async () => {
  const userData = localStorage.getItem('app_user');
  if (userData) loggedInUser.value = JSON.parse(userData);

  await loadInitialData(activePersonaId.value, activeSessionIdUrl.value);

  if (!activePersonaId.value && !activeSessionIdUrl.value) {
    sessionsList.value.length > 0 ? (isSidebarOpen.value = true) : (isPersonaModalOpen.value = true);
  }

  if (!activePersonaId.value && activeSessionIdUrl.value && currentPersona.value?.id) {
    router.replace({ query: { persona_id: currentPersona.value.id, session_id: activeSessionIdUrl.value } });
  }
});

const handleSidebarLoadSession = async (id) => {
  isSidebarOpen.value = false;

  const sessionData = sessionsList.value.find(s => s.id == id);

  const pId = sessionData?.personaId;

  if (pId) {
    router.replace({ query: { persona_id: pId, session_id: id } });
    const matchedPersona = allPersonas.value.find(p => p.id == pId);
    if (matchedPersona) {
      currentPersona.value = matchedPersona;
    }
  } else {
    const currentQuery = { ...route.query };
    delete currentQuery.persona_id;
    currentQuery.session_id = id;
    router.replace({ query: currentQuery });

    currentPersona.value = { name: "Pilih Teman Cerita", icon: "💬", colorBg: "bg-slate-50", colorHeader: "bg-white" };
  }

  await loadSession(id);
  scrollToBottom();
};

const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const handleEnter = (e) => {
  if (e.shiftKey) return;
  e.preventDefault();

  if (!newMessageText.value.trim()) return;

  if (userBalance.value <= 0) {
    showToast('Maaf, kuota chat kamu sudah habis. Yuk top-up saldo dulu!', 'warning');
    isQuotaModalOpen.value = true;
    return;
  }

  const currentId = activePersonaId.value || currentPersona.value?.id;

  sendChatMessage(newMessageText.value, currentId, (newId) => {
    router.replace({ query: { persona_id: currentId, session_id: newId } });
  });

  newMessageText.value = '';
  nextTick(() => { if (textareaRef.value) textareaRef.value.style.height = 'auto'; });
  scrollToBottom();
};


const switchPersona = (id) => {
  router.push({ query: { persona_id: id } });
  setTimeout(() => window.location.reload(), 100);
};

const handleLogout = () => {
  localStorage.removeItem('app_user');
  router.push('/login');
};

const scrollToBottom = () => {
  nextTick(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; });
};

const selectPersonaAndStart = (id) => {
  isPersonaModalOpen.value = false;
  router.push({ query: { persona_id: id } });
  setTimeout(() => {
    window.location.reload();
  }, 100);
};

</script>

<template>
  <ClientOnly>
    <div class="flex h-screen bg-white overflow-hidden font-sans font-inter relative w-full">

      <div v-if="isSidebarOpen" @click="isSidebarOpen = false"
        class="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm"></div>

      <aside :class="[
        'animate-slide-right absolute md:relative flex flex-col h-full bg-white z-50 shrink-0 transition-transform duration-300 w-72 border-r border-slate-100',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]">
        <ChatSidebar :sessions="sessionsList" :active-session-id="String(activeSessionId)"
          @newSession="isPersonaModalOpen = true" @loadSession="handleSidebarLoadSession" @logout="handleLogout"
          :user="loggedInUser" :balance="userBalance" />
      </aside>

      <div
        :class="[' animate-slide-up flex-1 flex flex-col relative transition-colors duration-500 min-w-0 overflow-hidden']">

        <header
          :class="['w-full px-8 py-6 flex items-center shadow-sm z-10 backdrop-blur-sm border-b border-slate-100/50']">
          <button @click="isSidebarOpen = true" class="mr-4 md:hidden text-2xl text-slate-600">☰</button>

          <div class="ml-10">
            <h1 class="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
              <span>{{ currentPersona?.name?.includes('Bunda') ? '👵' : (currentPersona?.name?.includes('Dr') ? '📋' :
                '🎧') }}</span>
              <span>{{ currentPersona?.name || 'Teman Cerita' }}</span>
            </h1>
            <span class="text-sm text-slate-500 font-medium capitalize">{{ currentPersona?.personality_type?.[0] ||
              'Umum' }}</span>
          </div>
          <div class="ml-auto flex items-center gap-5 md:gap-3">
            <button @click="isSosModalOpen = true"
              class="bg-red-400 hover:bg-red-500 text-white text-[11px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full transition shadow-sm tracking-wide">
              SOS
            </button>
          </div>
        </header>

        <main ref="chatContainer" class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-slate-50/30">
          <div class="max-w-4xl mx-auto w-full flex flex-col space-y-8 pb-10 pt-4">

            <div v-for="(msg, index) in messages" :key="index">
              <ChatBubble :message="msg" :is-user="msg.role === 'user'" :persona-icon="currentPersona.icon"
                :persona-color="currentPersona.colorHeader" @switchPersona="switchPersona" @open-sos="isSosModalOpen = true" />
            </div>

            <div v-if="isTyping" class="flex justify-start animate-pulse ml-14">
              <div
                class="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-tl-none text-sm text-slate-500 shadow-sm flex items-center gap-2">
                <span class="text-lg animate-bounce">💬</span> {{ currentPersona.name }} sedang mengetik...
              </div>
            </div>

          </div>
        </main>

        <footer class="p-4 md:p-6 bg-white border-t border-slate-100">
          <div class="max-w-4xl mx-auto relative flex items-end">
            <textarea ref="textareaRef" v-model="newMessageText" @input="autoResize" @keydown.enter="handleEnter"
              rows="1" placeholder="Ketik pesanmu di sini..."
              class="w-full pl-6 pr-16 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-300/50 focus:border-slate-400 transition text-slate-800 text-lg shadow-sm placeholder:text-slate-400 resize-none overflow-y-auto"
              style="min-height: 60px; max-height: 200px;"></textarea>
            <button @click="handleEnter({ shiftKey: false, preventDefault: () => { } })"
              class="absolute right-4 bottom-3 p-3 bg-slate-900 text-white rounded-xl hover:scale-105 active:scale-95 transition flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path
                  d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.519 60.519 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </footer>

      </div>

    </div>

    <template #fallback>
      <div class="h-screen flex items-center justify-center bg-slate-50 font-medium text-slate-500">
        Memuat ruang obrolan...
      </div>
    </template>

    <SosModal :is-open="isSosModalOpen" @close="isSosModalOpen = false" />

    <PilihPersona :is-open="isPersonaModalOpen" :personas="allPersonas" @close="isPersonaModalOpen = false"
      @select="selectPersonaAndStart" />

    <Transition name="quota-modal">
      <div v-if="isQuotaModalOpen" class="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">

        <div @click="isQuotaModalOpen = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

        <div class="quota-modal-content relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-8 text-center">
          <div
            class="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border-[6px] border-amber-100">
            🎟️
          </div>

          <h3 class="text-2xl font-bold text-slate-800 mb-3">Tiket Habis</h3>
          <p class="text-slate-500 mb-8 leading-relaxed text-sm">
            Maaf, tiket obrolanmu sudah habis nih. Yuk top-up tiket dulu biar bisa lanjut cerita-cerita lagi dengan AI
            Bicarakan!
          </p>

          <div class="flex flex-col gap-3">
            <button @click="router.push('/kuota')"
              class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-teal-600/30 active:scale-95">
              Isi Ulang Tiket
            </button>
            <button @click="isQuotaModalOpen = false"
              class="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold py-3.5 rounded-2xl transition-all active:scale-95">
              Nanti Saja
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-right {
  animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.quota-modal-enter-active,
.quota-modal-leave-active {
  transition: opacity 0.3s ease;
}

.quota-modal-enter-active .quota-modal-content,
.quota-modal-leave-active .quota-modal-content {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.quota-modal-enter-from,
.quota-modal-leave-to {
  opacity: 0;
}

.quota-modal-enter-from .quota-modal-content,
.quota-modal-leave-to .quota-modal-content {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
</style>