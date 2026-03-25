import { api } from './api.ts';
import { getAuthToken } from './api.ts';

export type UserItem = {
  id: string | number;
  nome: string;
  email: string;
  role: string;
};

export type CreateUserRequestDTO = {
  nome: string;
  email: string;
  password: string;
  role: string;
};

export type PageResponse<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

type ValidatePasswordResponse = {
  valid: boolean;
  message: string;
};

export type UpdateUserRequestDTO = {
  id: string | number;
  nome?: string;
  email?: string;
  role?: string;
};

export const getUsers = async (page = 0, size = 10) => {
  const token = getAuthToken();

  const response = await api.get<PageResponse<UserItem>>('gerenciador/usuario?size=4', {
    params: { page, size },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
};

export const createUser = async (data: CreateUserRequestDTO) => {
  const token = getAuthToken();

  const response = await api.post<UserItem>('gerenciador/usuario', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
};

export const getUserById = async (id: string | number) => {
  const token = getAuthToken();

  const response = await api.get<UserItem>(`gerenciador/usuario/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
};

export const deleteUser = async (id: string | number, password: string) => {
  const token = getAuthToken();
  const response = await api.post<ValidatePasswordResponse>('gerenciador/usuario/validar-senha', { password }, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const responseData = response.data;

  if (!responseData.valid) {
    throw new Error(responseData.message || 'Senha inválida');
  }

  await api.delete(`gerenciador/usuario/${id}`, {
    data: { password },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const updateUser = async (data: UpdateUserRequestDTO) => {
  const token = getAuthToken();
  const response = await api.put<UserItem>(`gerenciador/usuario`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

