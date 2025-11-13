import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  // A URL base da sua API backend, usando variáveis de ambiente com fallback.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',

  // ESSENCIAL para autenticação baseada em cookies!
  // Isso diz ao axios para enviar cookies (como o JSESSIONID) com cada requisição.
  withCredentials: true,
});

// Interceptor de Resposta
api.interceptors.response.use(
  // Função para respostas bem-sucedidas (status 2xx)
  (response) => {
    return response;
  },
  // Função para respostas com erro
  (error) => {
    // Verifica se o erro é de autenticação/autorização
    if (error.response && [401, 403].includes(error.response.status)) {
      const authStore = useAuthStore();
      // Limpa o estado do usuário e redireciona para o login
      // Apenas se o usuário estava previamente autenticado no frontend
      if (authStore.isAuthenticated) {
        authStore.logout();
        alert('Sua sessão expirou. Por favor, faça login novamente.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;