<template>
  <div class="login-container">
    <Card class="login-card">
      <template #title>
        <i class="pi pi-sign-in"></i>
        Página de Login
      </template>
      <template #content>
        <p>Acesse sua conta para continuar.</p>
        <div class="p-fluid">
          <div class="p-field">
            <label for="email">Email</label>
            <InputText id="email" v-model="email" type="email" />
          </div>
          <div class="p-field">
            <label for="password">Senha</label>
            <Password id="password" v-model="password" :feedback="false" toggleMask />
          </div>
          <div class="p-field text-center">
             <p>Não tem uma conta? <router-link to="/cadastro">Cadastre-se</router-link></p>
          </div>
        </div>
      </template>
      <template #footer>
        <Button label="Entrar" icon="pi pi-sign-in" @click="login" />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const router = useRouter();
const email = ref('');
const password = ref('');

const login = () => {
  // TODO: Implementar a lógica de validação de login
  console.log('Tentativa de login com:', { email: email.value });
  router.push('/home');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
}
.login-card {
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