import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MoonIcon, NotificationIcon, SearchIcon, UserIcon } from '../../../components/icons/sharedIcons';
import { auth } from '../../../services/authService.ts';
import { getUserById, updateUser, type CreateUserRequestDTO, type UpdateUserRequestDTO } from '../../../services/usersService.ts';
import sistemaImage from '../../../assets/logo.png';

type EditUserForm = Omit<CreateUserRequestDTO, 'password'>;

function normalizeRoleValue(role: string) {
	const normalizedRole = role.toLowerCase();

	if (normalizedRole === 'admin') {
		return 'Admin';
	}

	if (normalizedRole === 'user') {
		return 'User';
	}

	return '';
}

export default function EditUserPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [isLoadingUser, setIsLoadingUser] = useState(true);
	const [isSavingUser, setIsSavingUser] = useState(false);
	const [formError, setFormError] = useState('');
	const [formData, setFormData] = useState<EditUserForm>({
		nome: '',
		email: '',
		role: '',
	});

	async function handleLogout() {
		await auth.logout();
		navigate('/');
	}

	useEffect(() => {
		document.title = 'Editar usuário';
	}, []);

	useEffect(() => {
		async function loadUser() {
			if (!id) {
				setFormError('ID do usuário não informado.');
				setIsLoadingUser(false);
				return;
			}

			try {
				const user = await getUserById(id);
				setFormData({
					nome: user.nome,
					email: user.email,
					role: normalizeRoleValue(user.role),
				});
			} catch {
				setFormError('Não foi possível carregar os dados do usuário.');
			} finally {
				setIsLoadingUser(false);
			}
		}

		void loadUser();
	}, [id]);

	async function handleUpdateUser(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSavingUser(true);
		setFormError('');

		try {
			if (!id) {
				throw new Error('ID do usuário não informado.');
			}

			const payload: UpdateUserRequestDTO = {
				id,
				nome: formData.nome,
				email: formData.email,
				role: formData.role,
			};

			await updateUser(payload);
			navigate('/main/usuarios');
		} catch {
			setFormError('Não foi possível atualizar o usuário. Verifique os dados e tente novamente.');
		} finally {
			setIsSavingUser(false);
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
								<h1 className="text-2xl font-bold text-slate-900">Editar usuário</h1>
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
									onClick={() => navigate('/main/usuarios')}
									className="flex h-10 items-center gap-2 rounded-full border border-blue-500 bg-white px-4 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50 whitespace-nowrap"
								>
									Voltar
								</button>
							</div>
						</div>
					</div>
				</header>

				<section className="mt-4 flex w-[96%] flex-1 flex-col overflow-hidden rounded-t-4xl rounded-b-none border border-gray-100 bg-white shadow-sm">
					<div className="flex flex-1 flex-col gap-6 px-6 py-7">
						<div className="flex items-center justify-between">
							<h1 className="text-2xl font-semibold text-slate-900">Dados do usuário</h1>
						</div>

						<form className="grid grid-cols-1 gap-5 lg:grid-cols-2" onSubmit={handleUpdateUser}>
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700">Nome</label>
								<input
									type="text"
									placeholder="Digite o nome"
									value={formData.nome}
									disabled={isLoadingUser}
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
									disabled={isLoadingUser}
									onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
									className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700">Nível</label>
								<select
									value={formData.role}
									disabled={isLoadingUser}
									onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
									className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500"
								>
									<option value="">Selecione o nível</option>
									<option value="Admin">ADMIN</option>
									<option value="User">USER</option>
								</select>
							</div>

							{formError && (
								<p className="text-sm font-medium text-red-600 lg:col-span-2">{formError}</p>
							)}

							<div className="flex items-center justify-end gap-3 pt-2 lg:col-span-2">
								<button
									type="button"
									onClick={() => navigate('/main/usuarios')}
									className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={isSavingUser || isLoadingUser}
									className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
								>
									{isLoadingUser ? 'Carregando...' : isSavingUser ? 'Salvando...' : 'Salvar alterações'}
								</button>
							</div>
						</form>
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
