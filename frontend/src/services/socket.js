import { io } from 'socket.io-client';
import { ref } from 'vue';

const URL = process.env.NODE_ENV === 'production' ? undefined : '/';

export const isConnected = ref(false);

const socket = io(URL, {
  autoConnect: false,
  auth: (cb) => {
    const token = localStorage.getItem('token');
    console.log('Socket Attempting Connection with token:', token ? 'EXISTS' : 'MISSING');
    cb({ token });
  }
});

socket.on('connect_error', (err) => {
  console.error('Socket Connection Error Details:', err);
  if (err.message === 'Authentication error: No token') {
    // Reintentar una vegada si el token no s'ha carregat bé
    socket.connect();
  }
  isConnected.value = false;
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
