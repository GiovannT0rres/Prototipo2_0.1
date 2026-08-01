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
      toast.error("Resposta incorreta. Processo de segurança cancelado.");
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
    toast.error("Processo de segurança cancelado.");
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
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <button
          onClick={handleVoltar}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[17px]">Validação de Segurança</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={etapa} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-[17px] font-bold text-[#0F2744] uppercase tracking-wider mb-2">
              Pergunta {etapa} de 2
            </p>
            <p className="text-[28px] text-gray-900 mb-6 leading-tight">
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
                  className="w-full text-left px-5 py-5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold hover:border-gray-300 transition-colors flex items-center justify-between min-h-[72px]"
                >
                  <span className="text-[19px]">{opcao}</span>
                  <ChevronRight size={24} strokeWidth={2.25} className="text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white space-y-3">
        <button
          type="button"
          onClick={() => setConfirmarCancelamento(true)}
          className="w-full py-3 text-center text-[17px] font-semibold text-gray-500 hover:text-gray-700 transition-colors flex justify-center items-center gap-2"
        >
          <ShieldAlert size={18} strokeWidth={2.25} /> Nenhuma das alternativas
        </button>
      </div>

      {confirmarCancelamento && (
        <div
          onClick={() => setConfirmarCancelamento(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-blur-in"
        >
          <div
            className="bg-white w-full max-w-sm rounded-t-[28px] overflow-hidden shadow-2xl flex flex-col animate-spring-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-5" />
            <div className="px-6 pb-4 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={26} strokeWidth={1.75} />
              </div>
              <h3 className="text-[23px] font-bold text-gray-900 mb-2">Cancelar atendimento?</h3>
              <p className="text-[17px] text-gray-500 leading-relaxed mb-6">
                Nenhum dos nomes confere com a pessoa? Isso encerra o cadastro e volta ao início.
              </p>
              <div className="w-full space-y-2.5">
                <button
                  onClick={confirmarCancelamentoFn}
                  className="w-full bg-red-500 text-white font-semibold text-[19px] py-4 rounded-2xl ios-press shadow-sm min-h-[56px]"
                >
                  Sim, cancelar
                </button>
                <button
                  onClick={() => setConfirmarCancelamento(false)}
                  className="w-full bg-[#f2f2f7] text-gray-600 font-semibold text-[19px] py-4 rounded-2xl ios-press min-h-[56px]"
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