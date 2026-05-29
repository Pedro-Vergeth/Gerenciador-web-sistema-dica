import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MoonIcon, NotificationIcon, SearchIcon, UserIcon } from '../../../components/icons/sharedIcons';
import FoodGroupSelect from '../../../components/foodGroupSelect';
import { auth } from '../../../services/authService.ts';
import { getRecipeById, updateRecipe } from '../../../services/recipesService.ts';
import sistemaImage from '../../../assets/logo.png';
import { ESTADO_OPTIONS, TIPO_REFEICAO_OPTIONS, type CreateRecipeRequestDTO, type EditRecipeForm, type RecipeItem, type UpdateRecipeRequestDTO } from '../../../types/recipes.ts';

function normalizeImageSource(image64: string) {
  if (!image64) {
    return '';
  }

  if (image64.startsWith('data:')) {
    return image64;
  }

  return `data:image/jpeg;base64,${image64}`;
}

function normalizeRecipeGroupValue(grupoAlimentar: RecipeItem['grupoAlimentar']) {
  if (!grupoAlimentar) {
    return '';
  }

  if (typeof grupoAlimentar === 'string') {
    return grupoAlimentar;
  }

  return grupoAlimentar.nome ?? '';
}

function getSelectedEstado(estadoId: string | number | '') {
  if (estadoId === '') {
    return null;
  }

  return ESTADO_OPTIONS.find((estado) => estado.id === Number(estadoId)) ?? null;
}

