import { Outlet, useNavigate, useLocation } from "react-router";
import { BarChart3, Database, Home, Settings, LogOut } from "lucide-react";

export function ManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Fila de Trabalho", icon: BarChart3, path: "/manager" },
    { name: "Prestadores", icon: Database, path: "/manager/prestadores" },
    { name: "Sócio (ERP Forza)", icon: Settings, path: "/manager/socio/8493" },
    { name: "Movimentações", icon: Database, path: "/manager/logs" },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col md:flex-row">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-gray-900 leading-tight">MANAGER</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mt-0.5">
              Administração
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Home size={18} />
            <span className="text-[14px] font-semibold">Voltar ao Hub</span>
          </button>
          
          <div className="h-px bg-gray-200 my-4" />
          
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
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
      </aside>

      <main className="flex-1 overflow-x-hidden p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
