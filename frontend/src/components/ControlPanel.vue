<template>
  <div class="control-panel">
    <h2>Controles</h2>
    <button @click="addNode">Adicionar Nó</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['add-node']);

function addNode() {
  emit('add-node');
}
</script>

<style scoped>
.control-panel {
  padding: 1rem;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
