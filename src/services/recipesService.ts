import { api } from './api.ts';
import { getAuthToken } from './api.ts';
import type { PageResponse } from '../types/pagination.ts';
import type { CreateRecipeRequestDTO, RecipeItem, UpdateRecipeRequestDTO } from '../types/recipes.ts';

type ValidatePasswordResponse = {
  valid: boolean;
  message: string;
};

type RecipeApiResponse = Partial<RecipeItem> & {
  imagemBase64?: string;
  imagemUrl?: string;
  imagem?: string;
  content?: RecipeApiResponse;
  data?: RecipeApiResponse;
};

const normalizeRecipeItem = (responseData: RecipeApiResponse): RecipeItem => {
  const recipe = responseData.content ?? responseData.data ?? responseData;

  return {
    id: recipe.id ?? '',
    titulo: recipe.titulo ?? '',
    tipoRefeicao: recipe.tipoRefeicao ?? '',
    tempoPreparoMinutos: recipe.tempoPreparoMinutos ?? null,
    porcao: recipe.porcao ?? '',
    rendimento: recipe.rendimento ?? '',
    grupoAlimentar: recipe.grupoAlimentar ?? null,
    ingredientes: recipe.ingredientes ?? '',
    modoPreparo: recipe.modoPreparo ?? '',
    imagem64: recipe.imagem64 ?? recipe.imagemBase64 ?? recipe.imagemUrl ?? recipe.imagem ?? '',
    estado: recipe.estado ?? null,
  };
};

const buildRecipeFormData = (data: CreateRecipeRequestDTO | UpdateRecipeRequestDTO) => {
  const formData = new FormData();

  if ('id' in data) {
    formData.append('id', String(data.id));
  }

  formData.append('titulo', data.titulo);
  formData.append('tipoRefeicao', data.tipoRefeicao);

  if (typeof data.tempoPreparoMinutos === 'number' && Number.isFinite(data.tempoPreparoMinutos)) {
    formData.append('tempoPreparoMinutos', String(data.tempoPreparoMinutos));
  }

  formData.append('porcao', data.porcao);
  formData.append('rendimento', data.rendimento);
  formData.append('grupoAlimentar', data.grupoAlimentar);
  formData.append('ingredientes', data.ingredientes);
  formData.append('modoPreparo', data.modoPreparo);
  formData.append('idEstado', String(data.idEstado));

  if (data.imagem instanceof File) {
    formData.append('imagem', data.imagem);
  }

  return formData;
};

const buildMultipartHeaders = (token: string | null) => ({
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  'Content-Type': 'multipart/form-data',
});

export const getRecipes = async (page = 0, size = 4, buscaLivre = '', tipoRefeicao = '', grupoAlimentar = '') => {
  const token = getAuthToken();

  const response = await api.get<PageResponse<RecipeItem>>('gerenciador/receita', {
    params: {
      page,
      size,
      buscaLivre: buscaLivre || undefined,
      tipoRefeicao: tipoRefeicao || undefined,
      grupoAlimentar: grupoAlimentar || undefined,
    },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
};

export const createRecipe = async (data: CreateRecipeRequestDTO) => {
  const token = getAuthToken();
  const payload = buildRecipeFormData(data);

  const response = await api.post<RecipeItem>('gerenciador/receita', payload, {
    headers: buildMultipartHeaders(token),
  });

  return response.data;
};

export const getRecipeById = async (id: string | number) => {
  const token = getAuthToken();

  const response = await api.get<RecipeItem>(`gerenciador/receita/${id}`, {
    params: { id },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return normalizeRecipeItem(response.data as RecipeApiResponse);
};

export const updateRecipe = async (data: UpdateRecipeRequestDTO) => {
  const token = getAuthToken();
  const payload = buildRecipeFormData(data);

  const response = await api.put<RecipeItem>(`gerenciador/receita/${data.id}`, payload, {
    headers: buildMultipartHeaders(token),
  });

  return response.data;
};

export const deleteRecipe = async (id: string | number, password: string) => {
  const token = getAuthToken();
  const response = await api.post<ValidatePasswordResponse>('gerenciador/usuario/validar-senha', { password }, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const responseData = response.data;

  if (!responseData.valid) {
    throw new Error(responseData.message);
  }

  const deleteResponse = await api.delete(`gerenciador/receita/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return deleteResponse.data;
};
