import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfoIcon } from '../../../components/icons/iconLogin.tsx';
import { AddUserIcon, EditIcon, FilterIcon, MoonIcon, NotificationIcon, SearchIcon, TrashIcon, UserIcon } from '../../../components/icons/sharedIcons';
import FoodGroupSelect from '../../../components/foodGroupSelect';
import sistemaImage from '../../../assets/hero.png';
import { auth } from '../../../services/authService.ts';
import { createRecipe, deleteRecipe, getRecipes } from '../../../services/recipesService.ts';
import { ESTADO_OPTIONS, TIPO_REFEICAO_OPTIONS } from '../../../types/recipes.ts';
import type { CreateRecipeRequestDTO, RecipeItem } from '../../../types/recipes.ts';
import type { PageResponse } from '../../../types/pagination.ts';
import type { RecipeForm } from '../../../types/recipes.ts';

const RECIPES_PAGE_SIZE = 4;

function getRecipeImagePreview(image64: string) {
  if (!image64) {
    return '';
  }
  if (image64.startsWith('data:')) {
    return image64;
  }

  return `data:image/jpeg;base64,${image64}`;
}

function formatTempo(tempo: number | null) {
  return tempo === null ? '-' : `${tempo} min`;
}

function formatEstado(estado: RecipeItem['estado']) {
  if (!estado) {
    return '-';
  }

  return `${estado.nome} (${estado.sigla})`;
}

function formatGrupoAlimentar(grupoAlimentar: RecipeItem['grupoAlimentar']) {
  if (!grupoAlimentar) {
    return '-';
  }

  return typeof grupoAlimentar === 'string' ? grupoAlimentar : grupoAlimentar.nome ?? '-';
}

function getSelectedEstado(estadoId: string | number | '') {
  if (estadoId === '') {
    return null;
  }

  return ESTADO_OPTIONS.find((estado) => estado.id === Number(estadoId)) ?? null;
}

