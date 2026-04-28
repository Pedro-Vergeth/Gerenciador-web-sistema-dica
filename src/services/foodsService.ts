import { api } from './api.ts';
import { getAuthToken } from './api.ts';
import type { CreateFoodRequestDTO, FoodItem, UpdateFoodRequestDTO } from '../types/foods.ts';
import type { PageResponse } from '../types/pagination.ts';

type ValidatePasswordResponse = {
  valid: boolean;
  message: string;
};

type FoodApiResponse = Partial<FoodItem> & {
  imagemBase64?: string;
  imagemUrl?: string;
  imagem?: string;
  content?: FoodApiResponse;
  data?: FoodApiResponse;
};

const normalizeFoodItem = (responseData: FoodApiResponse): FoodItem => {
  const food = responseData.content ?? responseData.data ?? responseData;
  const groupValue = typeof food.grupoAlimentar === 'string'
    ? food.grupoAlimentar
    : food.grupoAlimentar?.nome ?? '';

  return {
    id: food.id ?? '',
    nomePrincipal: food.nomePrincipal ?? '',
    sinonimos: food.sinonimos ?? '',
    porcao: food.porcao ?? '',
    quantidade: food.quantidade ?? null,
    medidaCaseira: food.medidaCaseira ?? '',
    textoInformativo: food.textoInformativo ?? '',
    grupoAlimentar: food.grupoAlimentar ?? groupValue,
    imagem64: food.imagem64 ?? food.imagemBase64 ?? food.imagemUrl ?? food.imagem ?? '',
  };
};

const buildFoodFormData = (data: CreateFoodRequestDTO | UpdateFoodRequestDTO) => {
  const formData = new FormData();

  if ('id' in data) {
    formData.append('id', String(data.id));
  }

  if (data.nomePrincipal !== undefined) {
    formData.append('nomePrincipal', data.nomePrincipal);
  }

  if (data.sinonimos !== undefined) {
    formData.append('sinonimos', data.sinonimos);
  }

  if (data.porcao !== undefined) {
    formData.append('porcao', data.porcao);
  }

  if (data.quantidade !== undefined) {
    formData.append('quantidade', String(data.quantidade));
  }

  if (data.medidaCaseira !== undefined) {
    formData.append('medidaCaseira', data.medidaCaseira);
  }

  if (data.textoInformativo !== undefined) {
    formData.append('textoInformativo', data.textoInformativo);
  }

  if (data.grupoAlimentar !== undefined) {
    formData.append('grupoAlimentar', data.grupoAlimentar);
  }

  if (data.imagem instanceof File) {
    formData.append('imagem', data.imagem);
  }

  return formData;
};

const buildMultipartHeaders = (token: string | null) => {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'multipart/form-data',
  };
};

export const getFoods = async (page = 0, size = 4, buscaLivre = '', grupoAlimentar = '') => {
  const token = getAuthToken();

  const response = await api.get<PageResponse<FoodItem>>('gerenciador/alimento', {
    params: {
      page,
      size,
      buscaLivre: buscaLivre || undefined,
      grupoAlimentar: grupoAlimentar || undefined,
    },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
};

export const createFood = async (data: CreateFoodRequestDTO) => {
  const token = getAuthToken();
  const payload = buildFoodFormData(data);

  const response = await api.post<FoodItem>('gerenciador/alimento', payload, {
    headers: buildMultipartHeaders(token),
  });

  return response.data;
};

export const getFoodById = async (id: string | number) => {
  const token = getAuthToken();

  const response = await api.get<FoodItem>(`gerenciador/alimento/${id}`, {
    params: { id },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return normalizeFoodItem(response.data as FoodApiResponse);
};

export const deleteFood = async (id: string | number, password: string) => {
  const token = getAuthToken();
  const response = await api.post<ValidatePasswordResponse>('gerenciador/usuario/validar-senha', { password }, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.data.valid) {
    throw new Error(response.data.message || 'Senha inválida');
  }

  await api.delete(`gerenciador/alimento/${id}`, {
    data: { password },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const updateFood = async (data: UpdateFoodRequestDTO) => {
  const token = getAuthToken();
  const payload = buildFoodFormData(data);

  const response = await api.put<FoodItem>(`gerenciador/alimento/${data.id}`, payload, {
    headers: buildMultipartHeaders(token),
  });

  return response.data;
};