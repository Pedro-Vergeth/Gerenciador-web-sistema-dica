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

export async function getUsers(page = 0, size = 10) {
  const token = getAuthToken();

  const response = await api.get<PageResponse<UserItem>>('gerenciador/usuario?size=4', {
    params: { page, size },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
}

export async function createUser(data: CreateUserRequestDTO) {
  const token = getAuthToken();

  const response = await api.post<UserItem>('gerenciador/usuario', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
}