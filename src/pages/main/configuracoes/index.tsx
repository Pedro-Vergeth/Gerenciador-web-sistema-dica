import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../services/authService.ts';
import { MoonIcon, NotificationIcon, UserIcon } from '../../../components/icons/sharedIcons';
import sistemaImage from '../../../assets/logo.png';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleLogout() {
    await auth.logout();
    navigate('/');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage('Preencha todos os campos para alterar a senha.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('A nova senha e a confirmação não coincidem.');
      return;
    }

    setIsSaving(true);

    try {
      await auth.changePassword({
        currentPassword,
        newPassword,
      });

      setSuccessMessage('Senha alterada com sucesso.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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

        <section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-1 items-start justify-center px-6 py-8">
            <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Alterar senha</h2>
                <p className="mt-1 text-sm text-slate-500">Use sua senha atual e defina uma nova senha de acesso.</p>
              </div>

              <form className="grid gap-5" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">Senha atual</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400"
                    placeholder="Digite sua senha atual"
                  />
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">Nova senha</span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400"
                      placeholder="Digite a nova senha"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-slate-700">Confirmar nova senha</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400"
                      placeholder="Repita a nova senha"
                    />
                  </label>
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {isSaving ? 'Salvando...' : 'Alterar senha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
