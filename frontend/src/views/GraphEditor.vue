<script setup>
import { ref } from 'vue';
import ControlPanel from '../components/ControlPanel.vue'
import GraphCanvas from '../components/GraphCanvas.vue'

const graphCanvasRef = ref(null);

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
