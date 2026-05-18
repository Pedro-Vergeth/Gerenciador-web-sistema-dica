import axios from 'axios';
import { api, getAuthToken } from './api.ts';
import type {
  VideoIntroducaoItem,
  VideoIntroducaoRequestDTO,
  VideoIntroducaoUpdateDTO,
} from '../types/videoIntroducao.ts';

type VideoIntroducaoApiResponse = Partial<VideoIntroducaoItem> & {
  content?: VideoIntroducaoApiResponse;
  data?: VideoIntroducaoApiResponse;
  dadosFicheiro?: string | null;
};

const normalizeVideoIntroducao = (responseData: VideoIntroducaoApiResponse): VideoIntroducaoItem => {
  const videoIntroducao = responseData.content ?? responseData.data ?? responseData;

  return {
    id: videoIntroducao.id ?? '',
    dadosFicheiroBase64: videoIntroducao.dadosFicheiroBase64 ?? videoIntroducao.dadosFicheiro ?? null,
  };
};

const buildVideoIntroducaoFormData = (data: VideoIntroducaoRequestDTO | VideoIntroducaoUpdateDTO) => {
  const formData = new FormData();

  formData.append('dadosFicheiro', data.dadosFicheiro);

  return formData;
};

const buildMultipartHeaders = (token: string | null) => {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'multipart/form-data',
  };
};

const isNotFoundError = (error: unknown) => {
  return axios.isAxiosError(error) && error.response?.status === 404;
};

export const getVideoIntroducao = async () => {
  const token = getAuthToken();

  try {
    const response = await api.get<VideoIntroducaoApiResponse>('gerenciador/video-introdutorio', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return normalizeVideoIntroducao(response.data);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
};

export const createVideoIntroducao = async (data: VideoIntroducaoRequestDTO) => {
  const token = getAuthToken();
  const payload = buildVideoIntroducaoFormData(data);

  const response = await api.post<VideoIntroducaoApiResponse>('gerenciador/video-introdutorio', payload, {
    headers: buildMultipartHeaders(token),
  });

  return normalizeVideoIntroducao(response.data);
};

export const updateVideoIntroducao = async (data: VideoIntroducaoUpdateDTO) => {
  const token = getAuthToken();
  const payload = buildVideoIntroducaoFormData(data);

  const response = await api.put<VideoIntroducaoApiResponse>('gerenciador/video-introdutorio', payload, {
    headers: buildMultipartHeaders(token),
  });

  return normalizeVideoIntroducao(response.data);
};