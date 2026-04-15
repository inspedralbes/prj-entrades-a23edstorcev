<template>
  <main class="min-h-screen py-24 px-6 bg-background relative overflow-hidden">
    <!-- Atmospheric Background -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full opacity-30"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full opacity-30"></div>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto">
      <header class="mb-12">
        <h1 class="text-6xl md:text-8xl font-headline font-black tracking-tighter text-on-surface uppercase italic leading-[0.85] mb-4">
          FINALITZAR <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">PAGO</span>
        </h1>
        <p class="text-on-surface-variant text-lg font-body opacity-80">
          Revisa la teva comanda i completa els detalls de pagament.
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Order Summary -->
        <div class="space-y-6">
          <div class="bg-surface-container-high rounded-3xl p-8 border border-outline-variant/10 shadow-xl">
            <h3 class="text-sm font-label font-black text-primary uppercase tracking-[0.2em] mb-6">Resum de la comanda</h3>
            
            <div v-if="selectedSeats.length > 0" class="space-y-4">
              <div v-for="seat in selectedSeats" :key="seat.id" class="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                <div>
                  <p class="text-on-surface font-black uppercase text-sm">Seient {{ seat.row }}{{ seat.number }}</p>
                  <p class="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">{{ seat.category_name }}</p>
                </div>
                <p class="text-primary font-black">{{ seat.price }}€</p>
              </div>
              
              <div class="pt-4 flex justify-between items-center">
                <p class="text-on-surface font-black uppercase text-lg">Total</p>
                <p class="text-3xl font-headline font-black text-secondary tracking-tighter">{{ totalPrice }}€</p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-on-surface-variant italic">No hi ha seients seleccionats.</p>
              <router-link to="/events" class="text-primary text-sm font-black uppercase mt-4 inline-block underline">Tornar a esdeveniments</router-link>
            </div>
          </div>
        </div>

        <!-- Payment Form -->
        <div class="bg-surface p-8 rounded-3xl border border-outline-variant/10 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <form @submit.prevent="handlePayment" class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Titular de la targeta</label>
              <input type="text" v-model="form.name" required
                     class="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all"
                     placeholder="NOM COMPLET">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Número de targeta</label>
              <input type="text" v-model="form.number" required
                     class="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all"
                     placeholder="0000 0000 0000 0000">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Caducitat</label>
                <input type="text" v-model="form.expiry" required
                       class="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all"
                       placeholder="MM/AA">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">CVV</label>
                <input type="text" v-model="form.cvv" required
                       class="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:border-primary/50 outline-none transition-all"
                       placeholder="000">
              </div>
            </div>

            <button type="submit" :disabled="isProcessing || selectedSeats.length === 0"
                    class="w-full py-4 bg-primary text-background font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!isProcessing">Confirmar i Pagar {{ totalPrice }}€</span>
              <span v-else class="flex items-center justify-center gap-2">
                <div class="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                Processant...
              </span>
            </button>
          </form>

          <div class="mt-8 flex items-center justify-center gap-4 text-xs font-label text-on-surface-variant opacity-60">
            <span class="material-symbols-outlined text-sm text-secondary">verified_user</span>
            <p>Pagament 100% segur encriptat SSL</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const selectedSeats = ref([]);
const isProcessing = ref(false);

const form = ref({
  name: '',
  number: '',
  expiry: '',
  cvv: ''
});

const totalPrice = computed(() => {
  return selectedSeats.value.reduce((sum, seat) => sum + parseFloat(seat.price), 0);
});

const handlePayment = async () => {
  if (selectedSeats.value.length === 0) return;
  
  isProcessing.value = true;
  try {
    const token = localStorage.getItem('token');
    const seatIds = selectedSeats.value.map(s => s.id);
    
    // Simulem un retard en el pagament
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await axios.post('/api/purchase', { seat_ids: seatIds }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    localStorage.removeItem('selected_seats');
    alert('Compra realitzada amb èxit!');
    router.push('/entrades');
  } catch (err) {
    console.error('Error en el pago:', err);
    alert('S\'ha produït un error en processar el pagament: ' + (err.response?.data?.error || err.message));
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  const storedSeats = localStorage.getItem('selected_seats');
  if (storedSeats) {
    selectedSeats.value = JSON.parse(storedSeats);
  } else {
    // Si no hi ha seients al localStorage, potser hauríem de redirigir a l'inici
    // o intentar recuperar-los de l'estat si tinguéssim Pinia
  }
});
</script>
