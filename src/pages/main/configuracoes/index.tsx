import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../services/authService.ts';
import { MoonIcon, NotificationIcon, UserIcon } from '../../../components/icons/sharedIcons';
import sistemaImage from '../../../assets/logo.png';

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M21 12a9 9 0 0 0-15.3-6.4L3 8" />
      <path d="M3 4v4h4" />
      <path d="M3 12a9 9 0 0 0 15.3 6.4L21 16" />
      <path d="M21 20v-4h-4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 3-3" />
      <path d="M6.6 6.6C3.9 8.6 2 12 2 12s3.5 7 10 7c1.8 0 3.3-.3 4.5-.9" />
      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a20.6 20.6 0 0 1-4.1 5.5" />
    </svg>
  );
}

function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const labels = ['Fraca', 'Regular', 'Boa', 'Forte'] as const;

  return {
    checks,
    passedChecks,
    label: labels[Math.min(passedChecks, labels.length - 1)],
  };
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleLogout() {
    await auth.logout();
    navigate('/');
  }

  function resetPasswordForm() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setSuccessMessage('');
    setErrorMessage('');
  }

  function openPasswordModal() {
    resetPasswordForm();
    setIsPasswordModalOpen(true);
  }

  function closePasswordModal(shouldReset = true) {
    setIsPasswordModalOpen(false);

    if (shouldReset) {
      resetPasswordForm();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage('Preencha todos os campos para alterar a senha.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('A nova senha e a confirmação não coincidem.');
      return;
    }

    setIsSaving(true);

    try {
      await auth.changePassword({
        senhaAtual: currentPassword,
        novaSenha: newPassword,
      });

      setSuccessMessage('Senha alterada com sucesso.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordModalOpen(false);
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Não foi possível alterar a senha. Verifique os dados e tente novamente.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  const passwordStrength = getPasswordStrength(newPassword);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('');
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

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
          <a href="/main/video-introdutorio" className="text-gray-700 hover:text-gray-900">Vídeo Introdutório</a>
          <a href="/main/configuracoes" className="font-semibold text-slate-900">Configurações</a>
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
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
            </div>
          </div>
        </header>

        <section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-[#e8e5da] bg-white shadow-sm">
          <div className="flex flex-1 items-start justify-start px-4 py-8 sm:px-6">
            <div className="w-full max-w-4xl">
              <div className="border-b border-[#ece7d8] pb-5">
                <h2 className="text-2xl font-semibold text-slate-950">Segurança</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Mantenha sua conta segura atualizando sua senha periodicamente.
                </p>
              </div>

              <div className="mt-6 rounded-3xl bg-white px-5 py-5 shadow-[0_1px_0_rgba(15,23,42,0.02)] sm:px-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5f3be] text-[#7fb51b]">
                      <LockIcon />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">Alterar senha</h3>
                      <p className="mt-1 max-w-xl text-sm text-slate-500">
                        Atualize sua senha para manter sua conta protegida.
                      </p>
                    
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openPasswordModal}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#101828] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(124,195,31,0.24)] transition-colors hover:bg-[#0078d4]"
                  >
                    <span className="text-white">
                      <RefreshIcon />
                    </span>
                    Alterar senha
                  </button>
                </div>

                {successMessage ? (
                  <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {successMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {isPasswordModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4"
              onClick={() => closePasswordModal()}
            >
              <div
                className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e5f3be] text-[#7fb51b]">
                      <LockIcon />
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">Alterar senha</h2>
                      <p className="mt-1 text-sm text-slate-500">Informe sua senha atual e crie uma nova senha segura.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => closePasswordModal()}
                    className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    aria-label="Fechar popup"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>

                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Senha atual</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        className="w-full rounded-2xl border border-[#d9d7c7] bg-white px-4 py-3 pr-11 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#b7dd88] focus:ring-2 focus:ring-[#b7dd88]/30"
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-900"
                        aria-label={showCurrentPassword ? 'Ocultar senha atual' : 'Mostrar senha atual'}
                      >
                        {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Nova senha</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="w-full rounded-2xl border border-[#d9d7c7] bg-white px-4 py-3 pr-11 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#b7dd88] focus:ring-2 focus:ring-[#b7dd88]/30"
                        placeholder="Crie uma senha forte"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-900"
                        aria-label={showNewPassword ? 'Ocultar nova senha' : 'Mostrar nova senha'}
                      >
                        {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>

                    <div className="mt-3 rounded-2xl bg-[#f8f7ef] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-600">Força da senha</span>
                        <span className="text-sm font-medium text-slate-700">{passwordStrength.label}</span>
                      </div>

                      <div className="mt-3 grid grid-cols-4 gap-1.5">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <span
                            key={index}
                            className={`h-1.5 rounded-full ${index < passwordStrength.passedChecks ? 'bg-[#d4e7b5]' : 'bg-[#e4e1d1]'}`}
                          />
                        ))}
                      </div>

                      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                        <span className={passwordStrength.checks.length ? 'text-[#5c6b46]' : ''}>• Mínimo 8 caracteres</span>
                        <span className={passwordStrength.checks.upperLower ? 'text-[#5c6b46]' : ''}>• Maiúsculas e minúsculas</span>
                        <span className={passwordStrength.checks.number ? 'text-[#5c6b46]' : ''}>• Pelo menos 1 número</span>
                        <span className={passwordStrength.checks.special ? 'text-[#5c6b46]' : ''}>• 1 caractere especial</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Confirmar nova senha</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="w-full rounded-2xl border border-[#d9d7c7] bg-white px-4 py-3 pr-11 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#b7dd88] focus:ring-2 focus:ring-[#b7dd88]/30"
                        placeholder="Repita a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-900"
                        aria-label={showConfirmPassword ? 'Ocultar confirmação da senha' : 'Mostrar confirmação da senha'}
                      >
                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  {errorMessage ? (
                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {errorMessage}
                    </p>
                  ) : null}

                  {successMessage ? (
                    <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      {successMessage}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => closePasswordModal()}
                      className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-full bg-[#101828] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0078d4] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSaving ? 'Salvando...' : 'Alterar senha'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
