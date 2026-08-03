import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { hojeSemHora, mesmoDia } from "../utils/dateLabel";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface Props {
  value: Date | null;
  onChange: (data: Date) => void;
  minDate?: Date;
}

// Calendário próprio — o <input type="date"> nativo abre um seletor denso
// com alvos minúsculos que varia por navegador (design.md §14.6, proibido
// para este app). Grade de dias em cartões de 44px, mês por vez, sem
// dependência de teclado ou digitação.
export function CalendarioSimples({ value, onChange, minDate }: Props) {
  // Abre no mês de "value" se já houver seleção; senão no mês do limite
  // mínimo (ex.: término de um evento que começa em setembro deve abrir
  // em setembro, não no mês atual — do contrário o mês inicial pode vir
  // 100% desabilitado e obrigar a navegar "às cegas" pra sair dele).
  const inicial = value ?? minDate ?? hojeSemHora();
  const [mesVisivel, setMesVisivel] = useState(() => new Date(inicial.getFullYear(), inicial.getMonth(), 1));

  const primeiroDiaSemana = mesVisivel.getDay();
  const diasNoMes = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + 1, 0).getDate();
  const celulas: (Date | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from({ length: diasNoMes }, (_, i) => new Date(mesVisivel.getFullYear(), mesVisivel.getMonth(), i + 1)),
  ];

  const limite = minDate ?? hojeSemHora();
  const mesAnteriorDesabilitado =
    mesVisivel.getFullYear() === limite.getFullYear() && mesVisivel.getMonth() === limite.getMonth();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          aria-label="Mês anterior"
          disabled={mesAnteriorDesabilitado}
          onClick={() => setMesVisivel((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          className="w-11 h-11 flex items-center justify-center rounded-[12px] border-2 border-[var(--es-border)] text-[var(--es-ink-2)] disabled:opacity-30 active:scale-[0.96] transition-all shrink-0"
        >
          <ChevronLeft size={22} strokeWidth={2.25} />
        </button>
        <p className="text-[19px] font-semibold text-[var(--es-ink)]">
          {MESES[mesVisivel.getMonth()]} {mesVisivel.getFullYear()}
        </p>
        <button
          type="button"
          aria-label="Próximo mês"
          onClick={() => setMesVisivel((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="w-11 h-11 flex items-center justify-center rounded-[12px] border-2 border-[var(--es-border)] text-[var(--es-ink-2)] active:scale-[0.96] transition-all shrink-0"
        >
          <ChevronRight size={22} strokeWidth={2.25} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {DIAS_SEMANA.map((d, i) => (
          <div key={i} className="h-8 flex items-center justify-center text-[13px] font-semibold text-[var(--es-ink-3)] uppercase">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {celulas.map((data, i) => {
          if (!data) return <div key={`vazio-${i}`} />;
          const desabilitado = data < limite;
          const selecionado = value && mesmoDia(data, value);
          const hoje = mesmoDia(data, hojeSemHora());
          return (
            <button
              key={data.toISOString()}
              type="button"
              disabled={desabilitado}
              onClick={() => onChange(data)}
              className={`aspect-square min-h-[44px] rounded-[12px] text-[17px] font-semibold transition-all active:scale-[0.95] flex items-center justify-center ${
                selecionado
                  ? "bg-[var(--es-navy)] text-white"
                  : desabilitado
                    ? "text-[var(--es-ink-3)] opacity-35 cursor-not-allowed"
                    : hoje
                      ? "border-2 border-[var(--es-navy)] text-[var(--es-navy)]"
                      : "text-[var(--es-ink)] hover:bg-[var(--es-navy-soft)]"
              }`}
            >
              {data.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
