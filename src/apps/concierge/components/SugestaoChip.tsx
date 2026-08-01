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
      className="flex items-center gap-2.5 px-4 py-3 min-h-[48px] rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors text-left"
    >
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          tone === "marca" ? "bg-[#0F2744]/10 text-[#0F2744]" : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </span>
      <span className="text-[17px] font-semibold text-gray-800">{label}</span>
    </button>
  );
}
