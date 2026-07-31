import { useState } from "react";
import { MOCK_SOCIOS } from "../mocks/mockManager";
import { configurarPessoaConvidada, revogarPessoaConvidada, type PessoaConvidada } from "../mocks/mockManagerStore";
import { ESPACOS } from "@/shared/data/spaces";
import { SeletorPeriodo } from "./SeletorPeriodo";

type Motivo = "Visitante" | "Prestador de Serviço" | "Dependente";

// 3 categorias fixas do PACC (CLAUDE.md §6) — cada uma com uma cor própria,
// sempre visível no texto; a seleção só acrescenta a borda.
const MOTIVOS: { valor: Motivo; texto: string; borda: string }[] = [
  { valor: "Visitante", texto: "text-amber-600", borda: "border-amber-600" },
  { valor: "Prestador de Serviço", texto: "text-blue-600", borda: "border-blue-600" },
  { valor: "Dependente", texto: "text-emerald-600", borda: "border-emerald-600" },
];

const AUTORIZADORES = ["Administração do Clube", ...MOCK_SOCIOS.map((s) => s.name)];

interface Props {
  pessoa: PessoaConvidada;
  onAtualizado: () => void;
}

// Card único de grade — face + dados básicos + "Rejeitar" sempre visíveis;
// ao escolher o Motivo, o próprio card expande (não abre uma segunda box
// embaixo) revelando as configurações que faltam (Destino/Autorizador/
// Período), ou a mensagem de livre acesso se for Dependente.
export function ConvitePendenteCard({ pessoa, onAtualizado }: Props) {
  const [motivo, setMotivo] = useState<Motivo | null>(null);
  const [destino, setDestino] = useState("");
  const [autorizador, setAutorizador] = useState(AUTORIZADORES[0]);
  const [periodo, setPeriodo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const temLivreAcesso = motivo === "Dependente";
  const opcoesDestino = motivo === "Visitante" ? [...ESPACOS.map((e) => e.name), "Clube Inteiro"] : ESPACOS.map((e) => e.name);

  const handleRevogar = () => {
    revogarPessoaConvidada(pessoa.id);
    onAtualizado();
  };

  const handleAtivar = () => {
    if (!motivo) return;
    configurarPessoaConvidada(pessoa.id, {
      motivo,
      destino: temLivreAcesso ? "Clube Inteiro" : destino,
      autorizador: temLivreAcesso ? "" : autorizador,
      periodo: temLivreAcesso ? "" : periodo,
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
        <div className="flex flex-wrap justify-center gap-2">
          {MOTIVOS.map((m) => {
            const selecionado = motivo === m.valor;
            return (
              <button
                key={m.valor}
                type="button"
                onClick={() => { setMotivo(m.valor); setDestino(""); }}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold border-2 transition-colors ${m.texto} ${
                  selecionado ? m.borda : "border-transparent"
                }`}
              >
                {m.valor}
              </button>
            );
          })}
        </div>
      </div>

      {motivo && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          {temLivreAcesso ? (
            <p className="text-[12px] text-gray-500 text-center leading-relaxed">
              Dependente tem livre acesso a todo o clube — sem destino, autorizador ou período a definir.
            </p>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Destino</label>
                <select
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[13px] font-medium"
                >
                  <option value="">Selecione...</option>
                  {opcoesDestino.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Autorizador</label>
                <select
                  value={autorizador}
                  onChange={(e) => setAutorizador(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[13px] font-medium"
                >
                  {AUTORIZADORES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
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
            disabled={!temLivreAcesso && !destino}
            className="w-full py-2.5 rounded-xl font-bold text-[13px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40"
          >
            Ativar Acesso
          </button>
        </div>
      )}
    </div>
  );
}
