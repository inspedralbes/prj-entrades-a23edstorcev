<template>
  <div class="min-h-screen bg-background p-6 md:p-10">
    <header class="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-6">
        <div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
          <span class="material-symbols-outlined text-background text-2xl">monitoring</span>
        </div>
        <div>
          <h1 class="text-3xl font-black text-on-surface uppercase tracking-tighter italic">Live Monitor</h1>
          <p class="text-on-surface-variant text-[9px] font-black uppercase tracking-widest mt-1 opacity-60">Sincronització Global • {{ connectedUsers }} Nodes Actius</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="relative min-w-[250px]">
          <span class="absolute -top-2 left-3 bg-background px-2 text-[8px] font-black uppercase tracking-widest text-secondary z-10">Canviar Esdeveniment</span>
          <select 
            v-model="selectedEventId" 
            @change="handleEventChange"
            class="w-full bg-surface border border-outline-variant/30 text-on-surface px-4 py-3 rounded-xl outline-none focus:border-primary transition-all appearance-none cursor-pointer text-xs font-bold font-headline"
          >
            <option v-for="event in allEvents" :key="event.id" :value="event.id">
              {{ event.name }}
            </option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
            <span class="material-symbols-outlined text-sm">expand_more</span>
          </div>
        </div>

        <router-link to="/admin/events" class="bg-surface border border-outline-variant/10 px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-surface-bright transition-colors group text-on-surface">
          <span class="material-symbols-outlined text-secondary text-sm">arrow_back</span>
          <span class="text-[9px] font-black uppercase tracking-widest">Gestió</span>
        </router-link>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Panell de Mètriques -->
      <div class="space-y-6">
        <div v-for="stat in mainStats" :key="stat.label" 
             class="bg-surface p-6 rounded-3xl border border-outline-variant/10 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10 transition-all duration-700 group-hover:scale-150" :class="stat.bg"></div>
          <span class="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">{{ stat.label }}</span>
          <div class="flex items-baseline gap-2 mt-2">
            <span class="text-4xl font-black text-on-surface tracking-tighter">{{ stat.value }}</span>
            <span class="text-[9px] font-bold text-on-surface-variant opacity-40">/ {{ metrics.total }}</span>
          </div>
        </div>

        <!-- Live Log Terminal -->
        <div class="bg-black/40 rounded-3xl border border-outline-variant/10 p-6 font-mono overflow-hidden">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span class="text-[8px] font-black text-red-500 uppercase tracking-widest">Live Activity Feed</span>
          </div>
          <div id="logContainer" class="space-y-2 h-48 overflow-y-auto custom-scrollbar pr-2">
            <div v-for="(log, i) in activityLogs" :key="i" class="text-[9px] leading-tight border-l border-outline-variant/20 pl-2 py-1">
              <span class="text-secondary">[{{ log.time }}]</span> 
              <span class="text-on-surface" v-html="log.msg"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Mini Map -->
      <div class="lg:col-span-2 bg-surface rounded-[40px] border border-outline-variant/10 p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-xl font-black text-on-surface uppercase tracking-tighter italic">Estat del Terminal en Viu</h2>
          <div class="flex gap-4">
            <div v-for="item in legend" :key="item.label" class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" :class="item.color"></div>
              <span class="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">{{ item.label }}</span>
            </div>
          </div>
        </div>

        <div v-if="!isLoading" class="grid grid-cols-5 sm:grid-cols-10 gap-2 mx-auto flex-1 content-center">
          <div v-for="seat in liveSeats" :key="seat.id" 
               class="aspect-square w-8 md:w-10 rounded-lg border-2 transition-all duration-300 flex items-center justify-center relative overflow-hidden group/seat"
               :class="getMiniSeatClasses(seat)">
            <span class="text-[8px] font-black opacity-40 group-hover/seat:opacity-100 transition-opacity">{{ seat.number }}</span>
            <div v-if="seat.status === 'LOCKED'" class="absolute inset-0 bg-tertiary/20 animate-pulse"></div>
          </div>
        </div>
        <div v-else class="flex-1 flex items-center justify-center animate-pulse text-on-surface-variant font-black uppercase tracking-[0.3em] text-xs">
          Sincronitzant dades...
        </div>

        <div class="mt-12 pt-8 border-t border-outline-variant/10">
          <div class="h-2 bg-background rounded-full overflow-hidden flex shadow-inner">
            <div class="h-full bg-secondary transition-all duration-1000" :style="{ width: (metrics.available / metrics.total * 100) + '%' }"></div>
            <div class="h-full bg-tertiary transition-all duration-1000" :style="{ width: (metrics.locked / metrics.total * 100) + '%' }"></div>
            <div class="h-full bg-primary transition-all duration-1000" :style="{ width: (metrics.sold / metrics.total * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import socket from '../services/socket';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const selectedEventId = ref(route.query.event_id || '');
