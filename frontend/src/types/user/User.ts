/**
 * Tipo para o objeto de usuário que recebemos da API.
 * Corresponde ao UserResponseDTO no backend.
 */
export type User = {
  id: number;
  username: string;
  email: string;
  role: 'PERSONAL' | 'ADMIN'; // Ajuste os papéis conforme necessário
};

/**
 * Tipo para os dados que enviamos no corpo do login.
 */
export type UserCredentials = {
  username: string;
  password: string;
};

/**
 * Tipo para os dados completos de registro, incluindo email.
 */
export type UserRegistration = UserCredentials & {
  email: string;
};