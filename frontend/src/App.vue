<template>
  <div id="app-container">
    <Menubar :model="menuItems">
      <template #start>
        <div class="app-title-wrapper">
          <i class="pi pi-project-diagram app-icon"></i>
          <span class="app-title">Explorador de Algoritmos</span>
        </div>
      </template>
    </Menubar>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';

const router = useRouter();

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
</style>
