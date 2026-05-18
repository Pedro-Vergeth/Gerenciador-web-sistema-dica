import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../../components/dashboard';
import {
  FoodInventoryIcon,
  FoodSearchIcon,
  MoonIcon,
  NotificationIcon,
  RecipeInventoryIcon,
  RecipeSearchIcon,
  SearchIcon,
  UserIcon,
  VideoSearchIcon,
} from '../../../components/icons/sharedIcons';
import sistemaImage from '../../../assets/logo.png';
import { auth } from '../../../services/authService.ts';
import { getDashboardStatistics } from '../../../services/dashboardService.ts';
import type { DashboardStatistics } from '../../../types/dashboard.ts';

type DashboardCardConfig = {
  titulo: string;
  valor: string;
  badge: string;
  descricao: string;
  icone: ReactNode;
  accentClassName: string;
  badgeClassName: string;
  className?: string;
};

type DashboardStatisticsViewModel = {
  totalPesquisaAlimentos: number;
  totalPesquisaReceitas: number;
  totalPesquisaVideosEducativos: number;
  quantidadeAlimentosCadastrados: number;
  quantidadeReceitasCadastradas: number;
};

const searchSectionCards = (statistics: DashboardStatisticsViewModel): DashboardCardConfig[] => [
  {
    titulo: 'Pesquisas mensais de alimentos',
    valor: String(statistics.totalPesquisaAlimentos),
    badge: statistics.totalPesquisaAlimentos > 0 ? 'este mês' : 'sem atividade',
    descricao: statistics.totalPesquisaAlimentos > 0 ? 'pesquisa registrada no mês' : 'nenhuma pesquisa no mês',
    icone: <FoodSearchIcon />,
    accentClassName: 'bg-[#eef5d9] text-[#6c8f1a]',
    badgeClassName: statistics.totalPesquisaAlimentos > 0 ? 'bg-[#eef5d9] text-[#6c8f1a]' : 'bg-[#ecebdf] text-[#7c816f]',
  },
  {
    titulo: 'Pesquisas mensais de receitas',
    valor: String(statistics.totalPesquisaReceitas),
    badge: statistics.totalPesquisaReceitas > 0 ? 'este mês' : 'sem atividade',
    descricao: statistics.totalPesquisaReceitas > 0 ? 'pesquisa registrada no mês' : 'nenhuma pesquisa no mês',
    icone: <RecipeSearchIcon />,
    accentClassName: 'bg-[#fdf1c7] text-[#b27a00]',
    badgeClassName: statistics.totalPesquisaReceitas > 0 ? 'bg-[#ecebdf] text-[#7c816f]' : 'bg-[#ecebdf] text-[#7c816f]',
  },
  {
    titulo: 'Pesquisas mensais de vídeos educativos',
    valor: String(statistics.totalPesquisaVideosEducativos),
    badge: statistics.totalPesquisaVideosEducativos > 0 ? 'este mês' : 'sem atividade',
    descricao: statistics.totalPesquisaVideosEducativos > 0 ? 'pesquisa registrada no mês' : 'nenhuma pesquisa no mês',
    icone: <VideoSearchIcon />,
    accentClassName: 'bg-[#e3ebff] text-[#4775f6]',
    badgeClassName: statistics.totalPesquisaVideosEducativos > 0 ? 'bg-[#ecebdf] text-[#7c816f]' : 'bg-[#ecebdf] text-[#7c816f]',
  },
];

