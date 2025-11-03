import { defineStore } from 'pinia';

export const useGraphStore = defineStore('graph', {
  state: () => ({
    isDirected: false, // false = não direcionado, true = direcionado
    isWeighted: false, // false = não ponderado, true = ponderado
  }),
  actions: {
    setDirected(value) {
      this.isDirected = value;
    },
    setWeighted(value) {
      this.isWeighted = value;
    }
  }
});
