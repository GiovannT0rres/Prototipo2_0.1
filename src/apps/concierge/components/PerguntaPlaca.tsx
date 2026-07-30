import { useState } from "react";
import { ArrowLeft, Car } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onConfirmar: (placa: string) => void;
  onVoltar: () => void;
}

export function PerguntaPlaca({ onConfirmar, onVoltar }: Props) {
  const [placa, setPlaca] = useState("");

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-white text-gray-600 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Cadastro</p>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-50">
        <p className="text-[22px] font-bold text-gray-900 mb-2 leading-tight">
          Qual a Placa do Veículo?
        </p>
        <p className="text-[13px] text-gray-500 mb-6">Opcional — o LPR do clube já libera acesso por placa.</p>

        <input
          autoFocus
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          placeholder="ABC1D23"
          maxLength={7}
          className="w-full bg-white border-2 border-gray-200 px-5 py-4 rounded-xl text-[18px] font-semibold uppercase focus:outline-none focus:border-gray-900 text-gray-900"
        />

        {/* Chip de atalho — pula o campo com um único toque, sem digitar nada */}
        {!placa && (
          <button
            type="button"
            onClick={() => onConfirmar("")}
            className="mt-3 inline-flex items-center px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-[13px] font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Sem veículo
          </button>
        )}

        <button
          onClick={() => onConfirmar(placa)}
          className="w-full mt-6 py-4 rounded-xl font-bold text-[16px] text-white transition-opacity bg-gray-900 flex justify-center items-center gap-2"
        >
          <Car size={20} /> {placa ? "Confirmar" : "Continuar sem Placa"}
        </button>
      </div>
    </motion.div>
  );
}
