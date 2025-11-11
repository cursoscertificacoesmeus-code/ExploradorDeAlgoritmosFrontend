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
            <label for="name">Nome</label>
            <InputText id="name" v-model="name" type="text" />
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

<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const name = ref('');
const email = ref('');
const password = ref('');

const register = () => {
  // TODO: Implementar a lógica de cadastro
  console.log('Dados de cadastro:', { name: name.value, email: email.value });
  alert('Funcionalidade de cadastro ainda não implementada.');
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