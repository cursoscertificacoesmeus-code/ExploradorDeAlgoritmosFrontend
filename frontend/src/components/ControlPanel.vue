<template>
  <div class="control-panel">
    <Panel header="Gerar Grafo" toggleable>
      <div class="form-group">
        <label for="node-list">Nós (separados por vírgula)</label>
        <InputGroup>
          <InputText id="node-list" v-model="nodeListData" placeholder="1, 2, 3..." />
          <Button icon="pi pi-check" @click="generateGraph" />
        </InputGroup>
      </div>

      <div class="form-group">
        <label>Gerar Nós Aleatórios</label>
        <div class="random-node-inputs">
          <div class="input-item">
            <label for="min-value">Valor Mínimo</label>
            <InputNumber id="min-value" v-model="minRandomValue" placeholder="Min" :min="0" :max="999" />
          </div>
          <div class="input-item">
            <label for="max-value">Valor Máximo</label>
            <InputNumber id="max-value" v-model="maxRandomValue" placeholder="Max" :min="0" :max="999" />
          </div>
          <div class="input-item">
            <label for="num-nodes">Quantidade de Nós</label>
            <InputNumber id="num-nodes" v-model="numberOfRandomNodes" placeholder="Qtd" :min="1" :max="100" />
          </div>
        </div>
        <Button label="Gerar Aleatórios" @click="generateRandomNodes" />
      </div>
    </Panel>

    <Panel header="Ações Manuais" toggleable collapsed>
       <div class="form-group">
        <label for="new-node-id">ID do Novo Nó</label>
        <InputGroup>
          <InputText id="new-node-id" v-model="newNodeId" placeholder="Ex: A, B, C" />
          <Button icon="pi pi-plus" label="Adicionar Nó" @click="addNode" severity="secondary" />
        </InputGroup>
      </div>
      <div class="form-group">
        <label>Adicionar Aresta</label>
        <InputGroup>
          <InputText v-model="sourceNode" placeholder="Origem" />
          <span class="p-inputgroup-addon">→</span>
          <InputText v-model="targetNode" placeholder="Destino" />
          <InputNumber v-if="graphStore.isWeighted" v-model="edgeWeight" placeholder="Peso" :min="0" :max="999" />
          <Button icon="pi pi-plus" @click="addEdge" severity="secondary" />
        </InputGroup>
      </div>
    </Panel>

    <Panel header="Remover Elemento" toggleable collapsed>
      <div class="form-group">
        <label>Remover Nó</label>
        <InputGroup>
          <InputText v-model="nodeToRemove" placeholder="ID do Nó" />
          <Button icon="pi pi-trash" @click="removeNode" severity="danger" />
        </InputGroup>
      </div>
       <div class="form-group">
        <label>Remover Aresta</label>
        <InputGroup>
          <InputText v-model="edgeSourceToRemove" placeholder="Origem" />
          <span class="p-inputgroup-addon">→</span>
          <InputText v-model="edgeTargetToRemove" placeholder="Destino" />
          <Button icon="pi pi-times" @click="removeEdge" severity="danger" />
        </InputGroup>
      </div>
    </Panel>

    <Panel header="Configurações do Grafo" toggleable collapsed>
      <div class="form-group-checkbox">
        <TriStateCheckbox v-model="graphStore.isDirected" inputId="directed-graph" />
        <label for="directed-graph">Grafo Direcionado</label>
      </div>
      <div class="form-group-checkbox">
        <TriStateCheckbox v-model="graphStore.isWeighted" inputId="weighted-graph" />
        <label for="weighted-graph">Grafo Ponderado</label>
      </div>
    </Panel>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';
import InputGroup from 'primevue/inputgroup';
import InputNumber from 'primevue/inputnumber';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import { useGraphStore } from '../stores/graphStore';

const sourceNode = ref('');
const targetNode = ref('');
const nodeListData = ref('');
const nodeToRemove = ref('');
const edgeSourceToRemove = ref('');
const edgeTargetToRemove = ref('');

const minRandomValue = ref(1);
const maxRandomValue = ref(5);
const numberOfRandomNodes = ref(3);

const newNodeId = ref('');
const edgeWeight = ref(null); // Novo ref para o peso da aresta

const graphStore = useGraphStore();

const emit = defineEmits([
  'add-node',
  'add-edge',
  'generate-graph',
  'remove-node',
  'remove-edge',
  'generate-random-nodes'
]);

function addNode() {
  if (newNodeId.value) {
    emit('add-node', newNodeId.value);
    newNodeId.value = '';
  } else {
    alert("Por favor, insira um ID para o novo nó.");
  }
}

function addEdge() {
  if (sourceNode.value && targetNode.value) {
    const edgeData = {
      source: sourceNode.value,
      target: targetNode.value,
    };
    if (graphStore.isWeighted) {
      edgeData.weight = edgeWeight.value; // Adiciona o peso se for ponderado
    }
    emit('add-edge', edgeData);
    sourceNode.value = '';
    targetNode.value = '';
    edgeWeight.value = null; // Limpa o peso
  }
}

function generateGraph() {
  if (nodeListData.value) {
    const nodes = nodeListData.value.split(',').map(n => n.trim()).filter(n => n !== '');
    emit('generate-graph', nodes);
  }
}

function removeNode() {
  if (nodeToRemove.value) {
    emit('remove-node', nodeToRemove.value);
    nodeToRemove.value = '';
  }
}

function removeEdge() {
  if (edgeSourceToRemove.value && edgeTargetToRemove.value) {
    emit('remove-edge', { source: edgeSourceToRemove.value, target: edgeTargetToRemove.value });
    edgeSourceToRemove.value = '';
    edgeTargetToRemove.value = '';
  }
}

function generateRandomNodes() {
  if (minRandomValue.value !== null && maxRandomValue.value !== null && numberOfRandomNodes.value !== null) {
    if (minRandomValue.value > maxRandomValue.value) {
      alert("O valor mínimo não pode ser maior que o valor máximo.");
      return;
    }
    if (numberOfRandomNodes.value <= 0) {
      alert("A quantidade de nós deve ser maior que zero.");
      return;
    }
    emit('generate-random-nodes', {
      min: minRandomValue.value,
      max: maxRandomValue.value,
      count: numberOfRandomNodes.value
    });
  }
}

</script>

<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.random-node-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.random-node-inputs .input-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.random-node-inputs .p-inputnumber {
  width: 100%;
}

/* Remove a margem do último grupo de formulário dentro de um painel */
.p-panel-content .form-group:last-child,
.p-panel-content .form-group-checkbox:last-child {
  margin-bottom: 0;
}
</style>
