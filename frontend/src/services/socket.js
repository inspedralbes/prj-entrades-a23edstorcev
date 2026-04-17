import { io } from 'socket.io-client';
import { ref } from 'vue';

const URL = process.env.NODE_ENV === 'production' ? undefined : '/';

export const isConnected = ref(false);

const socket = io(URL, {
  autoConnect: false,
  auth: {
    token: null // Es carregarà abans de connectar
  }
});

// Interceptor per actualitzar el token abans de connectar
socket.on('connect_error', (err) => {
  if (err.message === 'Authentication error: No token') {
    socket.auth.token = localStorage.getItem('token');
    socket.connect();
  }
});

socket.on('connect', () => {
  console.log('Socket Connected Successfully');
  isConnected.value = true;
});

socket.on('connect_error', (err) => {
  console.error('Socket Connection Error:', err.message);
  isConnected.value = false;
});

socket.on('disconnect', (reason) => {
  console.warn('Socket Disconnected:', reason);
  isConnected.value = false;
});

if (window.Cypress) {
  window.socket = socket;
}

export default socket;
