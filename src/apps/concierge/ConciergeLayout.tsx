import { Outlet, useNavigate } from "react-router";
import { Shield, LogOut, Home } from "lucide-react";

export function ConciergeLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col">
      {/* Top Header Minimalista */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F2744] rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-gray-900 leading-tight">PORTARIA</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mt-0.5">
              PACC Clube
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-[14px] font-semibold"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Voltar ao Hub</span>
          </button>
          
          <div className="w-px h-6 bg-gray-200 mx-2" />
          
          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              navigate("/login");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-[14px] font-semibold"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Content (Onde o PortariaWizard vai renderizar) */}
      <main className="flex-1 overflow-x-hidden relative flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}