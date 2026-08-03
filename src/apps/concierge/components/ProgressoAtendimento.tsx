import { Check } from "lucide-react";

interface Props {
  etapas: string[];
  atual: number; // 1-indexed — etapa atual do atendimento
}

// Indicador de progresso do atendimento — mostrado no topo de todo fluxo da
// portaria (cadastro novo ou usuário existente) pra o porteiro sempre saber
// em que pé está e quantos passos faltam.
export function ProgressoAtendimento({ etapas, atual }: Props) {
  return (
    <div className="flex-shrink-0 bg-[var(--es-surface)] px-6 pt-4 pb-3 border-b border-[var(--es-border)]">
      <div className="flex items-start">
        {etapas.map((etapa, i) => {
          const passo = i + 1;
          const concluido = passo < atual;
          const ativo = passo === atual;

          return (
            <div key={etapa} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 w-[88px] shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[19px] font-bold shrink-0 ${
                    concluido
                      ? "bg-[var(--es-success)] text-white"
                      : ativo
                        ? "bg-[var(--es-surface)] border-[3px] border-[var(--es-navy)] text-[var(--es-navy)]"
                        : "bg-[var(--es-bg)] text-[var(--es-ink-3)]"
                  }`}
                >
                  {concluido ? <Check size={20} strokeWidth={3} /> : passo}
                </div>
                <span
                  className={`text-[17px] font-semibold text-center leading-tight ${
                    concluido ? "text-[var(--es-success)]" : ativo ? "text-[var(--es-ink)]" : "text-[var(--es-ink-3)]"
                  }`}
                >
                  {etapa}
                </span>
              </div>

              {passo < etapas.length && (
                <div className={`flex-1 h-[3px] mt-[19px] ${concluido ? "bg-[var(--es-success)]" : "bg-[var(--es-border)]"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
