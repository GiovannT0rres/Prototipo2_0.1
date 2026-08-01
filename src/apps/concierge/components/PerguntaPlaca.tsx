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
        <p className="text-[28px] text-gray-900 mb-2 leading-tight">
          Qual a <strong className="font-bold">PLACA</strong> do veículo?
        </p>
        <p className="text-[17px] text-gray-600 mb-6">Opcional — o LPR do clube já libera acesso por placa.</p>

        <input
          autoFocus
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          placeholder="ABC1D23"
          maxLength={7}
          className="w-full bg-white border-2 border-gray-300 px-5 py-4 rounded-xl text-[21px] font-semibold uppercase tracking-wide focus:outline-none focus:ring-4 focus:ring-[#0F2744]/12 focus:border-[#0F2744] text-gray-900 min-h-[64px]"
        />

        {/* Único caminho de escape — o botão primário permanece sempre
            "Confirmar" para não duplicar a mesma saída de duas formas. */}
        {!placa && (
          <button
            type="button"
            onClick={() => onConfirmar("")}
            className="mt-3 inline-flex items-center min-h-[44px] px-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-[15px] font-bold text-gray-700 hover:bg-gray-200 transition-colors self-start"
          >
            Sem veículo
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => onConfirmar(placa)}
          disabled={!placa}
          className="w-full mt-6 py-4 rounded-xl font-bold text-[21px] text-white transition-opacity disabled:opacity-45 bg-[#0F2744] flex justify-center items-center gap-2 min-h-[64px]"
        >
          <Car size={22} strokeWidth={2.25} /> Confirmar
        </button>
      </div>
    </motion.div>
  );
}
