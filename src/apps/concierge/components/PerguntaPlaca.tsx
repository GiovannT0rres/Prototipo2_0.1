import { useState } from "react";
import { ArrowLeft, Car } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onConfirmar: (placa: string) => void;
  onVoltar: () => void;
  placaAtual?: string;
  modoEdicao?: boolean;
}

export function PerguntaPlaca({ onConfirmar, onVoltar, placaAtual = "", modoEdicao = false }: Props) {
  const [placa, setPlaca] = useState(placaAtual);

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
        <p className="font-semibold text-[var(--es-ink)] text-[16px]">{modoEdicao ? "Editar Placa" : "Cadastro"}</p>
      </div>

      <div className="flex-1 flex flex-col p-6 bg-[var(--es-bg)]">
        <p className="text-[25px] font-semibold text-[var(--es-ink)] mb-2 leading-tight tracking-[-0.01em]">
          Qual a <strong className="font-bold">PLACA</strong> do veículo?
        </p>
        <p className="text-[16px] text-[var(--es-ink-3)] mb-6">Opcional — o LPR do clube já libera acesso por placa.</p>

        <input
          autoFocus
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          placeholder="ABC1D23"
          maxLength={7}
          className="w-full bg-[var(--es-surface)] border-2 border-[var(--es-border-strong)] px-5 py-4 rounded-[14px] text-[19px] font-semibold uppercase tracking-wide tabular-nums focus:outline-none focus:ring-4 focus:ring-[rgba(15,39,68,0.12)] focus:border-[var(--es-navy)] text-[var(--es-ink)] min-h-[58px]"
        />

        {/* Único caminho de escape — o botão primário permanece sempre
            "Confirmar" para não duplicar a mesma saída de duas formas. */}
        {!placa && (
          <button
            type="button"
            onClick={() => onConfirmar("")}
            className="mt-3 inline-flex items-center gap-2 min-h-[40px] px-[18px] rounded-full bg-[var(--es-surface)] border-[1.5px] border-[var(--es-border-strong)] text-[16px] font-semibold text-[var(--es-ink-2)] hover:border-[var(--es-ink-3)] transition-colors self-start"
          >
            Sem veículo
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => onConfirmar(placa)}
          disabled={!placa}
          className="w-full mt-6 px-6 py-4 rounded-[14px] font-semibold text-[19px] text-white transition-all active:scale-[0.98] disabled:opacity-45 bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] flex justify-center items-center gap-2.5 min-h-[58px]"
        >
          <Car size={25} strokeWidth={2.25} /> Confirmar
        </button>
      </div>
    </motion.div>
  );
}
