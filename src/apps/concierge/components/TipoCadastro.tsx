import { ArrowLeft, Ticket, Briefcase } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onSelecionar: (tipo: 'visitante' | 'prestador') => void;
  onVoltar: () => void;
}

export function TipoCadastro({ onSelecionar, onVoltar }: Props) {
  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col bg-gray-50 h-full">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <p className="font-bold text-gray-900 text-[15px]">Novo Cadastro no Clube</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center">
        <div className="text-center mb-6 max-w-sm">
          <h2 className="text-[22px] font-bold text-gray-900">Pessoa não encontrada</h2>
          <p className="text-[14px] text-gray-500 mt-2">
            Este CPF não possui registro. Selecione a categoria para iniciar o cadastro.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {/* Opção 1: Visitante (convidado de sócio, jogador em reciprocidade, etc.) */}
          <button
            onClick={() => onSelecionar('visitante')}
            className="w-full p-5 border-2 border-gray-200 bg-white rounded-2xl flex items-center gap-4 hover:border-blue-600 hover:bg-blue-50 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Ticket size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-gray-900">Visitante</p>
              <p className="text-[12px] text-gray-500 mt-0.5">Convidado de um sócio ou visitante em reciprocidade.</p>
            </div>
          </button>

          {/* Opção 2: Prestador de Serviço (particular ou do próprio clube) */}
          <button
            onClick={() => onSelecionar('prestador')}
            className="w-full p-5 border-2 border-gray-200 bg-white rounded-2xl flex items-center gap-4 hover:border-emerald-600 hover:bg-emerald-50 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Briefcase size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-gray-900">Prestador de Serviço</p>
              <p className="text-[12px] text-gray-500 mt-0.5">Personal, babá, manutenção — vinculado a um sócio ou ao clube.</p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
