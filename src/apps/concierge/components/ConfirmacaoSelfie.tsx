import { ArrowLeft, Check, X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface Props {
  dados: any;
  onConfirmado: () => void;
  onRejeitado: () => void;
}

export function ConfirmacaoSelfie({ dados, onConfirmado, onRejeitado }: Props) {
  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col h-full min-h-0 bg-[var(--es-bg)]">
      <div className="flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] bg-[var(--es-surface)] flex items-center justify-between">
        <button
          onClick={onRejeitado}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-[17px] text-[var(--es-ink)]">Verificação Visual</p>
        <div className="w-14" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <img
          src={dados.avatar}
          alt={dados.name}
          className="w-48 h-48 rounded-full border-4 border-[var(--es-surface)] object-cover shadow-xl mb-6"
        />
        <h2 className="text-[28px] font-bold text-[var(--es-ink)] mb-2 leading-tight">Esta pessoa é<br />{dados.name}?</h2>
        <p className="text-[21px] text-[var(--es-ink-2)] font-medium tabular-nums">CPF: {dados.cpf}</p>
      </div>

      <div className="p-6 flex gap-4 bg-[var(--es-surface)] border-t border-[var(--es-border)]">
        <button
          onClick={() => {
            toast.error("Processo cancelado. CPF não corresponde à pessoa.", { duration: 8000 });
            onRejeitado();
          }}
          className="flex-1 py-4 rounded-[14px] font-semibold text-[19px] bg-[var(--es-surface)] border-2 border-[var(--es-border-strong)] hover:bg-[var(--es-bg)] text-[var(--es-ink)] active:scale-[0.98] transition-all flex justify-center items-center gap-2 min-h-[64px]"
        >
          <X size={24} strokeWidth={2.25} /> Não
        </button>
        <button
          onClick={onConfirmado}
          className="flex-1 py-4 rounded-[14px] font-semibold text-[19px] bg-[var(--es-success)] hover:brightness-95 text-white active:scale-[0.98] transition-all flex justify-center items-center gap-2 min-h-[64px]"
        >
          <Check size={24} strokeWidth={2.25} /> Sim
        </button>
      </div>
    </motion.div>
  );
}