import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

// "1 Dia" entra pensando em evento (ex.: convidado só tem acesso no dia da
// festa) — período fixo em semanas/meses não cobre esse caso mais comum.
const TERMINO_PRESETS: { label: string; dias: number }[] = [
  { label: "1 Dia", dias: 1 },
  { label: "1 Semana", dias: 7 },
  { label: "2 Semanas", dias: 14 },
  { label: "1 Mês", dias: 30 },
  { label: "2 Meses", dias: 60 },
  { label: "6 Meses", dias: 180 },
];

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

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

export interface Periodo {
  inicio: string; // ISO datetime
  fim: string; // ISO datetime
}

interface Props {
  onChange: (periodo: Periodo) => void;
}

// Início (Hoje / data específica) + Término (presets, incluindo 1 dia, ou
// data específica) — mesma lógica já usada no Concierge, reaproveitada aqui
// pro Manager pra cobrir o caso de evento (acesso só naquele dia). Emite
// datas ISO reais (não mais um texto formatado) — é o que permite calcular
// status vigente/futura/expirada na lista de Autorizações.
export function SeletorPeriodo({ onChange }: Props) {
  const [inicio, setInicio] = useState<"hoje" | "data">("hoje");
  const [inicioData, setInicioData] = useState(hojeISO());
  const [terminoLabel, setTerminoLabel] = useState<string>(TERMINO_PRESETS[0].label);
  const [terminoData, setTerminoData] = useState("");

  useEffect(() => {
    const dataInicio = inicio === "hoje" ? hojeISO() : inicioData;
    const preset = TERMINO_PRESETS.find((p) => p.label === terminoLabel);

    let dataFim: string;
    if (preset) {
      const base = new Date(`${dataInicio}T00:00`);
      base.setDate(base.getDate() + preset.dias);
      dataFim = base.toISOString().slice(0, 10);
    } else {
      dataFim = terminoData || dataInicio;
    }

    onChange({ inicio: `${dataInicio}T00:00`, fim: `${dataFim}T23:59` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inicio, inicioData, terminoLabel, terminoData]);

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
            <Chip key={preset.label} label={preset.label} selected={terminoLabel === preset.label} onClick={() => setTerminoLabel(preset.label)} />
          ))}
          <Chip
            label="Escolher data"
            icon={<Calendar size={13} />}
            selected={terminoLabel === "Escolher data"}
            onClick={() => setTerminoLabel("Escolher data")}
          />
        </div>
        {terminoLabel === "Escolher data" && (
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

export function formatarPeriodo(inicio: string | null, fim: string | null): string {
  if (!inicio || !fim) return "Sem prazo definido";
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  const de = new Date(inicio).toLocaleDateString("pt-BR", opts);
  const ate = new Date(fim).toLocaleDateString("pt-BR", opts);
  return `${de} – ${ate}`;
}