const inventorySectionCards = (statistics: DashboardStatisticsViewModel): DashboardCardConfig[] => [
  {
    titulo: 'Alimentos cadastrados',
    valor: String(statistics.quantidadeAlimentosCadastrados),
    badge: statistics.quantidadeAlimentosCadastrados > 0 ? '+ este mês' : 'aguardando cadastro',
    descricao: statistics.quantidadeAlimentosCadastrados > 0 ? 'itens cadastrados no sistema' : 'nenhum alimento cadastrado ainda',
    icone: <FoodInventoryIcon />,
    accentClassName: 'bg-[#eef5d9] text-[#6c8f1a]',
    badgeClassName: statistics.quantidadeAlimentosCadastrados > 0 ? 'bg-[#eef5d9] text-[#6c8f1a]' : 'bg-[#ecebdf] text-[#7c816f]',
    className: 'xl:col-span-1 xl:min-h-[166px]',
  },
  {
    titulo: 'Receitas cadastradas',
    valor: String(statistics.quantidadeReceitasCadastradas),
    badge: statistics.quantidadeReceitasCadastradas > 0 ? 'este mês' : 'aguardando cadastro',
    descricao: statistics.quantidadeReceitasCadastradas > 0 ? 'receitas cadastradas no sistema' : 'nenhuma receita cadastrada ainda',
    icone: <RecipeInventoryIcon />,
    accentClassName: 'bg-[#ecebdf] text-[#6f705e]',
    badgeClassName: statistics.quantidadeReceitasCadastradas > 0 ? 'bg-[#ecebdf] text-[#6f705e]' : 'bg-[#ecebdf] text-[#7c816f]',
    className: 'xl:col-span-1 xl:min-h-[166px]',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogout() {
    await auth.logout();
    navigate('/');
  }

  useEffect(() => {
    let isActive = true;

    async function loadDashboardStatistics() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getDashboardStatistics();

        if (isActive) {
          setStatistics(response);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error instanceof Error ? error.message : 'Não foi possível carregar os indicadores do dashboard.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboardStatistics();

    return () => {
      isActive = false;
    };
  }, []);

  const dashboardStatistics: DashboardStatisticsViewModel = {
    totalPesquisaAlimentos: statistics?.totalPesquisaAlimentos ?? 0,
    totalPesquisaReceitas: statistics?.totalPesquisaReceitas ?? 0,
    totalPesquisaVideosEducativos: statistics?.totalPesquisaVideosEducativos ?? 0,
    quantidadeAlimentosCadastrados: statistics?.quantidadeAlimentosCadastrados ?? 0,
    quantidadeReceitasCadastradas: statistics?.quantidadeReceitasCadastradas ?? 0,
  };

  const searchCards = searchSectionCards(dashboardStatistics);
  const inventoryCards = inventorySectionCards(dashboardStatistics);

  return (
    <div className="flex min-h-screen w-full bg-[#f7f6ef]">
      <aside className="w-3/20 bg-white p-6 min-h-screen shadow-md flex flex-col">
        <div className="flex flex-col items-center gap-3 pb-6 border-b border-gray-100">
          <img
            src={sistemaImage}
            alt="Sistema"
            className="h-24 w-24 rounded-2xl object-contain shadow-sm"
          />
          <h2 className="text-lg font-semibold text-slate-800 text-center">
            Gerenciador Web
          </h2>
        </div>

        <nav className="flex flex-col gap-3 py-6 flex-1">
          <a href="#" className="text-gray-700 hover:text-gray-900">Dashboard</a>
          <a href="/main/usuarios" className="text-gray-700 hover:text-gray-900">Usuários</a>
          <a href="/main/alimentos" className="text-gray-700 hover:text-gray-900">Alimentos</a>
          <a href="/main/receitas" className="text-gray-700 hover:text-gray-900">Receitas</a>
          <a href="/main/videos" className="text-gray-700 hover:text-gray-900">Videos Educativos</a>
          <a href="/main/configuracoes" className="text-gray-700 hover:text-gray-900">Configurações</a>
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </aside>
      <div className="flex min-h-screen w-17/20 flex-col items-center pb-0">
        <header className="w-[96%] overflow-hidden rounded-b-3xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-lg font-medium text-slate-800">DICA</span>

            <div className="flex items-center gap-4 text-slate-600">
              <button type="button" className="transition-colors hover:text-slate-900" aria-label="Perfil">
                <UserIcon />
              </button>
              <button type="button" className="transition-colors hover:text-slate-900" aria-label="Tema">
                <MoonIcon />
              </button>
              <button type="button" className="transition-colors hover:text-slate-900" aria-label="Notificações">
                <NotificationIcon />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              </div>

              <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:max-w-115">
                <input
                  type="text"
                  placeholder="Pesquisar"
                  className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
                />
                <span className="text-blue-500">
                  <SearchIcon />
                </span>
              </label>
            </div>
          </div>
        </header>

        <section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-[#e8e5da] bg-white shadow-sm">
          <div className="flex flex-1 flex-col gap-8 px-5 py-5">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#5f675d]">Pesquisas no mês</h2>
                <span className="rounded-full border border-[#ddd7c4] bg-[#faf8f0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6f7368]">
                  {searchCards.length} indicadores
                </span>
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                {(isLoading ? searchCards.map((card) => ({ ...card, valor: '...' })) : searchCards).map((card) => (
                  <DashboardCard
                    key={card.titulo}
                    titulo={card.titulo}
                    valor={card.valor}
                    badge={card.badge}
                    descricao={card.descricao}
                    icone={card.icone}
                    accentClassName={card.accentClassName}
                    badgeClassName={card.badgeClassName}
                    className="xl:col-span-1"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#5f675d]">Conteúdo cadastrado no sistema</h2>
                <span className="rounded-full border border-[#ddd7c4] bg-[#faf8f0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6f7368]">
                  {inventoryCards.length} indicadores
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {(isLoading ? inventoryCards.map((card) => ({ ...card, valor: '...' })) : inventoryCards).map((card) => (
                  <DashboardCard
                    key={card.titulo}
                    titulo={card.titulo}
                    valor={card.valor}
                    badge={card.badge}
                    descricao={card.descricao}
                    icone={card.icone}
                    accentClassName={card.accentClassName}
                    badgeClassName={card.badgeClassName}
                    className={card.className}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1" />
          </div>

          <footer className="flex items-center justify-center gap-3 rounded-b-none bg-[#efefef] text-sm text-slate-700">
            <img src={sistemaImage} alt="Logo do sistema" className="h-8 w-8 rounded-md object-contain" />
            <span>© 2025 Dica. Todos os direitos reservados.</span>
          </footer>
        </section>

      </div>
    </div>
  );
}

