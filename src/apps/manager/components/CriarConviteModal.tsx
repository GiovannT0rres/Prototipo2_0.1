import { useEffect, useState } from "react";
import { X, Check, ChevronDown, Copy, MessageCircleMore, Link2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_SOCIOS } from "../mocks/mockManager";
import { criarConvite, type Convite } from "../mocks/mockManagerStore";
import { ESPACOS } from "@/shared/data/spaces";
import { SeletorPeriodo } from "./SeletorPeriodo";

// 3 categorias fixas do PACC (CLAUDE.md §6) — "Familiar" foi renomeado pra
// "Dependente" em 31/07/2026, decisão do usuário.
const MOTIVOS = ["Visitante", "Prestador de Serviço", "Dependente"] as const;
const AUTORIZADORES = ["Administração do Clube", ...MOCK_SOCIOS.map((s) => s.name)];

interface Props {
  predefinido: boolean;
  onFechar: () => void;
  onCriado: () => void;
}

// Um só modal cobre as duas opções pedidas: "Criar Convite" (link aberto, o
// Manager configura pessoa por pessoa depois que ela completa o cadastro no
// Bot) e "Criar Convite Pré-definido" (motivo/destino/autorizador/período já
// vêm prontos — pensado pra uso em lote, ex.: 50 convidados de um evento).
export function CriarConviteModal({ predefinido, onFechar, onCriado }: Props) {
  const [motivo, setMotivo] = useState<(typeof MOTIVOS)[number]>("Visitante");
  const [destino, setDestino] = useState("");
  const [autorizador, setAutorizador] = useState(AUTORIZADORES[0]);
  const [periodo, setPeriodo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [convite, setConvite] = useState<Convite | null>(null);

  // Dependente tem livre acesso por natureza (mesma regra do Concierge) —
  // não precisa de destino/autorizador/período.
  const temLivreAcesso = motivo === "Dependente";

  const opcoesDestino = motivo === "Visitante" ? [...ESPACOS.map((e) => e.name), "Clube Inteiro"] : ESPACOS.map((e) => e.name);

  const camposCompletos = !predefinido || temLivreAcesso || (!!destino && !!autorizador && !!periodo);

  const handleGerar = () => {
    const novo = criarConvite({
      tipo: predefinido ? "predefinido" : "aberto",
      label: predefinido ? `Convite em lote — ${motivo}` : "Convite aberto",
      ...(predefinido
        ? {
            motivo,
            destino: temLivreAcesso ? undefined : destino,
            autorizador: temLivreAcesso ? undefined : autorizador,
            periodo: temLivreAcesso ? undefined : periodo,
            observacoes: observacoes || undefined,
          }
        : {}),
    });
    setConvite(novo);
    onCriado();
  };

  // "Criar Convite" (não predefinido) não tem mais nenhum campo pra
  // preencher — gera o link na hora e já mostra a tela de copiar/WhatsApp.
  useEffect(() => {
    if (!predefinido) handleGerar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopiar = () => {
    if (!convite) return;
    navigator.clipboard?.writeText(convite.url);
    toast.success("Link copiado.");
  };

  const handleWhatsapp = () => {
    if (!convite) return;
    const texto = encodeURIComponent(
      `Olá! Você foi convidado(a) pelo PACC Clube. Conclua seu cadastro pelo link: ${convite.url}`,
    );
    window.open(`https://api.whatsapp.com/send?text=${texto}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onFechar}>
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-[16px] font-bold text-gray-900">
            {predefinido ? "Criar Convite Pré-definido" : "Criar Convite"}
          </p>
          <button onClick={onFechar} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {convite ? (
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Link2 size={28} />
            </div>
            <p className="text-[15px] font-bold text-gray-900">Link gerado com sucesso</p>
            <p className="text-[13px] text-gray-500 mt-1 mb-5">
              Envie pra quantas pessoas precisar — cada uma que completar o cadastro pelo Bot
              vira um card em Ativar.
            </p>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-mono text-gray-700 break-all">
              {convite.url}
            </div>
            <div className="w-full flex gap-3 mt-4">
              <button
                onClick={handleCopiar}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Copy size={16} /> Copiar
              </button>
              <button
                onClick={handleWhatsapp}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] text-white bg-[#25D366] hover:bg-[#1da851] transition-colors"
              >
                <MessageCircleMore size={16} /> WhatsApp
              </button>
            </div>
            <button
              onClick={onFechar}
              className="mt-4 text-[13px] font-semibold text-gray-500 hover:text-gray-700"
            >
              Concluir
            </button>
          </div>
        ) : predefinido ? (
          <>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Motivo</label>
                <div className="flex gap-2">
                  {MOTIVOS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setMotivo(m); setDestino(""); }}
                      className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold border-2 transition-colors ${
                        motivo === m ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {temLivreAcesso ? (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-[13px] text-gray-500 leading-relaxed">
                  Dependente tem livre acesso a todo o clube — sem destino, autorizador ou
                  período a definir.
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Destino</label>
                    <div className="relative">
                      <select
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                      >
                        <option value="">Selecione o destino...</option>
                        {opcoesDestino.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Autorizador</label>
                    <div className="relative">
                      <select
                        value={autorizador}
                        onChange={(e) => setAutorizador(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                      >
                        {AUTORIZADORES.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Período</label>
                    <SeletorPeriodo onChange={setPeriodo} />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Observações (opcional)</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                  placeholder="Alguma informação adicional sobre este lote de convites..."
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 resize-none"
                />
              </div>

              <p className="text-[12px] text-gray-400 leading-relaxed">
                Todo mundo que completar o cadastro por este link já entra com esses dados
                prontos — você só precisa aceitar ou recusar cada card (inclusive em lote).
              </p>
            </div>

            <div className="p-6 border-t border-gray-100">
              <button
                onClick={handleGerar}
                disabled={!camposCompletos}
                className="w-full py-3 rounded-xl font-semibold text-[14px] text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Check size={16} /> Gerar Link
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
