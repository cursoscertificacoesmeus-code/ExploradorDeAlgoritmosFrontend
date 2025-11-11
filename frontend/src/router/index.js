import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Login',
    // Lazy-load o componente para melhor performance
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    // Lazy-load o componente para melhor performance
    component: () => import('../views/Home.vue')
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
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    // Lazy-load o componente para melhor performance
    component: () => import('../views/Cadastro.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;