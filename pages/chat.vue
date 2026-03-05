<script setup>
import { ref, reactive, nextTick, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChatSidebar from '~/components/chat/ChatSidebar.vue';
import ChatBubble from '~/components/chat/ChatBubble.vue';
import SosModal from '~/components/chat/SosModal.vue';
import ModalPersona from '~/components/home/ModalPersona.vue';

const route = useRoute();
const router = useRouter();

const currentPersona = ref({});
const isTyping = ref(false);
const chatContainer = ref(null);
const messages = reactive([]);
const userBalance = ref(0);

const sessionsList = ref([]);
const activeSessionId = ref(null);
const isSidebarOpen = ref(false);
const isSosModalOpen = ref(false);

// 👇 INI VARIABEL UNTUK MODAL PERSONANYA
const isPersonaModalOpen = ref(false);
const allPersonas = ref([]); 

const { toastState, showToast } = useToast();

const newMessageText = ref('');
const textareaRef = ref(null);
const loggedInUser = ref(null);

const activePersonaId = route.query.persona_id;


const createNewSession = (personaId) => {
  router.push({ query: { persona_id: personaId } });
};

const fetchSidebarSessions = async () => {
  const token = getAuthToken();
  if (!token) return;

  try {
    const response = await useApiFetch('/chat-sessions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const rawData = response.data || response;

    if (Array.isArray(rawData)) {
      sessionsList.value = rawData.map(session => ({
        id: session.id,
        title: session.title || 'Obrolan Baru',
        personaIcon: session.personality?.name?.includes('Bunda') ? '👵' : (session.personality?.name?.includes('Dr') ? '📋' : '🎧'),
        personaBg: 'bg-slate-50'
      }));
    }
  } catch (error) {
    console.error("Gagal memuat riwayat sidebar:", error);
  }
};

const loadSession = async (sessionId) => {
  const token = getAuthToken(); 
  if (!token) return;

  activeSessionId.value = sessionId;
  isSidebarOpen.value = false; 

  try {
    messages.splice(0, messages.length);
    messages.push({ role: 'ai', text: 'Memuat riwayat obrolan...', time: '' });

    const response = await useApiFetch(`/chat-sessions/${sessionId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const dataMessages = response.data || response;

    if (Array.isArray(dataMessages)) {
      const formattedMessages = dataMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'ai' : 'user', 
        text: msg.message, 
        time: 'Riwayat'
      }));

      messages.splice(0, messages.length, ...formattedMessages);
      scrollToBottom();
      
    } else {
      messages.splice(0, messages.length, { role: 'ai', text: 'Mulai obrolan barumu...', time: '' });
    }

  } catch (error) {
    console.error("Gagal memuat isi chat:", error);
    messages.splice(0, messages.length, { role: 'ai', text: 'Gagal memuat riwayat.', time: '' });
  }
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

  if (newMessageText.value.trim()) {
    handleNewMessage(newMessageText.value);
    newMessageText.value = '';
    nextTick(() => { if (textareaRef.value) textareaRef.value.style.height = 'auto'; });
  }
};

const getAuthToken = () => {
  const userData = localStorage.getItem('app_user');
  if (userData) {
    const parsed = JSON.parse(userData);
    return parsed.token; 
  }
  return null;
};

const fetchBalance = async () => {
  const token = getAuthToken();
  if (!token) return;

  try {
    const response = await useApiFetch('/chat/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response && response.balance !== undefined) {
      userBalance.value = response.balance;
    }
  } catch (error) {
    console.error("Gagal mengambil saldo token:", error);
  }
};

// ==========================================
// LOGIKA FETCH DATA DARI BACKEND
// ==========================================
onMounted(async () => {
  await fetchSidebarSessions();
  await fetchBalance();
  if (route.query.session_id) {
    await loadSession(route.query.session_id);
  }

  const userData = localStorage.getItem('app_user');
  if (userData) {
    loggedInUser.value = JSON.parse(userData);
  }

  // 👇 INI LOGIKA BARU UNTUK NAMPILIN MODAL / SHORTCUT
  try {
    const response = await useApiFetch(`/personalities`);
    allPersonas.value = response.data || response;

    if (activePersonaId) {
      const matchedPersona = allPersonas.value.find(p => p.id == activePersonaId);
      currentPersona.value = matchedPersona || {
        name: "AI Bicarakan", icon: "👤", colorBg: "bg-slate-50", colorHeader: "bg-white"
      };

      if (messages.length === 0) {
        messages.push({
          role: 'ai',
          text: currentPersona.value.description || `Halo! Aku ${currentPersona.value.name} siap mendengarkan ceritamu hari ini. Ada yang ingin disampaikan?`,
          time: 'Baru saja'
        });
      }
    } else {
      // Jika user buka shortcut /chat tanpa ID
      currentPersona.value = { name: "Pilih Teman Cerita", icon: "💬", colorBg: "bg-slate-50", colorHeader: "bg-white" };
      
      if (sessionsList.value.length > 0) {
        isSidebarOpen.value = true;
      } else {
        isPersonaModalOpen.value = true;
      }
    }
  } catch (error) {
    console.error("Gagal load persona asli dari backend:", error);
  }
});

const handleNewMessage = async (text) => {
  if (!text.trim()) return;

  if (userBalance.value <= 0) {
    showToast('Maaf, kuota chat kamu sudah habis. Yuk top-up saldo dulu!', 'warning');
    router.push('/tickets');
    return;
  }

  const token = getAuthToken();
  messages.push({ role: 'user', text: text, time: 'Sekarang' });
  scrollToBottom();
  isTyping.value = true;

  try {
    if (!activeSessionId.value) {
      const sessionResponse = await useApiFetch('/chat-sessions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: { personality_id: parseInt(activePersonaId) }
      });

      let newId = null;
      if (sessionResponse && sessionResponse.session_id) {
        newId = sessionResponse.session_id;
      } else if (sessionResponse && sessionResponse.data && sessionResponse.data.session_id) {
        newId = sessionResponse.data.session_id;
      }

      activeSessionId.value = newId;

      if (newId) {
        router.replace({ query: { persona_id: activePersonaId, session_id: newId } });
      }
    }

    const response = await useApiFetch('/chat/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        session_id: activeSessionId.value,
        message: text
      }
    });

    const aiReply = response.reply || "Maaf, respon AI kosong.";
    messages.push({ role: 'ai', text: aiReply, time: 'Baru saja' });

    if (response.remaining_balance !== undefined) {
      userBalance.value = response.remaining_balance;
    }

    fetchSidebarSessions();

  } catch (error) {
    console.error("Gagal mengirim pesan:", error);
    messages.push({
      role: 'ai',
      text: "Maaf, koneksi terputus atau token tidak valid.",
      time: 'Baru saja'
    });
    showToast('Gagal mengirim pesan, coba periksa koneksimu.', 'error');
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  nextTick(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight; });
};

const switchPersona = (id) => {
  router.push({ query: { persona_id: id } });
  window.location.reload();
};

const handleLogout = () => {
  localStorage.removeItem('app_user');
  router.push('/login');
};

// 👇 INI FUNGSI BARU SAAT USER KLIK PERSONA DI MODAL
const selectPersonaAndStart = (id) => {
  isPersonaModalOpen.value = false;
  router.push({ query: { persona_id: id } });
  setTimeout(() => {
    window.location.reload();
  }, 100); // Jeda sebentar biar Vue router sempat nulis URL
};

</script>

<template>
  <ClientOnly>
    <div class="flex h-screen bg-white overflow-hidden font-sans font-inter relative w-full">

      <div v-if="isSidebarOpen" @click="isSidebarOpen = false"
        class="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm"></div>

      <aside :class="[
        'absolute md:relative flex flex-col h-full bg-white z-50 shrink-0 transition-transform duration-300 w-72 border-r border-slate-100',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]">
        <ChatSidebar :sessions="sessionsList" :active-session-id="String(activeSessionId)"
          @newSession="isPersonaModalOpen = true" @loadSession="loadSession" @logout="handleLogout"
          :user="loggedInUser" :balance="userBalance" />
      </aside>

      <div
        :class="['flex-1 flex flex-col relative transition-colors duration-500 min-w-0 overflow-hidden', currentPersona.colorBg]">

        <header
          :class="['w-full px-8 py-6 flex items-center shadow-sm z-10 backdrop-blur-sm border-b border-slate-100/50', currentPersona.colorHeader]">
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
          <div class="ml-auto flex items-center gap-2 md:gap-3">
            <button @click="isSosModalOpen = true"
              class="bg-red-400 hover:bg-red-500 text-white text-[11px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full transition shadow-sm tracking-wide">
              SOS
            </button>
            <button
              class="text-slate-400 hover:text-slate-600 transition p-1.5 rounded-full hover:bg-slate-100 hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </button>
            <button
              class="w-8 h-8 rounded-full border-2 border-slate-200 overflow-hidden hover:border-slate-400 transition ml-1 shrink-0">
              <img :src="`https://ui-avatars.com/api/?name=${loggedInUser?.name || 'User'}&background=0D9488&color=fff`"
                alt="User" class="w-full h-full object-cover">
            </button>
          </div>
        </header>

        <main ref="chatContainer" class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-slate-50/30">
          <div class="max-w-4xl mx-auto w-full flex flex-col space-y-8 pb-10 pt-4">

            <div v-for="(msg, index) in messages" :key="index">
              <ChatBubble :message="msg" :is-user="msg.role === 'user'" :persona-icon="currentPersona.icon"
                :persona-color="currentPersona.colorHeader" @switchPersona="switchPersona" />
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
    
    <PersonaModal 
      :is-open="isPersonaModalOpen" 
      :personas="allPersonas" 
      @close="isPersonaModalOpen = false" 
      @select="selectPersonaAndStart" 
    />

  </ClientOnly>
</template>