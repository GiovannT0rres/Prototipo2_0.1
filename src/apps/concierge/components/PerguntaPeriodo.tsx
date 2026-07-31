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
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
        selected ? "bg-[#0F2744] text-white" : "bg-white text-gray-600 border border-gray-200"
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
        <button onClick={onVoltar} className="p-2 rounded-xl bg-white text-gray-600 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Autorização</p>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-50">
        <p className="text-[22px] text-gray-900 mb-6 leading-tight">
          Qual o <strong className="font-bold">PERÍODO</strong>?
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
          <div>
            <p className="text-[14px] font-bold text-gray-900 mb-2.5">Inicia</p>
            <div className="flex flex-wrap gap-2">
              <Chip label="Hoje" selected={inicio === "hoje"} onClick={() => setInicio("hoje")} />
              <Chip
                label="Escolher data"
                icon={<Calendar size={13} />}
                selected={inicio === "data"}
                onClick={() => setInicio("data")}
              />
            </div>
            {inicio === "data" && (
              <input
                type="date"
                value={inicioData}
                onChange={(e) => setInicioData(e.target.value)}
                className="mt-2.5 w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-[14px] font-medium text-gray-900"
              />
            )}
          </div>

          <div>
            <p className="text-[14px] font-bold text-gray-900 mb-2.5">Termina em</p>
            <div className="flex flex-wrap gap-2">
              {TERMINO_PRESETS.map((preset) => (
                <Chip key={preset} label={preset} selected={termino === preset} onClick={() => setTermino(preset)} />
              ))}
              <Chip
                label="Escolher data"
                icon={<Calendar size={13} />}
                selected={termino === "Escolher data"}
                onClick={() => setTermino("Escolher data")}
              />
            </div>
            {termino === "Escolher data" && (
              <input
                type="date"
                value={terminoData}
                onChange={(e) => setTerminoData(e.target.value)}
                className="mt-2.5 w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-[14px] font-medium text-gray-900"
              />
            )}
          </div>
        </div>

        <button
          onClick={() => onConfirmar(periodoLabel())}
          className="w-full mt-6 py-4 rounded-xl font-bold text-[16px] text-white bg-[#0F2744] flex justify-center items-center gap-2"
        >
          Continuar <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
