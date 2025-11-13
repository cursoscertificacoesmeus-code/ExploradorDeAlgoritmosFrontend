<template>
  <div id="app-container">
    <Menubar v-if="showMenu" :model="guestMenuItems">
      <template #start>
        <div class="app-title-wrapper">
          <i class="pi pi-project-diagram app-icon"></i>
          <span class="app-title">Explorador de Algoritmos</span>
        </div>
      </template>
      <template #end>
        <div v-if="authStore.isAuthenticated" class="user-profile" @click="toggleMenu" aria-haspopup="true" aria-controls="overlay_menu">
          <Avatar 
            :label="authStore.userInitials" 
            class="mr-2" 
            shape="circle" 
            :style="{ backgroundColor: avatarColor, color: '#ffffff' }"
          />
          <div class="user-info">
            <span class="username">{{ authStore.user?.username }}</span>
            <span class="role">{{ authStore.user?.role }}</span>
          </div>
        </div>
        <Menu ref="menu" id="overlay_menu" :model="overlayMenuItems" :popup="true" />
      </template>
    </Menubar>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import { useAuthStore } from './stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Tenta buscar o usuário se um cookie de sessão existir ao carregar a página
onMounted(() => {
  authStore.fetchUser();
});

const showMenu = computed(() => {
  // O menu não será exibido nas rotas de login ('/') e cadastro ('/cadastro')
  const hiddenRoutes = ['/', '/cadastro'];
  return !hiddenRoutes.includes(router.currentRoute.value.path);
});

const menu = ref();
const overlayMenuItems = ref([
    {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => {
            authStore.logout();
        }
    }
]);

const toggleMenu = (event: Event) => {
    menu.value.toggle(event);
};

const avatarColor = computed(() => {
  if (!authStore.user?.username) return '#495057'; // Cor padrão
  let hash = 0;
  for (let i = 0; i < authStore.user.username.length; i++) {
    hash = authStore.user.username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 40%)`;
});

const guestMenuItems = ref([
  {
    label: 'Início',
    icon: 'pi pi-home',
    command: () => router.push('/home')
  },
  {
    label: 'Editor de Grafo',
    icon: 'pi pi-pencil',
    command: () => router.push('/editor')
  },
  {
    label: 'Análise de Ordenação',
    icon: 'pi pi-sort-amount-up-alt',
    command: () => router.push('/ordenacao')
  },
  // Item de menu condicional para administradores
  {
    label: 'Admin',
    icon: 'pi pi-cog',
    visible: () => authStore.isAuthenticated && authStore.user?.role === 'ADMIN',
    items: [
      {
        label: 'Usuários',
        icon: 'pi pi-users',
        command: () => router.push('/admin/users')
      }
    ]
  }
]);
</script>

<style>
/* Estilos globais para a aplicação */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  background-color: var(--surface-ground);
  color: var(--text-color);
}

.app-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-right: 2rem;
}

.app-icon {
  font-size: 1.5rem;
}

.app-title {
  font-size: 1.25rem;
  font-weight: bold;
}

main {
  padding: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  font-weight: bold;
  font-size: 0.9rem;
}

.role {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  text-transform: capitalize;
}
</style>
