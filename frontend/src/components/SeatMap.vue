<template>
  <div class="space-y-6 pb-24 max-w-[1200px] mx-auto px-4">
    <!-- Header Reactiu (Molt més compacte) -->
    <header class="sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 -mx-4 px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 transition-all duration-500">
      <div class="flex items-center gap-3 text-left w-full md:w-auto">
        <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface border border-outline-variant/20">
          <div class="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" 
               :class="isConnected ? 'bg-secondary animate-pulse' : 'bg-red-500'"></div>
          <span class="text-[8px] font-black uppercase tracking-widest" 
                :class="isConnected ? 'text-secondary' : 'text-red-400'">
            {{ isConnected ? 'En Línia' : 'Offline' }}
          </span>
        </div>
        <h2 class="text-lg font-black text-on-surface tracking-tighter uppercase italic">
          {{ eventInfo ? eventInfo.name : 'Terminal' }}
        </h2>
        <p v-if="eventInfo" class="text-on-surface-variant text-[8px] font-black uppercase tracking-widest ml-1 opacity-50">
          {{ eventInfo.location }}
        </p>
      </div>

      <!-- Temporitzador Reactiu Compacte -->
      <Transition name="fade">
        <div v-if="lockTimer > 0" 
             class="flex items-center gap-3 bg-surface px-3 py-1.5 rounded-lg border border-primary/20 shadow-lg shadow-primary/5">
          <span class="text-on-surface-variant text-[8px] font-black uppercase tracking-widest">Sessió:</span>
          <div class="text-primary font-mono text-xl font-black tabular-nums drop-shadow-[0_0_8px_rgba(243,130,255,0.6)]">
            {{ formattedTime }}
          </div>
        </div>
      </Transition>
    </header>

    <!-- Mapa de Seients -->
    <section class="bg-surface rounded-3xl border border-outline-variant/10 p-6 md:p-10 shadow-xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-40 h-48 bg-secondary/5 blur-[60px] rounded-full group-hover:bg-secondary/10 transition-colors duration-1000 pointer-events-none"></div>
      
      <div class="relative z-10">
        <div class="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-12 relative opacity-30">
          <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-primary text-[8px] font-black uppercase tracking-[0.4em] animate-pulse whitespace-nowrap italic">ESCENARI</div>
        </div>

        <div v-if="!isLoading && seats.length > 0" class="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-2 mx-auto">
          <SeatItem 
            v-for="seat in seats" 
            :key="seat.id"
            :seat="seat"
            :isMyLock="isMyLock(seat)"
            @select="handleSeatSelection"
          />
        </div>

        <div v-else-if="!isLoading" class="py-12 text-center text-on-surface-variant font-black uppercase tracking-widest opacity-30 text-[10px]">
          No s'han trobat seients
        </div>

        <div v-else class="py-12 text-center text-on-surface-variant animate-pulse font-black uppercase tracking-widest text-[10px]">
          Carregant Terminal...
        </div>
      </div>

      <footer class="mt-10 flex flex-wrap justify-center gap-4 border-t border-outline-variant/10 pt-6 text-[8px] font-black uppercase tracking-widest">
        <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-1.5" :class="{ 'opacity-30': item.status === 'SOLD' }">
          <div class="w-2 h-2 rounded-full" :class="item.colorClass"></div>
          <span :class="item.textClass">{{ item.label }}</span>
        </div>
      </footer>
    </section>

    <!-- Barra d'Acció de Pagament -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedSeats.length > 0" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
          <div class="bg-surface/90 backdrop-blur-2xl border border-primary/30 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 neon-glow-primary">
            <div class="flex items-center gap-4">
              <div class="bg-background/50 px-3 py-1.5 rounded-lg border border-outline-variant/20">
                <span class="text-[7px] font-black uppercase tracking-widest text-secondary block">Seleccionats</span>
                <span class="text-sm font-black text-white leading-none">{{ selectedSeats.length }} seients</span>
              </div>
              <div>
                <span class="text-[7px] font-black uppercase tracking-widest text-on-surface-variant block">Total</span>
                <span class="text-lg font-black text-primary">{{ totalPrice }}€</span>
              </div>
            </div>
            
            <button @click="executePurchase" 
                    class="px-6 py-3 bg-primary text-background font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px]">
              Finalitzar Pago
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import socket, { isConnected } from '../services/socket';
import SeatItem from './SeatItem.vue';

