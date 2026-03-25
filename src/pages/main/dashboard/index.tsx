import DashboardCard from '../../../components/dashboard';
import { DocIcon, MoonIcon, NotificationIcon, SearchIcon, UserIcon } from '../../../components/icons/sharedIcons';
import sistemaImage from '../../../assets/hero.png';

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex bg-[#F5F5F5]">
      <aside className="w-3/20 bg-white p-6 min-h-screen shadow-md flex flex-col">
        <div className="flex flex-col items-center gap-3 pb-6 border-b border-gray-100">
          <img
            src={sistemaImage}
            alt="Sistema"
            className="w-20 h-20 rounded-2xl object-cover shadow-sm"
          />
          <h2 className="text-lg font-semibold text-slate-800 text-center">
            Gerenciador Web
          </h2>
        </div>

        <nav className="flex flex-col gap-3 py-6 flex-1">
          <a href="#" className="text-gray-700 hover:text-gray-900">Dashboard</a>
          <a href="/main/usuarios" className="text-gray-700 hover:text-gray-900">Usuários</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">Alimentos</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">Receitas</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">Videos Educativos</a>
          <a href="#" className="text-gray-700 hover:text-gray-900">Configurações</a>
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <button
            type="button"
            className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </aside>
      <div className="w-17/20 min-h-screen flex flex-col items-center pb-0">
        <header className="w-[96%] overflow-hidden rounded-b-3xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-lg font-medium text-slate-800">Nome do aplicativo</span>

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
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                  Bem-vindo ao seu painel de controle!
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

        <section className="w-[96%] mt-6 flex flex-col gap-6 rounded-t-4xl rounded-b-none border border-gray-100 bg-white px-5 py-5 shadow-sm">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
            <DashboardCard
              titulo="Título do Card"
              descricao="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
              icone={<DocIcon />}
              className="xl:col-span-1"
            />
            <DashboardCard
              titulo="Título do Card"
              descricao="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
              icone={<DocIcon />}
              className="xl:col-span-1"
            />
            <DashboardCard
              titulo="Título do Card"
              descricao="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
              icone={<DocIcon />}
              className="xl:col-span-1"
            />
            <DashboardCard
              titulo="Título do Card"
              descricao="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
              icone={<DocIcon />}
              className="xl:col-span-1"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
            <DashboardCard
              titulo="Título do Card"
              descricao="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
              className="xl:col-span-2 xl:h-42.5"
            />
            <DashboardCard
              titulo="Título do Card"
              descricao="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
              className="xl:col-span-2 xl:h-42.5"
            />
          </div>

          <footer className="mt-1 flex items-center justify-center gap-3 rounded-2xl bg-[#efefef] px-4 py-4 text-sm text-slate-700">
            <img src={sistemaImage} alt="Logo do sistema" className="h-8 w-8 rounded-md object-cover" />
            <span>© 2025 [Nome da sua Empresa/App]. Todos os direitos reservados.</span>
          </footer>
        </section>
        
      </div>
    </div>
  );
}

