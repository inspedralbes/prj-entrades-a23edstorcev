<template>
  <div class="min-h-[calc(100vh-160px)] flex items-center justify-center relative overflow-hidden">
    <!-- Decoració Animada -->
    <div class="absolute w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md px-6 text-center">
      <div class="bg-surface/80 border border-outline-variant/20 rounded-[32px] p-10 shadow-2xl backdrop-blur-xl">
        <!-- Capçalera del Form -->
        <header class="mb-12">
          <div class="inline-flex p-4 rounded-2xl bg-secondary/10 border border-secondary/20 mb-6 text-secondary shadow-[0_0_15px_rgba(83,221,252,0.2)] mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-4xl font-black text-on-surface tracking-tighter uppercase italic">Registre</h2>
          <p class="text-on-surface-variant text-sm mt-3 tracking-wide">Crea el teu compte per començar</p>
        </header>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div v-for="field in formFields" :key="field.id" class="space-y-2 text-left">
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
                  class="w-full group relative bg-secondary text-background font-black py-5 rounded-2xl shadow-2xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden">
            <div v-if="isLoading" class="flex items-center justify-center gap-3">
              <div class="w-5 h-5 border-[3px] border-background border-t-transparent rounded-full animate-spin"></div>
              <span>Creant compte...</span>
            </div>
            <span v-else class="flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-sm">
              Registrar-se
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </form>

        <footer class="mt-10 pt-8 border-t border-outline-variant/10 text-center">
          <p class="text-on-surface-variant text-xs mb-4">Ja tens un compte?</p>
          <router-link to="/login" class="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
            Inicia sessió aquí
          </router-link>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const formFields = [
  { id: 'name', model: 'name', type: 'text', label: 'Nom Complet', placeholder: 'El teu nom' },
  { id: 'email', model: 'email', type: 'email', label: 'Correu Electrònic', placeholder: 'usuari@ticketx.cat' },
  { id: 'password', model: 'password', type: 'password', label: 'Contrasenya', placeholder: '••••••••' },
  { id: 'password_confirmation', model: 'password_confirmation', type: 'password', label: 'Confirmar Contrasenya', placeholder: '••••••••' }
];

const handleRegister = async () => {
  isLoading.value = true;
  try {
    const response = await axios.post('/api/register', form);
    // Podem fer login automàtic o redirigir a login
    alert('Compte creat correctament! Ara pots iniciar sessió.');
    router.push('/login');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Error al crear el compte. Revisa les dades.';
    alert(errorMsg);
  } finally {
    isLoading.value = false;
  }
};
</script>
