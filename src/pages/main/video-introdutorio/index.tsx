import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sistemaImage from '../../../assets/logo.png';
import { MoonIcon, NotificationIcon, SearchIcon, TrashIcon, UserIcon } from '../../../components/icons/sharedIcons';
import { auth } from '../../../services/authService.ts';
import { deleteVideoIntroducao as deleteVideoIntroducaoRequest } from '../../../services/videoIntroducaoService.ts';
import {
  createVideoIntroducao,
  getVideoIntroducao,
  updateVideoIntroducao,
} from '../../../services/videoIntroducaoService.ts';
import type { VideoIntroducaoItem } from '../../../types/videoIntroducao.ts';

function getVideoPreviewSrc(dadosFicheiroBase64: string | null) {
  if (!dadosFicheiroBase64) {
    return '';
  }

  if (dadosFicheiroBase64.startsWith('data:')) {
    return dadosFicheiroBase64;
  }

  return `data:video/mp4;base64,${dadosFicheiroBase64}`;
}

function formatFileSize(file: File | null) {
  if (!file) {
    return '-';
  }

  const megabytes = file.size / (1024 * 1024);

  if (megabytes >= 1) {
    return `${megabytes.toFixed(1)} MB`;
  }

  const kilobytes = file.size / 1024;
  return `${Math.max(1, Math.round(kilobytes))} KB`;
}

