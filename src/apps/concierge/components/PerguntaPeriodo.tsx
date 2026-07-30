import { useState } from "react";
import { ArrowLeft, CheckCircle2, Calendar } from "lucide-react";
import { motion } from "motion/react";

const TERMINO_PRESETS = ["1 Semana", "2 Semanas", "1 Mês", "2 Meses", "6 Meses"];

interface Props {
  dados: any;
  onConcluir: (novaAutorizacao?: any) => void;
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

export function PerguntaPeriodo({ dados, onConcluir, onVoltar }: Props) {
  const jaCadastrado = !!dados?.id;

  const [inicio, setInicio] = useState<"hoje" | "data">("hoje");
  const [inicioData, setInicioData] = useState("");
  const [termino, setTermino] = useState<string>(TERMINO_PRESETS[0]);
  const [terminoData, setTerminoData] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const periodoLabel = () => {
    const de = inicio === "hoje" ? "Hoje" : inicioData || "data a definir";
    const ate = termino === "Escolher data" ? (terminoData || "data a definir") : termino;
    return `${de} até ${ate}`;
  };

  const handleConfirmar = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      const novaAutorizacao = {
        id: `auth-${Date.now()}`,
        name: dados?.name,
        avatar: dados?.avatar,
        cpf: dados?.cpf,
        type: dados?.type,
        destino: dados?.destino,
        autorizador: dados?.autorizador,
        periodo: periodoLabel(),
        status: "Fora do clube",
        entrada: null,
      };

      setTimeout(() => onConcluir(novaAutorizacao), 2000);
    }, 1000);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center h-full bg-white p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-[#E9FBF0] text-[#30B855] flex items-center justify-center mb-5"
        >
          <CheckCircle2 size={44} strokeWidth={1.75} />
        </motion.div>
        <h2 className="text-[20px] font-semibold text-gray-900">Autorização criada</h2>
        <p className="text-[14px] text-gray-500 mt-1.5 max-w-xs leading-relaxed">
          {dados?.name || "Usuário"} está autorizado.
        </p>
        <p className="text-[12px] text-gray-400 mt-6">
          {jaCadastrado ? "Voltando ao perfil…" : "Voltando ao início…"}
        </p>
      </motion.div>
    );
  }

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
          onClick={handleConfirmar}
          disabled={isSubmitting}
          className="w-full mt-6 py-4 rounded-xl font-bold text-[16px] text-white transition-opacity disabled:opacity-60 bg-[#0F2744] flex justify-center items-center gap-2"
        >
          {isSubmitting ? "Processando..." : <><CheckCircle2 size={20} /> Salvar e Liberar</>}
        </button>
      </div>
    </motion.div>
  );
}
