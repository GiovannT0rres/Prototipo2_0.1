import { ArrowLeft, Ticket, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onConfirmar: (motivo: "Visitante" | "Prestador de Serviço") => void;
  onVoltar: () => void;
}

export function PerguntaMotivo({ onConfirmar, onVoltar }: Props) {
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
          <p className="font-bold text-gray-900 text-[17px]">Autorização</p>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-50">
        <p className="text-[28px] text-gray-900 mb-6 leading-tight">
          Qual o <strong className="font-bold">MOTIVO</strong>?
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onConfirmar("Visitante")}
            className="w-full text-left px-5 py-5 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors flex items-center gap-4 min-h-[80px]"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Ticket size={24} strokeWidth={2.25} className="text-blue-700" />
            </div>
            <span className="flex-1 font-semibold text-[21px] text-gray-900">Visitante</span>
            <ChevronRight size={24} strokeWidth={2.25} className="text-gray-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onConfirmar("Prestador de Serviço")}
            className="w-full text-left px-5 py-5 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors flex items-center gap-4 min-h-[80px]"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Briefcase size={24} strokeWidth={2.25} className="text-emerald-700" />
            </div>
            <span className="flex-1 font-semibold text-[21px] text-gray-900">Prestador de Serviço</span>
            <ChevronRight size={24} strokeWidth={2.25} className="text-gray-400 shrink-0" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
