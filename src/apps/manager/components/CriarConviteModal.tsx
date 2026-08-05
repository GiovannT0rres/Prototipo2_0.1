import { useEffect, useState } from "react";
import { X, Check, Copy, MessageCircleMore, Link2 } from "lucide-react";
import { toast } from "sonner";
import { criarConvite, type Convite } from "../mocks/mockManagerStore";
import { MOTIVOS, MOTIVO_COR, type Motivo } from "../types";
import { SeletorPeriodo, type Periodo } from "./SeletorPeriodo";

const AUTORIZADORES = ["Administração do Clube"];
const SEM_PRAZO: Motivo[] = ["Sócio Titular", "Dependente", "Equipe Administrativa", "Porteiro"];

interface Props {
  predefinido: boolean;
  onFechar: () => void;
  onCriado: () => void;
}

// Um só modal cobre as duas opções pedidas: "Convite aberto" (link sem
// nenhum campo, o Manager configura pessoa por pessoa depois que ela
// completa o cadastro no Bot, na fila de Pendências) e "Convite
// pré-definido" (motivo/espaço/autorizador/período já vêm prontos —
// pensado pra uso em lote, ex.: 50 convidados de um evento).
export function CriarConviteModal({ predefinido, onFechar, onCriado }: Props) {
  const [motivo, setMotivo] = useState<Motivo>("Visitante");
  const [autorizador, setAutorizador] = useState(AUTORIZADORES[0]);
  const [periodo, setPeriodo] = useState<Periodo | null>(null);
  const [observacoes, setObservacoes] = useState("");

  const [convite, setConvite] = useState<Convite | null>(null);

  const temLivreAcesso = SEM_PRAZO.includes(motivo);
  const camposCompletos = !predefinido || temLivreAcesso || (!!autorizador && !!periodo);

  const handleGerar = () => {
    const novo = criarConvite({
      tipo: predefinido ? "predefinido" : "aberto",
      label: predefinido ? `Convite em lote — ${motivo}` : "Convite aberto",
      ...(predefinido
        ? {
            motivo,
            autorizador: temLivreAcesso ? undefined : autorizador,
            periodoInicio: temLivreAcesso ? undefined : periodo?.inicio,
            periodoFim: temLivreAcesso ? undefined : periodo?.fim,
            observacoes: observacoes || undefined,
          }
        : {}),
    });
    setConvite(novo);
    onCriado();
  };

  // "Convite aberto" não tem mais nenhum campo pra preencher — gera o link
  // na hora e já mostra a tela de copiar/WhatsApp.
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
            {predefinido ? "Convite Pré-definido" : "Convite Aberto"}
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
              vira um card em Pendências.
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
                <div className="grid grid-cols-2 gap-2">
                  {MOTIVOS.map((m) => {
                    const cor = MOTIVO_COR[m];
                    const selecionado = motivo === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMotivo(m)}
                        className={`py-2.5 px-2 rounded-xl text-[12.5px] font-bold border-2 transition-colors ${
                          selecionado ? `${cor.border} ${cor.bg} ${cor.text}` : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {temLivreAcesso ? (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-[13px] text-gray-500 leading-relaxed">
                  {motivo} tem acesso ligado ao status de associação/função — sem
                  autorizador ou período a definir.
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Autorizador</label>
                    <input
                      value={autorizador}
                      onChange={(e) => setAutorizador(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600"
                    />
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
