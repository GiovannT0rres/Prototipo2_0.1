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
          className="w-20 h-20 rounded-full bg-[#E9FBF0] text-[#30B855] flex items-center justify-center mb-5"
        >
          <CheckCircle2 size={44} strokeWidth={1.75} />
        </motion.div>
        <h2 className="text-[20px] font-semibold text-gray-900">Autorização criada</h2>
        <p className="text-[14px] text-gray-500 mt-1.5 max-w-xs leading-relaxed">
          {dados?.name || "Usuário"} está autorizado.
        </p>
        <p className="text-[12px] text-gray-400 mt-6">
          {jaCadastrado ? "Voltando ao perfil…" : "Voltando ao início…"}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-white text-gray-600 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Autorização</p>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-50">
        <p className="text-[22px] text-gray-900 mb-2 leading-tight">
          Alguma <strong className="font-bold">OBSERVAÇÃO</strong>?
        </p>
        <p className="text-[13px] text-gray-500 mb-6">Opcional — fica registrado junto com a autorização.</p>

        <textarea
          autoFocus
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Ex: chega de carro, vai direto pro salão principal..."
          rows={4}
          className="w-full bg-white border-2 border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:border-[#0F2744] text-gray-900 resize-none"
        />

        <button
          onClick={handleConfirmar}
          disabled={isSubmitting}
          className="w-full mt-6 py-4 rounded-xl font-bold text-[16px] text-white transition-opacity disabled:opacity-60 bg-[#0F2744] flex justify-center items-center gap-2"
        >
          {isSubmitting ? "Processando..." : <><CheckCircle2 size={20} /> Salvar e Liberar</>}
        </button>
      </div>
    </motion.div>
  );
}
