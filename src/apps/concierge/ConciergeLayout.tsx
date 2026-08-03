import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Shield, LogOut, Home, Settings, ChevronRight, X } from "lucide-react";
import "./concierge-theme.css";

// Layout do app de Portaria — DESIGN.md §14.10: o header de marca só existe
// na Home (idle). Durante o atendimento ele duplicava o header interno de
// HomeBusca e custava ~120px de altura útil numa tela onde altura é o
// recurso mais escasso. "Sair" e "Voltar ao Hub" (ação destrutiva) saem do
// header persistente e vão para uma tela de ajustes, alcançável só a partir
// da Home — nunca a um toque de distância durante o atendimento.
//
// PortariaWizard não usa rotas por etapa (uma única rota index), então o
// sinal de "estamos na Home" sobe via Outlet context: PortariaWizard chama
// setIsHome(true/false) conforme o step muda, sem alterar a máquina de
// estados nem os callbacks existentes.
export function ConciergeLayout() {
  const navigate = useNavigate();
  const [isHome, setIsHome] = useState(true);
  const [ajustesAberto, setAjustesAberto] = useState(false);

  return (
    <div className="concierge-app min-h-screen bg-[var(--es-bg)] flex flex-col">
      {isHome && (
        <header className="bg-[var(--es-surface)] border-b border-[var(--es-border)] px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--es-navy)] rounded-[14px] flex items-center justify-center shrink-0">
              <Shield size={20} className="text-white" strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-[17px] font-bold text-[var(--es-ink)] leading-tight">PORTARIA</p>
              <p className="text-[17px] text-[var(--es-ink-3)] font-medium uppercase tracking-widest leading-none mt-0.5">
                PACC Clube
              </p>
            </div>
          </div>

          <button
            onClick={() => setAjustesAberto(true)}
            aria-label="Ajustes"
            title="Ajustes"
            className="w-14 h-14 flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors shrink-0"
          >
            <Settings size={24} strokeWidth={2.25} />
          </button>
        </header>
      )}

      {/* Main Content (Onde o PortariaWizard vai renderizar) */}
      <main className="flex-1 overflow-x-hidden relative flex flex-col">
        <Outlet context={{ setIsHome }} />
      </main>

      {ajustesAberto && (
        <div
          onClick={() => setAjustesAberto(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
        >
          <div
            className="bg-[var(--es-surface)] w-full max-w-sm rounded-t-[28px] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[var(--es-border-strong)] rounded-full mx-auto mt-3 mb-2" />
            <div className="px-6 pt-2 pb-4 flex items-center justify-between">
              <h3 className="text-[23px] font-semibold text-[var(--es-ink)]">Ajustes</h3>
              <button
                onClick={() => setAjustesAberto(false)}
                aria-label="Fechar"
                className="w-14 h-14 flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors -mr-2"
              >
                <X size={24} strokeWidth={2.25} />
              </button>
            </div>

            <div className="px-4 pb-6 space-y-2">
              <button
                onClick={() => navigate("/")}
                className="w-full min-h-[64px] px-4 rounded-[14px] flex items-center gap-3 text-[19px] font-semibold text-[var(--es-ink)] hover:bg-[var(--es-bg)] transition-colors"
              >
                <Home size={24} strokeWidth={2.25} className="text-[var(--es-ink-2)]" />
                <span className="flex-1 text-left">Voltar ao Hub</span>
                <ChevronRight size={22} strokeWidth={2.25} className="text-[var(--es-ink-3)]" />
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                  navigate("/login");
                }}
                className="w-full min-h-[64px] px-4 rounded-[14px] flex items-center gap-3 text-[19px] font-semibold text-[var(--es-danger)] hover:bg-[var(--es-danger-soft)] transition-colors"
              >
                <LogOut size={24} strokeWidth={2.25} />
                <span className="flex-1 text-left">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
