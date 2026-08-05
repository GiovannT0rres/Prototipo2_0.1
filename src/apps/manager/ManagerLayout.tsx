import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Bell } from "lucide-react";
import { Toaster } from "sonner";
import { MOCK_NOTIFICACOES } from "./mocks/mockManager";
import { TransicaoPilha } from "./components/TransicaoPilha";
import "./manager.css";

// Shell mínimo do redesign filter-first — sem sidebar, sem nav por tela.
// Toda navegação passa pela busca (Busca.tsx); este layout só dá a moldura:
// marca, notificações, e as ações de sair/voltar ao hub que todo *Layout.tsx
// do protótipo compartilha (CLAUDE.md §3).
export function ManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const naoLidas = MOCK_NOTIFICACOES.filter((n) => !n.lida).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-12 flex-none flex items-center gap-3 px-4 border-b border-gray-200 bg-white">
        <span className="font-bold text-[13.5px] tracking-tight text-gray-900">PACC Manager</span>
        <div className="flex-1" />
        <button
          onClick={() => navigate("/manager/notificacoes")}
          disabled={location.pathname === "/manager/notificacoes"}
          className="relative w-8 h-8 rounded-lg border border-gray-200 grid place-items-center hover:bg-gray-50 disabled:opacity-50"
        >
          <Bell size={15} className="text-gray-600" />
          {naoLidas > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-red-600 text-white text-[9.5px] font-bold grid place-items-center border-2 border-white">
              {naoLidas}
            </span>
          )}
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-[12.5px] font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-2.5 py-1"
        >
          Voltar ao Hub
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            navigate("/login");
          }}
          className="text-[12.5px] font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-2.5 py-1"
        >
          Sair
        </button>
      </header>
      <main className="flex-1 flex flex-col min-h-0">
        <TransicaoPilha>
          <Outlet />
        </TransicaoPilha>
      </main>
      <Toaster />
    </div>
  );
}
