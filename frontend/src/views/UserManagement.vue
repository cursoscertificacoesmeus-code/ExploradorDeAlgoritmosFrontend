<template>
  <div class="user-management-container">
    <Card>
      <template #title>
        <div class="title-container">
          <i class="pi pi-users mr-2"></i>
          Gerenciamento de Usuários Comuns (PERSONAL)
        </div>
      </template>
      <template #content>
        <DataTable :value="users" :loading="loading" responsiveLayout="scroll">
          <Column field="id" header="ID"></Column>
          <Column field="username" header="Nome de Usuário"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="role" header="Role"></Column>
        </DataTable>
        <div v-if="error" class="error-message">
          <p>Ocorreu um erro ao carregar os usuários: {{ error }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import { getPersonalUsers } from '../services/userService'; // Importa a nova função
import type { User } from '../types/user/User';

const users = ref<User[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => { // Ao montar o componente, busca os usuários PERSONAL
  try {
    users.value = await getPersonalUsers(); // Chama a nova função
  } catch (err: any) {
    error.value = err.message || 'Não foi possível buscar os dados.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.user-management-container {
  padding: 1rem;
}
.title-container {
  display: flex;
  align-items: center;
}
</style>