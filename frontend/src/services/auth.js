import { ref, reactive } from 'vue';
import axios from 'axios';

const user = ref(null);
const isAuthenticated = ref(false);
const isAdmin = ref(false);

const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    user.value = null;
    isAuthenticated.value = false;
    isAdmin.value = false;
    return;
  }

  try {
    const res = await axios.get('/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    user.value = res.data.user;
    isAuthenticated.value = true;
    isAdmin.value = !!res.data.user.is_admin;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    console.error('Auth check failed', e);
    logout();
  }
};

const handleLoginSuccess = async (token) => {
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  await checkAuth();
};

const logout = async () => {
  // ... (sin cambios)
  localStorage.removeItem('token');
  user.value = null;
  isAuthenticated.value = false;
  isAdmin.value = false;
  window.location.href = '/';
};

export default {
  user,
  isAuthenticated,
  isAdmin,
  checkAuth,
  handleLoginSuccess,
  logout
};
