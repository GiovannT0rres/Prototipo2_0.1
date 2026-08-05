import { useState } from "react";
import { configurarPessoaConvidada, revogarPessoaConvidada, type PessoaConvidada } from "../mocks/mockManagerStore";
import { MOTIVOS, MOTIVO_COR, type Motivo } from "../types";
import { SeletorPeriodo, type Periodo } from "./SeletorPeriodo";

const AUTORIZADORES = ["Administração do Clube"];
const SEM_PRAZO: Motivo[] = ["Sócio Titular", "Dependente", "Equipe Administrativa", "Porteiro"];

interface Props {
  pessoa: PessoaConvidada;
  onAtualizado: () => void;
}

// Card único de grade — face + dados básicos + "Rejeitar" sempre visíveis;
// ao escolher o Motivo, o próprio card expande (não abre uma segunda box
// embaixo) revelando as configurações que faltam (Autorizador/Período), ou
// a mensagem de acesso sem prazo se for Sócio Titular/Dependente/Equipe
// Administrativa/Porteiro.
export function ConvitePendenteCard({ pessoa, onAtualizado }: Props) {
  const [motivo, setMotivo] = useState<Motivo | null>(null);
  const [autorizador, setAutorizador] = useState(AUTORIZADORES[0]);
  const [periodo, setPeriodo] = useState<Periodo | null>(null);
  const [observacoes, setObservacoes] = useState("");

  const temLivreAcesso = motivo ? SEM_PRAZO.includes(motivo) : false;

  const handleRevogar = () => {
    revogarPessoaConvidada(pessoa.id);
    onAtualizado();
  };

  const handleAtivar = () => {
    if (!motivo) return;
    configurarPessoaConvidada(pessoa.id, {
      motivo,
      autorizadorId: null,
      autorizadorLabel: temLivreAcesso ? "Administração do Clube" : autorizador,
      periodoInicio: temLivreAcesso ? "" : (periodo?.inicio ?? ""),
      periodoFim: temLivreAcesso ? "" : (periodo?.fim ?? ""),
      observacoes: observacoes || undefined,
    });
    onAtualizado();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-gray-900 truncate">{pessoa.nome}</h3>
          <p className="text-[12px] text-gray-500 mt-0.5">Fone: {pessoa.telefone}</p>
          <p className="text-[11px] text-gray-400 mt-1">Completou o cadastro {pessoa.completadoEm}</p>
        </div>
        <img src={pessoa.avatar} alt={pessoa.nome} className="w-14 h-14 rounded-full object-cover border border-gray-100 shrink-0" />
      </div>

      <button
        onClick={handleRevogar}
        className="mt-2 text-[12px] font-bold text-red-500 hover:text-red-600 transition-colors"
      >
        Rejeitar
      </button>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-[13px] font-bold text-gray-700 text-center mb-3">Qual o MOTIVO do acesso?</p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {MOTIVOS.map((m) => {
            const cor = MOTIVO_COR[m];
            const selecionado = motivo === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMotivo(m)}
                className={`px-2.5 py-1.5 rounded-full text-[11.5px] font-bold border-2 transition-colors ${cor.text} ${
                  selecionado ? cor.border : "border-transparent"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {motivo && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          {temLivreAcesso ? (
            <p className="text-[12px] text-gray-500 text-center leading-relaxed">
              {motivo} tem acesso ligado ao status de associação/função — sem autorizador ou período a definir.
            </p>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Autorizador</label>
                <input
                  value={autorizador}
                  onChange={(e) => setAutorizador(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[13px] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Período</label>
                <SeletorPeriodo onChange={setPeriodo} />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Observações (opcional)</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={2}
              placeholder="Alguma informação adicional..."
              className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[13px] font-medium resize-none"
            />
          </div>

          <button
            onClick={handleAtivar}
            disabled={!temLivreAcesso && !periodo}
            className="w-full py-2.5 rounded-xl font-bold text-[13px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40"
          >
            Ativar Acesso
          </button>
        </div>
      )}
    </div>
  );
}
