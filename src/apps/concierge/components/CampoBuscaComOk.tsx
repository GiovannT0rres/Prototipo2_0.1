import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (valor: string) => void;
  onConfirmar: () => void;
  placeholder: string;
  podeConfirmar: boolean;
  autoFocus?: boolean;
}

// Campo de busca — a confirmação vive fora deste componente, num botão
// primário fixo no rodapé da tela (design.md §14.5: a ação de avançar precisa
// do peso visual e do alvo de toque de uma ação primária, não de um ícone
// pequeno embutido no campo). Este componente só filtra e devolve o texto.
export function CampoBuscaComOk({ value, onChange, onConfirmar, placeholder, podeConfirmar, autoFocus }: Props) {
  return (
    <div className="flex items-center bg-[var(--es-surface)] border-2 border-[var(--es-border-strong)] rounded-[14px] focus-within:border-[var(--es-navy)] focus-within:ring-4 focus-within:ring-[rgba(15,39,68,0.12)] transition-colors min-h-[58px]">
      <Search size={22} strokeWidth={2.25} className="ml-4 text-[var(--es-ink-3)] shrink-0" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && podeConfirmar) onConfirmar();
        }}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent px-3 py-4 text-[19px] font-medium text-[var(--es-ink)] focus:outline-none"
      />
    </div>
  );
}
