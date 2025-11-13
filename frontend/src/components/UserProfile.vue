<template>
  <div v-if="authStore.isAuthenticated" class="user-profile" @click="toggleMenu" aria-haspopup="true" aria-controls="overlay_menu">
    <Avatar 
      :label="authStore.userInitials" 
      class="mr-2" 
      shape="circle" 
      :style="{ backgroundColor: avatarColor, color: '#ffffff' }"
    />
    <div class="user-info">
      <span class="username">{{ authStore.user?.username }}</span>
      <span class="role">{{ authStore.user?.role }}</span>
    </div>
    <Menu ref="menu" id="overlay_menu" :model="overlayMenuItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const menu = ref();

const overlayMenuItems = ref([
    {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => {
            authStore.logout();
        }
    }
]);

const toggleMenu = (event: Event) => {
    menu.value.toggle(event);
};

const avatarColor = computed(() => {
  if (!authStore.user?.username) return '#495057'; // Cor padrão
  let hash = 0;
  for (let i = 0; i < authStore.user.username.length; i++) {
    hash = authStore.user.username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 40%)`;
});
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>