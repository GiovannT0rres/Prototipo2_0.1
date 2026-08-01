import { useState } from "react";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const TERMINO_PRESETS = ["1 Semana", "2 Semanas", "1 Mês", "2 Meses", "6 Meses"];

interface Props {
  onConfirmar: (periodo: string) => void;
  onVoltar: () => void;
}

// Chip minimalista estilo iOS — cheio e azul quando selecionado, plano
// (sem borda pesada) quando não.
function Chip({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-3 min-h-[48px] rounded-full text-[17px] font-semibold transition-colors ${
        selected ? "bg-[#0F2744] text-white" : "bg-white text-gray-700 border-2 border-gray-300"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function PerguntaPeriodo({ onConfirmar, onVoltar }: Props) {
  const [inicio, setInicio] = useState<"hoje" | "data">("hoje");
  const [inicioData, setInicioData] = useState("");
  const [termino, setTermino] = useState<string>(TERMINO_PRESETS[0]);
  const [terminoData, setTerminoData] = useState("");

  const periodoLabel = () => {
    const de = inicio === "hoje" ? "Hoje" : inicioData || "data a definir";
    const ate = termino === "Escolher data" ? (terminoData || "data a definir") : termino;
    return `${de} até ${ate}`;
  };

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

      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <p className="text-[28px] text-gray-900 mb-6 leading-tight">
          Qual o <strong className="font-bold">PERÍODO</strong>?
        </p>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 space-y-5">
          <div>
            <p className="text-[19px] font-bold text-gray-900 mb-3">Inicia</p>
            <div className="flex flex-wrap gap-2.5">
              <Chip label="Hoje" selected={inicio === "hoje"} onClick={() => setInicio("hoje")} />
              <Chip
                label="Escolher data"
                icon={<Calendar size={16} strokeWidth={2.25} />}
                selected={inicio === "data"}
                onClick={() => setInicio("data")}
              />
            </div>
            {inicio === "data" && (
              <input
                type="date"
                value={inicioData}
                onChange={(e) => setInicioData(e.target.value)}
                className="mt-3 w-full bg-gray-50 border-2 border-gray-300 px-4 py-3 rounded-xl text-[17px] font-medium text-gray-900 min-h-[56px]"
              />
            )}
          </div>

          <div>
            <p className="text-[19px] font-bold text-gray-900 mb-3">Termina em</p>
            <div className="flex flex-wrap gap-2.5">
              {TERMINO_PRESETS.map((preset) => (
                <Chip key={preset} label={preset} selected={termino === preset} onClick={() => setTermino(preset)} />
              ))}
              <Chip
                label="Escolher data"
                icon={<Calendar size={16} strokeWidth={2.25} />}
                selected={termino === "Escolher data"}
                onClick={() => setTermino("Escolher data")}
              />
            </div>
            {termino === "Escolher data" && (
              <input
                type="date"
                value={terminoData}
                onChange={(e) => setTerminoData(e.target.value)}
                className="mt-3 w-full bg-gray-50 border-2 border-gray-300 px-4 py-3 rounded-xl text-[17px] font-medium text-gray-900 min-h-[56px]"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-100 bg-white">
        <button
          onClick={() => onConfirmar(periodoLabel())}
          className="w-full py-4 rounded-xl font-bold text-[21px] text-white bg-[#0F2744] flex justify-center items-center gap-2 min-h-[64px]"
        >
          Continuar <ChevronRight size={22} strokeWidth={2.25} />
        </button>
      </div>
    </motion.div>
  );
}
