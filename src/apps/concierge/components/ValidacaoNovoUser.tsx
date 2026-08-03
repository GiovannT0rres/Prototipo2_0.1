import { useState, useMemo } from "react";
import { ArrowLeft, ShieldAlert, ChevronRight, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Props {
  dadosBigData: any;
  etapaInicial?: 1 | 2;
  onSucesso: () => void;
  onFalha: () => void;
  onVoltar: () => void;
}

const NOMES_FALSOS = ["Marcos Silva Pinto", "Roberto Nunes Alves"];
const ANOS_FALSOS = ["1982", "1988"];
const NENHUMA_OPCAO = "Nenhuma das alternativas";

export function ValidacaoNovoUser({ dadosBigData, etapaInicial = 1, onSucesso, onFalha, onVoltar }: Props) {
  const [etapa, setEtapa] = useState<1 | 2>(etapaInicial);
  // "Nenhuma das Alternativas" encerra o atendimento — irreversível, então
  // pede confirmação antes de cancelar (design.md §14.2: essa ação não pode
  // ter o mesmo peso visual nem o mesmo custo de toque que uma resposta normal).
  const [confirmarCancelamento, setConfirmarCancelamento] = useState(false);

  // Mistura as opções para a pergunta 1 (Nome) — 2 falsas + a real, sem "Nenhuma" na lista
  const opcoesNome = useMemo(() => {
    return [...NOMES_FALSOS, dadosBigData.name].sort(() => Math.random() - 0.5);
  }, [dadosBigData]);

  // Mistura as opções para a pergunta 2 (Ano) — 2 falsas + a real, sem "Nenhuma" na lista
  const opcoesAno = useMemo(() => {
    return [...ANOS_FALSOS, dadosBigData.birthYear].sort(() => Math.random() - 0.5);
  }, [dadosBigData]);

  const opcoesAtuais = etapa === 1 ? opcoesNome : opcoesAno;
  const respostaCorreta = etapa === 1 ? dadosBigData.name : dadosBigData.birthYear;

  // Cada opção (inclusive o botão "Nenhuma das alternativas" no rodapé) já
  // valida e avança sozinha — um único clique por pergunta, sem passo de confirmação.
  const handleResposta = (resposta: string) => {
    if (resposta !== respostaCorreta) {
      toast.error("Resposta incorreta. Processo de segurança cancelado.", { duration: 8000 });
      onFalha();
      return;
    }

    if (etapa === 1) {
      setEtapa(2);
    } else {
      toast.success("Identidade confirmada!");
      onSucesso();
    }
  };

  const confirmarCancelamentoFn = () => {
    setConfirmarCancelamento(false);
    toast.error("Processo de segurança cancelado.", { duration: 8000 });
    onFalha();
  };

  // Voltar sempre volta pra pergunta anterior — na etapa 2 (Ano), isso é a
  // etapa 1 (Nome); só na etapa 1 é que "voltar" sai do fluxo de verdade.
  const handleVoltar = () => {
    if (etapa === 2) {
      setEtapa(1);
    } else {
      onVoltar();
    }
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full min-h-0 bg-[var(--es-surface)]">
      <div className="flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] flex items-center gap-3 bg-[var(--es-surface)]">
        <button
          onClick={handleVoltar}
          aria-label="Voltar"
          className="w-[50px] h-[50px] flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors shrink-0"
        >
          <ArrowLeft size={22} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-[var(--es-ink)] text-[16px]">Cadastro</p>
      </div>

      <div className="flex-1 min-h-0 p-6 overflow-y-auto bg-[var(--es-bg)] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={etapa} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-[16px] font-semibold text-[var(--es-navy)] uppercase tracking-wider mb-2">
              Pergunta {etapa} de 2
            </p>
            <p className="text-[25px] font-semibold text-[var(--es-ink)] mb-6 leading-tight tracking-[-0.01em]">
              {etapa === 1 ? (
                <>Qual é o <strong className="font-bold">NOME COMPLETO</strong> da pessoa?</>
              ) : (
                <>Qual é o <strong className="font-bold">ANO DE NASCIMENTO</strong> da pessoa?</>
              )}
            </p>

            <div className="space-y-3">
              {opcoesAtuais.map((opcao) => (
                <button
                  key={opcao}
                  onClick={() => handleResposta(opcao)}
                  className="w-full text-left px-5 py-5 rounded-[14px] border-2 border-[var(--es-border)] bg-[var(--es-surface)] text-[var(--es-ink)] font-semibold hover:border-[var(--es-navy)] hover:bg-[var(--es-navy-soft)] active:scale-[0.99] transition-all flex items-center gap-3 min-h-[72px]"
                >
                  {/* min-w-0 + flex-1: o nome precisa da largura toda pra si
                      pra quebrar linha normalmente — antes o badge de dica
                      ficava na mesma linha (shrink-0) e forçava o nome a
                      quebrar ao redor dele, resultado esquisito em telas
                      estreitas (S24 FE, 360px). Badge agora numa linha
                      própria abaixo do nome. */}
                  <span className="min-w-0 flex-1">
                    <span className="text-[19px] block break-words">{opcao}</span>
                    {/* Dica de protótipo — resposta certa não é conhecida por quem testa o fluxo sem acesso ao mock da BigDataCorp. Remover antes de produção. */}
                    {opcao === respostaCorreta && (
                      <span className="mt-1.5 inline-block text-[16px] font-bold uppercase tracking-wide text-[var(--es-success)] bg-[var(--es-success-soft)] px-2.5 py-1 rounded-full">
                        dica: correta
                      </span>
                    )}
                  </span>
                  <ChevronRight size={22} strokeWidth={2.25} className="text-[var(--es-ink-3)] shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* "Nenhuma das alternativas" é terciário — texto simples, sem fundo,
          separado por divisória (design.md §14.2: é a saída de exceção que
          cancela o atendimento, não pode ter peso visual de ação primária). */}
      <div className="p-6 pt-4 border-t border-[var(--es-border)] bg-[var(--es-surface)]">
        <button
          type="button"
          onClick={() => setConfirmarCancelamento(true)}
          className="w-full min-h-[50px] py-3 text-center text-[16px] font-semibold text-[var(--es-ink-2)] hover:text-[var(--es-ink)] transition-colors flex justify-center items-center gap-2"
        >
          <ShieldAlert size={20} strokeWidth={2.25} /> Nenhuma das alternativas
        </button>
      </div>

      {confirmarCancelamento && (
        <div
          onClick={() => setConfirmarCancelamento(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-blur-in"
        >
          <div
            className="bg-[var(--es-surface)] w-full max-w-sm rounded-t-[28px] overflow-hidden shadow-2xl flex flex-col animate-spring-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[var(--es-border-strong)] rounded-full mx-auto mt-3 mb-5" />
            <div className="px-6 pb-4 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[var(--es-danger-soft)] rounded-full flex items-center justify-center text-[var(--es-danger)] mb-4">
                <AlertTriangle size={29} strokeWidth={2.25} />
              </div>
              <h3 className="text-[25px] font-bold text-[var(--es-ink)] mb-2">Cancelar atendimento?</h3>
              <p className="text-[17px] text-[var(--es-ink-2)] leading-relaxed mb-6">
                Nenhum dos nomes confere com a pessoa? Isso encerra o cadastro e volta ao início.
              </p>
              <div className="w-full space-y-2.5">
                <button
                  onClick={confirmarCancelamentoFn}
                  className="w-full px-6 bg-[var(--es-danger)] text-white font-semibold text-[19px] py-4 rounded-[14px] active:scale-[0.98] transition-all shadow-sm min-h-[58px]"
                >
                  Sim, cancelar
                </button>
                <button
                  onClick={() => setConfirmarCancelamento(false)}
                  className="w-full px-6 bg-[var(--es-bg)] text-[var(--es-ink-2)] font-semibold text-[19px] py-4 rounded-[14px] active:scale-[0.98] transition-all min-h-[58px]"
                >
                  Voltar às opções
                </button>
              </div>
            </div>
            <div className="h-5" />
          </div>
        </div>
      )}
    </motion.div>
  );
}