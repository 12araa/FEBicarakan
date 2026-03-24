import { ref, reactive } from "vue";

export const useChat = () => {
  const messages = reactive([]);
  const isTyping = ref(false);
  const userBalance = ref(0);
  const sessionsList = ref([]);
  const activeSessionId = ref(null);
  const allPersonas = ref([]);
  const currentPersona = ref({});

  const getAuthToken = () => {
    if (import.meta.client) {
      const userData = localStorage.getItem("app_user");
      if (userData) return JSON.parse(userData).token;
    }
    return null;
  };

  const getStarterMessage = (persona) => {
    if (!persona || !persona.name || persona.name === "Pilih Teman Cerita") {
      return "Pilih teman ceritamu untuk memulai obrolan...";
    }
    const pName = persona.name.toLowerCase();
    if (pName.includes("bunda")) return "Halo sayang, Bunda di sini. Bagaimana harimu? Kalau ada yang mengganjal di hati, cerita pelan-pelan sama Bunda ya. Bunda siap dengerin.";
    if (pName.includes("dr") || pName.includes("aria")) return "Halo, saya Dr. Aria. Ruang aman ini milikmu. Apa yang sedang membebani pikiran atau perasaanmu saat ini? Mari kita urai bersama-sama.";
    if (pName.includes("evelyn")) return "Hai! Aku Evelyn. Senang bisa menemanimu hari ini. Mau mulai cerita dari mana nih? Aku siap dengerin kok.";
    return `Halo! Aku ${persona.name}. Aku di sini untuk mendengarkan apapun yang ingin kamu ceritakan hari ini.`;
  };

  const fetchSidebarSessions = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await useApiFetch("/chat-sessions", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawData = response.data || response;
      if (Array.isArray(rawData)) {
        sessionsList.value = rawData.map((session) => ({
          id: session.id,
          title: session.title || "Obrolan Baru",
          // Menerima data dari backend yang sudah diperbaiki
          personaId: session.personality_id || session.personality?.id || session.persona_id,
          personaIcon: session.personality?.name?.includes("Bunda") ? "👵" : session.personality?.name?.includes("Dr") ? "📋" : "🎧",
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

    try {
      messages.splice(0, messages.length);
      messages.push({ role: "ai", text: "Memuat riwayat obrolan...", time: "" });

      const response = await useApiFetch(`/chat-sessions/${sessionId}/messages`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataMessages = response.data || response;

      if (Array.isArray(dataMessages) && dataMessages.length > 0) {
        const formattedMessages = dataMessages.map((msg) => ({
          role: msg.role === "assistant" ? "ai" : "user",
          text: msg.message,
          time: "Riwayat",
        }));
        messages.splice(0, messages.length, ...formattedMessages);
      } else {
        messages.splice(0, messages.length, {
          role: "ai",
          text: getStarterMessage(currentPersona.value),
          time: "Baru saja",
        });
      }
    } catch (error) {
      console.error("Gagal memuat isi chat:", error);
      messages.splice(0, messages.length, { role: "ai", text: "Gagal memuat riwayat.", time: "" });
    }
  };

  const fetchBalance = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const response = await useApiFetch("/chat/balance", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response && response.balance !== undefined) {
        userBalance.value = response.balance;
      }
    } catch (error) {
      console.error("Gagal mengambil saldo token:", error);
    }
  };

  const sendChatMessage = async (text, activePersonaId, onSuccessCallback) => {
    const token = getAuthToken();
    messages.push({ role: "user", text: text, time: "Sekarang" });
    isTyping.value = true;

    const fallbackPersonaId = activePersonaId || currentPersona.value?.id;

    try {
      if (!activeSessionId.value) {
        const sessionResponse = await useApiFetch("/chat-sessions", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: { personality_id: parseInt(fallbackPersonaId) },
        });

        let newId = null;
        if (sessionResponse && sessionResponse.session_id) {
          newId = sessionResponse.session_id;
        } else if (sessionResponse?.data?.session_id) {
          newId = sessionResponse.data.session_id;
        }

        activeSessionId.value = newId;
        if (newId && onSuccessCallback) onSuccessCallback(newId);
      }

      const response = await useApiFetch("/chat/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { session_id: activeSessionId.value, message: text },
      });

      const aiReply = response.reply || "Maaf, respon AI kosong.";
      const aiAlert = response.alert || null;

      messages.push({
        role: "ai",
        text: aiReply,
        time: "Baru saja",
        alert: aiAlert,
      });

      if (response.remaining_balance !== undefined) {
        userBalance.value = response.remaining_balance;
      }

      fetchSidebarSessions();
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      messages.push({ role: "ai", text: "Maaf, koneksi terputus atau token tidak valid.", time: "Baru saja" });
    } finally {
      isTyping.value = false;
    }
  };

  const loadInitialData = async (activePersonaId, urlSessionId) => {
    let safePersonaId = activePersonaId;
    let safeSessionId = urlSessionId;

    if (import.meta.client) {
      const urlParams = new URLSearchParams(window.location.search);
      safePersonaId = urlParams.get('persona_id') || activePersonaId;
      safeSessionId = urlParams.get('session_id') || urlSessionId;
    }

    await Promise.all([
      fetchSidebarSessions(),
      fetchBalance(),
      (async () => {
         try {
           const pResponse = await useApiFetch(`/personalities`);
           allPersonas.value = pResponse.data || pResponse;
         } catch(e) { console.error("Gagal get personas:", e); }
      })()
    ]);

    let finalPersonaId = safePersonaId;
    if (!finalPersonaId && safeSessionId) {
      const sessionData = sessionsList.value.find(s => String(s.id) === String(safeSessionId));
      if (sessionData) finalPersonaId = sessionData.personaId;
    }

    if (finalPersonaId) {
      const matchedPersona = allPersonas.value.find(p => String(p.id) === String(finalPersonaId));
      if (matchedPersona) {
         currentPersona.value = matchedPersona;
      } else {
         currentPersona.value = { name: "Pilih Teman Cerita", icon: "💬" };
      }
    } else {
      currentPersona.value = { name: "Pilih Teman Cerita", icon: "💬" };
    }

    if (safeSessionId) {
      await loadSession(safeSessionId);
    } else {
      messages.splice(0, messages.length);
      if (currentPersona.value.name !== "Pilih Teman Cerita") {
        messages.push({
          role: 'ai',
          text: getStarterMessage(currentPersona.value),
          time: 'Baru saja'
        });
      }
    }
  };

  return {
    messages,
    isTyping,
    userBalance,
    sessionsList,
    activeSessionId,
    allPersonas,
    currentPersona,
    fetchSidebarSessions,
    loadSession,
    fetchBalance,
    sendChatMessage,
    loadInitialData,
  };
};