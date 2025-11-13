import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Cadastro from '../views/Cadastro.vue';
import Home from '../views/Home.vue';
import GraphEditor from '../views/GraphEditor.vue';
import UserManagement from '../views/UserManagement.vue';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: Cadastro,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home, // Rota protegida por autenticação
    meta: { requiresAuth: true }
  },
  {
    path: '/editor',
    name: 'GraphEditor',
    component: GraphEditor, // Rota protegida por autenticação
    meta: { requiresAuth: true }
  },
  {
    path: '/ordenacao',
    name: 'SortingAnalysis',
    component: () => import('../views/Home.vue'), // Placeholder, também protegido
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true } // Rota protegida para ADMIN
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Tenta buscar o usuário se o estado estiver vazio (ex: F5 na página)
  if (authStore.user === null) {
    await authStore.fetchUser();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.user?.role === 'ADMIN';

  if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'Home' }); // Redireciona para Home se não for admin
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' }); // Redireciona para Login se não estiver autenticado
  } else {
    next(); // Permite o acesso
  }
});

export default router;
