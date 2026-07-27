import { useState, useMemo } from "react";
import { ArrowLeft, Database, ShieldAlert, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Props {
  dadosBigData: any;
  onSucesso: () => void;
  onFalha: () => void;
  onVoltar: () => void;
}

const NOMES_FALSOS = ["Marcos Silva Pinto", "Roberto Nunes Alves", "Julio Cesar Rocha"];
const ANOS_FALSOS = ["1982", "1988", "1991"];
const NENHUMA_OPCAO = "Nenhuma das alternativas";

export function ValidacaoNovoUser({ dadosBigData, onSucesso, onFalha, onVoltar }: Props) {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [resposta, setResposta] = useState<string | null>(null);
  
  // Mistura as opções para a pergunta 1 (Nome), mantendo "Nenhuma" no final
  const opcoesNome = useMemo(() => {
    const misturadas = [...NOMES_FALSOS, dadosBigData.name].sort(() => Math.random() - 0.5);
    return [...misturadas, NENHUMA_OPCAO];
  }, [dadosBigData]);

  // Mistura as opções para a pergunta 2 (Ano), mantendo "Nenhuma" no final
  const opcoesAno = useMemo(() => {
    const misturadas = [...ANOS_FALSOS, dadosBigData.birthYear].sort(() => Math.random() - 0.5);
    return [...misturadas, NENHUMA_OPCAO];
  }, [dadosBigData]);

  const opcoesAtuais = etapa === 1 ? opcoesNome : opcoesAno;
  const respostaCorreta = etapa === 1 ? dadosBigData.name : dadosBigData.birthYear;

  const handleVerificar = () => {
    if (resposta !== respostaCorreta) {
      toast.error("Resposta incorreta. Processo de segurança cancelado.");
      onFalha();
      return;
    }

    if (etapa === 1) {
      setEtapa(2);
      setResposta(null);
    } else {
      toast.success("Identidade confirmada!");
      onSucesso();
    }
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-white text-gray-600 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Validação de Segurança</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={etapa} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-[14px] font-bold text-blue-600 uppercase tracking-wider mb-2">
              Pergunta {etapa} de 2
            </p>
            <p className="text-[22px] font-bold text-gray-900 mb-6 leading-tight">
              {etapa === 1 ? "Qual é o NOME COMPLETO do motorista?" : "Qual é o ANO DE NASCIMENTO do motorista?"}
            </p>

            <div className="space-y-3">
              {opcoesAtuais.map((opcao) => {
                const isCorreta = opcao === respostaCorreta;
                
                return (
                  <button
                    key={opcao}
                    onClick={() => setResposta(opcao)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-colors flex items-center justify-between ${
                      resposta === opcao
                        ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                        : "border-gray-200 bg-white text-gray-700 font-semibold hover:border-gray-300"
                    }`}
                  >
                    <span>{opcao}</span>
                    
                    {/* DICA DE PROTÓTIPO: Marca a correta visualmente */}
                    {isCorreta && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-md flex items-center gap-1 font-bold uppercase tracking-wider">
                        <Lightbulb size={12} /> Correta
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <button
          onClick={handleVerificar}
          disabled={!resposta}
          className="w-full py-4 rounded-xl font-bold text-[16px] text-white transition-opacity disabled:opacity-40 bg-gray-900 flex justify-center items-center gap-2"
        >
          <ShieldAlert size={20} /> Validar Resposta
        </button>
      </div>
    </motion.div>
  );
}