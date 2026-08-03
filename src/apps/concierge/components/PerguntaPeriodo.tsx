import { useState } from "react";
import { ArrowLeft, Calendar, ChevronRight, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarioSimples } from "./CalendarioSimples";
import { hojeSemHora, somarDias, labelDataCurta, labelPeriodo } from "../utils/dateLabel";

// Atalhos de início — cobre tanto "começa agora" (caso dominante, design.md
// §14.6) quanto "começa num dia específico no futuro" (evento agendado, ex.
// Baile de Debutantes — autorização criada com antecedência para uma data
// futura, não só para agora). "Escolher data" abre o calendário.
const INICIO_PRESETS = [
  { label: "Hoje", dias: 0 },
  { label: "Amanhã", dias: 1 },
];

const TERMINO_PRESETS = [
  { label: "Só esse dia", dias: 0 },
  { label: "+7 dias", dias: 7 },
  { label: "+15 dias", dias: 15 },
  { label: "+30 dias", dias: 30 },
];

interface Props {
  // periodo é o label pronto pra exibir (ex. "hoje até 22 de agosto");
  // inicioISO/fimISO são datas reais — usadas pra decidir se Liberar já
  // pode ser tocado (autorização futura não deve liberar antes de começar).
  onConfirmar: (periodo: string, inicioISO: string, fimISO: string) => void;
  onVoltar: () => void;
}

type Etapa = "inicio" | "fim";

export function PerguntaPeriodo({ onConfirmar, onVoltar }: Props) {
  const [etapa, setEtapa] = useState<Etapa>("inicio");
  const [inicio, setInicio] = useState<Date>(hojeSemHora());
  const [fim, setFim] = useState<Date | null>(null);
  const [calendarioAberto, setCalendarioAberto] = useState<Etapa | null>(null);

  const confirmarInicio = (data: Date) => {
    setInicio(data);
    // Trocar o início invalida um término já escolhido que ficou anterior a ele.
    if (fim && fim < data) setFim(null);
    setCalendarioAberto(null);
    setEtapa("fim");
  };

  const confirmarFim = (data: Date) => {
    setFim(data);
    setCalendarioAberto(null);
    onConfirmar(labelPeriodo(inicio, data), inicio.toISOString(), data.toISOString());
  };

  const handleVoltar = () => {
    if (etapa === "fim") {
      setEtapa("inicio");
    } else {
      onVoltar();
    }
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-[var(--es-surface)]">
      <div className="flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] flex items-center gap-3 bg-[var(--es-surface)]">
        <button
          onClick={handleVoltar}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-[var(--es-ink)] text-[17px]">Autorização</p>
      </div>

      <div className="flex-1 p-6 bg-[var(--es-bg)] overflow-y-auto">
        <AnimatePresence mode="wait">
          {etapa === "inicio" ? (
            <motion.div key="inicio" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-[17px] font-semibold text-[var(--es-navy)] uppercase tracking-wider mb-2">Pergunta 1 de 2</p>
              <p className="text-[28px] font-semibold text-[var(--es-ink)] mb-6 leading-tight tracking-[-0.01em]">
                Quando <strong className="font-bold">COMEÇA</strong>?
              </p>

              <div className="space-y-3">
                {INICIO_PRESETS.map((preset) => {
                  const data = somarDias(hojeSemHora(), preset.dias);
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => confirmarInicio(data)}
                      className="w-full text-left px-5 min-h-[72px] rounded-[14px] border-2 border-[var(--es-border)] bg-[var(--es-surface)] hover:border-[var(--es-border-strong)] active:scale-[0.99] transition-all flex items-center gap-4"
                    >
                      <Calendar size={24} strokeWidth={2.25} className="text-[var(--es-navy)] shrink-0" />
                      <span className="flex-1 font-semibold text-[21px] text-[var(--es-ink)]">{preset.label}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCalendarioAberto("inicio")}
                  className="w-full text-left px-5 min-h-[72px] rounded-[14px] border-2 border-dashed border-[var(--es-border-strong)] hover:border-[var(--es-navy)] active:scale-[0.99] transition-all flex items-center gap-4"
                >
                  <CalendarDays size={24} strokeWidth={2.25} className="text-[var(--es-ink-2)] shrink-0" />
                  <span className="flex-1 font-semibold text-[21px] text-[var(--es-ink-2)]">Escolher data (evento futuro)</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="fim" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-[17px] font-semibold text-[var(--es-navy)] uppercase tracking-wider mb-2">Pergunta 2 de 2</p>
              <p className="text-[28px] font-semibold text-[var(--es-ink)] mb-2 leading-tight tracking-[-0.01em]">
                Até <strong className="font-bold">QUANDO</strong>?
              </p>
              <p className="text-[17px] text-[var(--es-ink-3)] mb-6">Começa {labelDataCurta(inicio)}.</p>

              <div className="space-y-3">
                {TERMINO_PRESETS.map((preset) => {
                  const data = somarDias(inicio, preset.dias);
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => confirmarFim(data)}
                      className="w-full text-left px-5 min-h-[72px] rounded-[14px] border-2 border-[var(--es-border)] bg-[var(--es-surface)] hover:border-[var(--es-border-strong)] active:scale-[0.99] transition-all flex items-center gap-4"
                    >
                      <Calendar size={24} strokeWidth={2.25} className="text-[var(--es-navy)] shrink-0" />
                      <span className="flex-1 font-semibold text-[21px] text-[var(--es-ink)]">{preset.label}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCalendarioAberto("fim")}
                  className="w-full text-left px-5 min-h-[72px] rounded-[14px] border-2 border-dashed border-[var(--es-border-strong)] hover:border-[var(--es-navy)] active:scale-[0.99] transition-all flex items-center gap-4"
                >
                  <CalendarDays size={24} strokeWidth={2.25} className="text-[var(--es-ink-2)] shrink-0" />
                  <span className="flex-1 font-semibold text-[21px] text-[var(--es-ink-2)]">Escolher data específica</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom sheet do calendário — nasce na zona do polegar, não modal
          centralizado (design.md §7.9). Reaproveitado pra início e término. */}
      {calendarioAberto && (
        <div
          onClick={() => setCalendarioAberto(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-blur-in"
        >
          <div
            className="bg-[var(--es-surface)] w-full max-w-sm rounded-t-[28px] overflow-hidden shadow-2xl flex flex-col animate-spring-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[var(--es-border-strong)] rounded-full mx-auto mt-3 mb-4" />
            <div className="px-6 pb-6">
              <p className="text-[21px] font-semibold text-[var(--es-ink)] mb-4">
                {calendarioAberto === "inicio" ? "Início do acesso" : "Término do acesso"}
              </p>
              <CalendarioSimples
                value={calendarioAberto === "inicio" ? inicio : fim}
                minDate={calendarioAberto === "inicio" ? hojeSemHora() : inicio}
                onChange={(data) => (calendarioAberto === "inicio" ? confirmarInicio(data) : confirmarFim(data))}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
