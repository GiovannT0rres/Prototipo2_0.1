import { useState } from "react";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

// Presets de término — "Só hoje" primeiro por ser o caso mais comum de
// visitante (design.md §14.6: o preset mais frequente deve ser o mais fácil
// de alcançar). Os demais em contagem de dias, sem input de data nativo.
const TERMINO_PRESETS = [
  { label: "Só hoje", dias: 0 },
  { label: "+7 dias", dias: 7 },
  { label: "+15 dias", dias: 15 },
  { label: "+30 dias", dias: 30 },
];

interface Props {
  onConfirmar: (periodo: string) => void;
  onVoltar: () => void;
}

export function PerguntaPeriodo({ onConfirmar, onVoltar }: Props) {
  // Início assume "Hoje" por padrão e não é perguntado — a esmagadora
  // maioria dos acessos de portaria começa agora (design.md §14.6 proposta
  // 1). "Começa em outro dia" fica disponível como link terciário pra quem
  // precisar do caso raro de agendar um início futuro.
  const [inicioOutroDia, setInicioOutroDia] = useState(false);
  const [diasInicio, setDiasInicio] = useState(1);
  const [termino, setTermino] = useState(TERMINO_PRESETS[0]);

  const periodoLabel = () => {
    const de = inicioOutroDia ? `daqui a ${diasInicio} dia${diasInicio > 1 ? "s" : ""}` : "Hoje";
    const ate = termino.dias === 0 ? "hoje" : `${termino.dias} dias`;
    return `${de} até ${ate}`;
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-[var(--es-surface)]">
      <div className="flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] flex items-center gap-3 bg-[var(--es-surface)]">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-[var(--es-ink)] text-[17px]">Autorização</p>
      </div>

      <div className="flex-1 p-6 bg-[var(--es-bg)] overflow-y-auto">
        <p className="text-[28px] font-semibold text-[var(--es-ink)] mb-2 leading-tight tracking-[-0.01em]">
          <strong className="font-bold">ATÉ QUANDO</strong>?
        </p>
        <p className="text-[17px] text-[var(--es-ink-3)] mb-6">
          {inicioOutroDia ? `Começa daqui a ${diasInicio} dia${diasInicio > 1 ? "s" : ""}.` : "O acesso começa hoje."}
        </p>

        <div className="space-y-3">
          {TERMINO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setTermino(preset)}
              className={`w-full text-left px-5 min-h-[72px] rounded-[14px] border-2 transition-all active:scale-[0.99] flex items-center gap-4 ${
                termino.label === preset.label
                  ? "border-[var(--es-navy)] bg-[var(--es-navy-soft)]"
                  : "border-[var(--es-border)] bg-[var(--es-surface)] hover:border-[var(--es-border-strong)]"
              }`}
            >
              <Calendar size={24} strokeWidth={2.25} className="text-[var(--es-navy)] shrink-0" />
              <span className="flex-1 font-semibold text-[21px] text-[var(--es-ink)]">{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Início em outro dia é a exceção — link terciário, não compete
            visualmente com a pergunta principal da tela (design.md §14.6). */}
        <button
          type="button"
          onClick={() => setInicioOutroDia((v) => !v)}
          className="mt-6 min-h-[56px] px-2 text-[17px] font-semibold text-[var(--es-ink-2)] hover:text-[var(--es-ink)] transition-colors underline underline-offset-4 decoration-[var(--es-border-strong)]"
        >
          {inicioOutroDia ? "Começar hoje" : "Começa em outro dia"}
        </button>

        {inicioOutroDia && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {[1, 2, 3, 7].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDiasInicio(d)}
                className={`inline-flex items-center gap-2 px-[18px] min-h-[44px] rounded-full text-[17px] font-semibold border-[1.5px] transition-colors active:scale-[0.98] ${
                  diasInicio === d
                    ? "bg-[var(--es-navy)] text-white border-[var(--es-navy)]"
                    : "bg-[var(--es-surface)] text-[var(--es-ink-2)] border-[var(--es-border-strong)]"
                }`}
              >
                +{d} dia{d > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 p-6 pt-8 border-t border-[var(--es-border)] bg-[var(--es-surface)]">
        <button
          onClick={() => onConfirmar(periodoLabel())}
          className="w-full py-4 rounded-[14px] font-semibold text-[21px] text-white bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] active:scale-[0.98] transition-all flex justify-center items-center gap-2.5 min-h-[64px]"
        >
          Continuar <ChevronRight size={28} strokeWidth={2.25} />
        </button>
      </div>
    </motion.div>
  );
}
