<template>
  <Toast />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';

import Toast from 'primevue/toast';
const authStore = useAuthStore();

// Tenta buscar o usuário se um cookie de sessão existir ao carregar a página
onMounted(() => {
  authStore.fetchUser();
});
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
</style>
