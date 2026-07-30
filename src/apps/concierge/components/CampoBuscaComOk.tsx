import { Search, ChevronRight } from "lucide-react";

interface Props {
  value: string;
  onChange: (valor: string) => void;
  onConfirmar: () => void;
  placeholder: string;
  podeConfirmar: boolean;
  autoFocus?: boolean;
}

// Busca com seta ">" transparente embutida — estilo iPhone (Spotlight/Safari),
// sem caixa sólida separada. A seta só "desbloqueia" (fica azul e clicável)
// quando o texto digitado bate com uma das opções válidas — antes disso fica
// cinza-claro e não faz nada, pra não confirmar algo que não existe.
export function CampoBuscaComOk({ value, onChange, onConfirmar, placeholder, podeConfirmar, autoFocus }: Props) {
  return (
    <div className="flex items-center gap-1 bg-white border-2 border-gray-200 rounded-xl pr-1.5 focus-within:border-gray-900 transition-colors">
      <Search size={16} className="ml-4 text-gray-400 shrink-0" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && podeConfirmar) onConfirmar();
        }}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent px-3 py-4 text-[15px] font-medium text-gray-900 focus:outline-none"
      />
      <button
        type="button"
        onClick={onConfirmar}
        disabled={!podeConfirmar}
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[#0F2744] disabled:text-gray-300 transition-colors"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}
