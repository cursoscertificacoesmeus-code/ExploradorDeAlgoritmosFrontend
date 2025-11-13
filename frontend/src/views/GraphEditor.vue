<script setup lang="ts">
import { ref } from 'vue';
import ControlPanel from '../components/ControlPanel.vue'
import GraphCanvas from '../components/GraphCanvas.vue'
import { useGraphStore } from '../stores/graphStore';
import api from '../services/api'; // 1. Usar a instância centralizada do 'api'
import { useToast } from 'primevue/usetoast';

// 1. Definir os tipos para os dados dos eventos, espelhando o que é emitido pelo ControlPanel
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

// 1. Adicionar uma interface para a nova resposta da API
interface GraphAnalysisResponse {
  nodeCount: number;
  edgeCount: number;
  weighted: boolean;
  graphType: 'Mixed' | 'Directed' | 'Undirected';
  message: string;
}


// 2. Tipar a referência para que o TypeScript saiba quais métodos estão disponíveis
const graphCanvasRef = ref<InstanceType<typeof GraphCanvas> | null>(null);
const graphStore = useGraphStore();
const toast = useToast();

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
  if (!graphCanvasRef.value) return; // A verificação de nulo continua sendo uma boa prática

  const { nodes, edges } = graphCanvasRef.value.getGraphData();

  const graphData = {
    nodes,
    edges,
    directed: graphStore.isDirected,
    weighted: graphStore.isWeighted,
    mixed: graphStore.isMixed
  };

  try {
    // 2. Chamar o endpoint usando a instância 'api'. A baseURL já está configurada.
    const response = await api.post<GraphAnalysisResponse>('/graph/process', graphData);
    console.log('Resposta do Backend:', response.data);
    toast.add({ 
      severity: 'success', 
      summary: 'Sucesso', 
      detail: response.data.message || 'Grafo processado com sucesso!', 
      life: 4000 
    });
  } catch (error: any) {
    console.error('Erro ao enviar o grafo para o backend:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Erro de Comunicação', 
      detail: error.response?.data?.message || 'Não foi possível se comunicar com o backend.', 
      life: 5000 });
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
