<template>
  <main class="min-h-screen pt-20 pb-12 flex items-center justify-center relative overflow-hidden px-6">
    <!-- Atmospheric Background Elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full"></div>
    </div>
    
    <!-- Content Container -->
    <div class="relative z-10 w-full max-w-3xl text-center">
      
      <!-- Editorial Headline Area -->
      <div class="mb-10">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-outline-variant/30 text-secondary text-[9px] font-black tracking-widest uppercase mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          Live Queue Active
        </span>
        <h1 class="text-3xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-3 leading-tight uppercase italic">
          ESTÀS A LA CUA PER <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{{ eventName }}</span>
        </h1>
        <p class="text-on-surface-variant font-body text-sm max-w-lg mx-auto opacity-70" v-if="currentSpot > 0">
          Estem gestionant l'alta demanda. Mantén aquesta finestra oberta per assegurar el teu lloc.
        </p>
        <p class="text-secondary font-black uppercase tracking-widest text-xs animate-pulse mt-4" v-else>
          Preparant el teu accés al terminal...
        </p>
      </div>

      <!-- Bento-style Queue Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <!-- Spot Card -->
        <div class="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
          <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <span class="material-symbols-outlined text-4xl text-primary">group</span>
          </div>
          <p class="text-on-surface-variant font-label text-[9px] uppercase tracking-widest mb-1.5">La teva posició</p>
          <p class="text-4xl font-headline font-black text-primary tracking-tighter">{{ formattedSpot }}</p>
          <div class="mt-3 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div class="h-full bg-primary shadow-[0_0_10px_rgba(243,130,255,0.6)] transition-all duration-1000" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
        
        <!-- Wait Time Card -->
        <div class="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
          <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <span class="material-symbols-outlined text-4xl text-secondary">schedule</span>
          </div>
          <p class="text-on-surface-variant font-label text-[9px] uppercase tracking-widest mb-1.5">Temps estimat</p>
          <p class="text-4xl font-headline font-black text-secondary tracking-tighter">{{ waitTime }} min</p>
          <p class="mt-3 text-on-surface-variant text-[9px] font-body italic">No tanquis la sessió</p>
        </div>
      </div>

      <!-- Progressive Loader Section -->
      <div class="bg-surface p-8 rounded-[32px] relative overflow-hidden shadow-2xl border border-outline-variant/10">
        <div class="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x"></div>
        <div class="flex flex-col items-center gap-6">
          <div class="relative w-20 h-20 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-2 border-surface-container-highest"></div>
            <div class="absolute inset-0 rounded-full border-2 border-t-primary border-r-secondary border-b-transparent border-l-transparent animate-spin"></div>
            <span class="material-symbols-outlined text-2xl text-primary-fixed-dim">confirmation_number</span>
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center justify-center gap-2 text-error font-label font-semibold text-[9px] uppercase tracking-widest">
              <span class="material-symbols-outlined text-sm">warning</span>
              No refresquis la pàgina
            </div>
            <p class="text-on-surface-variant text-[10px] max-w-xs mx-auto opacity-60">
              Refrescar o sortir de la pàgina pot suposar la pèrdua del teu lloc a la cua.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const currentSpot = ref(0);
const progress = ref(0);
const eventName = ref('Carregant...');
const userId = ref(null);
let pollInterval = null;

const formattedSpot = computed(() => {
  return currentSpot.value === 0 ? '--' : currentSpot.value.toLocaleString();
});

const waitTime = computed(() => {
  if (currentSpot.value === 0) return '--';
  return Math.ceil(currentSpot.value / 50) + 1;
});

const fetchEventDetails = async (eventId) => {
  try {
    const res = await axios.get(`/api/events/${eventId}`);
    eventName.value = res.data.name;
  } catch (e) {
    console.error('Failed to load event details', e);
    eventName.value = 'Esdeveniment';
  }
};

const getUserId = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return null;
    }
    const res = await axios.get('/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.user?.id || res.data.id;
  } catch (e) {
    router.push('/login');
    return null;
  }
};

const checkStatus = async (eventId, uid) => {
  try {
    const res = await axios.get(`/rt-api/queue/check-status/${eventId}/${uid}`);
    if (res.data.status === 'ACTIVE') {
      clearInterval(pollInterval);
      router.push({ path: '/seats', query: { event_id: eventId }});
    } else if (res.data.status === 'QUEUE') {
      currentSpot.value = res.data.position;
      // Simple progress calculation based on position (assuming max 2000 for visual)
      progress.value = Math.max(5, Math.min(95, 100 - (currentSpot.value / 20)));
    }
  } catch (e) {
    console.error('Status check failed', e);
  }
};

onMounted(async () => {
  const eventId = route.query.event_id;
  if (!eventId) {
    router.push('/');
    return;
  }

  await fetchEventDetails(eventId);
  userId.value = await getUserId();

  if (userId.value) {
    try {
      // 1. Join queue
      const joinRes = await axios.post('/rt-api/queue/join', {
        eventId,
        userId: userId.value
      });

      if (joinRes.data.status === 'ACTIVE') {
        router.push({ path: '/seats', query: { event_id: eventId }});
      } else {
        currentSpot.value = joinRes.data.position;
        progress.value = Math.max(5, 100 - (currentSpot.value / 20));
        
        // 2. Start polling
        pollInterval = setInterval(() => {
          checkStatus(eventId, userId.value);
        }, 5000);
      }
    } catch (e) {
      console.error('Failed to join queue', e);
    }
  }
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>
