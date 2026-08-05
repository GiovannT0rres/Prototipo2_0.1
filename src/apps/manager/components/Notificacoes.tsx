import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Clock, Gauge, AlertTriangle, PartyPopper, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MOCK_NOTIFICACOES, type Notificacao } from "../mocks/mockManager";

function iconeDe(n: Notificacao): LucideIcon {
  if (n.categoria === "seguranca") return AlertTriangle;
  if (n.vaiParaTag?.startsWith("evento:")) return PartyPopper;
  if (n.vaiParaTag === "cadastro:aguardando-autorizacao") return Clock;
  if (n.vaiParaTag === "cadastro:aguardando-cadastro") return Gauge;
  return CheckCircle2;
}

const CATEGORIAS = [
  { id: "todas" as const, label: "Todas" },
  { id: "acao" as const, label: "Ação" },
  { id: "seguranca" as const, label: "Segurança" },
  { id: "atividade" as const, label: "Atividade" },
];

const GRUPOS: { id: Notificacao["categoria"]; label: string }[] = [
  { id: "acao", label: "Precisa de você" },
  { id: "seguranca", label: "Segurança" },
  { id: "atividade", label: "Atividade" },
];

export function Notificacoes() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<Notificacao[]>(MOCK_NOTIFICACOES);
  const [aba, setAba] = useState<(typeof CATEGORIAS)[number]["id"]>("todas");

  const naoLidas = notifs.filter((n) => !n.lida).length;
  const visiveis = aba === "todas" ? notifs : notifs.filter((n) => n.categoria === aba);

  function abrir(n: Notificacao) {
    setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x)));
    if (n.vaiParaTag) {
      navigate(`/manager?tags=${encodeURIComponent(n.vaiParaTag)}`);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-white">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-emerald-700 font-medium text-[13px] hover:bg-emerald-50 rounded-lg px-2 py-1">
          <ChevronLeft size={16} /> Voltar
        </button>
        <h2 className="text-[14px] font-semibold flex-1">Notificações</h2>
        {naoLidas > 0 && (
          <button
            onClick={() => setNotifs((prev) => prev.map((n) => ({ ...n, lida: true })))}
            className="text-[12.5px] text-gray-500 hover:text-gray-800"
          >
            Marcar lidas
          </button>
        )}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mx-4 mt-3">
        {CATEGORIAS.map((c) => {
          const n = c.id === "todas" ? naoLidas : notifs.filter((x) => x.categoria === c.id && !x.lida).length;
          return (
            <button
              key={c.id}
              onClick={() => setAba(c.id)}
              className={`flex-1 text-[12.5px] font-medium rounded-md py-1.5 ${aba === c.id ? "bg-white shadow-sm" : "text-gray-500"}`}
            >
              {c.label} {n > 0 && <span className="text-gray-400 tabular-nums">{n}</span>}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {GRUPOS.map((g) => {
          const doGrupo = visiveis.filter((n) => n.categoria === g.id);
          if (!doGrupo.length) return null;
          return (
            <div key={g.id} className="mb-4">
              <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1">{g.label}</p>
              <div className="space-y-1">
                {doGrupo.map((n) => {
                  const Icone = iconeDe(n);
                  return (
                    <button
                      key={n.id}
                      onClick={() => abrir(n)}
                      className={`w-full flex items-start gap-3 rounded-xl p-2.5 text-left ${n.lida ? "hover:bg-gray-50" : "bg-emerald-50 hover:bg-emerald-100"}`}
                    >
                      <span className="w-6 h-6 rounded-md bg-white border border-gray-200 grid place-items-center flex-none mt-0.5">
                        <Icone size={13} className="text-gray-600" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-[13px] ${n.lida ? "" : "font-semibold"}`}
                          dangerouslySetInnerHTML={{ __html: n.titulo }}
                        />
                        <span className="block text-[12.5px] text-gray-500 mt-0.5">{n.detalhe}</span>
                        <span className="block text-[12px] text-gray-400 mt-0.5">{n.quando}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {!visiveis.length && <p className="text-center text-gray-400 text-[13px] py-10">Nada por aqui.</p>}
        <p className="text-[12px] text-gray-400 px-1 mt-2">Clicar numa notificação aplica o filtro correspondente e volta para a busca.</p>
      </div>
    </div>
  );
}
