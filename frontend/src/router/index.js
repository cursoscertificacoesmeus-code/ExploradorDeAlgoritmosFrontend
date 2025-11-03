import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/editor',
    name: 'GraphEditor',
    component: () => import('../views/GraphEditor.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
