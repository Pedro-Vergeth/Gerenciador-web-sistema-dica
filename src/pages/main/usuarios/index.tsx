import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, deleteUser, getUsers, type CreateUserRequestDTO, type PageResponse, type UserItem } from '../../../services/usersService.ts';
import { auth } from '../../../services/authService.ts';
import { AddUserIcon, EditIcon, MoonIcon, NotificationIcon, SearchIcon, TrashIcon, UserIcon } from '../../../components/icons/sharedIcons';
import sistemaImage from '../../../assets/logo.png';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [page, setPage] = useState<PageResponse<UserItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState<UserItem | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState<CreateUserRequestDTO>({
    nome: '',
    email: '',
    password: '',
    role: '',
  });

  async function handleLogout() {
    await auth.logout();
    navigate('/');
  }

  const loadUsers = useCallback(async (pageIndex = 0) => {
    setLoading(true);

    try {
      const response = await getUsers(pageIndex);
      setUsers(response.content);
      setPage(response);
      setCurrentPage(response.number);
    } catch {
      setUsers([]);
      setPage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers(currentPage);
  }, [currentPage, loadUsers]);

  function handleOpenCreateUser() {
    setFormError('');
    setIsCreateUserOpen(true);
  }

  function handleCloseCreateUser() {
    setIsCreateUserOpen(false);
    setFormError('');
    setFormData({
      nome: '',
      email: '',
      password: '',
      role: '',
    });
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingUser(true);
    setFormError('');

    try {
      await createUser(formData);
      handleCloseCreateUser();
      await loadUsers(currentPage);
    } catch {
      setFormError('Não foi possível cadastrar o usuário. Verifique os dados e tente novamente.');
    } finally {
      setIsSavingUser(false);
    }
  }

  function handleOpenDeleteUser(user: UserItem) {
    setDeleteUserTarget(user);
    setDeletePassword('');
    setDeleteError('');
    setShowDeletePassword(false);
    setIsDeleteUserOpen(true);
  }

  function handleCloseDeleteUser() {
    setIsDeleteUserOpen(false);
    setDeleteUserTarget(null);
    setDeletePassword('');
    setDeleteError('');
    setShowDeletePassword(false);
  }

  async function handleDeleteUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!deleteUserTarget) {
      return;
    }

    if (!deletePassword.trim()) {
      setDeleteError('Informe sua senha para confirmar a exclusão.');
      return;
    }

    setIsDeletingUser(true);
    setDeleteError('');

    try {
      await deleteUser(deleteUserTarget.id, deletePassword);
      handleCloseDeleteUser();
      await loadUsers(currentPage);
    } catch (error) {
      if (error instanceof Error && error.message) {
        setDeleteError(error.message);
        return;
      }

      setDeleteError('Não foi possível excluir o usuário. Verifique a senha e tente novamente.');
    } finally {
      setIsDeletingUser(false);
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
          <a href="/main/usuarios" className="font-semibold text-slate-900">Usuários</a>
          <a href="/main/alimentos" className="text-gray-700 hover:text-gray-900">Alimentos</a>
          <a href="/main/receitas" className="text-gray-700 hover:text-gray-900">Receitas</a>
          <a href="/main/videos" className="text-gray-700 hover:text-gray-900">Videos Educativos</a>
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

      <div className="flex min-h-screen w-17/20 flex-col items-center pb-0 ">
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
                <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
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

                <button
                  type="button"
                  onClick={handleOpenCreateUser}
                  className="flex h-10 items-center gap-2 rounded-full border border-blue-500 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50 whitespace-nowrap"
                >
                  <AddUserIcon />
                  Cadastrar usuário
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-7">
            <h1 className="text-2xl font-semibold text-slate-900">Lista de contas cadastradas</h1>

          </div>

          {page && (
            <div className="px-6 pb-2 text-sm text-slate-500">
              Página {page.number + 1} de {page.totalPages} - {page.totalElements} registros
            </div>
          )}

          <div className="px-2 pb-4">
            <div className="max-h-[calc(100vh-330px)] overflow-y-auto rounded-t-lg border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-[#101828] text-white">
                  <tr className="h-16 text-sm font-medium">
                    <th className="px-2 py-4 font-normal">
                      <div className="flex items-center gap-2">
                        <span>Nome</span>
                      </div>
                    </th>
                    <th className="px-2 py-4 font-normal">
                      <div className="flex items-center gap-2">
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="px-2 py-4 font-normal">Nível</th>
                    <th className="px-2 py-4 font-normal text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-900">
                  {loading ? (
                    <tr className="border-b border-slate-200 bg-white">
                      <td className="px-6 py-6 text-slate-500" colSpan={4}>
                        Carregando usuários...
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <UserRow
                        key={user.id}
                        nome={user.nome}
                        email={user.email}
                        nivel={user.role}
                        onEdit={() => navigate(`/main/usuarios/edit/${user.id}`)}
                        onDelete={() => handleOpenDeleteUser(user)}
                      />
                    ))
                  ) : (
                    <tr className="border-b border-slate-200 bg-white">
                      <td className="px-6 py-6 text-slate-500" colSpan={4}>
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
            <span>
              {page ? `${page.number + 1} de ${page.totalPages} páginas` : '0 de 0 páginas'}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage((value) => Math.max(0, value - 1))}
                disabled={!page || page.first || loading}
                className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((value) => value + 1)}
                disabled={!page || page.last || loading}
                className="rounded-full border border-blue-500 px-4 py-2 font-semibold text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>

          <div className="flex-1" />
        
          <footer className="mt-auto flex items-center justify-center gap-3 rounded-b-none bg-[#efefef] text-sm text-slate-700">
            <img src={sistemaImage} alt="Logo do sistema" className="h-8 w-8 rounded-md object-contain" />
            <span>© 2025 Dica. Todos os direitos reservados.</span>
          </footer>
        </section>
      </div>

      {isDeleteUserOpen && deleteUserTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
          onClick={handleCloseDeleteUser}
        >
          <div
            className="w-full max-w-130 rounded-[28px] bg-white px-10 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[1.55rem] font-medium text-slate-900">Deletar usuário</h2>

              <button
                type="button"
                onClick={handleCloseDeleteUser}
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Fechar popup"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
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

            <p className="mx-auto mt-8 max-w-90 text-center text-[0.96rem] leading-6 text-slate-700">
              Somente administradores podem executar essa função. Por favor, digite sua senha para confirmar essa ação:
            </p>

            <form className="mt-8" onSubmit={handleDeleteUser}>
              <label className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-[#f8f8f8] px-4 py-3 shadow-[0_4px_10px_rgba(15,23,42,0.14)] transition-colors focus-within:border-red-500">
                <span className="text-slate-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
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

              {deleteError && (
                <p className="mt-4 text-sm font-medium text-red-600">{deleteError}</p>
              )}

              <div className="mt-10 flex items-center justify-center gap-14">
                <button
                  type="button"
                  onClick={handleCloseDeleteUser}
                  className="text-[0.95rem] font-medium text-red-500 transition-colors hover:text-red-600"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isDeletingUser}
                  className="min-w-37.5 rounded-full bg-red-600 px-8 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDeletingUser ? 'Deletando...' : 'Deletar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreateUserOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4"
          onClick={() => setIsCreateUserOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Cadastrar usuário</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateUserOpen(false)}
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Fechar popup"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleCreateUser}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nome</label>
                <input
                  type="text"
                  placeholder="Digite o nome"
                  value={formData.nome}
                  onChange={(event) => setFormData((current) => ({ ...current, nome: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  placeholder="Digite o email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Senha</label>
                <input
                  type="password"
                  placeholder="Digite a senha"
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nível</label>
                <select
                  value={formData.role}
                  onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500"
                >
                  <option value="">Selecione o nível</option>
                  <option value="Admin">ADMIN</option>
                  <option value="User">USER</option>
                </select>
              </div>

              {formError && (
                <p className="text-sm font-medium text-red-600">{formError}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseCreateUser}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {isSavingUser ? 'Salvando...' : 'Salvar usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function UserRow({
  nome,
  email,
  nivel,
  onEdit,
  onDelete,
}: {
  nome: string;
  email: string;
  nivel: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-slate-200 bg-white">
      <td className="px-2 py-6 font-medium text-slate-900">{nome}</td>
      <td className="px-2 py-6 text-slate-700">{email}</td>
      <td className="px-2 py-6 text-slate-700">{nivel}</td>
      <td className="px-2 py-6">
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Editar usuário ${nome}`}
            className="text-slate-500 transition-colors hover:text-blue-600"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Excluir usuário ${nome}`}
            className="text-slate-500 transition-colors hover:text-red-600"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}
