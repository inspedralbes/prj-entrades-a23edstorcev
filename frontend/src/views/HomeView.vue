<template>
  <main class="min-h-screen relative overflow-hidden">
    <!-- Atmospheric Background Elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 w-full max-w-4xl px-6 py-12 md:py-24 mx-auto text-center" v-if="featuredEvent">
      <!-- Editorial Headline Area -->
      <div class="mb-12">
        <span class="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container-high text-secondary font-label text-[10px] tracking-widest uppercase mb-6 border border-outline-variant/20">
          <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          Live Event Experience
        </span>
        <h1 class="text-5xl md:text-8xl font-headline font-black tracking-tighter text-on-surface mb-8 leading-none uppercase italic">
          EXPERIMENTA <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary">{{ featuredEvent.name }}</span>
        </h1>
        <p class="text-on-surface-variant font-body text-lg md:text-xl max-w-2xl mx-auto opacity-80 leading-relaxed mb-12">
          {{ featuredEvent.description }}
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <router-link :to="{ path: '/seats', query: { event_id: featuredEvent.id } }" class="px-10 py-5 bg-primary text-background font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm neon-glow-primary">
            Adquirir Accés
          </router-link>
          <router-link :to="{ path: '/cua', query: { event_id: featuredEvent.id } }" class="px-10 py-5 bg-surface border border-outline-variant/30 text-on-surface font-black rounded-2xl hover:bg-surface-bright transition-all uppercase tracking-widest text-sm">
            Veure Cua en Viu
          </router-link>
        </div>
      </div>

      <!-- Visual Context Imagery -->
      <div class="mt-24 relative h-[400px] rounded-[40px] overflow-hidden group border border-outline-variant/10 shadow-2xl">
        <img alt="Concert stage with laser lights" 
             class="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-[2000ms] ease-out" 
             src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIGNV6vwsddIe_37E_ODlyjdT7RWMpvRPfBTcpQtG6eRyz9xUrIca4sQvyn9a86vCGoO9pVbxhS47ONZOcvEQ029y7qJVBz9tWx0Dkc6ALnYHoV6xzFXjELz865RAzu7iC5cXs1-7bdzm6wNRYXo0V1TRNTdMTnJD3SbN7-4tVPveTJJn_0f1nSUxr0wFtg26-0_lN8w9mVTZ2I4Hi-1Eu5z2zeWvYWpshViH_n7w1kl7fP1MyB1-h0LiAUNFgr9UagWrqG2raFGY"/>
        <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        
        <div class="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div class="text-left">
            <p class="text-primary font-label text-[10px] uppercase tracking-[0.5em] font-black mb-3">Sessió Destacada</p>
            <h3 class="text-4xl font-headline font-black text-on-surface uppercase tracking-tighter italic">{{ featuredEvent.name }}</h3>
            <p class="text-on-surface-variant font-label text-xs tracking-widest mt-2 uppercase opacity-80">{{ featuredEvent.location }} • {{ formatDate(featuredEvent.date) }}</p>
          </div>
          
          <div class="flex items-center gap-4 bg-background/50 backdrop-blur-xl p-4 rounded-3xl border border-outline-variant/20">
            <div class="flex -space-x-3">
              <div v-for="i in 3" :key="i" class="w-10 h-10 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center overflow-hidden">
                <div class="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
              </div>
            </div>
            <div class="text-left">
              <div class="text-secondary font-black text-lg leading-none">+2.4k</div>
              <div class="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">Assistents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="relative z-10 min-h-[60vh] flex items-center justify-center text-on-surface-variant animate-pulse font-headline tracking-widest">
      Sincronitzant dades...
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const featuredEvent = ref(null);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

onMounted(async () => {
  try {
    const res = await axios.get('/api/events');
    if (res.data && res.data.length > 0) {
      featuredEvent.value = res.data[0]; // Select the first event as featured
    }
  } catch (err) {
    console.error('Error carregant l\'esdeveniment destacat:', err);
  }
});
</script>
