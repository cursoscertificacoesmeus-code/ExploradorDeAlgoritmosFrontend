import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/editor',
    name: 'GraphEditor',
    // Lazy-load o componente para melhor performance
    component: () => import('../views/GraphEditor.vue')
  },
  {
    path: '/ordenacao',
    name: 'SortingAnalysis',
    // Lazy-load o componente para melhor performance
    component: () => import('../views/AnaliseOrdenacao.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;