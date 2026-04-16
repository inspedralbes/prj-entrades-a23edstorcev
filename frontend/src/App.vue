<template>
  <div class="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary font-body">
    <TopNavBar />
    
    <main class="pt-20 min-h-screen">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-surface-container border-t border-outline-variant/10 py-20 px-8 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
        <div class="space-y-4">
          <div class="text-2xl font-black italic tracking-tighter text-primary">TICKETX</div>
          <p class="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Architecting Soundscapes • Since 2026</p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-8">
          <a v-for="link in footerLinks" :key="link" href="#" class="text-on-surface-variant hover:text-secondary transition-all font-label text-[10px] tracking-[0.2em] uppercase font-black opacity-60 hover:opacity-100">{{ link }}</a>
        </div>
        
        <div class="text-on-surface-variant font-label text-[10px] tracking-[0.2em] uppercase font-black opacity-40">
          © 2026 TICKETX. TOTS ELS DRETS RESERVATS.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import TopNavBar from './components/TopNavBar.vue';

const footerLinks = ['Termes de Servei', 'Privacitat', 'Ajuda', 'Accessibilitat'];
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  @apply bg-background;
}
::-webkit-scrollbar-thumb {
  @apply bg-outline-variant/30 rounded-full hover:bg-primary/50 transition-colors;
}
</style>
