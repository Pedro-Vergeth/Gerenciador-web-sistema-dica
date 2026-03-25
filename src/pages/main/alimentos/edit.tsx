import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MoonIcon, NotificationIcon, SearchIcon, UserIcon } from '../../../components/icons/sharedIcons';
import FoodGroupSelect from '../../../components/foodGroupSelect';
import { auth } from '../../../services/authService.ts';
import { getFoodById, updateFood } from '../../../services/foodsService.ts';
import type { CreateFoodRequestDTO, UpdateFoodRequestDTO } from '../../../types/foods.ts';
import type { EditFoodForm } from '../../../types/foods.ts';
import sistemaImage from '../../../assets/hero.png';

function normalizeImageSource(image64: string) {
  if (!image64) {
    return '';
  }

  if (image64.startsWith('data:')) {
    return image64;
  }

  return `data:image/jpeg;base64,${image64}`;
}

function normalizeGrupoAlimentar(value: string) {
  return ['VERDE', 'AMARELO', 'AZUL', 'VERMELHO'].includes(value)
    ? (value as CreateFoodRequestDTO['grupoAlimentar'])
    : '';
}

function normalizeFoodGroupValue(grupoAlimentar: CreateFoodRequestDTO['grupoAlimentar'] | string | { nome?: string } | null | undefined) {
  if (!grupoAlimentar) {
    return '';
  }

  if (typeof grupoAlimentar === 'string') {
    return normalizeGrupoAlimentar(grupoAlimentar);
  }

  return normalizeGrupoAlimentar(grupoAlimentar.nome ?? '');
}