const allEvents = ref([]);
const eventName = ref('Monitor Global');
const liveSeats = ref([]);
const activityLogs = ref([]);
const isLoading = ref(false);

const metrics = ref({
  available: 0,
  locked: 0,
  sold: 0,
  total: 40
});

const connectedUsers = ref(0);
let metricsInterval = null;

const mainStats = computed(() => [
  { label: 'Disponibles', value: metrics.value.available, bg: 'bg-secondary' },
  { label: 'En Procés', value: metrics.value.locked, bg: 'bg-tertiary' },
  { label: 'Venuts', value: metrics.value.sold, bg: 'bg-primary' }
]);

const legend = [
  { label: 'Lliure', color: 'bg-secondary' },
  { label: 'Bloquejat', color: 'bg-tertiary' },
  { label: 'Venut', color: 'bg-outline-variant' }
];

const addToLog = (msg) => {
  const time = new Date().toLocaleTimeString('ca-ES', { hour12: false });
  activityLogs.value.unshift({ time, msg });
  if (activityLogs.value.length > 50) activityLogs.value.pop();
};

const getMiniSeatClasses = (seat) => {
  if (seat.status === 'SOLD') return 'bg-outline-variant border-transparent opacity-20';
  if (seat.status === 'LOCKED') return 'bg-tertiary border-tertiary shadow-[0_0_8px_rgba(143,96,250,0.3)]';
  return 'bg-secondary/5 border-secondary/10 text-secondary hover:border-secondary/40 hover:bg-secondary/10';
};

const updateMetricsLocally = () => {
  const stats = { available: 0, locked: 0, sold: 0, total: liveSeats.value.length };
  liveSeats.value.forEach(s => {
    if (s.status === 'SOLD') stats.sold++;
    else if (s.status === 'LOCKED') stats.locked++;
    else stats.available++;
  });
  metrics.value = stats;
};

const handleEventChange = () => {
  router.replace({ query: { event_id: selectedEventId.value } });
  initMonitoring();
};

const initMonitoring = async () => {
  if (!selectedEventId.value) return;
  isLoading.value = true;
  try {
    const [eRes, sRes] = await Promise.all([
      axios.get(`/api/events/${selectedEventId.value}`),
      axios.get(`/api/seats`, { params: { event_id: selectedEventId.value } })
    ]);
    eventName.value = eRes.data.name;
    liveSeats.value = sRes.data;
    activityLogs.value = [];
    updateMetricsLocally();
    addToLog(`Monitorització activa per a <b>${eventName.value}</b>`);
    socket.emit('metrics.get', { eventId: selectedEventId.value });
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const res = await axios.get('/api/events');
    allEvents.value = res.data;
    if (!selectedEventId.value && allEvents.value.length > 0) {
      selectedEventId.value = allEvents.value[0].id;
    }
  } catch (err) {
    console.error(err);
  }

  await initMonitoring();
  socket.connect();
  
  socket.on('metrics.update', (data) => {
    // Solo actualizamos si los datos del servidor son más recientes o si no tenemos locales
    connectedUsers.value = data.connected;
  });

  socket.on('seat.updated', (updatedSeat) => {
    if (updatedSeat.event_id === selectedEventId.value) {
      const index = liveSeats.value.findIndex(s => s.id === updatedSeat.id);
      if (index !== -1) {
        const seat = liveSeats.value[index];
        const oldStatus = seat.status;
        liveSeats.value[index] = { ...seat, ...updatedSeat };
        
        // Actualización reactiva de métricas sin esperar al poll
        updateMetricsLocally();

        // Log enriquecido
        let msg = `Seient ${seat.number}: ${oldStatus} ➔ <span class="text-primary">${updatedSeat.status}</span>`;
        if (updatedSeat.status === 'SOLD' && updatedSeat.user_name) {
          msg = `🔥 <b>${updatedSeat.user_name}</b> ha comprat el seient ${seat.number}`;
        } else if (updatedSeat.status === 'LOCKED') {
          msg = `🔒 Seient ${seat.number} bloquejat per usuari`;
        }
        addToLog(msg);
      }
    }
  });

  metricsInterval = setInterval(() => {
    if (selectedEventId.value) {
      socket.emit('metrics.get', { eventId: selectedEventId.value });
    }
  }, 5000);
});

onUnmounted(() => {
  socket.off('metrics.update');
  socket.off('seat.updated');
  if (metricsInterval) clearInterval(metricsInterval);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { @apply bg-transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-outline-variant/30 rounded-full; }
select { background-image: none; }
</style>
