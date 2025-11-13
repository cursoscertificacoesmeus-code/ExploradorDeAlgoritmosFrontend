<script setup lang="ts">
import { ref } from 'vue';
import ControlPanel from '../components/ControlPanel.vue'
import GraphCanvas from '../components/GraphCanvas.vue'
import { useGraphStore } from '../stores/graphStore';
import api from '../services/api'; // 1. Usar a instância centralizada do 'api'
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

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

// Interface para os detalhes de cada nó na resposta da API
interface NodeDetail {
  id: string;
  inDegree: number;
  outDegree: number;
}

// Interface atualizada para a resposta da API (v6)
interface GraphAnalysisResponse {
  nodeCount: number;
  edgeCount: number;
  weighted: boolean;
  graphType: 'Mixed' | 'Directed' | 'Undirected';
  message: string;
  nodeDetails: NodeDetail[];
}


// 2. Tipar a referência para que o TypeScript saiba quais métodos estão disponíveis
const graphCanvasRef = ref<InstanceType<typeof GraphCanvas> | null>(null);
const analysisResult = ref<GraphAnalysisResponse | null>(null);
const isDialogVisible = ref(false);
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
    const analysisData = response.data;
    console.log('Resposta do Backend:', analysisData);

    // Mapeamento para tradução do tipo de grafo
    const graphTypeTranslations: Record<string, string> = {
      Mixed: 'Misto',
      Directed: 'Direcionado',
      Undirected: 'Não Direcionado'
    };
    const translatedGraphType = graphTypeTranslations[analysisData.graphType] || analysisData.graphType;

    // Criar a mensagem em português
    const portugueseMessage = `Grafo processado com sucesso. É um grafo do tipo ${translatedGraphType} com ${analysisData.nodeCount} nós e ${analysisData.edgeCount} arestas.`;

    // Atualiza o resultado da análise com a mensagem traduzida
    analysisResult.value = { ...analysisData, message: portugueseMessage };
    isDialogVisible.value = true; // Abre o modal com os resultados

    // Usa a mensagem traduzida no toast
    toast.add({ 
      severity: 'success', 
      summary: 'Sucesso', 
      detail: portugueseMessage, 
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

    <!-- Modal para exibir os resultados da análise -->
    <Dialog v-model:visible="isDialogVisible" modal header="Análise do Grafo" :style="{ width: '50vw' }">
      <div v-if="analysisResult">
        <p>{{ analysisResult.message }}</p>
        <ul class="summary-list">
          <li><strong>Tipo de Grafo:</strong> {{ analysisResult.graphType }}</li>
          <li><strong>Nós:</strong> {{ analysisResult.nodeCount }}</li>
          <li><strong>Arestas:</strong> {{ analysisResult.edgeCount }}</li>
          <li><strong>Ponderado:</strong> {{ analysisResult.weighted ? 'Sim' : 'Não' }}</li>
        </ul>
        <DataTable :value="analysisResult.nodeDetails" responsiveLayout="scroll">
          <Column field="id" header="Nó"></Column>
          <Column field="inDegree" header="Grau de Entrada"></Column>
          <Column field="outDegree" header="Grau de Saída"></Column>
          <Column header="Tipo">
            <template #body="slotProps">
              <div class="node-type-cell">
                <i v-if="slotProps.data.inDegree === 0 && slotProps.data.outDegree > 0" class="pi pi-sitemap" v-tooltip.top="'Raiz (Fonte)'"></i>
                <i v-else-if="slotProps.data.inDegree > 0 && slotProps.data.outDegree === 0" class="pi pi-flag-fill" v-tooltip.top="'Folha (Sumidouro)'"></i>
                <i v-else-if="slotProps.data.inDegree > 0 && slotProps.data.outDegree > 0" class="pi pi-users" v-tooltip.top="'Intermediário (Filho)'"></i>
                <i v-else-if="slotProps.data.inDegree === 0 && slotProps.data.outDegree === 0" class="pi pi-circle-off" v-tooltip.top="'Isolado'"></i>
                <span v-if="slotProps.data.inDegree === 0 && slotProps.data.outDegree > 0">Raiz</span>
                <span v-else-if="slotProps.data.inDegree > 0 && slotProps.data.outDegree === 0">Folha</span>
                <span v-else-if="slotProps.data.inDegree > 0 && slotProps.data.outDegree > 0">Intermediário</span>
                <span v-else-if="slotProps.data.inDegree === 0 && slotProps.data.outDegree === 0">Isolado</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </Dialog>
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

.summary-list {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.node-type-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
