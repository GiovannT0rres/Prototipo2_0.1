import { useState } from "react";
import { useNavigate } from "react-router";
import { Users, Check, X, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import { MOCK_FILA_DEPENDENTES } from "../mocks/mockManager";

export function DashboardAprovacoes() {
  const navigate = useNavigate();

  // Só dependentes passam por aprovação — convidado é livre, o sócio patrocina
  // direto sem fila (ver CLAUDE.md §5/§7). O Manager acompanha convidados pelo Histórico.
  const [fila, setFila] = useState(MOCK_FILA_DEPENDENTES);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = (id: string, action: "aprovar" | "rejeitar") => {
    setProcessingId(id);
    setTimeout(() => {
      setFila((prev) => prev.filter((item) => item.id !== id));
      setProcessingId(null);
      toast.success(action === "aprovar" ? "Solicitação aprovada com sucesso!" : "Solicitação rejeitada.");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fila de Trabalho</h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Aprovações pendentes de dependentes. Convidados são livres — o sócio patrocina
          direto, sem passar por aqui (acompanhe pelo Histórico quem convidou quem).
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-emerald-50/30">
           <Users size={18} className="text-emerald-600" />
           <span className="text-[15px] font-semibold text-emerald-700">Dependentes</span>
           {fila.length > 0 && (
             <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-100 text-emerald-700">
               {fila.length}
             </span>
           )}
         </div>

         {/* Lista */}
         <div className="p-2 sm:p-6 bg-gray-50/30 min-h-[400px]">
           <AnimatePresence initial={false} mode="popLayout">
             {fila.map((item) => (
               <motion.div
                 key={item.id}
                 layout
                 initial={{ opacity: 0, scale: 0.9, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, x: -20 }}
                 transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                 className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
               >
                 <div className="flex items-center gap-4">
                   <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full border border-gray-100 object-cover" />
                   <div>
                     <h3 className="text-[16px] font-bold text-gray-900">{item.name}</h3>
                     <div className="flex flex-wrap items-center gap-2 mt-1">
                       <span className="text-[11px] uppercase tracking-wider font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                         {item.type}
                       </span>
                       <button
                         onClick={() => navigate(`/manager/socio/${item.titularId}`)}
                         className="text-[12px] font-semibold text-gray-500 hover:text-emerald-700 flex items-center gap-1"
                       >
                         Titular: {item.titular} <ChevronRight size={12} />
                       </button>
                     </div>
                   </div>
                 </div>

                 <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleAction(item.id, "rejeitar")}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-semibold text-[14px] transition-colors disabled:opacity-50"
                    >
                      <X size={16} strokeWidth={2.5} /> Rejeitar
                    </button>
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleAction(item.id, "aprovar")}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-semibold text-[14px] transition-colors shadow-sm disabled:opacity-70"
                    >
                      {processingId === item.id ? (
                         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      ) : (
                         <><Check size={16} strokeWidth={2.5} /> Aprovar</>
                      )}
                    </button>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>

           {fila.length === 0 && (
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-20 text-center"
             >
               <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle2 size={32} />
               </div>
               <p className="text-[18px] font-bold text-gray-900">Fila Vazia</p>
               <p className="text-[14px] text-gray-500 mt-1">Nenhum dependente aguardando aprovação.</p>
             </motion.div>
           )}
         </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
