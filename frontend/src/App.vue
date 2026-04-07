<template>
  <div id="app">
    <header>
      <h1>Venda d'Entrades</h1>
    </header>
    <main>
      <SeatMap />
    </main>
  </div>
</template>

<script setup>
import SeatMap from './components/SeatMap.vue'
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
}
header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}
main {
  padding: 2rem;
}
</style>
