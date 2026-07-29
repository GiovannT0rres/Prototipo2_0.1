import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, ShieldCheck, FileText, Contact, Users, UserPlus, Calendar, LogOut, Menu, X } from "lucide-react";

export function CheckInLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Fecha o menu mobile sempre que a rota muda
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Início", icon: Home, path: "/check-in/espacos", match: (p: string) => p.startsWith("/check-in/clube/") || p === "/check-in/espacos" || p === "/check-in/clubes" },
    { name: "Autorizações", icon: FileText, path: "/check-in/autorizacoes" },
    { name: "Contatos", icon: Contact, path: "/check-in/contatos" },
    { name: "Gestão de Dependentes", icon: Users, path: "/check-in/dependentes" },
    { name: "Patrocínio de Visitantes", icon: UserPlus, path: "/check-in/patrocinio" },
    { name: "Eventos e Reservas", icon: Calendar, path: "/check-in/reservas" },
  ];

  const NavLinks = () => (
    <nav className="flex-1 px-4 space-y-1.5 mt-4">
      {navItems.map((item) => {
        const isActive = item.match ? item.match(location.pathname) : location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
              isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon size={18} />
            <span className="text-[14px] font-semibold">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );

  const SairButton = () => (
    <div className="p-4 border-t border-gray-200">
      <button
        onClick={() => {
          localStorage.removeItem("isAuthenticated");
          navigate("/login");
        }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut size={18} />
        <span className="text-[14px] font-semibold">Sair</span>
      </button>
    </div>
  );

  const Logo = () => (
    <div className="p-6 flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
        <ShieldCheck size={20} className="text-white" />
      </div>
      <div>
        <p className="text-[15px] font-extrabold text-gray-900 leading-tight">CHECK-IN</p>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mt-0.5">
          PACC Clube
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
      {/* Barra superior — só no mobile/tablet, onde a sidebar fica escondida */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 -ml-2 text-gray-600"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={14} className="text-white" />
          </div>
          <p className="text-[14px] font-extrabold text-gray-900">CHECK-IN</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="p-2 -mr-2 text-gray-600"
          title="Voltar ao Hub"
        >
          <Home size={20} />
        </button>
      </div>

      {/* Botão "Voltar ao Hub" flutuante — só faz sentido em telas largas, já que
          no mobile o mesmo atalho já está na barra superior acima */}
      <button
        onClick={() => navigate("/")}
        className="hidden md:flex fixed top-4 right-4 z-50 items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3.5 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors text-[13px] font-semibold"
      >
        <Home size={16} />
        <span>Voltar ao Hub</span>
      </button>

      {/* Sidebar persistente — desktop/tablet largo */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <Logo />
        <NavLinks />
        <SairButton />
      </aside>

      {/* Drawer — mobile, aberto pelo botão de menu na barra superior */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="relative w-72 max-w-[80%] bg-white h-full flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pr-4">
              <Logo />
              <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-500" aria-label="Fechar menu">
                <X size={20} />
              </button>
            </div>
            <NavLinks />
            <SairButton />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
