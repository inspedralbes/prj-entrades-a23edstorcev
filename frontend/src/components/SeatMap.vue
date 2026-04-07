<template>
  <div class="seat-map-container">
    <h2>Selecció de Seients</h2>
    
    <div v-if="lockTimer > 0" class="lock-timer">
      La reserva caduca en: {{ formatTime(lockTimer) }}
    </div>

    <div class="map-wrapper">
      <svg :viewBox="`0 0 ${mapWidth} ${mapHeight}`" class="seat-map">
        <g v-for="seat in seats" :key="seat.id" 
           class="seat" 
           :class="[seat.status.toLowerCase(), { 'my-lock': seat.status === 'LOCKED' && seat.u === userId }]"
           @click="selectSeat(seat)">
          <rect :x="seat.x" :y="seat.y" width="30" height="30" rx="5" />
          <text :x="seat.x + 15" :y="seat.y + 20" text-anchor="middle" font-size="10" fill="white">
            {{ seat.number }}
          </text>
        </g>
      </svg>
    </div>
    
    <div class="legend">
      <div class="item available">Disponible</div>
      <div class="item locked">Reservat</div>
      <div class="item my-lock">La teva reserva</div>
      <div class="item sold">Venut</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const mapWidth = 800;
const mapHeight = 600;

// Mock initial data
const seats = ref([
  { id: '1', section: 'A', row: 1, number: 1, status: 'AVAILABLE', x: 100, y: 100, price: 50 },
  { id: '2', section: 'A', row: 1, number: 2, status: 'AVAILABLE', x: 140, y: 100, price: 50 },
  { id: '3', section: 'A', row: 1, number: 3, status: 'LOCKED', x: 180, y: 100, price: 50, u: 'other' },
  { id: '4', section: 'A', row: 1, number: 4, status: 'SOLD', x: 220, y: 100, price: 50 },
]);

const userId = ref('my-uuid'); // This would come from auth
const lockTimer = ref(0);

const selectSeat = (seat) => {
  console.log('Seat selected:', seat.id);
  // Selection logic will be integrated in next task
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.seat-map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lock-timer {
  background: #ffecb3;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-weight: bold;
}

.map-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: auto;
  max-width: 100%;
}

.seat-map {
  width: 100%;
  min-width: 400px;
}

.seat {
  cursor: pointer;
  transition: opacity 0.2s;
}

.seat:hover {
  opacity: 0.8;
}

.seat rect {
  fill: #4CAF50; /* Available */
}

.seat.locked rect {
  fill: #FF9800; /* Locked */
  cursor: not-allowed;
}

.seat.my-lock rect {
  fill: #2196F3; /* Your Reservation */
  cursor: pointer;
}

.seat.sold rect {
  fill: #F44336; /* Sold */
  cursor: not-allowed;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.legend .item::before {
  content: "";
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 5px;
  vertical-align: middle;
  border-radius: 3px;
}

.legend .available::before { background: #4CAF50; }
.legend .locked::before { background: #FF9800; }
.legend .my-lock::before { background: #2196F3; }
.legend .sold::before { background: #F44336; }
</style>
