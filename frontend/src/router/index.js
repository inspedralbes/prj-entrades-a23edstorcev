import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import QueueView from '../views/QueueView.vue';
import TicketsView from '../views/TicketsView.vue';
import SeatMap from '../components/SeatMap.vue';
import LoginView from '../views/LoginView.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import EventsView from '../views/EventsView.vue';
import EventDetailView from '../views/EventDetailView.vue';
import AdminEvents from '../views/AdminEvents.vue';
import ProfileView from '../views/ProfileView.vue';
import RegisterView from '../views/RegisterView.vue';
import PaymentView from '../views/PaymentView.vue';
import auth from '../services/auth';

const routes = [
  { path: '/', component: EventsView },
  { path: '/home', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/cua', component: QueueView },
  { path: '/events', component: EventsView },
  { path: '/event/:id', component: EventDetailView, props: true },
  { path: '/seats', component: SeatMap },
  { path: '/entrades', component: TicketsView },
  { path: '/perfil', component: ProfileView },
  { path: '/pago', component: PaymentView },
  { 
    path: '/admin', 
    component: AdminDashboard,
    beforeEnter: async (to, from, next) => {
      await auth.checkAuth();
      if (auth.isAdmin.value) next();
      else next('/');
    }
  },
  { 
    path: '/admin/events', 
    component: AdminEvents,
    beforeEnter: async (to, from, next) => {
      await auth.checkAuth();
      if (auth.isAdmin.value) next();
      else next('/');
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
