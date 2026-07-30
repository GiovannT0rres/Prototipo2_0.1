import { useState, useMemo } from "react";
import { ArrowLeft, Database, ShieldAlert, Lightbulb, ChevronRight } from "lucide-react";
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
        <button onClick={handleVoltar} className="p-2 rounded-xl bg-white text-gray-600 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Validação de Segurança</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={etapa} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-[14px] font-bold text-[#0F2744] uppercase tracking-wider mb-2">
              Pergunta {etapa} de 2
            </p>
            <p className="text-[22px] text-gray-900 mb-6 leading-tight">
              {etapa === 1 ? (
                <>Qual é o <strong className="font-bold">NOME COMPLETO</strong> da pessoa?</>
              ) : (
                <>Qual é o <strong className="font-bold">ANO DE NASCIMENTO</strong> da pessoa?</>
              )}
            </p>

            <div className="space-y-3">
              {opcoesAtuais.map((opcao) => {
                const isCorreta = opcao === respostaCorreta;

                return (
                  <button
                    key={opcao}
                    onClick={() => handleResposta(opcao)}
                    className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold hover:border-gray-300 transition-colors flex items-center justify-between"
                  >
                    <span>{opcao}</span>

                    <span className="flex items-center gap-2">
                      {/* DICA DE PROTÓTIPO: Marca a correta visualmente */}
                      {isCorreta && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-md flex items-center gap-1 font-bold uppercase tracking-wider">
                          <Lightbulb size={12} /> Correta
                        </span>
                      )}
                      <ChevronRight size={18} className="text-gray-300" />
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <button
          onClick={() => handleResposta(NENHUMA_OPCAO)}
          className="w-full py-4 rounded-xl font-bold text-[16px] text-white transition-opacity bg-[#0F2744] flex justify-center items-center gap-2"
        >
          <ShieldAlert size={20} /> Nenhuma das Alternativas
        </button>
      </div>
    </motion.div>
  );
}