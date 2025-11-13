<template>
  <div class="home-container">
    <Card>
      <template #title>Bem-vindo ao Explorador de Algoritmos</template>
      <template #content>
        <p>
          Este é um projeto acadêmico para explorar a criação, visualização e análise de algoritmos clássicos.
        </p>
        <p>
          Aqui você pode tanto desenhar e manipular <strong>grafos</strong>, executando algoritmos como Dijkstra e Busca em Largura,
          quanto analisar o comportamento de <strong>algoritmos de ordenação</strong> como Merge Sort e Quick Sort.
        </p>
        <p>Utilize o menu de navegação para acessar a funcionalidade desejada.</p>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
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
