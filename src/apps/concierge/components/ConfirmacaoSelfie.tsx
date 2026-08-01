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
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col h-full bg-gray-50">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-white flex items-center justify-between">
        <button
          onClick={onRejeitado}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <p className="font-bold text-[17px] text-gray-900">Verificação Visual</p>
        <div className="w-14" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <img
          src={dados.avatar}
          alt={dados.name}
          className="w-48 h-48 rounded-full border-4 border-white object-cover shadow-xl mb-6"
        />
        <h2 className="text-[28px] font-bold text-gray-900 mb-2 leading-tight">Esta pessoa é<br/>{dados.name}?</h2>
        <p className="text-[19px] text-gray-600 font-medium font-mono">CPF: {dados.cpf}</p>
      </div>

      <div className="p-6 flex gap-4 bg-white border-t border-gray-100">
        <button
          onClick={() => {
            toast.error("Processo cancelado. CPF não corresponde à pessoa.");
            onRejeitado();
          }}
          className="flex-1 py-4 rounded-2xl font-bold text-[19px] bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800 transition-colors flex justify-center items-center gap-2 min-h-[64px]"
        >
          <X size={24} strokeWidth={2.25} /> Não
        </button>
        <button
          onClick={onConfirmado}
          className="flex-1 py-4 rounded-2xl font-bold text-[19px] bg-[#0B7A3B] hover:bg-[#096530] text-white transition-colors flex justify-center items-center gap-2 min-h-[64px]"
        >
          <Check size={24} strokeWidth={2.25} /> Sim
        </button>
      </div>
    </motion.div>
  );
}