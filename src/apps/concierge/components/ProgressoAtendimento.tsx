interface Props {
  etapas: string[];
  atual: number; // 1-indexed — etapa atual do atendimento
}

// Indicador de progresso do atendimento — mostrado no topo de todo fluxo da
// portaria (cadastro novo ou usuário existente) pra o porteiro sempre saber
// em que pé está e quantos passos faltam. Barra fina + texto: mesma função
// de orientação do padrão anterior (círculos numerados + rótulo embaixo),
// mas numa fração da altura — o círculo grande consumia espaço vertical
// desproporcional ao valor informativo em telas curtas.
export function ProgressoAtendimento({ etapas, atual }: Props) {
  return (
    <div className="flex-shrink-0 bg-[var(--es-surface)] px-6 pt-3 pb-3 border-b border-[var(--es-border)]">
      <p className="text-[16px] font-semibold text-[var(--es-ink-3)] mb-1.5">
        Etapa {atual} de {etapas.length} — <span className="text-[var(--es-navy)]">{etapas[atual - 1]}</span>
      </p>
      <div className="flex gap-1.5">
        {etapas.map((etapa, i) => {
          const passo = i + 1;
          const concluido = passo < atual;
          const ativo = passo === atual;
          return (
            <div
              key={etapa}
              className={`flex-1 h-[5px] rounded-full ${
                concluido || ativo ? "bg-[var(--es-navy)]" : "bg-[var(--es-border)]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
