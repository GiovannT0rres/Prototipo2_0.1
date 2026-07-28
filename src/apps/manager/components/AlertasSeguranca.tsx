import { useState } from "react";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { MOCK_ALERTAS } from "../mocks/mockManager";

type Severidade = "alta" | "media" | "baixa";
type Filtro = "todos" | Severidade;

const SEVERIDADE_STYLE: Record<Severidade, { dot: string; bg: string; border: string; text: string; label: string }> = {
  alta: { dot: "bg-red-500", bg: "bg-red-50", border: "border-red-100", text: "text-red-800", label: "Alta" },
  media: { dot: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-800", label: "Média" },
  baixa: { dot: "bg-gray-400", bg: "bg-gray-50", border: "border-gray-100", text: "text-gray-700", label: "Baixa" },
};

export function AlertasSeguranca() {
  const [alertas, setAlertas] = useState(MOCK_ALERTAS);
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const resolver = (id: string) => {
    setAlertas((prev) => prev.map((a) => (a.id === id ? { ...a, resolvido: true } : a)));
  };

  const visiveis = alertas
    .filter((a) => filtro === "todos" || a.severidade === filtro)
    .sort((a, b) => Number(a.resolvido) - Number(b.resolvido));

  const pendentes = alertas.filter((a) => !a.resolvido).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Alertas de Segurança</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            {pendentes > 0 ? `${pendentes} alerta(s) aguardando providência.` : "Nenhum alerta pendente no momento."}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
          <ShieldAlert size={22} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["todos", "alta", "media", "baixa"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold border transition-colors ${
              filtro === f
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f === "todos" ? "Todos" : SEVERIDADE_STYLE[f].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visiveis.map((alerta) => {
          const theme = SEVERIDADE_STYLE[alerta.severidade as Severidade];
          return (
            <div
              key={alerta.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-opacity ${
                alerta.resolvido ? "bg-gray-50 border-gray-100 opacity-60" : `${theme.bg} ${theme.border}`
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${alerta.resolvido ? "bg-gray-300" : theme.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-[14px] font-bold ${alerta.resolvido ? "text-gray-500 line-through" : theme.text}`}>
                    {alerta.titulo}
                  </p>
                  <span className="text-[11px] font-bold uppercase tracking-wide bg-white/60 text-gray-500 px-2 py-0.5 rounded-md shrink-0">
                    {SEVERIDADE_STYLE[alerta.severidade as Severidade].label}
                  </span>
                </div>
                <p className={`text-[13px] mt-0.5 ${alerta.resolvido ? "text-gray-400" : `${theme.text} opacity-80`}`}>
                  {alerta.detalhe}
                </p>
                <p className="text-[11px] text-gray-400 mt-1.5">{alerta.data}</p>
              </div>

              {!alerta.resolvido ? (
                <button
                  onClick={() => resolver(alerta.id)}
                  className="flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 px-3 py-2 rounded-xl font-semibold text-[12px] hover:bg-gray-50 transition-colors shrink-0"
                >
                  <CheckCircle2 size={14} />
                  Resolver
                </button>
              ) : (
                <span className="text-[12px] font-semibold text-emerald-600 shrink-0">Resolvido</span>
              )}
            </div>
          );
        })}

        {visiveis.length === 0 && (
          <div className="py-12 text-center text-gray-500 font-medium">
            Nenhum alerta nessa categoria.
          </div>
        )}
      </div>
    </div>
  );
}
