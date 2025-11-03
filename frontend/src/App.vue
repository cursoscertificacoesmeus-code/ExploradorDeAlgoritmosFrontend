<script setup>
import { ref } from 'vue';
import ControlPanel from './components/ControlPanel.vue'
import GraphCanvas from './components/GraphCanvas.vue'

const graphCanvasRef = ref(null);

function handleAddNode() {
  if (graphCanvasRef.value) {
    graphCanvasRef.value.addNewNode();
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <h1>Graph Explorer</h1>
    </div>
  </header>

  <main>
    <ControlPanel @add-node="handleAddNode" />
    <GraphCanvas ref="graphCanvasRef" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

main {
  display: grid;
  grid-template-columns: 1fr 3fr; /* Painel de controle ocupa 1/4 e o Canvas 3/4 */
  gap: 2rem;
  height: calc(100vh - 100px); /* Ajusta a altura da área principal */
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