export default function EditRecipePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true);
  const [isSavingRecipe, setIsSavingRecipe] = useState(false);
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [recipeData, setRecipeData] = useState<EditRecipeForm>({
    titulo: '',
    tipoRefeicao: '',
    tempoPreparoMinutos: '',
    porcao: '',
    rendimento: '',
    grupoAlimentar: '',
    ingredientes: '',
    modoPreparo: '',
    imagem: null,
    idEstado: '',
  });
  const selectedEstado = getSelectedEstado(recipeData.idEstado);

  async function handleLogout() {
    await auth.logout();
    navigate('/');
  }

  useEffect(() => {
    document.title = 'Editar receita';
  }, []);

  useEffect(() => {
    async function loadRecipe() {
      if (!id) {
        setFormError('ID da receita não informado.');
        setIsLoadingRecipe(false);
        return;
      }

      try {
        const recipe = await getRecipeById(id);
        setRecipeData({
          titulo: recipe.titulo,
          tipoRefeicao: recipe.tipoRefeicao as CreateRecipeRequestDTO['tipoRefeicao'],
          tempoPreparoMinutos: recipe.tempoPreparoMinutos ?? '',
          porcao: recipe.porcao,
          rendimento: recipe.rendimento,
          grupoAlimentar: normalizeRecipeGroupValue(recipe.grupoAlimentar) as EditRecipeForm['grupoAlimentar'],
          ingredientes: recipe.ingredientes,
          modoPreparo: recipe.modoPreparo,
          imagem: null,
          idEstado: recipe.estado?.id ?? '',
        });
        setImagePreview(normalizeImageSource(recipe.imagem64));
      } catch {
        setFormError('Não foi possível carregar os dados da receita.');
      } finally {
        setIsLoadingRecipe(false);
      }
    }

    void loadRecipe();
  }, [id]);

  async function handleUpdateRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingRecipe(true);
    setFormError('');

    try {
      if (!id) {
        throw new Error('ID da receita não informado.');
      }

      if (!recipeData.titulo.trim() || !recipeData.tipoRefeicao || !recipeData.porcao.trim() || !recipeData.rendimento.trim() || !recipeData.grupoAlimentar || !recipeData.ingredientes.trim() || !recipeData.modoPreparo.trim() || !recipeData.idEstado) {
        throw new Error('Preencha os campos obrigatórios da receita.');
      }

      const payload: UpdateRecipeRequestDTO = {
        id,
        titulo: recipeData.titulo,
        tipoRefeicao: recipeData.tipoRefeicao,
        tempoPreparoMinutos: recipeData.tempoPreparoMinutos === '' ? null : Number(recipeData.tempoPreparoMinutos),
        porcao: recipeData.porcao,
        rendimento: recipeData.rendimento,
        grupoAlimentar: recipeData.grupoAlimentar,
        ingredientes: recipeData.ingredientes,
        modoPreparo: recipeData.modoPreparo,
        imagem: recipeData.imagem,
        idEstado: recipeData.idEstado,
      };

      await updateRecipe(payload);
      navigate('/main/receitas');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível atualizar a receita. Verifique os dados e tente novamente.');
    } finally {
      setIsSavingRecipe(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F5F5F5]">
      <aside className="flex min-h-screen w-3/20 flex-col bg-white p-6 shadow-md">
        <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-6">
          <img src={sistemaImage} alt="Sistema" className="h-24 w-24 rounded-2xl object-contain shadow-sm" />
          <h2 className="text-center text-lg font-semibold text-slate-800">Gerenciador Web</h2>
        </div>

        <nav className="flex flex-1 flex-col gap-3 py-6">
          <a href="/main/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
          <a href="/main/usuarios" className="text-gray-700 hover:text-gray-900">Usuários</a>
          <a href="/main/alimentos" className="text-gray-700 hover:text-gray-900">Alimentos</a>
          <a href="/main/receitas" className="font-semibold text-slate-900">Receitas</a>
          <a href="/main/videos" className="text-gray-700 hover:text-gray-900">Videos Educativos</a>
          <a href="/main/video-introdutorio" className="text-gray-700 hover:text-gray-900">Vídeo Introdutório</a>
          <a href="/main/configuracoes" className="text-gray-700 hover:text-gray-900">Configurações</a>
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
                <h1 className="text-2xl font-bold text-slate-900">Editar receita</h1>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:max-w-115">
                  <input type="text" placeholder="Pesquisar" className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" />
                  <span className="text-blue-500"><SearchIcon /></span>
                </label>

                <button type="button" onClick={() => navigate('/main/receitas')} className="flex h-10 items-center gap-2 rounded-full border border-blue-500 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50 whitespace-nowrap">Voltar</button>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-1 flex-col gap-6 px-6 py-7">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-slate-900">Dados da receita</h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <form className="grid grid-cols-1 gap-5 lg:grid-cols-2" onSubmit={handleUpdateRecipe}>
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Título</label>
                  <input type="text" placeholder="Digite o título" value={recipeData.titulo} disabled={isLoadingRecipe} onChange={(event) => setRecipeData((current) => ({ ...current, titulo: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tipo de refeição</label>
                  <select value={recipeData.tipoRefeicao} disabled={isLoadingRecipe} onChange={(event) => setRecipeData((current) => ({ ...current, tipoRefeicao: event.target.value as EditRecipeForm['tipoRefeicao'] }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500">
                    <option value="">Selecione</option>
                    {TIPO_REFEICAO_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Tempo de preparo (minutos)</label>
                  <input type="number" min="0" placeholder="Ex.: 30" value={recipeData.tempoPreparoMinutos} disabled={isLoadingRecipe} onChange={(event) => setRecipeData((current) => ({ ...current, tempoPreparoMinutos: event.target.value === '' ? '' : Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Porção</label>
                  <input type="text" placeholder="Digite a porção" value={recipeData.porcao} disabled={isLoadingRecipe} onChange={(event) => setRecipeData((current) => ({ ...current, porcao: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Rendimento</label>
                  <input type="text" placeholder="Digite o rendimento" value={recipeData.rendimento} disabled={isLoadingRecipe} onChange={(event) => setRecipeData((current) => ({ ...current, rendimento: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Estado</label>
                  <select value={recipeData.idEstado} disabled={isLoadingRecipe} onChange={(event) => setRecipeData((current) => ({ ...current, idEstado: event.target.value === '' ? '' : Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500">
                    <option value="">Selecione</option>
                    {ESTADO_OPTIONS.map((estado) => (
                      <option key={estado.id} value={estado.id}>{estado.nome}</option>
                    ))}
                  </select>
                  {selectedEstado && (
                    <p className="mt-2 text-xs text-slate-500">
                      Sigla: {selectedEstado.sigla} - Região: {selectedEstado.regiao}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <FoodGroupSelect disabled={isLoadingRecipe} value={recipeData.grupoAlimentar} onChange={(value) => setRecipeData((current) => ({ ...current, grupoAlimentar: value }))} />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Ingredientes</label>
                  <textarea placeholder="Digite os ingredientes" value={recipeData.ingredientes} disabled={isLoadingRecipe} onChange={(event) => setRecipeData((current) => ({ ...current, ingredientes: event.target.value }))} className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Modo de preparo</label>
                  <textarea placeholder="Digite o modo de preparo" value={recipeData.modoPreparo} disabled={isLoadingRecipe} onChange={(event) => setRecipeData((current) => ({ ...current, modoPreparo: event.target.value }))} className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Imagem</label>
                  <input type="file" accept="image/*" disabled={isLoadingRecipe} onChange={(event) => { const file = event.target.files?.[0] ?? null; setRecipeData((current) => ({ ...current, imagem: file })); setImagePreview(file ? URL.createObjectURL(file) : imagePreview); }} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700" />
                  <p className="mt-2 text-xs text-slate-500">Deixe em branco para manter a imagem atual.</p>
                </div>

                {formError && <p className="text-sm font-medium text-red-600 lg:col-span-2">{formError}</p>}

                <div className="flex items-center justify-end gap-3 pt-2 lg:col-span-2">
                  <button type="button" onClick={() => navigate('/main/receitas')} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">Cancelar</button>
                  <button type="submit" disabled={isSavingRecipe || isLoadingRecipe} className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">{isLoadingRecipe ? 'Carregando...' : isSavingRecipe ? 'Salvando...' : 'Salvar alterações'}</button>
                </div>
              </form>

              <div className="flex flex-col gap-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Pré-visualização da imagem</p>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img src={imagePreview || 'https://placehold.co/800x520?text=Imagem+da+receita'} alt="Imagem da receita" className="h-72 w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
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