import { useState } from "react";
import { Pencil, Ban, Check, X } from "lucide-react";
import { MOTIVO_COR, statusAutorizacao, type Authorization, type AuthorizationStatus, type Motivo } from "../types";
import { editarAutorizacao, revogarAutorizacao, getPessoa } from "../mocks/mockManagerStore";
import { formatarPeriodo, SeletorPeriodo, type Periodo } from "./SeletorPeriodo";

const STATUS_STYLE: Record<AuthorizationStatus, { label: string; dot: string; text: string }> = {
  vigente: { label: "Vigente", dot: "bg-emerald-500", text: "text-emerald-700" },
  futura: { label: "Futura", dot: "bg-blue-400", text: "text-blue-700" },
  expirada: { label: "Expirada", dot: "bg-gray-300", text: "text-gray-400" },
  revogada: { label: "Revogada", dot: "bg-red-300", text: "text-red-400" },
};

// Motivos ligados ao status de associação/função, não a um período —
// espelha statusAutorizacao() em types.ts.
const SEM_PRAZO: Motivo[] = ["Sócio Titular", "Dependente", "Equipe Administrativa", "Porteiro"];

function AuthorizationRow({
  auth,
  onAtualizado,
  onAbrirPerfil,
}: {
  auth: Authorization;
  onAtualizado: () => void;
  onAbrirPerfil: (personId: string) => void;
}) {
  const [editando, setEditando] = useState(false);
  const [periodo, setPeriodo] = useState<Periodo | null>(null);

  const status = statusAutorizacao(auth);
  const cor = MOTIVO_COR[auth.motivo];
  const editavel = !SEM_PRAZO.includes(auth.motivo) && status !== "revogada";

  const autorizadorNome = auth.autorizadorId ? getPessoa(auth.autorizadorId)?.nome : undefined;
  const rotuloAutorizador = autorizadorNome ?? auth.autorizadorLabel ?? "Administração do Clube";

  const handleSalvar = () => {
    editarAutorizacao(auth.id, {
      periodoInicio: periodo?.inicio ?? auth.periodoInicio,
      periodoFim: periodo?.fim ?? auth.periodoFim,
    });
    setEditando(false);
    onAtualizado();
  };

  const handleRevogar = () => {
    revogarAutorizacao(auth.id);
    onAtualizado();
  };

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-3.5">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_STYLE[status].dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLE[status].text}`}>
              {STATUS_STYLE[status].label}
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${cor.bg} ${cor.text}`}>
              {auth.motivo}
            </span>
          </div>
          <p className="text-[13px] text-gray-500 mt-1.5">
            {auth.periodoInicio && auth.periodoFim ? formatarPeriodo(auth.periodoInicio, auth.periodoFim) : "Sem prazo — status de associação"}
            {" · "}
            {auth.autorizadorId ? (
              <button
                type="button"
                onClick={() => onAbrirPerfil(auth.autorizadorId!)}
                className="text-emerald-700 font-medium hover:underline"
              >
                {rotuloAutorizador}
              </button>
            ) : (
              <span className="font-medium">{rotuloAutorizador}</span>
            )}
          </p>
          {auth.observacoes && <p className="text-[12px] text-gray-400 mt-0.5 italic">{auth.observacoes}</p>}
        </div>
        {editavel && !editando && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setEditando(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 text-[12px] font-semibold transition-colors"
            >
              <Pencil size={13} /> Editar período
            </button>
            <button
              onClick={handleRevogar}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 text-[12px] font-semibold transition-colors"
            >
              <Ban size={13} /> Revogar
            </button>
          </div>
        )}
      </div>

      {editando && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3 bg-gray-50/50">
          <p className="text-[11px] text-gray-400">
            Só o período pode ser editado — autorizador e motivo não mudam (revogue e crie outra pra isso).
          </p>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Período</label>
            <SeletorPeriodo onChange={setPeriodo} />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setEditando(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 text-[13px] font-semibold transition-colors"
            >
              <X size={14} /> Cancelar
            </button>
            <button
              onClick={handleSalvar}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 text-[13px] font-semibold transition-colors"
            >
              <Check size={14} /> Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AuthorizationList({
  autorizacoes,
  onAtualizado,
  onAbrirPerfil,
}: {
  autorizacoes: Authorization[];
  onAtualizado: () => void;
  onAbrirPerfil: (personId: string) => void;
}) {
  const ordenadas = [...autorizacoes].sort((a, b) => {
    const ordem: Record<AuthorizationStatus, number> = { vigente: 0, futura: 1, expirada: 2, revogada: 3 };
    return ordem[statusAutorizacao(a)] - ordem[statusAutorizacao(b)];
  });

  if (ordenadas.length === 0) {
    return (
      <div className="py-10 text-center text-gray-400 text-[13px] font-medium">
        Nenhuma autorização registrada pra essa pessoa.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {ordenadas.map((auth) => (
        <AuthorizationRow key={auth.id} auth={auth} onAtualizado={onAtualizado} onAbrirPerfil={onAbrirPerfil} />
      ))}
    </div>
  );
}
