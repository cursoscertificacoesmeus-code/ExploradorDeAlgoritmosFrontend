<script setup lang="ts">
import { ref } from 'vue';
import ControlPanel from '../components/ControlPanel.vue'
import GraphCanvas from '../components/GraphCanvas.vue'
import { useGraphStore } from '../stores/graphStore';
import api from '../services/api'; // 1. Substituir axios pela nossa instância 'api'

// 1. Definir uma interface para os métodos expostos por GraphCanvas
interface GraphCanvasInstance {
  addNewNode: (nodeId: string) => void;
  addNewEdge: (edgeData: EdgeData) => void;
  generateGraphFromData: (nodes: string[]) => void;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeData: { source: string; target: string }) => void;
  generateRandomNodes: (data: RandomNodeData) => void;
  getGraphData: () => { nodes: { id: string }[]; edges: EdgeData[] };
}

// 2. Tipar a ref com a interface que criamos
const graphCanvasRef = ref<GraphCanvasInstance | null>(null);

const graphStore = useGraphStore(); // A store já é tipada

interface EdgeData {
  source: string;
  target: string;
  weight?: number | null;
  directed?: boolean;
}

interface RandomNodeData {
  min: number;
  max: number;
  count: number;
}

function handleAddNode(nodeId: string) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.addNewNode(nodeId);
  }
}

function handleAddEdge(edgeData: EdgeData) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.addNewEdge(edgeData);
  }
}

function handleGenerateGraph(nodes: string[]) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.generateGraphFromData(nodes);
  }
}

function handleRemoveNode(nodeId: string) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.removeNode(nodeId);
  }
}

function handleRemoveEdge(edgeData: { source: string; target: string }) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.removeEdge(edgeData);
  }
}

function handleGenerateRandomNodes(data: RandomNodeData) {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.generateRandomNodes(data);
  }
}

async function handleProcessGraph() {
  if (!graphCanvasRef.value) return;

  const { nodes, edges } = graphCanvasRef.value.getGraphData();

  const graphData = {
    // Os tipos aqui são inferidos a partir do retorno de getGraphData()
    nodes,
    edges,
    directed: graphStore.isDirected,
    weighted: graphStore.isWeighted,
    mixed: graphStore.isMixed
  };

  try {
    // 2. Usar a instância 'api'. A baseURL já está configurada nela.
    const response = await api.post('/graph/process', graphData);
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
