<template>
  <div class="sorting-analysis-container">
    <Card>
      <template #title>
        <i class="pi pi-sort-amount-up-alt"></i>
        Análise de Algoritmos de Ordenação
      </template>
      <template #content>
        <p>
          Bem-vindo à seção de análise de algoritmos de ordenação.
        </p>
        <p>
          Em breve, aqui você poderá gerar dados, escolher um algoritmo (como Merge Sort, Quick Sort, etc.) e visualizar o processo de ordenação passo a passo.
        </p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
</script>

<style scoped>
.sorting-analysis-container {
  padding: 1rem;
}
</style>