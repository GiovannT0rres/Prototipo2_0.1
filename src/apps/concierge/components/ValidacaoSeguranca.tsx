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

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <p className="font-bold text-gray-900 text-[15px]">Validação de Segurança</p>
      </div>

      <div className="p-6 bg-gray-50 flex items-center gap-4">
        <img src={dados.avatar} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
        <div>
          <p className="text-[12px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Pessoa Encontrada</p>
          <p className="text-[16px] font-bold text-gray-900">{dados.name}</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <p className="text-[18px] font-bold text-gray-900 mb-6">
          Qual o mês de nascimento?
        </p>

        <div className="space-y-3">
          {opcoes.map((opcao) => (
            <button
              key={opcao}
              onClick={() => setResposta(opcao)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-colors ${
                resposta === opcao
                  ? "border-gray-900 bg-gray-900 text-white font-semibold"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {opcao}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100">
        <button
          onClick={handleValidar}
          disabled={!resposta}
          className="w-full py-4 rounded-xl font-bold text-[16px] text-white transition-opacity disabled:opacity-40 bg-gray-900 flex justify-center items-center gap-2"
        >
          <UserCheck size={20} /> Confirmar Identidade
        </button>
      </div>
    </motion.div>
  );
}