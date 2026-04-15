<template>
  <nav class="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-2xl shadow-2xl shadow-black/40 h-20 flex justify-between items-center px-8 font-headline tracking-tight border-b border-outline-variant/10">
    <router-link to="/" class="text-2xl font-black italic tracking-tighter text-primary">TICKET</router-link>
    
    <div class="hidden md:flex items-center gap-8">
      <router-link class="text-on-surface hover:text-secondary transition-colors hover:opacity-80 transition-all duration-300 font-label text-[10px] uppercase tracking-widest font-black" to="/events">Esdeveniments</router-link>
      <router-link v-if="auth.isAdmin.value" class="text-on-surface hover:text-secondary transition-colors hover:opacity-80 transition-all duration-300 font-label text-[10px] uppercase tracking-widest font-black" to="/admin">Monitor</router-link>
    </div>

    <div class="flex items-center gap-6">
      <!-- Usuari Autenticat -->
      <div v-if="auth.isAuthenticated.value" class="relative group">
        <button class="scale-95 active:scale-90 transition-transform hover:opacity-80 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-3xl">account_circle</span>
          <span class="hidden md:block text-[9px] font-black uppercase tracking-widest text-on-surface">{{ auth.user.value?.name }}</span>
        </button>
        
        <!-- Dropdown Menu -->
        <div class="absolute right-0 top-full mt-2 w-48 bg-surface border border-outline-variant/20 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] overflow-hidden">
          <router-link to="/perfil" class="flex items-center gap-3 px-6 py-4 hover:bg-surface-bright transition-colors text-[9px] font-black uppercase tracking-widest text-on-surface border-b border-outline-variant/10">
            <span class="material-symbols-outlined text-primary text-lg">person</span>
            Perfil
          </router-link>
          <router-link to="/entrades" class="flex items-center gap-3 px-6 py-4 hover:bg-surface-bright transition-colors text-[9px] font-black uppercase tracking-widest text-on-surface border-b border-outline-variant/10">
            <span class="material-symbols-outlined text-primary text-lg">confirmation_number</span>
            Les meves entrades
          </router-link>
          <button @click="auth.logout()" class="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-500/10 transition-colors text-[9px] font-black uppercase tracking-widest text-red-400">
            <span class="material-symbols-outlined text-lg">logout</span>
            Tancar sessió
          </button>
        </div>
      </div>

      <!-- Usuari no autenticat -->
      <router-link v-else to="/login" class="scale-95 active:scale-90 transition-transform hover:opacity-80 flex items-center">
        <span class="material-symbols-outlined text-primary text-3xl">account_circle</span>
      </router-link>
      
      <button class="scale-95 active:scale-90 transition-transform hover:opacity-80 flex items-center">
        <span class="material-symbols-outlined text-primary text-3xl">shopping_bag</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import auth from '../services/auth';
import { onMounted } from 'vue';

onMounted(() => {
  auth.checkAuth();
});
</script>
