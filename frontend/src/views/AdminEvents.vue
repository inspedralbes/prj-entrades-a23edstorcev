<template>
  <div class="min-h-screen bg-background p-8 md:p-12">
    <header class="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center shadow-2xl shadow-secondary/20">
          <span class="material-symbols-outlined text-background text-3xl font-bold">calendar_month</span>
        </div>
        <div>
          <h1 class="text-4xl font-black text-on-surface uppercase tracking-tighter italic">Gestió d'Esdeveniments</h1>
          <p class="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Panell d'Administració • Control Total</p>
        </div>
      </div>
      
      <button @click="openCreateModal" class="px-8 py-4 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs neon-glow-primary">
        Nou Esdeveniment
      </button>
    </header>

    <!-- Taula d'Esdeveniments -->
    <div class="bg-surface rounded-[40px] border border-outline-variant/10 overflow-hidden shadow-2xl">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high border-b border-outline-variant/10">
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary">Nom</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary">Ubicació</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary">Data</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Accions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/5">
          <tr v-for="event in events" :key="event.id" class="hover:bg-surface-bright/30 transition-colors group">
            <td class="px-8 py-6">
              <div class="text-on-surface font-headline font-bold text-lg">{{ event.name }}</div>
              <div class="text-on-surface-variant text-xs mt-1 line-clamp-1 opacity-60">{{ event.description }}</div>
            </td>
            <td class="px-8 py-6 text-on-surface-variant font-medium">{{ event.location }}</td>
            <td class="px-8 py-6 text-on-surface-variant font-mono text-sm">{{ formatDate(event.date) }}</td>
            <td class="px-8 py-6 text-right">
              <div class="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <router-link :to="{ path: '/admin', query: { event_id: event.id } }" class="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors" title="Monitoritzar en viu">
                  <span class="material-symbols-outlined">analytics</span>
                </router-link>
                <button @click="openEditModal(event)" class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button @click="deleteEvent(event.id)" class="p-2 text-error hover:bg-error/10 rounded-lg transition-colors">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="events.length === 0" class="p-20 text-center text-on-surface-variant font-black uppercase tracking-[0.3em] opacity-30">
        No hi ha esdeveniments registrats
      </div>
    </div>

    <!-- Modal de Creació/Edició -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showingModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-background/90 backdrop-blur-md" @click="closeModal"></div>
          
          <div class="relative bg-surface w-full max-w-2xl rounded-[32px] border border-outline-variant/20 shadow-2xl overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
            
            <div class="p-10">
              <h3 class="text-3xl font-black mb-8 uppercase tracking-tighter text-on-surface italic">
                {{ isEditing ? 'Editar Esdeveniment' : 'Crear Esdeveniment' }}
              </h3>
              
              <form @submit.prevent="saveEvent" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Nom de l'Esdeveniment</label>
                    <input v-model="formData.name" required type="text" class="w-full bg-background border border-outline-variant/20 rounded-2xl px-6 py-4 text-on-surface focus:border-primary transition-all outline-none" placeholder="Ex: Cyberpunk Rhythms">
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Ubicació</label>
                    <input v-model="formData.location" required type="text" class="w-full bg-background border border-outline-variant/20 rounded-2xl px-6 py-4 text-on-surface focus:border-primary transition-all outline-none" placeholder="Ex: Palau Sant Jordi, Barcelona">
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Imatge de l'Esdeveniment</label>
                  
                  <!-- Preview de imagen existente -->
                  <div v-if="isEditing && currentEventImagePath" class="mb-4 relative w-full h-32 rounded-2xl overflow-hidden border border-outline-variant/20 bg-background flex items-center justify-center">
                    <img :src="`/storage/${currentEventImagePath}`" class="w-full h-full object-cover opacity-50">
                    <div class="absolute inset-0 flex items-center justify-center bg-background/40">
                      <p class="text-[8px] font-black uppercase tracking-widest text-on-surface">Imatge Actual</p>
                    </div>
                  </div>

                  <input type="file" @change="handleFileUpload" accept="image/*" class="w-full bg-background border border-outline-variant/20 rounded-2xl px-6 py-4 text-on-surface focus:border-primary transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20">
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between ml-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-secondary">Fechas del Evento</label>
                    <button type="button" @click="addDate" class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">+ Añadir Fecha</button>
                  </div>
                  
                  <div v-for="(dateObj, index) in formData.dates" :key="index" class="flex gap-4 items-center animate-in fade-in slide-in-from-left-4 duration-300">
                    <input v-model="dateObj.date" required type="datetime-local" class="flex-1 bg-background border border-outline-variant/20 rounded-2xl px-6 py-4 text-on-surface focus:border-primary transition-all outline-none">
                    <button type="button" @click="removeDate(index)" class="p-4 text-error hover:bg-error/10 rounded-2xl transition-colors" v-if="formData.dates.length > 1">
                      <span class="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-secondary ml-2">Descripció</label>
                  <textarea v-model="formData.description" rows="4" class="w-full bg-background border border-outline-variant/20 rounded-2xl px-6 py-4 text-on-surface focus:border-primary transition-all outline-none resize-none" placeholder="Detalls de l'esdeveniment..."></textarea>
                </div>

                <div class="flex gap-4 pt-6">
                  <button type="submit" class="flex-1 px-8 py-4 bg-primary text-background font-black rounded-2xl shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm neon-glow-primary">
                    {{ isEditing ? 'Actualitzar' : 'Sincronitzar Nou Event' }}
                  </button>
                  <button type="button" @click="closeModal" class="px-8 py-4 text-on-surface-variant hover:text-on-surface font-bold transition-all uppercase tracking-widest text-xs">
                    Cancel·lar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const events = ref([]);
