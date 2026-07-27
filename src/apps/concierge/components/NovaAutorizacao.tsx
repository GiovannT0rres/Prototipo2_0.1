import { useState } from "react";
import { ArrowLeft, UserPlus, Building2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface Props {
  dados: any;
  onConcluir: () => void;
  onVoltar: () => void;
}

export function NovaAutorizacao({ dados, onConcluir, onVoltar }: Props) {
  const [tipo, setTipo] = useState<"visitante" | "prestador">("visitante");
  const [empresa, setEmpresa] = useState("");
  const [destino, setDestino] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destino) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${tipo === 'visitante' ? 'Visitante' : 'Prestador'} autorizado com sucesso!`);
      setTimeout(onConcluir, 1500);
    }, 1000);
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Definir Autorização</p>
          <p className="text-[12px] text-gray-500 font-medium">{dados?.name || "Novo Usuário"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        
        <div>
          <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider block mb-3">Qual o Perfil?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipo("visitante")}
              className={`py-3 px-2 rounded-xl text-[14px] font-bold border-2 transition-all ${
                tipo === "visitante" ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-500"
              }`}
            >
              Visitante
            </button>
            <button
              type="button"
              onClick={() => setTipo("prestador")}
              className={`py-3 px-2 rounded-xl text-[14px] font-bold border-2 transition-all ${
                tipo === "prestador" ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-500"
              }`}
            >
              Prestador
            </button>
          </div>
        </div>

        <motion.div layout>
          {tipo === "prestador" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 space-y-1.5 overflow-hidden">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Empresa / Terceirizada</label>
              <div className="relative">
                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Nome da empresa..."
                  className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-3.5 rounded-xl text-[15px] font-medium focus:ring-2 focus:ring-gray-900/10 outline-none"
                />
              </div>
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Local de Destino</label>
            <input
              required
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Ex: Bloco B, Apto 204"
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:ring-2 focus:ring-gray-900/10 outline-none"
            />
          </div>
        </motion.div>
      </form>

      <div className="p-6 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold text-[16px] text-white bg-gray-900 hover:bg-gray-800 transition-all flex justify-center items-center gap-2"
        >
          {isSubmitting ? "Processando..." : <><UserPlus size={20} /> Salvar e Liberar</>}
        </button>
      </div>
    </motion.div>
  );
}