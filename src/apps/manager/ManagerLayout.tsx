import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { BarChart3, Home, Settings, LogOut, ListChecks, Menu, X } from "lucide-react";

export function ManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Dashboard", icon: BarChart3, path: "/manager" },
    { name: "Ativar", icon: ListChecks, path: "/manager/aprovacoes" },
    { name: "Sócios", icon: Settings, path: "/manager/socios" },
  ];

  const NavLinks = () => (
    <nav className="flex-1 px-4 space-y-2 mt-4">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
            location.pathname === item.path
              ? "bg-emerald-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <item.icon size={18} />
          <span className="text-[14px] font-semibold">{item.name}</span>
        </button>
      ))}
    </nav>
  );

  const SairButton = () => (
    <div className="p-4 border-t border-gray-200 space-y-1">
      <button
        onClick={() => navigate("/")}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <Home size={18} />
        <span className="text-[14px] font-semibold">Voltar ao Hub</span>
      </button>
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
      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
        <BarChart3 size={20} className="text-white" />
      </div>
      <div>
        <p className="text-[15px] font-extrabold text-gray-900 leading-tight">MANAGER</p>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mt-0.5">
          Administração
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col md:flex-row">
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
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={14} className="text-white" />
          </div>
          <p className="text-[14px] font-extrabold text-gray-900">MANAGER</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="p-2 -mr-2 text-gray-600"
          title="Voltar ao Hub"
        >
          <Home size={20} />
        </button>
      </div>

      {/* Sidebar persistente — desktop/tablet largo. "Voltar ao Hub" mora aqui
          embaixo, junto do Sair (era um botão flutuante no canto superior
          direito, mas sobrepunha o conteúdo das telas — ver SairButton). */}
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

      <main className="flex-1 overflow-x-hidden p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