const route = useRoute();
const router = useRouter();
const seats = ref([]);
const eventInfo = ref(null);
const userId = ref(null);
const lockTimer = ref(0);
const selectedSeats = ref([]);
const isLoading = ref(true);
let timerInterval = null;

const legendItems = [
  { label: 'Lliure', colorClass: 'bg-secondary shadow-[0_0_8px_rgba(83,221,252,0.6)]', textClass: 'text-on-surface-variant', status: 'AVAILABLE' },
  { label: 'Reservat', colorClass: 'bg-tertiary', textClass: 'text-on-surface-variant', status: 'LOCKED' },
  { label: 'Selecció', colorClass: 'bg-primary shadow-[0_0_8px_rgba(243,130,255,0.6)]', textClass: 'text-primary', status: 'MY_LOCK' },
  { label: 'Venut', colorClass: 'bg-outline-variant', textClass: 'text-on-surface-variant', status: 'SOLD' }
];

const formattedTime = computed(() => {
  const m = Math.floor(lockTimer.value / 60);
  const s = lockTimer.value % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
});

const totalPrice = computed(() => {
  return selectedSeats.value.reduce((sum, seat) => sum + parseFloat(seat.price), 0);
});

const isMyLock = (seat) => {
  return seat.status === 'LOCKED' && String(seat.u) === String(userId.value);
};

const handleSeatSelection = (seat) => {
  const eventId = route.query.event_id;
  socket.emit('seat.select', { seatId: seat.id, eventId });
};

const executePurchase = async () => {
  if (selectedSeats.value.length > 0) {
    localStorage.setItem('selected_seats', JSON.stringify(selectedSeats.value));
    router.push('/pago');
  }
};

const handleAbandon = async () => {
  const eventId = route.query.event_id;
  if (eventId && userId.value) {
    try {
      // Liberar cola y asientos en una sola llamada al servidor de tiempo real
      await axios.post('/rt-api/queue/leave', { eventId, userId: userId.value });
      selectedSeats.value = [];
    } catch (e) {
      console.error('Abandon failed', e);
    }
  }
};

const startTimer = (seconds) => {
  if (timerInterval) return;
  lockTimer.value = seconds;
  timerInterval = setInterval(async () => {
    if (lockTimer.value > 0) {
      lockTimer.value--;
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      await handleAbandon();
      alert('La teva sessió de reserva ha caducat.');
      router.push('/');
    }
  }, 1000);
};

onMounted(async () => {
  const eventId = route.query.event_id;
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const [seatsRes, eventRes, meRes] = await Promise.all([
      axios.get('/api/seats', { params: { event_id: eventId } }),
      eventId ? axios.get(`/api/events/${eventId}`) : Promise.resolve(null),
      token ? axios.get('/api/me', { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve(null)
    ]);
    seats.value = seatsRes.data || [];
    if (eventRes) eventInfo.value = eventRes.data;
    if (meRes) userId.value = meRes.data.user?.id || meRes.data.id;

    if (userId.value) {
      selectedSeats.value = seats.value.filter(s => isMyLock(s));
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }

  const token = localStorage.getItem('token');
  if (token) {
    socket.auth.token = token;
    socket.connect();
    socket.on('seat.updated', (updatedSeat) => {
      const index = seats.value.findIndex(s => s.id === updatedSeat.id);
      if (index !== -1) {
        seats.value[index] = { ...seats.value[index], ...updatedSeat };
        if (userId.value) {
          if (isMyLock(seats.value[index])) {
            if (!selectedSeats.value.find(s => s.id === updatedSeat.id)) selectedSeats.value.push(seats.value[index]);
          } else {
            selectedSeats.value = selectedSeats.value.filter(s => s.id !== updatedSeat.id);
          }
        }
      }
    });
    
    socket.on('lock.confirmed', () => startTimer(600));
    
    socket.on('lock.status.result', (locks) => {
      if (locks.length > 0) {
        const maxTTL = Math.max(...locks.map(l => l.ttl));
        startTimer(maxTTL);
        locks.forEach(lock => {
          const seat = seats.value.find(s => s.id === lock.seatId);
          if (seat && !selectedSeats.value.find(s => s.id === seat.id)) selectedSeats.value.push(seat);
        });
      }
    });
    socket.emit('lock.status', { eventId });
  }
});

onUnmounted(() => {
  handleAbandon();
  socket.off('seat.updated');
  socket.off('lock.confirmed');
  socket.off('lock.status.result');
  socket.disconnect();
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(20px); }
</style>
