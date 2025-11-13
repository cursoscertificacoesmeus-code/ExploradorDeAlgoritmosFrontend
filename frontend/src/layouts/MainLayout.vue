<template>
  <div id="app-container">
    <TheHeader />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '../components/TheHeader.vue';
</script>