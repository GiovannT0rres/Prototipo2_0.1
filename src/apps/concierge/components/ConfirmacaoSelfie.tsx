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
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col h-full bg-gray-900 text-white">
      <div className="flex-shrink-0 p-4 flex items-center justify-between">
        <button onClick={onRejeitado} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20">
          <ArrowLeft size={20} />
        </button>
        <p className="font-bold text-[15px]">Verificação Visual</p>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <img 
          src={dados.avatar} 
          alt={dados.name} 
          className="w-48 h-48 rounded-full border-4 border-white/20 object-cover shadow-2xl mb-6"
        />
        <h2 className="text-[28px] font-bold mb-2 leading-tight">Esta pessoa é<br/>{dados.name}?</h2>
        <p className="text-[15px] text-gray-400 font-medium">CPF: {dados.cpf}</p>
      </div>

      <div className="p-6 flex gap-4">
        <button
          onClick={() => {
            toast.error("Processo cancelado. CPF não corresponde à pessoa.");
            onRejeitado();
          }}
          className="flex-1 py-4 rounded-2xl font-bold text-[16px] bg-white/10 hover:bg-white/20 text-white transition-colors flex justify-center items-center gap-2"
        >
          <X size={24} /> Não
        </button>
        <button
          onClick={onConfirmado}
          className="flex-1 py-4 rounded-2xl font-bold text-[16px] bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex justify-center items-center gap-2"
        >
          <Check size={24} /> Sim
        </button>
      </div>
    </motion.div>
  );
}