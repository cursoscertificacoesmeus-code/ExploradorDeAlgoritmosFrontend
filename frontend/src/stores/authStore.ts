import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserCredentials } from '../types/user/User';
import { login as apiLogin, getMe } from '../services/authService';
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userInitials = computed(() => {
    if (user.value && user.value.username) {
      return user.value.username.substring(0, 2).toUpperCase();
    }
    return '';
  });

  // Actions
  async function login(credentials: UserCredentials) {
    try {
      await apiLogin(credentials); // 1. Faz o login para obter o cookie de sessão
      await fetchUser(); // 2. Busca os dados do usuário
      router.push('/home'); // 3. Redireciona para a home
    } catch (error) {
      console.error('Falha no processo de login:', error);
      user.value = null; // Garante que o usuário não está setado em caso de falha
      throw error; // Re-lança o erro para o componente de UI tratar (ex: mostrar toast)
    }
  }

  async function fetchUser() {
    try {
      const userData = await getMe();
      user.value = userData;
    } catch (error) {
      user.value = null;
      console.error('Não foi possível buscar os dados do usuário.', error);
    }
  }

  function logout() {
    user.value = null;
    router.push('/');
    // Opcional: Chamar um endpoint de /logout no backend se existir
  }

  return { user, isAuthenticated, userInitials, login, fetchUser, logout };
});