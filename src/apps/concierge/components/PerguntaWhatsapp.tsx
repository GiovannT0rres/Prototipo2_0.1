import { useState } from "react";
import { ArrowLeft, MessageCircleMore } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onConfirmar: (phone: string) => void;
  onVoltar: () => void;
}

// DDD do clube (Porto Alegre) — atalho de preenchimento, não obrigatório.
const DDD_SUGERIDO = "(51) ";

export function PerguntaWhatsapp({ onConfirmar, onVoltar }: Props) {
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else if (value.length > 0) {
      value = value.replace(/(\d{0,2})/, "($1");
    }
    setPhone(value.trim());
  };

  const digits = phone.replace(/\D/g, "");

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
        <p className="font-semibold text-[var(--es-ink)] text-[16px]">Cadastro</p>
      </div>

      <div className="flex-1 flex flex-col p-6 bg-[var(--es-bg)]">
        <p className="text-[25px] font-semibold text-[var(--es-ink)] mb-6 leading-tight tracking-[-0.01em]">
          Qual o <strong className="font-bold">WHATSAPP</strong>?
        </p>

        <input
          autoFocus
          value={phone}
          onChange={handlePhoneChange}
          placeholder="00000-0000"
          inputMode="numeric"
          className="w-full bg-[var(--es-surface)] border-2 border-[var(--es-border-strong)] px-5 py-4 rounded-[14px] text-[19px] font-semibold tabular-nums focus:outline-none focus:ring-4 focus:ring-[rgba(15,39,68,0.12)] focus:border-[var(--es-navy)] text-[var(--es-ink)] min-h-[58px]"
        />

        {/* Chip de atalho — preenche o DDD local, poupando o porteiro de digitar tudo */}
        {!phone && (
          <button
            type="button"
            onClick={() => setPhone(DDD_SUGERIDO)}
            className="mt-3 inline-flex items-center gap-2 min-h-[40px] px-[18px] rounded-full bg-[var(--es-surface)] border-[1.5px] border-[var(--es-border-strong)] text-[16px] font-semibold text-[var(--es-ink-2)] hover:border-[var(--es-ink-3)] transition-colors self-start"
          >
            DDD 51 (Porto Alegre)
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => onConfirmar(phone)}
          disabled={digits.length < 10}
          className="w-full mt-6 px-6 py-4 rounded-[14px] font-semibold text-[19px] text-white transition-all active:scale-[0.98] disabled:opacity-45 bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] flex justify-center items-center gap-2.5 min-h-[58px]"
        >
          <MessageCircleMore size={25} strokeWidth={2.25} /> Confirmar
        </button>
      </div>
    </motion.div>
  );
}
