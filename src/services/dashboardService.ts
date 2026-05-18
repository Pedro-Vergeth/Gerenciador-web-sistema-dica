import { api } from './api.ts';
import { getAuthToken } from './api.ts';
import type { DashboardStatistics } from '../types/dashboard.ts';

type DashboardStatisticsApiResponse = DashboardStatistics & {
  content?: DashboardStatisticsApiResponse;
  data?: DashboardStatisticsApiResponse;
};

const normalizeDashboardStatistics = (responseData: DashboardStatisticsApiResponse): DashboardStatistics => {
  const statistics = responseData.content ?? responseData.data ?? responseData;

  return {
    totalPesquisaAlimentos: statistics.totalPesquisaAlimentos ?? 0,
    totalPesquisaReceitas: statistics.totalPesquisaReceitas ?? 0,
    totalPesquisaVideosEducativos: statistics.totalPesquisaVideosEducativos ?? 0,
    quantidadeAlimentosCadastrados: statistics.quantidadeAlimentosCadastrados ?? 0,
    quantidadeReceitasCadastradas: statistics.quantidadeReceitasCadastradas ?? 0,
  };
};

export const getDashboardStatistics = async () => {
  const token = getAuthToken();

  const response = await api.get<DashboardStatisticsApiResponse>('gerenciador/estatistica', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return normalizeDashboardStatistics(response.data as DashboardStatisticsApiResponse);
};
