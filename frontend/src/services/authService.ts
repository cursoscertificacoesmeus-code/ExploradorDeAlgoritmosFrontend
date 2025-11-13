import api from './api';
import type { UserCredentials, UserRegistration, User } from '../types/user/User';

/**
 * Registra um novo usuário.
 * @param registrationData - Os dados do novo usuário (username, email, password).
 * @returns Uma Promise que resolve com os dados do usuário criado.
 */
export const register = async (registrationData: UserRegistration): Promise<User> => {
  try {
    const response = await api.post<User>('/users/register', registrationData);
    return response.data;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

/**
 * Autentica um usuário.
 * @param credentials - Objeto com username e password.
 * @returns Uma Promise que resolve com a mensagem de sucesso do login.
 */
export const login = async (credentials: UserCredentials): Promise<string> => {
  try {
    const response = await api.post<string>('/users/login', credentials);
    // A API retorna um texto 'Login successful!' no corpo da resposta
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

/**
 * Busca os dados do usuário autenticado.
 * @returns Uma Promise que resolve com os dados do usuário.
 */
export const getMe = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/users/me'); // Assumindo que este endpoint existe
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    throw error;
  }
};