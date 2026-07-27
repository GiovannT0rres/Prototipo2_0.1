import { ArrowLeft, Plus, CheckCircle2, Clock } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  dados: any;
  onNovaAutorizacao: () => void;
  onVoltar: () => void;
}

export function PerfilPessoa({ dados, onNovaAutorizacao, onVoltar }: Props) {
  const autorizacoes = dados.autorizacoes || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full bg-gray-50">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <p className="font-bold text-gray-900 text-[15px]">Perfil do Usuário</p>
        <div className="w-10" />
      </div>

      <div className="flex-shrink-0 bg-white p-6 border-b border-gray-100 flex items-center gap-4">
        <img src={dados.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover" />
        <div>
          <h2 className="text-[18px] font-bold text-gray-900">{dados.name}</h2>
          <p className="text-[13px] text-gray-500 font-medium font-mono">{dados.cpf}</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Autorizações Vigentes</h3>
        </div>

        <div className="space-y-3">
          {autorizacoes.length === 0 ? (
             <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center text-gray-500 text-[14px]">
               Nenhuma autorização ativa encontrada.
             </div>
          ) : (
            autorizacoes.map((auth: any) => (
              <div key={auth.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase px-2 py-0.5 rounded">
                    {auth.reason}
                  </span>
                  <span className="text-[12px] font-bold text-gray-400 flex items-center gap-1">
                    <Clock size={12}/> Válido até 18:00
                  </span>
                </div>
                <p className="text-[16px] font-bold text-gray-900">{auth.spot}</p>
                <p className="text-[13px] text-gray-500 mb-4">{auth.details || "Acesso liberado"}</p>
                
                <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Dar Entrada Usando Esta
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <button
          onClick={onNovaAutorizacao}
          className="w-full py-4 rounded-xl font-bold text-[15px] text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
        >
          <Plus size={20} /> Nova Autorização
        </button>
      </div>
    </motion.div>
  );
}