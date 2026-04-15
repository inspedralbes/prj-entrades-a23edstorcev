<template>
  <main class="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
    <!-- Atmospheric Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto space-y-10">
      <!-- Header de la secció -->
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="text-left text-on-surface">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-outline-variant/30 text-secondary text-[9px] font-black tracking-widest uppercase mb-4">
            Accessos Autoritzats
          </span>
          <h2 class="text-4xl font-black tracking-tighter uppercase italic leading-none">
            Els meus <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tickets</span>
          </h2>
          <p class="text-on-surface-variant mt-2 text-xs max-w-sm opacity-70">
            Llistat d'accessos confirmats per a la xarxa Neon Curator.
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="px-6 py-3 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl">
            <span class="text-[8px] font-black uppercase tracking-widest text-secondary block mb-0.5">Total</span>
            <span class="text-2xl font-headline font-black text-white text-center block">{{ sales.length }}</span>
          </div>
        </div>
      </header>

      <!-- Llista d'Entrades -->
      <div v-if="sales.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketItem 
          v-for="sale in sales" 
          :key="sale.id" 
          :sale="sale" 
        />
      </div>

      <!-- Estat buit -->
      <div v-else-if="!isLoading" class="py-24 text-center bg-surface/30 rounded-[32px] border border-outline-variant/10 backdrop-blur-sm">
        <div class="w-16 h-16 bg-background/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-outline-variant/20">
          <span class="material-symbols-outlined text-on-surface-variant opacity-30 text-2xl">confirmation_number</span>
        </div>
        <h3 class="text-xl font-black text-on-surface uppercase tracking-tight mb-3">Sense tickets actius</h3>
        <p class="text-on-surface-variant mb-8 max-w-xs mx-auto text-xs opacity-60 font-medium italic">
          Encara no has realitzat cap reserva.
        </p>
        <router-link to="/" class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-background font-black rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px] neon-glow-primary">
          EXPLORAR ESDEVENIMENTS
        </router-link>
      </div>
      
      <div v-else class="text-center p-24 animate-pulse text-on-surface-variant font-black uppercase tracking-widest text-[10px]">
        Sincronitzant arxius...
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TicketItem from '../components/TicketItem.vue';

const sales = ref([]);
const isLoading = ref(true);

const fetchMyTickets = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    isLoading.value = true;
    const response = await axios.get('/api/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    sales.value = response.data;
  } catch (error) {
    console.error('Error carregant entrades:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMyTickets();
});
</script>
