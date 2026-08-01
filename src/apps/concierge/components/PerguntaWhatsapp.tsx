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
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[17px]">Cadastro</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 bg-gray-50">
        <p className="text-[28px] text-gray-900 mb-6 leading-tight">
          Qual o <strong className="font-bold">WHATSAPP</strong>?
        </p>

        <input
          autoFocus
          value={phone}
          onChange={handlePhoneChange}
          placeholder="(11) 99999-9999"
          inputMode="numeric"
          className="w-full bg-white border-2 border-gray-300 px-5 py-4 rounded-xl text-[21px] font-semibold focus:outline-none focus:ring-4 focus:ring-[#0F2744]/12 focus:border-[#0F2744] text-gray-900 min-h-[64px]"
        />

        {/* Chip de atalho — preenche o DDD local, poupando o porteiro de digitar tudo */}
        {!phone && (
          <button
            type="button"
            onClick={() => setPhone(DDD_SUGERIDO)}
            className="mt-3 inline-flex items-center min-h-[44px] px-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-[15px] font-bold text-gray-700 hover:bg-gray-200 transition-colors self-start"
          >
            DDD 51 (Porto Alegre)
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => onConfirmar(phone)}
          disabled={digits.length < 10}
          className="w-full mt-6 py-4 rounded-xl font-bold text-[21px] text-white transition-opacity disabled:opacity-45 bg-[#0F2744] flex justify-center items-center gap-2 min-h-[64px]"
        >
          <MessageCircleMore size={22} strokeWidth={2.25} /> Confirmar
        </button>
      </div>
    </motion.div>
  );
}
