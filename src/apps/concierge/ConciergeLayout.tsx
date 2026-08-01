import { Outlet, useNavigate } from "react-router";
import { Shield, LogOut, Home } from "lucide-react";

export function ConciergeLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col">
      {/* Header — só a identidade da marca; ações administrativas (Sair, Hub)
          ficam discretas pois nunca são usadas em meio a um atendimento. */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F2744] rounded-xl flex items-center justify-center shrink-0">
            <Shield size={20} className="text-white" strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-[17px] font-extrabold text-gray-900 leading-tight">PORTARIA</p>
            <p className="text-[13px] text-gray-500 font-medium uppercase tracking-widest leading-none mt-0.5">
              PACC Clube
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate("/")}
            aria-label="Voltar ao Hub"
            title="Voltar ao Hub"
            className="w-12 h-12 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Home size={20} strokeWidth={2.25} />
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              navigate("/login");
            }}
            className="h-12 px-3 flex items-center justify-center gap-1.5 rounded-lg text-red-700 hover:bg-red-50 transition-colors text-[15px] font-semibold"
          >
            <LogOut size={18} strokeWidth={2.25} /> Sair
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