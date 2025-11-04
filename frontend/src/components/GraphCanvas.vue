<template>
  <div class="graph-canvas-wrapper">
    <div ref="cyContainer" class="graph-canvas-container"></div>
    <transition name="fade" mode="out-in">
      <div v-if="showEmptyMessage" :key="currentMessageIndex" class="empty-message-overlay">
        <div class="message-content">
          <h3>{{ currentMessage.title }}</h3>
          <p v-for="(paragraph, index) in currentMessage.paragraphs" :key="index" v-html="paragraph"></p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import cytoscape from 'cytoscape';
import { useGraphStore } from '../stores/graphStore';

const cyContainer = ref(null);
let cy = null;
const showEmptyMessage = ref(true);
const currentMessageIndex = ref(0);
let messageInterval = null;

const graphStore = useGraphStore();

// Estilo estático para os nós
const nodeStyle = {
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
};

// Função para obter os estilos dinâmicos das arestas
const getDynamicEdgeStyles = () => {
  return [
    {
      selector: 'edge',
      style: {
        'width': 1,
        'line-color': '#ccc',
        'arrow-scale': 0.5,
        'curve-style': 'bezier',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': (ele) => {
          // Se for misto, a direção vem do dado da aresta.
          // Senão, usa a configuração global.
          if (graphStore.isMixed) {
            return ele.data('directed') ? 'triangle' : 'none';
          } else {
            return graphStore.isDirected ? 'triangle' : 'none';
          }
        },
        'label': graphStore.isWeighted ? 'data(weight)' : '',
        'text-margin-y': graphStore.isWeighted ? -10 : 0,
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

const messages = [
  {
    title: 'O que são Grafos?',
    paragraphs: [
      'Grafos são estruturas matemáticas usadas para modelar relações entre objetos.',
      'Eles consistem em <strong>Nós (vértices)</strong>, que representam os objetos, e <strong>Arestas</strong>, que representam as conexões entre eles.',
      'Use o painel ao lado para criar seu primeiro grafo!'
    ]
  },
  {
    title: 'Tipos de Grafos',
    paragraphs: [
      'Existem vários tipos de grafos, cada um com suas particularidades:',
      '<strong>Direcionados (Digrafos):</strong> As arestas têm um sentido, como uma rua de mão única.',
      '<strong>Não-Direcionados:</strong> As arestas são vias de mão dupla.',
      '<strong>Ponderados:</strong> Cada aresta tem um "peso" ou "custo" associado.',
      '<strong>Mistos:</strong> Podem conter tanto arestas direcionadas quanto não-direcionadas.'
    ]
  }
];

const currentMessage = computed(() => messages[currentMessageIndex.value]);

onMounted(() => {
  if (cyContainer.value) {
    cy = cytoscape({
      container: cyContainer.value,
      elements: [],
      style: [
        nodeStyle, // Estilo estático dos nós
        ...getDynamicEdgeStyles() // Estilo dinâmico inicial das arestas
      ],
      layout: {
        name: 'cose',
        idealNodeSpacing: 100,
        nodeOverlap: 20,
        fit: true,
        padding: 30
      }
    });

    cy.on('add remove', 'node, edge', () => {
      showEmptyMessage.value = cy.elements().empty();
    });

    startMessageCarousel();
  }
});

onUnmounted(() => {
  stopMessageCarousel();
});

function startMessageCarousel() {
  stopMessageCarousel(); // Garante que não haja múltiplos intervalos
  messageInterval = setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % messages.length;
  }, 5000); // Muda a cada 5 segundos
}

function stopMessageCarousel() {
  if (messageInterval) {
    clearInterval(messageInterval);
    messageInterval = null;
  }
}

watch(showEmptyMessage, (isVisible) => {
  if (isVisible) {
    startMessageCarousel();
  } else {
    stopMessageCarousel();
  }
});

// Atualiza os estilos das arestas quando isDirected ou isWeighted mudar
watch([() => graphStore.isDirected, () => graphStore.isMixed],
  () => {
    if (!cy) return;

    // Redefine o estilo da seta para todas as arestas com base no modo atual
    cy.edges().style('target-arrow-shape', (ele) => {
      if (graphStore.isMixed) {
        return ele.data('directed') ? 'triangle' : 'none';
      } else {
        return graphStore.isDirected ? 'triangle' : 'none';
      }
    });
  }
);

watch(
  () => graphStore.isWeighted,
  (newIsWeighted) => {
    if (cy) {
      cy.style().selector('edge').style('label', newIsWeighted ? 'data(weight)' : '').style('text-margin-y', newIsWeighted ? -10 : 0).update();
    }
  }
);

// Função que gera um grafo a partir de uma lista de nós
function generateGraphFromData(nodes) {
  if (!cy) return;
  cy.elements().remove();
  const newElements = nodes.map(nodeId => ({ group: 'nodes', data: { id: nodeId } }));
  cy.add(newElements);
  cy.layout({ name: 'cose', fit: true, padding: 50 }).run();
  showEmptyMessage.value = cy.elements().empty();
}

// Função que adiciona um novo nó manualmente
function addNewNode(nodeId) {
  if (!cy) return;

  if (!cy.getElementById(nodeId).empty()) {
    alert(`Erro: Nó com ID '${nodeId}' já existe.`);
    return;
  }

  cy.add({
    group: 'nodes',
    data: { id: nodeId }
  });
  cy.layout({ name: 'cose', fit: false }).run();
  showEmptyMessage.value = cy.elements().empty();
}

// Função que adiciona uma nova aresta
function addNewEdge({ source, target, weight = null, directed = true }) {
  if (!cy) return;
  if (cy.getElementById(source).empty() || cy.getElementById(target).empty()) {
    alert(`Erro: Nó de origem ou destino não encontrado.`);
    return;
  }

  const edgeData = {
    id: `${source}-${target}-${Math.random()}`,
    source: source,
    target: target,
  };

  if (graphStore.isWeighted && weight !== null) {
    edgeData.weight = weight;
  }

  // No modo misto, a direção é definida por aresta
  if (graphStore.isMixed) {
    edgeData.directed = directed;
  }

  cy.add({ group: 'edges', data: edgeData });
  showEmptyMessage.value = cy.elements().empty();
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

  cy.elements().remove();

  const generatedNodes = new Set();
  while (generatedNodes.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    generatedNodes.add(randomNumber.toString());
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
  background-color: rgba(255, 255, 255, 0.8);
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
