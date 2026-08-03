import { useState } from "react";
import { ArrowLeft, UserCheck } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  dados: any;
  onSucesso: () => void;
  onVoltar: () => void;
}

export function ValidacaoSeguranca({ dados, onSucesso, onVoltar }: Props) {
  const [resposta, setResposta] = useState<string | null>(null);

  // Mock de perguntas. Em produção, isso viria da API.
  const opcoes = ["Janeiro", "Março", "Agosto", "Nenhuma das opções"];

  const handleValidar = () => {
    // Simulação: qualquer resposta avança no protótipo
    if (resposta) onSucesso();
  };

  // Nota: componente órfão — sem rota/import apontando para ele (substituído
  // por ValidacaoNovoUser.tsx no fluxo real). Ver CLAUDE.md §6, candidato a
  // remoção numa próxima rodada. Mantido só com o token pass de tipografia/
  // cor deste redesign, sem reestruturar a lógica.
  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full min-h-0 bg-[var(--es-surface)]">
      <div className="flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] flex items-center gap-3">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-[50px] h-[50px] flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors"
        >
          <ArrowLeft size={22} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-[var(--es-ink)] text-[16px]">Validação de Segurança</p>
      </div>

      <div className="p-6 bg-[var(--es-bg)] flex items-center gap-4">
        <img src={dados.avatar} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-[var(--es-surface)] shadow-sm" />
        <div>
          <p className="text-[16px] font-semibold text-[var(--es-navy)] uppercase tracking-wider mb-0.5">Pessoa Encontrada</p>
          <p className="text-[17px] font-bold text-[var(--es-ink)]">{dados.name}</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 p-6 overflow-y-auto">
        <p className="text-[25px] font-semibold text-[var(--es-ink)] mb-6 leading-tight">
          Qual o mês de nascimento?
        </p>

        <div className="space-y-3">
          {opcoes.map((opcao) => (
            <button
              key={opcao}
              onClick={() => setResposta(opcao)}
              className={`w-full text-left px-5 min-h-[64px] rounded-[14px] border-2 transition-all active:scale-[0.99] text-[19px] ${
                resposta === opcao
                  ? "border-[var(--es-navy)] bg-[var(--es-navy-soft)] text-[var(--es-navy)] font-semibold"
                  : "border-[var(--es-border)] bg-[var(--es-surface)] text-[var(--es-ink)] hover:border-[var(--es-border-strong)]"
              }`}
            >
              {opcao}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 pt-8 border-t border-[var(--es-border)]">
        <button
          onClick={handleValidar}
          disabled={!resposta}
          className="w-full px-6 py-4 rounded-[14px] font-semibold text-[19px] text-white transition-all active:scale-[0.98] disabled:opacity-45 bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] flex justify-center items-center gap-2.5 min-h-[58px]"
        >
          <UserCheck size={25} strokeWidth={2.25} /> Confirmar Identidade
        </button>
      </div>
    </motion.div>
  );
}