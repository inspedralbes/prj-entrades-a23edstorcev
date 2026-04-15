<template>
  <main class="min-h-screen relative overflow-hidden py-24 px-6 bg-background">
    <!-- Atmospheric Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full opacity-30"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full opacity-30"></div>
    </div>

    <div v-if="event" class="relative z-10 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <!-- Event Visuals -->
        <div class="space-y-8">
          <div class="aspect-[4/5] rounded-[48px] overflow-hidden bg-surface-container-low border border-outline-variant/10 shadow-3xl group relative">
            <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-60"></div>
            
            <img v-if="event.image_path" :src="`/storage/${event.image_path}`" 
                 class="w-full h-full object-cover">
            <div v-else class="w-full h-full bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-8xl text-primary/30 animate-pulse">event</span>
            </div>
            
            <div class="absolute bottom-12 left-12 right-12 z-20">
               <span class="px-4 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary font-label text-[10px] tracking-widest uppercase border border-primary/30 mb-4 inline-block">
                 Official Event
               </span>
               <h2 class="text-4xl font-headline font-black text-on-surface uppercase tracking-tighter leading-none mb-2">{{ event.name }}</h2>
               <p class="text-on-surface-variant text-sm font-label flex items-center gap-2">
                 <span class="material-symbols-outlined text-sm">location_on</span>
                 {{ event.location }}
               </p>
            </div>
          </div>
        </div>

        <!-- Event Information & Date Selection -->
        <div class="flex flex-col h-full justify-center space-y-12">
          <header>
            <h1 class="text-6xl md:text-8xl font-headline font-black tracking-tighter text-on-surface uppercase italic leading-[0.85] mb-8">
              DETALLS DEL <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">SOU</span>
            </h1>
            <p class="text-on-surface-variant text-lg md:text-xl font-body leading-relaxed max-w-xl opacity-80">
              {{ event.description }}
            </p>
          </header>

          <div class="space-y-6">
            <h3 class="text-sm font-label font-black text-primary uppercase tracking-[0.2em]">Dias Disponibles</h3>
            <div class="grid grid-cols-1 gap-4">
              <!-- Dates List -->
              <button v-for="(dateObj, index) in allDates" :key="index"
                      @click="handleReservation(dateObj)" 
                      class="flex items-center justify-between p-6 bg-surface-container-high border border-outline-variant/10 rounded-3xl hover:border-primary/50 hover:bg-surface-container-highest transition-all group">
                <div class="flex items-center gap-6">
                  <div class="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-background border border-outline-variant/20 group-hover:bg-primary/10 transition-colors">
                    <span class="text-[10px] font-black uppercase text-on-surface-variant group-hover:text-primary">{{ getMonth(dateObj.date) }}</span>
                    <span class="text-2xl font-black text-on-surface">{{ getDay(dateObj.date) }}</span>
                  </div>
                  <div class="text-left">
                    <p class="text-on-surface font-black uppercase tracking-widest text-sm">General Admission</p>
                    <p class="text-on-surface-variant text-xs font-label">Portes a les {{ getHours(dateObj.date) }}h</p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  <span class="text-[10px] font-black text-secondary uppercase tracking-widest">Disponible</span>
                </div>
              </button>
            </div>
          </div>

          <div class="pt-12 border-t border-outline-variant/10">
            <div class="flex items-center gap-4 text-xs font-label text-on-surface-variant opacity-60">
              <span class="material-symbols-outlined text-sm">info</span>
              <p>Al fer clic a "Reservar", podràs entrar en una cua virtual si hi ha molta demanda per garantir una compra justa.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const event = ref(null);

const allDates = computed(() => {
  if (!event.value) return [];
  
  // Combinar la fecha principal con las fechas adicionales del array 'dates'
  const dates = [];
  if (event.value.date) {
    dates.push({ date: event.value.date });
  }
  
  if (event.value.dates && Array.isArray(event.value.dates)) {
    event.value.dates.forEach(d => {
      // Evitar duplicar la fecha principal si ya está en el array
      if (d.date !== event.value.date) {
        dates.push(d);
      }
    });
  }
  
  // Ordenar fechas cronológicamente
  return dates.sort((a, b) => new Date(a.date) - new Date(b.date));
});

const getMonth = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ca-ES', { month: 'short' });
};

const getDay = (dateStr) => {
  const date = new Date(dateStr);
  return date.getDate();
};

const getHours = (dateStr) => {
  const date = new Date(dateStr);
  return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
};

const handleReservation = async (dateObj) => {
  if (!event.value) return;
  
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.id || 'guest-' + Math.random().toString(36).substr(2, 9);

    const res = await axios.post('/rt-api/queue/join', {
      eventId: event.value.id,
      userId: userId
    });

    if (res.data.status === 'ACTIVE') {
      // Si no hay demanda, directo a selección de asientos
      router.push({ path: '/seats', query: { event_id: event.value.id } });
    } else {
      // Si hay demanda, a la página de cola con su posición inicial
      router.push({ 
        path: '/cua', 
        query: { 
          event_id: event.value.id, 
          position: res.data.position,
          user_id: userId
        } 
      });
    }
  } catch (err) {
    console.error('Error al unirse a la cola:', err);
    // Fallback: ir a la cola de todos modos para que el usuario no se quede bloqueado
    router.push({ path: '/cua', query: { event_id: event.value.id } });
  }
};

onMounted(async () => {
  try {
    const res = await axios.get(`/api/events/${route.params.id}`);
    event.value = res.data;
  } catch (err) {
    console.error('Error carregant l\'esdeveniment:', err);
    router.push('/events');
  }
});
</script>
