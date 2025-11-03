<template>
  <div ref="cyContainer" class="graph-canvas-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import cytoscape from 'cytoscape';

const cyContainer = ref(null);
let cy = null; // Variável para guardar a instância do Cytoscape
let nodeIdCounter = 3; // Contador para gerar IDs únicos para novos nós

onMounted(() => {
  if (cyContainer.value) {
    cy = cytoscape({
      container: cyContainer.value,

      elements: [
        { data: { id: '0' } },
        { data: { id: '1' } },
        { data: { id: '2' } },
        { data: { id: 'ab', source: '0', target: '1' } },
        { data: { id: 'bc', source: '1', target: '2' } }
      ],

      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'hsla(160, 100%, 37%, 1)',
            'label': 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],

      layout: {
        name: 'cose', // Layout mais orgânico
        idealNodeSpacing: 100,
        nodeOverlap: 20,
        fit: true,
        padding: 30
      }
    });
  }
});

// Função que adiciona um novo nó
function addNewNode() {
  if (!cy) return;

  const newNodeId = `${nodeIdCounter++}`;
  cy.add({
    group: 'nodes',
    data: { id: newNodeId },
    position: { x: 100, y: 100 } // Posição inicial (o layout vai ajustar)
  });

  // Roda o layout novamente para organizar os nós
  cy.layout({ name: 'cose' }).run();
}

// Expõe a função para o componente pai
defineExpose({
  addNewNode
});
</script>

<style scoped>
.graph-canvas-container {
  border: 1px solid var(--color-border);
  height: 100%;
  min-height: 500px;
}
</style>
