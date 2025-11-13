<template>
  <Menubar :model="menuItems">
    <template #start>
      <div class="app-title-wrapper">
        <i class="pi pi-project-diagram app-icon"></i>
        <span class="app-title">Explorador de Algoritmos</span>
      </div>
    </template>
    <template #end>
      <UserProfile />
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';
import UserProfile from './UserProfile.vue';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const menuItems = ref([
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

<style scoped>
/* Os estilos do título podem ser movidos para cá se forem específicos do header */
</style>