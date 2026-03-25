import { api } from './api.ts';
import { getAuthToken } from './api.ts';
import type { PageResponse } from '../types/pagination.ts';
import type { CreateVideoRequestDTO, UpdateVideoRequestDTO, VideoItem } from '../types/videos.ts';

type VideoApiResponse = Partial<VideoItem> & {
  content?: VideoApiResponse;
  data?: VideoApiResponse;
};

const normalizeVideoItem = (responseData: VideoApiResponse): VideoItem => {
  const video = responseData.content ?? responseData.data ?? responseData;

  return {
    id: video.id ?? '',
    titulo: video.titulo ?? '',
    duracaoSegundos: video.duracaoSegundos ?? null,
    videoUrl: video.videoUrl ?? '',
  };
};

export const getVideos = async (page = 0, size = 4, buscaLivre = '') => {
  const token = getAuthToken();

  const response = await api.get<PageResponse<VideoItem>>('gerenciador/video-educativo', {
    params: {
      page,
      size,
      buscaLivre: buscaLivre || undefined,
    },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
};

export const createVideo = async (data: CreateVideoRequestDTO) => {
  const token = getAuthToken();

  const response = await api.post<VideoItem>('gerenciador/video-educativo', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
};

export const getVideoById = async (id: string | number) => {
  const token = getAuthToken();

  const response = await api.get<VideoItem>(`gerenciador/video-educativo/${id}`, {
    params: { id },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return normalizeVideoItem(response.data as VideoApiResponse);
};

export const updateVideo = async (data: UpdateVideoRequestDTO) => {
  const token = getAuthToken();

  const response = await api.put<VideoItem>(`gerenciador/video-educativo/${data.id}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response.data;
};

type ValidatePasswordResponse = {
  valid: boolean;
  message: string;
};

export const deleteVideo = async (id: string | number, password: string) => {
  const token = getAuthToken();

  const response = await api.post<ValidatePasswordResponse>('gerenciador/usuario/validar-senha', { password }, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.data.valid) {
    throw new Error(response.data.message || 'Senha inválida');
  }

  await api.delete(`gerenciador/video-educativo/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};