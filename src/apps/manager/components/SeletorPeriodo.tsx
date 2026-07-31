import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

// "1 Dia" entra pensando em evento (ex.: convidado só tem acesso no dia da
// festa) — período fixo em semanas/meses não cobre esse caso mais comum.
const TERMINO_PRESETS = ["1 Dia", "1 Semana", "2 Semanas", "1 Mês", "2 Meses", "6 Meses"];

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
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold border-2 transition-colors ${
        selected ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-600"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface Props {
  onChange: (periodo: string) => void;
}

// Início (Hoje / data específica) + Término (presets, incluindo 1 dia, ou
// data específica) — mesma lógica já usada no Concierge, reaproveitada aqui
// pro Manager pra cobrir o caso de evento (acesso só naquele dia).
export function SeletorPeriodo({ onChange }: Props) {
  const [inicio, setInicio] = useState<"hoje" | "data">("hoje");
  const [inicioData, setInicioData] = useState("");
  const [termino, setTermino] = useState<string>(TERMINO_PRESETS[0]);
  const [terminoData, setTerminoData] = useState("");

  useEffect(() => {
    const de = inicio === "hoje" ? "Hoje" : inicioData || "data a definir";
    const ate = termino === "Escolher data" ? (terminoData || "data a definir") : termino;
    onChange(`${de} até ${ate}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inicio, inicioData, termino, terminoData]);

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
      <div>
        <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Inicia</p>
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
            className="mt-2.5 w-full bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-900"
          />
        )}
      </div>

      <div>
        <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Termina em</p>
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
            className="mt-2.5 w-full bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-900"
          />
        )}
      </div>
    </div>
  );
}