export default function VideoIntroducaoPage() {
  const navigate = useNavigate();
  const [videoIntroducao, setVideoIntroducao] = useState<VideoIntroducaoItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleLogout() {
    await auth.logout();
    navigate('/');
  }

  useEffect(() => {
    document.title = 'Vídeo introdutório';
  }, []);

  useEffect(() => {
    async function loadVideoIntroducao() {
      setIsLoading(true);

      try {
        const response = await getVideoIntroducao();
        setVideoIntroducao(response);
      } catch {
        setFormError('Não foi possível carregar o vídeo introdutório.');
        setVideoIntroducao(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadVideoIntroducao();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFilePreview('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setSelectedFilePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFormError('');
    setSuccessMessage('');

    if (file && !file.type.startsWith('video/')) {
      setSelectedFile(null);
      setFormError('Selecione um arquivo de vídeo válido.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  }

  function handleClearSelection() {
    setSelectedFile(null);
    setFormError('');
    setSuccessMessage('');
  }

  function handleOpenDeleteModal() {
    setDeleteError('');
    setDeletePassword('');
    setShowDeletePassword(false);
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    setDeleteError('');
    setDeletePassword('');
    setShowDeletePassword(false);
    setIsDeleteModalOpen(false);
  }

  async function handleDeleteVideoIntroducao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!deletePassword.trim()) {
      setDeleteError('Informe sua senha para confirmar a exclusão.');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteVideoIntroducaoRequest(deletePassword);
      setVideoIntroducao(null);
      setSelectedFile(null);
      setSelectedFilePreview('');
      setSuccessMessage('Vídeo introdutório excluído com sucesso.');
      handleCloseDeleteModal();
    } catch (error) {
      if (error instanceof Error && error.message) {
        setDeleteError(error.message);
        return;
      }

      setDeleteError('Não foi possível excluir o vídeo introdutório. Verifique a senha e tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!selectedFile) {
      setFormError('Selecione o arquivo do vídeo para substituir o conteúdo atual.');
      return;
    }

    setIsSaving(true);

    try {
      const payload = { dadosFicheiro: selectedFile };

      if (videoIntroducao) {
        await updateVideoIntroducao(payload);
      } else {
        await createVideoIntroducao(payload);
      }

      const updatedVideo = await getVideoIntroducao();
      setVideoIntroducao(updatedVideo);
      setSelectedFile(null);
      setSuccessMessage('Vídeo introdutório atualizado com sucesso.');
    } catch {
      setFormError('Não foi possível salvar o vídeo introdutório. Verifique o arquivo e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  const previewSrc = selectedFilePreview || getVideoPreviewSrc(videoIntroducao?.dadosFicheiroBase64 ?? null);

  return (
    <div className="flex min-h-screen w-full bg-[#F5F5F5]">
      <aside className="flex min-h-screen w-3/20 flex-col bg-white p-6 shadow-md">
        <div className="flex flex-col items-center gap-3 border-b border-gray-100 pb-6">
          <img
            src={sistemaImage}
            alt="Sistema"
            className="h-24 w-24 rounded-2xl object-contain shadow-sm"
          />
          <h2 className="text-center text-lg font-semibold text-slate-800">
            Gerenciador Web
          </h2>
        </div>

        <nav className="flex flex-1 flex-col gap-3 py-6">
          <a href="/main/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
          <a href="/main/usuarios" className="text-gray-700 hover:text-gray-900">Usuários</a>
          <a href="/main/alimentos" className="text-gray-700 hover:text-gray-900">Alimentos</a>
          <a href="/main/receitas" className="text-gray-700 hover:text-gray-900">Receitas</a>
          <a href="/main/videos" className="text-gray-700 hover:text-gray-900">Videos Educativos</a>
          <a href="/main/video-introdutorio" className="font-semibold text-slate-900">Vídeo Introdutório</a>
          <a href="/main/configuracoes" className="text-gray-700 hover:text-gray-900">Configurações</a>
        </nav>

        <div className="border-t border-gray-100 pt-6">
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
                <h1 className="text-2xl font-bold text-slate-900">Vídeo introdutório</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Gerencie o único vídeo exibido no app na abertura.
                </p>
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

        <section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-1 flex-col gap-6 px-5 py-5">
            {isLoading ? (
              <div className="flex min-h-105 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-slate-600">
                Carregando vídeo introdutório...
              </div>
            ) : (
              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <article className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">Atualizar vídeo introdutório</h2>
                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                      Este espaço gerencia apenas um vídeo. Quando um novo arquivo for enviado, ele substitui o conteúdo atual exibido no aplicativo.
                    </p>
                  </div>

                  {formError ? (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {formError}
                    </div>
                  ) : null}

                  {successMessage ? (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {successMessage}
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <label className="flex flex-col gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">Arquivo de vídeo</span>
                      <span className="text-xs text-slate-500">
                        Selecione um novo arquivo para substituir o vídeo atual.
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="mt-2 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
                      />
                    </label>

                    <div className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Status atual</p>
                        <p className="mt-1 font-medium text-slate-900">
                          {videoIntroducao ? 'Vídeo cadastrado' : 'Nenhum vídeo cadastrado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Arquivo selecionado</p>
                        <p className="mt-1 font-medium text-slate-900">
                          {selectedFile ? selectedFile.name : 'Nenhum arquivo selecionado'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Tamanho: {formatFileSize(selectedFile)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {isSaving ? 'Salvando...' : videoIntroducao ? 'Substituir vídeo' : 'Cadastrar vídeo'}
                      </button>

                      <button
                        type="button"
                        onClick={handleClearSelection}
                        disabled={!selectedFile}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Limpar seleção
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenDeleteModal}
                        disabled={!videoIntroducao}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <TrashIcon />
                        Excluir vídeo
                      </button>
                    </div>
                  </form>
                </article>

                <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Pré-visualização</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        O player abaixo mostra o arquivo atual ou o arquivo selecionado para envio.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100 bg-slate-950">
                    {previewSrc ? (
                      <video
                        controls
                        className="h-full w-full max-h-110 bg-black object-contain"
                        src={previewSrc}
                      >
                        Seu navegador não suporta a reprodução de vídeo.
                      </video>
                    ) : (
                      <div className="flex min-h-70 items-center justify-center px-6 py-10 text-center text-sm text-slate-300">
                        Nenhum vídeo disponível no momento.
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>
      </div>

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" onClick={handleCloseDeleteModal}>
          <div className="w-full max-w-130 rounded-[28px] bg-white px-10 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.22)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[1.55rem] font-medium text-slate-900">Excluir vídeo introdutório</h2>
              <button type="button" onClick={handleCloseDeleteModal} className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Fechar popup">
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

            <p className="mx-auto mt-8 max-w-90 text-center text-[0.96rem] leading-6 text-slate-700">Somente administradores podem executar essa função. Por favor, digite sua senha para confirmar a exclusão do vídeo introdutório:</p>

            <form className="mt-8" onSubmit={handleDeleteVideoIntroducao}>
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

              {deleteError ? <p className="mt-4 text-sm font-medium text-red-600">{deleteError}</p> : null}

              <div className="mt-10 flex items-center justify-center gap-14">
                <button type="button" onClick={handleCloseDeleteModal} className="text-[0.95rem] font-medium text-red-500 transition-colors hover:text-red-600">Cancelar</button>
                <button type="submit" disabled={isDeleting} className="min-w-37.5 rounded-full bg-red-600 px-8 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70">{isDeleting ? 'Excluindo...' : 'Excluir'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}