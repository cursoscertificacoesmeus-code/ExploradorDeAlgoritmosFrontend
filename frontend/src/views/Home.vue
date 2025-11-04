<template>
  <div class="home-container">
    <Card>
      <template #title>Bem-vindo ao Explorador de Grafos</template>
      <template #content>
        <p>
          Este é um projeto acadêmico para explorar a criação, visualização e manipulação de grafos.
        </p>
        <p>
          Utilize o menu de navegação para acessar o editor de grafos e começar a criar.
        </p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}
</style>
