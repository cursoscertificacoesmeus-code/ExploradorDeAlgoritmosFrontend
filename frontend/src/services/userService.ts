import api from './api';
import type { User } from '../types/user/User';

/**
 * Busca todos os usuários do sistema.
 * Requer que o usuário logado tenha a role 'ADMIN'.
 * @returns Uma Promise que resolve com um array de usuários.
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    // Assumindo que o endpoint no backend é /api/users/admin/all
    const response = await api.get<User[]>('/users/admin/all');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todos os usuários:', error);
    throw error;
  }
};

/**
 * Busca todos os usuários com a role 'PERSONAL' do sistema.
 * Requer que o usuário logado tenha a role 'ADMIN'.
 * @returns Uma Promise que resolve com um array de usuários.
 */
export const getPersonalUsers = async (): Promise<User[]> => {
  try {
    // Usando o novo endpoint para listar apenas usuários PERSONAL
    const response = await api.get<User[]>('/users/admin/personal');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários PERSONAL:', error);
    throw error;
  }
};