export default function RecipesPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [page, setPage] = useState<PageResponse<RecipeItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateRecipeOpen, setIsCreateRecipeOpen] = useState(false);
  const [isSavingRecipe, setIsSavingRecipe] = useState(false);
  const [isDeleteRecipeOpen, setIsDeleteRecipeOpen] = useState(false);
  const [deleteRecipeTarget, setDeleteRecipeTarget] = useState<RecipeItem | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingRecipe, setIsDeletingRecipe] = useState(false);
  const [isFilterRecipeOpen, setIsFilterRecipeOpen] = useState(false);
  const [pendingFilterTipoRefeicao, setPendingFilterTipoRefeicao] = useState('');
  const [pendingFilterGrupoAlimentar, setPendingFilterGrupoAlimentar] = useState('');
  const [selectedFilterTipoRefeicao, setSelectedFilterTipoRefeicao] = useState('');
  const [selectedFilterGrupoAlimentar, setSelectedFilterGrupoAlimentar] = useState('');
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState<RecipeForm>({
    titulo: '',
    tipoRefeicao: '',
    tempoPreparoMinutos: '',
    porcao: '',
    grupoAlimentar: '',
    ingredientes: '',
    modoPreparo: '',
    imagem: null,
    idEstado: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const selectedCreateEstado = getSelectedEstado(formData.idEstado);

  async function handleLogout() {
    await auth.logout();
    navigate('/');
  }

  const loadRecipes = useCallback(async (pageIndex = 0, searchValue = '', tipoRefeicao = selectedFilterTipoRefeicao, grupoAlimentar = selectedFilterGrupoAlimentar) => {
    setLoading(true);

    try {
      const response = await getRecipes(pageIndex, RECIPES_PAGE_SIZE, searchValue, tipoRefeicao, grupoAlimentar);
      setRecipes(response.content);
      setPage(response);
      setCurrentPage(response.number);
    } catch {
      setRecipes([]);
      setPage(null);
    } finally {
      setLoading(false);
    }
  }, [selectedFilterGrupoAlimentar, selectedFilterTipoRefeicao]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRecipes(currentPage, searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [currentPage, loadRecipes, searchTerm]);

  function handleOpenCreateRecipe() {
    setFormError('');
    setIsCreateRecipeOpen(true);
  }

  function handleCloseCreateRecipe() {
    setIsCreateRecipeOpen(false);
    setFormError('');
    setFormData({
      titulo: '',
      tipoRefeicao: '',
      tempoPreparoMinutos: '',
      porcao: '',
      grupoAlimentar: '',
      ingredientes: '',
      modoPreparo: '',
      imagem: null,
      idEstado: '',
    });
    setImagePreview('');
  }

  function handleOpenRecipeDetails(recipe: RecipeItem) {
    setSelectedRecipe(recipe);
  }

  function handleCloseRecipeDetails() {
    setSelectedRecipe(null);
  }

  function handleOpenFilterRecipe() {
    setPendingFilterTipoRefeicao(selectedFilterTipoRefeicao);
    setPendingFilterGrupoAlimentar(selectedFilterGrupoAlimentar);
    setIsFilterRecipeOpen(true);
  }

  function handleCloseFilterRecipe() {
    setIsFilterRecipeOpen(false);
  }

  function handleClearRecipeFilters() {
    setSelectedFilterTipoRefeicao('');
    setSelectedFilterGrupoAlimentar('');
    setPendingFilterTipoRefeicao('');
    setPendingFilterGrupoAlimentar('');
    setCurrentPage(0);
  }

  async function handleApplyRecipeFilters() {
    setSelectedFilterTipoRefeicao(pendingFilterTipoRefeicao);
    setSelectedFilterGrupoAlimentar(pendingFilterGrupoAlimentar);
    setIsFilterRecipeOpen(false);
    setCurrentPage(0);
    await loadRecipes(0, searchTerm.trim(), pendingFilterTipoRefeicao, pendingFilterGrupoAlimentar);
  }

  function handleOpenDeleteRecipe(recipe: RecipeItem) {
    setDeleteRecipeTarget(recipe);
    setDeletePassword('');
    setDeleteError('');
    setShowDeletePassword(false);
    setIsDeleteRecipeOpen(true);
  }

  function handleCloseDeleteRecipe() {
    setIsDeleteRecipeOpen(false);
    setDeleteRecipeTarget(null);
    setDeletePassword('');
    setDeleteError('');
    setShowDeletePassword(false);
  }

  async function handleDeleteRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!deleteRecipeTarget) {
      return;
    }

    if (!deletePassword.trim()) {
      setDeleteError('Informe sua senha para confirmar a exclusão.');
      return;
    }

    setIsDeletingRecipe(true);
    setDeleteError('');

    try {
      await deleteRecipe(deleteRecipeTarget.id, deletePassword);
      handleCloseDeleteRecipe();
      await loadRecipes(currentPage, searchTerm.trim());
    } catch (error) {
      if (error instanceof Error && error.message) {
        setDeleteError(error.message);
        return;
      }

      setDeleteError('Não foi possível excluir a receita. Verifique a senha e tente novamente.');
    } finally {
      setIsDeletingRecipe(false);
    }
  }

  async function handleCreateRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingRecipe(true);
    setFormError('');

    if (!formData.titulo.trim() || !formData.tipoRefeicao || !formData.grupoAlimentar || !formData.ingredientes.trim() || !formData.modoPreparo.trim() || !formData.idEstado) {
      setFormError('Preencha os campos obrigatórios da receita.');
      setIsSavingRecipe(false);
      return;
    }

    try {
      await createRecipe(formData as CreateRecipeRequestDTO);
      handleCloseCreateRecipe();
      await loadRecipes(currentPage, searchTerm.trim());
    } catch {
      setFormError('Não foi possível cadastrar a receita. Verifique os dados e tente novamente.');
    } finally {
      setIsSavingRecipe(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F5F5F5]">
      <aside className="flex min-h-screen w-3/20 flex-col bg-white p-6 shadow-md">
        <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-6">
          <img src={sistemaImage} alt="Sistema" className="h-20 w-20 rounded-2xl object-cover shadow-sm" />
          <h2 className="text-center text-lg font-semibold text-slate-800">Gerenciador Web</h2>
        </div>

        <nav className="flex flex-1 flex-col gap-3 py-6">
          <a href="/main/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
          <a href="/main/usuarios" className="text-gray-700 hover:text-gray-900">Usuários</a>
          <a href="/main/alimentos" className="text-gray-700 hover:text-gray-900">Alimentos</a>
          <a href="/main/receitas" className="font-semibold text-slate-900">Receitas</a>
          <a href="/main/videos" className="text-gray-700 hover:text-gray-900">Videos Educativos</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">Configurações</a>
        </nav>

        <div className="border-t border-gray-100 pt-6">
          <button type="button" onClick={() => void handleLogout()} className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2">Logout</button>
        </div>
      </aside>

      <div className="flex min-h-screen w-17/20 flex-col items-center pb-0">
        <header className="w-[96%] overflow-hidden rounded-b-3xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-lg font-medium text-slate-800">DICA</span>

            <div className="flex items-center gap-4 text-slate-600">
              <button type="button" className="transition-colors hover:text-slate-900" aria-label="Perfil"><UserIcon /></button>
              <button type="button" className="transition-colors hover:text-slate-900" aria-label="Tema"><MoonIcon /></button>
              <button type="button" className="transition-colors hover:text-slate-900" aria-label="Notificações"><NotificationIcon /></button>
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Receitas</h1>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:max-w-115">
                  <input type="text" placeholder="Pesquisar" value={searchTerm} onChange={(event) => { setCurrentPage(0); setSearchTerm(event.target.value); }} className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" />
                  <span className="text-blue-500"><SearchIcon /></span>
                </label>

                <button type="button" onClick={handleOpenCreateRecipe} className="flex h-10 items-center gap-2 rounded-full border border-blue-500 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50 whitespace-nowrap">
                  <AddUserIcon />
                  Cadastrar receita
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-7">
            <h1 className="text-2xl font-semibold text-slate-900">Lista de receitas cadastradas</h1>

                <button
                  type="button"
                  onClick={handleOpenFilterRecipe}
                  className="flex items-center gap-2 rounded-full border border-blue-500 px-5 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                >
                  Filtro
                  <span className="text-blue-700">
                    <FilterIcon />
                  </span>
                </button>
          </div>

          {page && <div className="px-6 pb-2 text-sm text-slate-500">Página {page.number + 1} de {page.totalPages} - {page.totalElements} registros</div>}

          <div className="px-2 pb-4">
            <div className="max-h-[calc(100vh-330px)] overflow-y-auto rounded-t-lg border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-[#101828] text-white">
                  <tr className="h-16 text-sm font-medium">
                    <th className="px-2 py-4 font-normal">Imagem</th>
                    <th className="px-2 py-4 font-normal">Título</th>
                    <th className="px-2 py-4 font-normal">Tipo refeição</th>
                    <th className="px-2 py-4 font-normal">Grupo alimentar</th>
                    <th className="px-2 py-4 font-normal">Estado</th>
                    <th className="px-2 py-4 font-normal">Tempo</th>
                    <th className="px-2 py-4 font-normal text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-900">
                  {loading ? (
                    <tr className="border-b border-slate-200 bg-white">
                      <td className="px-6 py-6 text-slate-500" colSpan={7}>Carregando receitas...</td>
                    </tr>
                  ) : recipes.length > 0 ? (
                    recipes.map((recipe) => (
                      <RecipeRow
                        key={recipe.id}
                        imagePreview={getRecipeImagePreview(recipe.imagem64)}
                        titulo={recipe.titulo}
                        tipoRefeicao={recipe.tipoRefeicao}
                        grupoAlimentar={formatGrupoAlimentar(recipe.grupoAlimentar)}
                        estado={formatEstado(recipe.estado)}
                        tempoPreparoMinutos={formatTempo(recipe.tempoPreparoMinutos)}
                        onView={() => handleOpenRecipeDetails(recipe)}
                        onEdit={() => navigate(`/main/receitas/edit/${recipe.id}`)}
                        onDelete={() => handleOpenDeleteRecipe(recipe)}
                      />
                    ))
                  ) : (
                    <tr className="border-b border-slate-200 bg-white">
                      <td className="px-6 py-6 text-slate-500" colSpan={7}>Nenhuma receita encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
            <span>{page ? `${page.number + 1} de ${page.totalPages} páginas` : '0 de 0 páginas'}</span>

            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setCurrentPage((value) => Math.max(0, value - 1))} disabled={!page || page.first || loading} className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Anterior</button>
              <button type="button" onClick={() => setCurrentPage((value) => value + 1)} disabled={!page || page.last || loading} className="rounded-full border border-blue-500 px-4 py-2 font-semibold text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50">Próximo</button>
            </div>
          </div>

          <div className="flex-1" />

          <footer className="flex items-center justify-center gap-3 rounded-b-none bg-[#efefef] text-sm text-slate-700">
            <img src={sistemaImage} alt="Logo do sistema" className="h-8 w-8 rounded-md object-cover" />
            <span>© 2025 [Nome da sua Empresa/App]. Todos os direitos reservados.</span>
          </footer>
        </section>
      </div>

      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4" onClick={handleCloseRecipeDetails}>
          <div className="max-h-[92vh] w-[90vw] max-w-[90vw] overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Detalhes da receita</h2>
              </div>

              <button type="button" onClick={handleCloseRecipeDetails} className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Fechar detalhes da receita">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <div className="grid max-h-[calc(92vh-92px)] gap-6 overflow-y-auto p-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                {getRecipeImagePreview(selectedRecipe.imagem64) ? (
                  <img src={getRecipeImagePreview(selectedRecipe.imagem64)} alt={`Imagem da receita ${selectedRecipe.titulo}`} className="aspect-square h-full min-h-80 w-full object-cover" />
                ) : (
                  <div className="flex aspect-square min-h-80 items-center justify-center px-6 text-center text-slate-400">
                    <div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-14 w-14">
                        <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                      </svg>
                      <p className="mt-3 text-sm font-medium">Sem imagem cadastrada</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{selectedRecipe.tipoRefeicao || '-'}</span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{formatGrupoAlimentar(selectedRecipe.grupoAlimentar)}</span>
                  </div>
                  <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{selectedRecipe.titulo}</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <DetailCard label="Tempo de preparo" value={formatTempo(selectedRecipe.tempoPreparoMinutos)} />
                  <DetailCard label="Porção" value={selectedRecipe.porcao || '-'} />
                  <DetailCard label="Estado" value={formatEstado(selectedRecipe.estado)} />
                  <DetailCard label="Tipo de refeição" value={selectedRecipe.tipoRefeicao || '-'} />
                </div>

                <DetailSection title="Ingredientes" value={selectedRecipe.ingredientes} />
                <DetailSection title="Modo de preparo" value={selectedRecipe.modoPreparo} />

                <div className="grid gap-4 md:grid-cols-2">
                  <DetailCard label="Grupo alimentar" value={formatGrupoAlimentar(selectedRecipe.grupoAlimentar)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFilterRecipeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4" onClick={handleCloseFilterRecipe}>
          <div className="w-full max-w-180 rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Filtrar receitas</h2>
              </div>

              <button type="button" onClick={handleCloseFilterRecipe} className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Fechar popup">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tipo de refeição</label>
                <select value={pendingFilterTipoRefeicao} onChange={(event) => setPendingFilterTipoRefeicao(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500">
                  <option value="">Todos</option>
                  {TIPO_REFEICAO_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <FoodGroupSelect value={pendingFilterGrupoAlimentar as RecipeForm['grupoAlimentar']} onChange={(value) => setPendingFilterGrupoAlimentar(value)} />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              <button type="button" onClick={handleClearRecipeFilters} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                Limpar filtros
              </button>
              <button type="button" onClick={() => void handleApplyRecipeFilters()} className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteRecipeOpen && deleteRecipeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" onClick={handleCloseDeleteRecipe}>
          <div className="w-full max-w-130 rounded-[28px] bg-white px-10 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.22)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[1.55rem] font-medium text-slate-900">Deletar receita</h2>
              <button type="button" onClick={handleCloseDeleteRecipe} className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Fechar popup">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center text-red-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className="h-20 w-20">
                  <path d="M12 2.4 5 5.8V12c0 4.8 3.3 9 7 10 3.7-1 7-5.2 7-10V5.8Z" />
                  <path d="M12 8v5" />
                  <path d="M12 16.5h.01" />
                </svg>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-90 text-center text-[0.96rem] leading-6 text-slate-700">Somente administradores podem executar essa função. Por favor, digite sua senha para confirmar essa ação:</p>

            <form className="mt-8" onSubmit={handleDeleteRecipe}>
              <label className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-[#f8f8f8] px-4 py-3 shadow-[0_4px_10px_rgba(15,23,42,0.14)] transition-colors focus-within:border-red-500">
                <span className="text-slate-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                </span>

                <input
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  placeholder="Senha"
                  className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-500"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowDeletePassword((current) => !current)}
                  className="text-slate-500 transition-colors hover:text-slate-800"
                  aria-label={showDeletePassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    {showDeletePassword ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.4 10.4 0 0 1 12 5c5.5 0 9.5 5 10 7-.4 1.1-1.3 2.6-2.6 4.1" />
                        <path d="M6.2 6.2C3.8 8.2 2.5 10.7 2 12c.4 1.1 1.3 2.6 2.6 4.1 1.7 1.8 4.2 3.9 7.4 3.9 1.4 0 2.7-.3 3.9-.8" />
                      </>
                    ) : (
                      <>
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </label>

              {deleteError && <p className="mt-4 text-sm font-medium text-red-600">{deleteError}</p>}

              <div className="mt-10 flex items-center justify-center gap-14">
                <button type="button" onClick={handleCloseDeleteRecipe} className="text-[0.95rem] font-medium text-red-500 transition-colors hover:text-red-600">Cancelar</button>
                <button type="submit" disabled={isDeletingRecipe} className="min-w-37.5 rounded-full bg-red-600 px-8 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70">{isDeletingRecipe ? 'Deletando...' : 'Deletar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreateRecipeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4" onClick={() => setIsCreateRecipeOpen(false)}>
          <div className="w-full max-w-[96vw] rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Cadastrar receita</h2>
              </div>

              <button type="button" onClick={() => setIsCreateRecipeOpen(false)} className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Fechar popup">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <form className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]" onSubmit={handleCreateRecipe}>
              <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Imagem da receita</h3>
                </div>

                <label className="flex w-full cursor-pointer flex-col gap-2 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50">
                  <span className="font-semibold text-slate-700">Selecionar imagem</span>
                  <span className="text-xs text-slate-500">PNG, JPG ou WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setFormData((current) => ({ ...current, imagem: file }));
                      setImagePreview(file ? URL.createObjectURL(file) : '');
                    }}
                    className="sr-only"
                  />
                </label>

                {imagePreview ? (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <img src={imagePreview} alt="Pré-visualização da imagem" className="aspect-square w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white text-center text-slate-400">
                    <div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12">
                        <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                      </svg>
                      <p className="mt-3 text-sm font-medium">Nenhuma imagem selecionada</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Título</label>
                  <input type="text" placeholder="Digite o título" value={formData.titulo} onChange={(event) => setFormData((current) => ({ ...current, titulo: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tipo de refeição</label>
                  <select value={formData.tipoRefeicao} onChange={(event) => setFormData((current) => ({ ...current, tipoRefeicao: event.target.value as RecipeForm['tipoRefeicao'] }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500">
                    <option value="">Selecione</option>
                    <option value="CAFE_DA_MANHA">CAFÉ DA MANHÃ</option>
                    <option value="ALMOCO">ALMOÇO</option>
                    <option value="JANTAR">JANTAR</option>
                    <option value="LANCHE">LANCHE</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tempo de preparo (minutos)</label>
                  <input type="number" min="0" placeholder="Ex.: 30" value={formData.tempoPreparoMinutos} onChange={(event) => setFormData((current) => ({ ...current, tempoPreparoMinutos: event.target.value === '' ? '' : Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Porção</label>
                  <input type="text" placeholder="Digite a porção" value={formData.porcao} onChange={(event) => setFormData((current) => ({ ...current, porcao: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Estado</label>
                  <select value={formData.idEstado} onChange={(event) => setFormData((current) => ({ ...current, idEstado: event.target.value === '' ? '' : Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500">
                    <option value="">Selecione</option>
                    {ESTADO_OPTIONS.map((estado) => (
                      <option key={estado.id} value={estado.id}>{estado.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <FoodGroupSelect value={formData.grupoAlimentar} onChange={(value) => setFormData((current) => ({ ...current, grupoAlimentar: value }))} />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Ingredientes</label>
                  <textarea placeholder="Digite os ingredientes" value={formData.ingredientes} onChange={(event) => setFormData((current) => ({ ...current, ingredientes: event.target.value }))} className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Modo de preparo</label>
                  <textarea placeholder="Digite o modo de preparo" value={formData.modoPreparo} onChange={(event) => setFormData((current) => ({ ...current, modoPreparo: event.target.value }))} className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                {formError && <p className="text-sm font-medium text-red-600 lg:col-span-2">{formError}</p>}

                <div className="flex items-center justify-end gap-3 pt-2 lg:col-span-2">
                  <button type="button" onClick={handleCloseCreateRecipe} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">Cancelar</button>
                  <button type="submit" disabled={isSavingRecipe} className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">{isSavingRecipe ? 'Salvando...' : 'Salvar receita'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeRow({ imagePreview, titulo, tipoRefeicao, grupoAlimentar, estado, tempoPreparoMinutos, onView, onEdit, onDelete }: { imagePreview: string; titulo: string; tipoRefeicao: string; grupoAlimentar: string; estado: string; tempoPreparoMinutos: string; onView: () => void; onEdit: () => void; onDelete: () => void; }) {
  return (
    <tr className="border-b border-slate-200 bg-white">
      <td className="px-2 py-6">
        {imagePreview ? (
          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img src={imagePreview} alt={`Pré-visualização de ${titulo}`} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
            </svg>
          </div>
        )}
      </td>
      <td className="px-2 py-6 font-medium text-slate-900">{titulo}</td>
      <td className="px-2 py-6 text-slate-700">{tipoRefeicao}</td>
      <td className="px-2 py-6 text-slate-700">{grupoAlimentar}</td>
      <td className="px-2 py-6 text-slate-700">{estado}</td>
      <td className="px-2 py-6 text-slate-700">{tempoPreparoMinutos}</td>
      <td className="px-2 py-6">
        <div className="flex items-center justify-center gap-4">
          <button type="button" onClick={onView} aria-label={`Visualizar receita ${titulo}`} className="text-slate-500 transition-colors hover:text-blue-600">
            <InfoIcon />
          </button>
          <button type="button" onClick={onEdit} aria-label={`Editar receita ${titulo}`} className="text-slate-500 transition-colors hover:text-blue-600">
            <EditIcon />
          </button>
          <button type="button" onClick={onDelete} aria-label={`Excluir receita ${titulo}`} className="text-slate-500 transition-colors hover:text-red-600">
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

function DetailCard({ label, value }: { label: string; value: string; }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{value || '-'}</p>
    </div>
  );
}

function DetailSection({ title, value }: { title: string; value: string; }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h4>
      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{value || '-'}</p>
    </section>
  );
}