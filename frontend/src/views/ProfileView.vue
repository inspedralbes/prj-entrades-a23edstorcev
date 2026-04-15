<template>
  <main class="min-h-screen pt-32 pb-12 px-6 relative overflow-hidden">
    <!-- Atmospheric Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative z-10 max-w-2xl mx-auto">
      <header class="mb-12 text-center">
        <div class="relative group mx-auto mb-6 w-32 h-32">
          <div class="w-full h-full bg-surface border border-primary/20 rounded-full flex items-center justify-center shadow-2xl shadow-primary/10 overflow-hidden">
            <img v-if="auth.user.value?.profile_photo_path" :src="`http://localhost:8000/storage/${auth.user.value.profile_photo_path}`" class="w-full h-full object-cover">
            <span v-else class="material-symbols-outlined text-primary text-6xl">account_circle</span>
          </div>
          <label class="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
            <span class="material-symbols-outlined">photo_camera</span>
            <input type="file" @change="updatePhoto" class="hidden" accept="image/*">
          </label>
        </div>
        <h1 class="text-4xl font-black text-on-surface uppercase tracking-tighter italic">{{ auth.user.value?.name }}</h1>
        <p class="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Panell de Control d'Identitat</p>
      </header>

      <div v-if="auth.user.value" class="bg-surface rounded-[40px] border border-outline-variant/10 p-10 shadow-2xl space-y-8">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Nom Complet</label>
          <div class="flex gap-4">
            <input v-model="userName" class="flex-1 bg-background border border-outline-variant/20 rounded-2xl px-8 py-5 text-on-surface font-bold text-lg focus:border-primary outline-none transition-all">
            <button @click="updateName" class="px-6 py-4 bg-primary/10 text-primary font-black rounded-2xl hover:bg-primary hover:text-background transition-all uppercase tracking-widest text-[10px]">Guardar</button>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Correu Electrònic</label>
          <div class="w-full bg-background border border-outline-variant/20 rounded-2xl px-8 py-5 text-on-surface font-mono opacity-80">
            {{ auth.user.value.email }}
          </div>
        </div>

        <div class="pt-6 border-t border-outline-variant/10 flex justify-between items-center">
          <div class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant italic">ID de Sessió Activa</div>
          <div class="text-[10px] font-mono text-primary uppercase opacity-40">{{ auth.user.value.id }}</div>
        </div>
      </div>
      
      <div v-else class="text-center p-20 animate-pulse text-on-surface-variant font-black uppercase tracking-widest">
        Autenticant...
      </div>
    </div>
  </main>
</template>

<script setup>
import auth from '../services/auth';
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';

const userName = ref('');

onMounted(async () => {
  await auth.checkAuth();
  if (auth.user.value) {
    userName.value = auth.user.value.name;
  }
});

watch(auth.user, (newVal) => {
  if (newVal) userName.value = newVal.name;
});

const updateName = async () => {
  try {
    const res = await axios.post('/api/profile/update', { name: userName.value });
    auth.user.value = res.data.user;
    alert('Nom actualitzat!');
  } catch (err) {
    console.error(err);
    alert('Error al actualitzar el nom');
  }
};

const updatePhoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await axios.post('/api/profile/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    auth.user.value = res.data.user;
    // Forzar recarga de la imagen si es necesario
    alert('Foto de perfil actualitzada!');
  } catch (err) {
    console.error(err);
    alert('Error al pujar la foto');
  }
};
</script>
