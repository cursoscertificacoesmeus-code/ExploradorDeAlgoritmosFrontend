import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGraphStore = defineStore('graph', () => {
  // State
  const isDirected = ref(false);
  const isWeighted = ref(false);
  const isMixed = ref(false);

  return {
    isDirected,
    isWeighted,
    isMixed,
  };
});