const showingModal = ref(false);
const isEditing = ref(false);
const currentId = ref(null);
const currentEventImagePath = ref(null);

const formData = ref({
  name: '',
  location: '',
  date: '',
  dates: [{ date: '' }],
  description: ''
});

const selectedFile = ref(null);

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const addDate = () => {
  formData.value.dates.push({ date: '' });
};

const removeDate = (index) => {
  formData.value.dates.splice(index, 1);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('ca-ES', { 
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const fetchEvents = async () => {
  try {
    const res = await axios.get('/api/events');
    events.value = res.data;
  } catch (err) {
    console.error('Error carregant esdeveniments:', err);
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  currentId.value = null;
  selectedFile.value = null;
  formData.value = { 
    name: '', 
    location: '', 
    date: '', 
    dates: [{ date: '' }], 
    description: '' 
  };
  showingModal.value = true;
};

const openEditModal = (event) => {
  isEditing.value = true;
  currentId.value = event.id;
  currentEventImagePath.value = event.image_path;
  selectedFile.value = null;
  
  const date = new Date(event.date);
  const formattedDate = date.toISOString().slice(0, 16);
  
  let eventDates = [{ date: formattedDate }];
  if (event.dates && Array.isArray(event.dates) && event.dates.length > 0) {
    eventDates = event.dates.map(d => ({
      date: new Date(d.date).toISOString().slice(0, 16)
    }));
  }
  
  formData.value = { 
    name: event.name, 
    location: event.location, 
    date: formattedDate,
    dates: eventDates,
    description: event.description 
  };
  showingModal.value = true;
};

const closeModal = () => {
  showingModal.value = false;
};

const saveEvent = async () => {
  try {
    const data = new FormData();
    data.append('name', formData.value.name);
    data.append('location', formData.value.location);
    data.append('description', formData.value.description || '');
    
    if (formData.value.dates.length > 0) {
      data.append('date', formData.value.dates[0].date);
      data.append('dates', JSON.stringify(formData.value.dates));
    }

    if (selectedFile.value) {
      data.append('image', selectedFile.value);
    }

    if (isEditing.value) {
      // Laravel tiene problemas con PUT y FormData, usamos POST con _method
      data.append('_method', 'PUT');
      await axios.post(`/api/events/${currentId.value}`, data);
    } else {
      await axios.post('/api/events', data);
    }
    await fetchEvents();
    closeModal();
  } catch (err) {
    console.error('Error desant l\'esdeveniment:', err);
    const message = err.response?.data?.message || 'Error al desar l\'esdeveniment.';
    const errors = err.response?.data?.errors;
    if (errors) {
      const detail = Object.values(errors).flat().join('\n');
      alert(`${message}\n\n${detail}`);
    } else {
      alert(message);
    }
  }
};

const deleteEvent = async (id) => {
  if (confirm('Estàs segur que vols eliminar aquest esdeveniment?')) {
    try {
      await axios.delete(`/api/events/${id}`);
      await fetchEvents();
    } catch (err) {
      console.error('Error eliminant l\'esdeveniment:', err);
    }
  }
};

onMounted(fetchEvents);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease-out; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
</style>
