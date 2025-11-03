<template>
  <div class="graph-canvas-wrapper">
    <div ref="cyContainer" class="graph-canvas-container"></div>
    <div v-if="showEmptyMessage" class="empty-message-overlay">
      <div class="message-content">
        <h3>O que são Grafos?</h3>
        <p>Grafos são estruturas matemáticas usadas para modelar relações entre objetos.</p>
        <p>Eles consistem em <strong>Nós (vértices)</strong>, que representam os objetos, e <strong>Arestas</strong>, que representam as conexões entre eles.</p>
        <p>Use o painel ao lado para criar seu primeiro grafo!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import cytoscape from 'cytoscape';
import { useGraphStore } from '../stores/graphStore'; // Importa o store

const cyContainer = ref(null);
let cy = null; // Variável para guardar a instância do Cytoscape
const showEmptyMessage = ref(true); // Controla a visibilidade da mensagem

const graphStore = useGraphStore(); // Usa o store

// Função para obter os estilos das arestas dinamicamente
const getEdgeStyle = () => {
  return [
    {
      selector: 'edge',
      style: {
        'width': 1,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': graphStore.isDirected ? 'triangle' : 'none', // Define a seta dinamicamente
        'arrow-scale': 0.5,
        'curve-style': 'bezier',
        'label': graphStore.isWeighted ? 'data(weight)' : '', // Mostra o peso como label se ponderado
        'text-margin-y': graphStore.isWeighted ? -10 : 0, // Ajusta a posição do label
        'font-size': '8px',
        'color': '#333',
        'text-background-opacity': 1,
        'text-background-color': '#fff',
        'text-background-padding': '2px',
        'text-border-width': 1,
        'text-border-color': '#ccc',
        'text-border-radius': 3
      }
    }
  ];
};

onMounted(() => {
  if (cyContainer.value) {
    cy = cytoscape({
      container: cyContainer.value,
      elements: [], // Começa com um grafo vazio
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'hsla(160, 100%, 37%, 1)',
            'label': 'data(id)',
            'color': '#333',
            'text-outline-width': 0,
            'width': '20px',
            'height': '20px',
            'font-size': '8px'
          }
        },
        ...getEdgeStyle() // Adiciona os estilos das arestas
      ],
      layout: {
        name: 'cose',
        idealNodeSpacing: 100,
        nodeOverlap: 20,
        fit: true,
        padding: 30
      }
    });

    // Monitora mudanças no grafo para exibir/ocultar a mensagem
    cy.on('add remove', 'node, edge', () => {
      showEmptyMessage.value = cy.elements().empty();
    });
  }
});

// Roda o layout e atualiza os estilos quando isDirected ou isWeighted mudar
watch(
  () => [graphStore.isDirected, graphStore.isWeighted],
  () => {
    if (cy) {
      cy.style().fromJson(getEdgeStyle()).update();
      cy.layout({ name: 'cose', fit: true, padding: 50 }).run();
    }
  },
  { deep: true } // Observa mudanças profundas nas propriedades do store
);

// Função que gera um grafo a partir de uma lista de nós
function generateGraphFromData(nodes) {
  if (!cy) return;
  cy.elements().remove();
  const newElements = nodes.map(nodeId => ({ group: 'nodes', data: { id: nodeId } }));
  cy.add(newElements);
  cy.layout({ name: 'cose', fit: true, padding: 50 }).run();
  showEmptyMessage.value = cy.elements().empty(); // Atualiza a visibilidade da mensagem
}

// Função que adiciona um novo nó manualmente
function addNewNode(nodeId) {
  if (!cy) return;

  // Valida se o nó já existe
  if (!cy.getElementById(nodeId).empty()) {
    alert(`Erro: Nó com ID '${nodeId}' já existe.`);
    return;
  }

  cy.add({
    group: 'nodes',
    data: { id: nodeId }
  });
  cy.layout({ name: 'cose', fit: false }).run();
  showEmptyMessage.value = cy.elements().empty(); // Atualiza a visibilidade da mensagem
}

// Função que adiciona uma nova aresta
function addNewEdge({ source, target, weight = null }) {
  if (!cy) return;
  if (cy.getElementById(source).empty() || cy.getElementById(target).empty()) {
    alert(`Erro: Nó de origem ou destino não encontrado.`);
    return;
  }

  const edgeData = {
    id: `${source}-${target}-${Math.random()}`,
    source: source,
    target: target
  };

  if (graphStore.isWeighted && weight !== null) {
    edgeData.weight = weight;
  }

  cy.add({ group: 'edges', data: edgeData });
  showEmptyMessage.value = cy.elements().empty(); // Atualiza a visibilidade da mensagem
}

// Função para remover um nó específico
function removeNode(nodeId) {
  if (!cy) return;
  const node = cy.getElementById(nodeId);
  if (node.empty()) {
    alert(`Erro: Nó com ID '${nodeId}' não encontrado.`);
    return;
  }
  node.remove();
}

// Função para remover uma aresta específica
function removeEdge({ source, target }) {
  if (!cy) return;
  const edge = cy.edges(`[source = "${source}"][target = "${target}"]`);
  if (edge.empty()) {
    alert(`Erro: Aresta de '${source}' para '${target}' não encontrada.`);
    return;
  }
  edge.first().remove();
}

// Nova função para gerar nós aleatórios dentro de uma faixa
function generateRandomNodes({ min, max, count }) {
  if (!cy) return;

  cy.elements().remove(); // Limpa o grafo existente

  const generatedNodes = new Set();
  while (generatedNodes.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    generatedNodes.add(randomNumber.toString()); // Garante que o ID seja string
  }

  const newElements = Array.from(generatedNodes).map(nodeId => ({
    group: 'nodes',
    data: { id: nodeId }
  }));

  cy.add(newElements);
  cy.layout({ name: 'cose', fit: true, padding: 50 }).run();
  showEmptyMessage.value = cy.elements().empty();
}

// Expõe as funções para o componente pai
defineExpose({
  addNewNode,
  addNewEdge,
  generateGraphFromData,
  removeNode,
  removeEdge,
  generateRandomNodes
});
</script>

<style scoped>
.graph-canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
}

.graph-canvas-container {
  width: 100%;
  height: 100%;
}

.empty-message-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8); /* Fundo semi-transparente */
  z-index: 10;
  border-radius: 6px;
}

.message-content {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  color: var(--text-color);
  background-color: var(--surface-overlay);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.message-content h3 {
  margin-top: 0;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.message-content p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}
</style>
