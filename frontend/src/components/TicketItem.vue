<script setup>
const props = defineProps(['sale']);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};
</script>

<template>
  <div class="flex bg-surface rounded-[24px] overflow-hidden border border-outline-variant/20 shadow-xl hover:shadow-primary/10 transition-all duration-500 group">
    <!-- Part Principal: Detalls -->
    <div class="flex-1 p-6 relative">
      <div class="absolute top-0 left-6 w-10 h-0.5 bg-primary shadow-[0_0_10px_#f382ff]"></div>
      
      <div class="flex justify-between items-start mb-6 text-left">
        <div>
          <div class="text-primary text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">Accés Confirmat</div>
          <h3 class="text-lg font-black text-on-surface uppercase tracking-tighter italic">{{ sale.seat?.seat_category?.event?.name || 'Esdeveniment' }}</h3>
        </div>
        <div class="text-right">
          <div class="text-secondary text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">Inversió</div>
          <div class="text-md font-bold text-white">{{ sale.amount }}€</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 text-left font-sans">
        <div>
          <div class="text-on-surface-variant text-[8px] font-bold uppercase tracking-widest mb-0.5 opacity-60">Secció</div>
          <div class="text-lg font-mono font-black text-white truncate">{{ sale.seat?.section }}</div>
        </div>
        <div>
          <div class="text-on-surface-variant text-[8px] font-bold uppercase tracking-widest mb-0.5 opacity-60">Fila</div>
          <div class="text-lg font-mono font-black text-white">{{ sale.seat?.row }}</div>
        </div>
        <div>
          <div class="text-on-surface-variant text-[8px] font-bold uppercase tracking-widest mb-0.5 opacity-60">Seient</div>
          <div class="text-lg font-mono font-black text-white">{{ sale.seat?.number }}</div>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-outline-variant/10 flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-on-surface-variant/60">
        <div class="flex items-center gap-1.5 italic">
          <span class="material-symbols-outlined text-xs">calendar_today</span>
          {{ sale.seat?.seat_category?.event?.date ? formatDate(sale.seat.seat_category.event.date) : 'DATA PENDENT' }}
        </div>
        <div class="font-mono opacity-40 uppercase truncate max-w-[80px]">Hash: {{ sale.ticket?.ticket_code || sale.id.substring(0,8) }}</div>
      </div>
    </div>

    <!-- Separador Troquelat -->
    <div class="relative w-px border-l-2 border-dashed border-outline-variant/30 my-4 flex flex-col justify-between">
      <div class="absolute -top-8 -left-2.5 w-5 h-5 bg-background rounded-full border border-outline-variant/20"></div>
      <div class="absolute -bottom-8 -left-2.5 w-5 h-5 bg-background rounded-full border border-outline-variant/20"></div>
    </div>

    <!-- Stub del QR -->
    <div class="w-28 sm:w-36 bg-background/40 p-4 flex flex-col items-center justify-center relative group-hover:bg-background/20 transition-colors">
      <div class="w-16 h-16 bg-on-surface p-1.5 rounded-xl shadow-inner mb-3 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
        <div class="w-full h-full bg-background rounded-sm opacity-90 flex flex-wrap" 
             style="background-image: conic-gradient(#060e20 0.25turn, #fff 0 0.5turn, #060e20 0 0.75turn, #fff 0); background-size: 10px 10px;">
        </div>
      </div>
      <span class="text-[7px] text-secondary font-black tracking-[0.2em] uppercase whitespace-nowrap">Validació Neural</span>
    </div>
  </div>
</template>
