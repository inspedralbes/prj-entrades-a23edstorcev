<script setup>
const props = defineProps(['seat', 'isMyLock']);
const emit = defineEmits(['select']);

// Lògica per determinar les classes de Tailwind basades en l'estat de Vue
const getStatusClasses = () => {
  if (props.seat.status === 'SOLD') return 'bg-outline-variant/20 border-transparent opacity-30 cursor-not-allowed text-on-surface-variant/50';
  if (props.isMyLock) return 'bg-primary border-primary text-background shadow-[0_0_20px_rgba(243,130,255,0.5)] scale-105 z-10';
  if (props.seat.status === 'LOCKED') return 'bg-tertiary border-tertiary text-background opacity-80 cursor-not-allowed';
  return 'bg-surface border-outline-variant/30 text-secondary hover:border-secondary hover:shadow-[0_0_15px_rgba(83,221,252,0.3)] hover:scale-110 cursor-pointer';
};
</script>

<template>
  <button
    @click="emit('select', seat)"
    :disabled="seat.status === 'SOLD' || (seat.status === 'LOCKED' && !isMyLock)"
    class="relative aspect-square rounded-xl transition-all duration-500 flex items-center justify-center font-bold text-lg border-2 group overflow-hidden"
    :class="getStatusClasses()"
  >
    <span class="relative z-10">{{ seat.number }}</span>
    
    <!-- Efecte visual de "scaneig" si el seient és de l'usuari -->
    <div v-if="isMyLock" class="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1/2 animate-scanline pointer-events-none"></div>
    
    <!-- Tooltip reactiu -->
    <div class="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-on-surface text-background text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-black uppercase tracking-tighter">
      Fila {{ seat.row }} - {{ seat.price }}€
    </div>
  </button>
</template>

<style scoped>
.animate-scanline {
  animation: scanline 2s linear infinite;
}
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}
</style>