export default function EditFoodPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoadingFood, setIsLoadingFood] = useState(true);
  const [isSavingFood, setIsSavingFood] = useState(false);
  const [formError, setFormError] = useState('');
  const [foodImageError, setFoodImageError] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [foodData, setFoodData] = useState<EditFoodForm>({
    nomePrincipal: '',
    sinonimos: '',
    porcao: '',
    medidaCaseira: '',
    textoInformativo: '',
    grupoAlimentar: '',
    imagem: null,
  });

  async function handleLogout() {
    await auth.logout();
    navigate('/');
  }

  useEffect(() => {
    document.title = 'Editar alimento';
  }, []);

  useEffect(() => {
    async function loadFood() {
      if (!id) {
        setFormError('ID do alimento não informado.');
        setIsLoadingFood(false);
        return;
      }

      try {
        const food = await getFoodById(id);
        setFoodData({
          nomePrincipal: food.nomePrincipal,
          sinonimos: food.sinonimos,
          porcao: food.porcao,
          medidaCaseira: food.medidaCaseira,
          textoInformativo: food.textoInformativo,
          grupoAlimentar: normalizeFoodGroupValue(food.grupoAlimentar),
          imagem: null,
        });
        setImagePreview(normalizeImageSource(food.imagem64));
        setFoodImageError(false);
      } catch {
        setFormError('Não foi possível carregar os dados do alimento.');
      } finally {
        setIsLoadingFood(false);
      }
    }

    void loadFood();
  }, [id]);

  async function handleUpdateFood(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingFood(true);
    setFormError('');

    try {
      if (!id) {
        throw new Error('ID do alimento não informado.');
      }

      const payload: UpdateFoodRequestDTO = {
        id,
        nomePrincipal: foodData.nomePrincipal,
        sinonimos: foodData.sinonimos,
        porcao: foodData.porcao,
        medidaCaseira: foodData.medidaCaseira,
        textoInformativo: foodData.textoInformativo,
        grupoAlimentar: foodData.grupoAlimentar || undefined,
        imagem: foodData.imagem,
      };

      await updateFood(payload);
      navigate('/main/alimentos');
    } catch {
      setFormError('Não foi possível atualizar o alimento. Verifique os dados e tente novamente.');
    } finally {
      setIsSavingFood(false);
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
          <a href="/main/alimentos" className="font-semibold text-slate-900">Alimentos</a>
          <a href="/main/receitas" className="text-gray-700 hover:text-gray-900">Receitas</a>
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
                <h1 className="text-2xl font-bold text-slate-900">Editar alimento</h1>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:max-w-115">
                  <input type="text" placeholder="Pesquisar" className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" />
                  <span className="text-blue-500"><SearchIcon /></span>
                </label>

                <button type="button" onClick={() => navigate('/main/alimentos')} className="flex h-10 items-center gap-2 rounded-full border border-blue-500 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50 whitespace-nowrap">Voltar</button>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-1 flex-col gap-6 px-6 py-7">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-slate-900">Dados do alimento</h1>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <form className="grid grid-cols-1 gap-5 lg:grid-cols-2" onSubmit={handleUpdateFood}>
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nome principal</label>
                  <input type="text" placeholder="Digite o nome principal" value={foodData.nomePrincipal} disabled={isLoadingFood} onChange={(event) => setFoodData((current) => ({ ...current, nomePrincipal: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Sinônimos</label>
                  <input type="text" placeholder="Digite os sinônimos" value={foodData.sinonimos} disabled={isLoadingFood} onChange={(event) => setFoodData((current) => ({ ...current, sinonimos: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Porção</label>
                  <input type="text" placeholder="Digite a porção" value={foodData.porcao} disabled={isLoadingFood} onChange={(event) => setFoodData((current) => ({ ...current, porcao: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Medida caseira</label>
                  <input type="text" placeholder="Digite a medida caseira" value={foodData.medidaCaseira} disabled={isLoadingFood} onChange={(event) => setFoodData((current) => ({ ...current, medidaCaseira: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <FoodGroupSelect
                  disabled={isLoadingFood}
                  value={foodData.grupoAlimentar}
                  onChange={(value) => setFoodData((current) => ({ ...current, grupoAlimentar: value }))}
                />

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Texto informativo</label>
                  <textarea placeholder="Digite o texto informativo" value={foodData.textoInformativo} disabled={isLoadingFood} onChange={(event) => setFoodData((current) => ({ ...current, textoInformativo: event.target.value }))} className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Imagem</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isLoadingFood}
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setFoodData((current) => ({ ...current, imagem: file }));
                      setImagePreview(file ? URL.createObjectURL(file) : normalizeImageSource(imagePreview));
                      setFoodImageError(false);
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                  />
                  <p className="mt-2 text-xs text-slate-500">Deixe em branco para manter a imagem atual.</p>
                </div>

                {formError && <p className="text-sm font-medium text-red-600 lg:col-span-2">{formError}</p>}

                <div className="flex items-center justify-end gap-3 pt-2 lg:col-span-2">
                  <button type="button" onClick={() => navigate('/main/alimentos')} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">Cancelar</button>
                  <button type="submit" disabled={isSavingFood || isLoadingFood} className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">{isLoadingFood ? 'Carregando...' : isSavingFood ? 'Salvando...' : 'Salvar alterações'}</button>
                </div>
              </form>

              <div className="flex flex-col gap-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Pré-visualização da imagem</p>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img
                      src={imagePreview || 'https://placehold.co/800x520?text=Imagem+do+alimento'}
                      alt="Imagem do alimento"
                      className="h-72 w-full object-cover"
                      onError={() => setFoodImageError(true)}
                    />
                  </div>
                  {foodImageError && <p className="mt-3 text-sm text-amber-600">Não foi possível carregar a imagem informada. Verifique a base64.</p>}
                </div>
              </div>
            </div>
          </div>

          <footer className="flex items-center justify-center gap-3 rounded-b-none bg-[#efefef] text-sm text-slate-700">
            <img src={sistemaImage} alt="Logo do sistema" className="h-8 w-8 rounded-md object-cover" />
            <span>© 2025 [Nome da sua Empresa/App]. Todos os direitos reservados.</span>
          </footer>
        </section>
      </div>
    </div>
  );
}
