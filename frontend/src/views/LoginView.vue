<template>
  <div class="min-h-[calc(100vh-160px)] flex items-center justify-center relative overflow-hidden">
    <!-- Decoració Animada -->
    <div class="absolute w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md px-6 text-center">
      <div class="bg-surface/80 border border-outline-variant/20 rounded-[32px] p-10 shadow-2xl backdrop-blur-xl">
        <!-- Capçalera del Form -->
        <header class="mb-12">
          <div class="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-6 text-primary shadow-[0_0_15px_rgba(243,130,255,0.2)] mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-4xl font-black text-on-surface tracking-tighter uppercase italic">Accés</h2>
          <p class="text-on-surface-variant text-sm mt-3 tracking-wide">Autenticació requerida per a la reserva</p>
        </header>

        <form @submit.prevent="handleLogin" class="space-y-8">
          <div v-for="field in formFields" :key="field.id" class="space-y-3 text-left">
            <label :for="field.id" class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1">
              {{ field.label }}
            </label>
            <div class="relative">
              <input v-model="form[field.model]" :id="field.id" :type="field.type" required
                     class="w-full bg-background/50 border border-outline-variant/30 rounded-2xl px-5 py-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-slate-700"
                     :placeholder="field.placeholder" />
            </div>
          </div>

          <!-- Botó d'Acció -->
          <button type="submit" :disabled="isLoading"
                  class="w-full group relative bg-primary text-background font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden">
            <div v-if="isLoading" class="flex items-center justify-center gap-3">
              <div class="w-5 h-5 border-[3px] border-background border-t-transparent rounded-full animate-spin"></div>
              <span>Sincronitzant...</span>
            </div>
            <span v-else class="flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-sm">
              Entrar al Sistema
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </form>

        <footer class="mt-10 pt-8 border-t border-outline-variant/10 text-center">
          <p class="text-on-surface-variant text-xs mb-4">No tens un compte?</p>
          <router-link to="/register" class="text-secondary font-black uppercase tracking-widest text-[10px] hover:underline">
            Crea un compte nou aquí
          </router-link>
          
          <div class="mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 italic">
            <div class="w-1 h-1 rounded-full bg-secondary animate-ping"></div>
            Node Segur Detectat
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import auth from '../services/auth';

const router = useRouter();
const isLoading = ref(false);

const form = reactive({
  email: '',
  password: ''
});

const formFields = [
  { id: 'email', model: 'email', type: 'email', label: 'Identificador (Email)', placeholder: 'usuari@neon.com' },
  { id: 'password', model: 'password', type: 'password', label: 'Clau d\'Accés', placeholder: '••••••••' }
];

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const response = await axios.post('/api/login', form);
    await auth.handleLoginSuccess(response.data.access_token);
    router.push('/');
  } catch (error) {
    alert('Error de connexió: Clau no vàlida');
  } finally {
    isLoading.value = false;
  }
};
</script>
