import type { ReactNode } from "react";

interface Props {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  tone?: "marca" | "neutro";
}

// Moeda de sugestão com ícone — usada nos campos de busca (Destino,
// Autorizador, Empresa). Um toque preenche o campo e já avança. Tom "neutro"
// é pra opções de atalho/pular (ex.: "Autônomo"), não pra dados reais.
export function SugestaoChip({ label, icon, onClick, tone = "marca" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 min-h-[56px] rounded-[14px] border-2 border-[var(--es-border)] bg-[var(--es-surface)] hover:border-[var(--es-border-strong)] active:scale-[0.98] transition-all text-left"
    >
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          tone === "marca" ? "bg-[var(--es-navy-soft)] text-[var(--es-navy)]" : "bg-[var(--es-bg)] text-[var(--es-ink-2)]"
        }`}
      >
        {icon}
      </span>
      <span className="text-[17px] font-semibold text-[var(--es-ink)]">{label}</span>
    </button>
  );
}
