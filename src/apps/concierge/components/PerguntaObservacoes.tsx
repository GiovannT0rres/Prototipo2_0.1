import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  dados: any;
  onConcluir: (novaAutorizacao?: any) => void;
  onVoltar: () => void;
}

// Última pergunta da Autorização (CADASTRO → AUTORIZAÇÃO → LIBERAÇÃO — ver
// CLAUDE.md §4.1): Motivo, Destino, Autorizador e Período já foram
// preenchidos nas telas anteriores; aqui só falta um campo livre e opcional
// antes de finalizar e virar autorização de verdade.
export function PerguntaObservacoes({ dados, onConcluir, onVoltar }: Props) {
  const jaCadastrado = !!dados?.id;

  const [observacoes, setObservacoes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirmar = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      const novaAutorizacao = {
        id: `auth-${Date.now()}`,
        name: dados?.name,
        avatar: dados?.avatar,
        cpf: dados?.cpf,
        type: dados?.type,
        destino: dados?.destino,
        autorizador: dados?.autorizador,
        periodo: dados?.periodo,
        observacoes: observacoes || undefined,
        status: "Fora do clube",
        entrada: null,
      };

      setTimeout(() => onConcluir(novaAutorizacao), 2000);
    }, 1000);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center h-full bg-white p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-[#E9FBF0] text-[#0B7A3B] flex items-center justify-center mb-5"
        >
          <CheckCircle2 size={44} strokeWidth={1.75} />
        </motion.div>
        <h2 className="text-[23px] font-semibold text-gray-900">Autorização criada</h2>
        <p className="text-[19px] text-gray-600 mt-1.5 max-w-xs leading-relaxed">
          {dados?.name || "Usuário"} está autorizado.
        </p>
        <p className="text-[17px] text-gray-500 mt-6">
          {jaCadastrado ? "Voltando ao perfil…" : "Voltando ao início…"}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[17px]">Autorização</p>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <p className="text-[28px] text-gray-900 mb-2 leading-tight">
          Alguma <strong className="font-bold">OBSERVAÇÃO</strong>?
        </p>
        <p className="text-[17px] text-gray-600 mb-6">Opcional — fica registrado junto com a autorização.</p>

        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Ex: chega de carro, vai direto pro salão principal..."
          rows={4}
          enterKeyHint="done"
          className="w-full bg-white border-2 border-gray-300 px-4 py-4 rounded-xl text-[19px] font-medium focus:outline-none focus:ring-4 focus:ring-[#0F2744]/12 focus:border-[#0F2744] text-gray-900 resize-none"
        />
      </div>

      <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-100 bg-white">
        <button
          onClick={handleConfirmar}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold text-[21px] text-white transition-opacity disabled:opacity-60 bg-[#0F2744] flex justify-center items-center gap-2 min-h-[64px]"
        >
          {isSubmitting ? "Processando..." : <><CheckCircle2 size={22} strokeWidth={2.25} /> Salvar e Liberar</>}
        </button>
      </div>
    </motion.div>
  );
}
