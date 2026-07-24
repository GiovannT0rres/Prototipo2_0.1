import { Outlet, useNavigate, useLocation } from "react-router";
import { Shield, Home, Users, Settings, LogOut } from "lucide-react";

export function ConciergeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Portaria", icon: Shield, path: "/concierge" },
    { name: "Presença", icon: Users, path: "/concierge/presenca" },
    { name: "Configurações", icon: Settings, path: "/concierge/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-gray-900 leading-tight">PORTARIA</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mt-0.5">
              Condomínios
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
                  ? "bg-gray-900 text-white"
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

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
