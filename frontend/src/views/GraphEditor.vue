<script setup>
import { ref } from 'vue';
import ControlPanel from '../components/ControlPanel.vue'
import GraphCanvas from '../components/GraphCanvas.vue'
import { useGraphStore } from '../stores/graphStore';
import axios from 'axios';

const graphCanvasRef = ref(null);
const graphStore = useGraphStore();

function handleAddNode(nodeId) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.addNewNode(nodeId);
  }
}

function handleAddEdge(edgeData) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.addNewEdge(edgeData);
  }
}

function handleGenerateGraph(nodes) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.generateGraphFromData(nodes);
  }
}

function handleRemoveNode(nodeId) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.removeNode(nodeId);
  }
}

function handleRemoveEdge(edgeData) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.removeEdge(edgeData);
  }
}

function handleGenerateRandomNodes(data) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.generateRandomNodes(data);
  }
}

async function handleProcessGraph() {
  if (!graphCanvasRef.value) return;

  const { nodes, edges } = graphCanvasRef.value.getGraphData();

  const graphData = {
    nodes,
    edges,
    directed: graphStore.isDirected,
    weighted: graphStore.isWeighted,
    mixed: graphStore.isMixed
  };

  try {
    const response = await axios.post('http://localhost:8080/api/graph/process', graphData);
    console.log('Resposta do Backend:', response.data);
    alert('Grafo processado com sucesso pelo backend! Verifique o console do backend.');
  } catch (error) {
    console.error('Erro ao enviar o grafo para o backend:', error);
    alert('Ocorreu um erro ao se comunicar com o backend. Verifique se ele está rodando e o console do navegador para mais detalhes.');
  }
}
</script>

<template>
  <div class="editor-layout">
    <ControlPanel 
      @add-node="handleAddNode" 
      @add-edge="handleAddEdge"
      @generate-graph="handleGenerateGraph"
      @remove-node="handleRemoveNode"
      @remove-edge="handleRemoveEdge"
      @generate-random-nodes="handleGenerateRandomNodes"
      @process-graph="handleProcessGraph"
    />
    <GraphCanvas ref="graphCanvasRef" />
  </div>
</template>

<style scoped>
.editor-layout {
  display: grid;
  grid-template-columns: 450px 1fr; /* Painel de controle com largura fixa */
  gap: 1rem;
  height: calc(100vh - 120px); /* Ajusta a altura para descontar o menu */
  padding: 1rem;
}
</style>
