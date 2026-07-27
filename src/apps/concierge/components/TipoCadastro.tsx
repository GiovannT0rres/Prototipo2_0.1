import { ArrowLeft, Ticket, Briefcase, Wrench } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onSelecionar: (tipo: 'convidado' | 'prestador-socio' | 'funcionario-clube') => void;
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
            Este CPF não possui registro. Selecione o tipo de vínculo para iniciar o cadastro.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          {/* Opção 1: Convidado de Sócio */}
          <button
            onClick={() => onSelecionar('convidado')}
            className="w-full p-5 border-2 border-gray-200 bg-white rounded-2xl flex items-center gap-4 hover:border-blue-600 hover:bg-blue-50 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Ticket size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-gray-900">Convidado</p>
              <p className="text-[12px] text-gray-500 mt-0.5">Vem a convite de um Sócio (Patrocinado).</p>
            </div>
          </button>

          {/* Opção 2: Prestador do Sócio */}
          <button
            onClick={() => onSelecionar('prestador-socio')}
            className="w-full p-5 border-2 border-gray-200 bg-white rounded-2xl flex items-center gap-4 hover:border-emerald-600 hover:bg-emerald-50 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Briefcase size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-gray-900">Prestador Particular</p>
              <p className="text-[12px] text-gray-500 mt-0.5">Personal, babá, etc. (Vinculado a Sócio).</p>
            </div>
          </button>

          {/* Opção 3: Funcionário/Serviço do Clube */}
          <button
            onClick={() => onSelecionar('funcionario-clube')}
            className="w-full p-5 border-2 border-gray-200 bg-white rounded-2xl flex items-center gap-4 hover:border-amber-600 hover:bg-amber-50 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Wrench size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-gray-900">Serviço do Clube</p>
              <p className="text-[12px] text-gray-500 mt-0.5">Funcionários e manutenções do próprio clube.</p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}