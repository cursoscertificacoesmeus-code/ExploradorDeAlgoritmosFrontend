<template>
  <div class="registration-container">
    <Card class="registration-card">
      <template #title>
        <i class="pi pi-user-plus"></i>
        Página de Cadastro
      </template>
      <template #content>
        <p>Crie sua conta para salvar e gerenciar seus grafos e análises.</p>
        <div class="p-fluid">
          <div class="p-field">
            <label for="username">Nome de Usuário</label>
            <InputText id="username" v-model="username" type="text" />
          </div>
          <div class="p-field">
            <label for="email">Email</label>
            <InputText id="email" v-model="email" type="email" />
          </div>
          <div class="p-field">
            <label for="password">Senha</label>
            <Password id="password" v-model="password" :feedback="false" toggleMask />
          </div>
           <div class="p-field text-center">
             <p>Já tem uma conta? <router-link to="/">Faça login</router-link></p>
          </div>
        </div>
      </template>
      <template #footer>
        <Button label="Cadastrar" icon="pi pi-check" @click="register" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { register as registerUser } from '../services/authService';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const username = ref('');
const email = ref('');
const password = ref('');

const register = async () => {
  if (!username.value || !email.value || !password.value) {
    toast.add({ 
      severity: 'warn', 
      summary: 'Atenção', 
      detail: 'Por favor, preencha todos os campos.', 
      life: 3000 
    });
    return;
  }
  try {
    await registerUser({ username: username.value, email: email.value, password: password.value });
    toast.add({ 
      severity: 'success', 
      summary: 'Sucesso', 
      detail: 'Cadastro realizado com sucesso! Redirecionando para o login.', 
      life: 3000 });
    router.push('/'); // Redireciona para o login após o sucesso
  } catch (error: any) {
    toast.add({ 
      severity: 'error', 
      summary: 'Erro no Cadastro', 
      detail: error.response?.data?.message || 'Verifique os dados e tente novamente.', 
      life: 5000 });
  }
};
</script>

<style scoped>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
}
.registration-card {
  width: 100%;
  max-width: 500px;
}
.p-field {
  margin-bottom: 1.5rem;
}
.p-fluid .p-field:last-of-type {
    margin-bottom: 0;
}
.text-center {
  text-align: center;
  margin-top: 1rem;
}
.text-center a {
  color: var(--primary-color);
  text-decoration: none;
}
</style>