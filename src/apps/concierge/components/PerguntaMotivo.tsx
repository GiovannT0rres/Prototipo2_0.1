import { ArrowLeft, Ticket, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onConfirmar: (motivo: "Visitante" | "Prestador de Serviço") => void;
  onVoltar: () => void;
}

export function PerguntaMotivo({ onConfirmar, onVoltar }: Props) {
  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full min-h-0 bg-[var(--es-surface)]">
      <div className="flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] flex items-center gap-3 bg-[var(--es-surface)]">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-[50px] h-[50px] flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors shrink-0"
        >
          <ArrowLeft size={22} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-[var(--es-ink)] text-[16px]">Autorização</p>
      </div>

      <div className="flex-1 p-6 bg-[var(--es-bg)]">
        <p className="text-[25px] font-semibold text-[var(--es-ink)] mb-6 leading-tight tracking-[-0.01em]">
          Qual o <strong className="font-bold">MOTIVO</strong>?
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onConfirmar("Visitante")}
            className="w-full text-left px-4 py-5 rounded-[14px] border-2 border-[var(--es-border)] bg-[var(--es-surface)] hover:border-[var(--es-navy)] hover:bg-[var(--es-navy-soft)] active:scale-[0.99] transition-all flex items-center gap-2 min-h-[72px]"
          >
            <div className="w-11 h-11 rounded-full bg-[var(--es-navy-soft)] flex items-center justify-center shrink-0">
              <Ticket size={22} strokeWidth={2.25} className="text-[var(--es-navy)]" />
            </div>
            <span className="flex-1 min-w-0 font-semibold text-[19px] text-[var(--es-ink)] text-balance">Visitante</span>
            <ChevronRight size={22} strokeWidth={2.25} className="text-[var(--es-ink-3)] shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onConfirmar("Prestador de Serviço")}
            className="w-full text-left px-4 py-5 rounded-[14px] border-2 border-[var(--es-border)] bg-[var(--es-surface)] hover:border-[var(--es-navy)] hover:bg-[var(--es-navy-soft)] active:scale-[0.99] transition-all flex items-center gap-2 min-h-[72px]"
          >
            <div className="w-11 h-11 rounded-full bg-[var(--es-success-soft)] flex items-center justify-center shrink-0">
              <Briefcase size={22} strokeWidth={2.25} className="text-[var(--es-success)]" />
            </div>
            <span className="flex-1 min-w-0 font-semibold text-[19px] text-[var(--es-ink)] text-balance">Prestador de Serviço</span>
            <ChevronRight size={22} strokeWidth={2.25} className="text-[var(--es-ink-3)] shrink-0" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
