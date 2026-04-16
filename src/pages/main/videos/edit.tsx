import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MoonIcon, NotificationIcon, SearchIcon, UserIcon } from '../../../components/icons/sharedIcons';
import { auth } from '../../../services/authService.ts';
import { getVideoById, updateVideo } from '../../../services/videosService.ts';
import sistemaImage from '../../../assets/logo.png';
import type { EditVideoForm, UpdateVideoRequestDTO, VideoItem } from '../../../types/videos.ts';

function formatDuration(seconds: number | null) {
  if (seconds === null) {
    return '-';
  }

  const totalMinutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (totalMinutes === 0) {
    return `${seconds} seg`;
  }

  return `${totalMinutes} min ${remainingSeconds.toString().padStart(2, '0')} s`;
}

function normalizeVideo(video: VideoItem) {
  return {
    titulo: video.titulo,
    duracaoSegundos: video.duracaoSegundos ?? '',
    videoUrl: video.videoUrl,
  } satisfies EditVideoForm;
}

function getYoutubeEmbedUrl(videoUrl: string) {
  if (!videoUrl.trim()) {
    return '';
  }

  const match = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);

  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return '';
}

export default function EditVideoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [formError, setFormError] = useState('');
  const [videoData, setVideoData] = useState<EditVideoForm>({
    titulo: '',
    duracaoSegundos: '',
    videoUrl: '',
  });

  async function handleLogout() {
    await auth.logout();
    navigate('/');
  }

  useEffect(() => {
    document.title = 'Editar vídeo educativo';
  }, []);

  useEffect(() => {
    async function loadVideo() {
      if (!id) {
        setFormError('ID do vídeo não informado.');
        setIsLoadingVideo(false);
        return;
      }

      try {
        const video = await getVideoById(id);
        setVideoData(normalizeVideo(video));
      } catch {
        setFormError('Não foi possível carregar os dados do vídeo.');
      } finally {
        setIsLoadingVideo(false);
      }
    }

    void loadVideo();
  }, [id]);

  async function handleUpdateVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingVideo(true);
    setFormError('');

    try {
      if (!id) {
        throw new Error('ID do vídeo não informado.');
      }

      if (!videoData.titulo.trim() || !videoData.videoUrl.trim()) {
        throw new Error('Preencha os campos obrigatórios do vídeo.');
      }

      const payload: UpdateVideoRequestDTO = {
        id,
        titulo: videoData.titulo,
        duracaoSegundos: videoData.duracaoSegundos === '' ? null : Number(videoData.duracaoSegundos),
        videoUrl: videoData.videoUrl,
      };

      await updateVideo(payload);
      navigate('/main/videos');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível atualizar o vídeo. Verifique os dados e tente novamente.');
    } finally {
      setIsSavingVideo(false);
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
          <a href="/main/receitas" className="text-gray-700 hover:text-gray-900">Receitas</a>
          <a href="/main/videos" className="font-semibold text-slate-900">Videos Educativos</a>
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
                <h1 className="text-2xl font-bold text-slate-900">Editar vídeo educativo</h1>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:max-w-115">
                  <input type="text" placeholder="Pesquisar" className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" />
                  <span className="text-blue-500"><SearchIcon /></span>
                </label>

                <button type="button" onClick={() => navigate('/main/videos')} className="flex h-10 items-center gap-2 rounded-full border border-blue-500 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50 whitespace-nowrap">Voltar</button>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-1 flex-col gap-6 px-6 py-7">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-slate-900">Dados do vídeo</h1>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <form className="grid grid-cols-1 gap-3 lg:grid-cols-2" onSubmit={handleUpdateVideo}>
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">Título</label>
                  <input type="text" placeholder="Digite o título" value={videoData.titulo} disabled={isLoadingVideo} onChange={(event) => setVideoData((current) => ({ ...current, titulo: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Duração em segundos</label>
                  <input type="number" min="0" placeholder="Ex.: 120" value={videoData.duracaoSegundos} disabled={isLoadingVideo} onChange={(event) => setVideoData((current) => ({ ...current, duracaoSegundos: event.target.value === '' ? '' : Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">URL do vídeo</label>
                  <input type="text" placeholder="Digite a URL do vídeo" value={videoData.videoUrl} disabled={isLoadingVideo} onChange={(event) => setVideoData((current) => ({ ...current, videoUrl: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500" />
                </div>

                {formError && <p className="text-sm font-medium text-red-600 lg:col-span-2">{formError}</p>}

                <div className="flex items-center justify-end gap-3 pt-2 lg:col-span-2">
                  <button type="button" onClick={() => navigate('/main/videos')} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">Cancelar</button>
                  <button type="submit" disabled={isSavingVideo || isLoadingVideo} className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">{isLoadingVideo ? 'Carregando...' : isSavingVideo ? 'Salvando...' : 'Salvar alterações'}</button>
                </div>
              </form>

              <div className="flex flex-col gap-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Pré-visualização</p>
                  {getYoutubeEmbedUrl(videoData.videoUrl) ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <iframe
                        src={getYoutubeEmbedUrl(videoData.videoUrl)}
                        title={videoData.titulo || 'Pré-visualização do vídeo do YouTube'}
                        className="aspect-square w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center text-slate-400">
                      <div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12">
                          <path d="M8 5v14l11-7-11-7Z" />
                        </svg>
                        <p className="mt-3 text-sm font-medium">Cole a URL do YouTube para visualizar aqui</p>
                      </div>
                    </div>
                  )}
                  <p className="mt-3 text-xs text-slate-500">{videoData.duracaoSegundos === '' ? 'Sem duração informada' : formatDuration(Number(videoData.duracaoSegundos))}</p>
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