<template>
  <main class="min-h-screen relative overflow-hidden py-10 px-6">
    <!-- Atmospheric Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative z-10 max-w-[1400px] mx-auto">
      <header class="mb-10 text-left">
        <span class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-surface border border-outline-variant/30 text-secondary text-[8px] font-black tracking-widest uppercase mb-3">
          Cartellera Live
        </span>
        <h1 class="text-3xl font-headline font-black tracking-tighter text-on-surface uppercase italic leading-none">
          PRÒXIMS <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ESDEVENIMENTS</span>
        </h1>
      </header>

      <!-- Grid més compacte i amb més columnes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="event in events" :key="event.id" 
             class="group bg-surface-container-low border border-outline-variant/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-lg flex flex-col">
          <div class="aspect-[4/3] bg-surface-container-highest relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10"></div>
            <div class="absolute top-2 right-2 z-20 bg-background/60 backdrop-blur-md px-2 py-1 rounded-lg border border-outline-variant/20">
               <p class="text-primary font-black text-[9px]">{{ formatDate(event.date) }}</p>
            </div>
            <img v-if="event.image_path" :src="`/storage/${event.image_path}`" 
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">
            <div v-else class="w-full h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 group-hover:scale-110 transition-transform duration-1000"></div>
          </div>
          
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="text-sm font-headline font-black text-on-surface uppercase tracking-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{{ event.name }}</h3>
            <p class="text-on-surface-variant text-[10px] line-clamp-2 mb-4 opacity-60 leading-tight flex-1">{{ event.description }}</p>
            
            <div class="flex items-center justify-between pt-3 border-t border-outline-variant/10">
              <div class="flex items-center gap-1.5 text-on-surface-variant">
                <span class="material-symbols-outlined text-[10px] opacity-50">location_on</span>
                <span class="text-[8px] font-black uppercase tracking-wider truncate max-w-[80px]">{{ event.location }}</span>
              </div>
              <router-link :to="{ path: '/cua', query: { event_id: event.id } }" 
                           class="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-primary hover:text-background transition-all">
                Reservar
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const events = ref([]);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' }).toUpperCase();
};

onMounted(async () => {
  try {
    const res = await axios.get('/api/events');
    events.value = res.data;
  } catch (err) {
    console.error('Error carregant esdeveniments:', err);
  }
});
</script>
