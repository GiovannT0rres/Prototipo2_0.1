import { useState } from "react";
import { Users, FileText, Check, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import { INITIAL_PENDING } from "../mocks/mockManager";

export function DashboardAprovacoes() {
  const [activeTab, setActiveTab] = useState<"dependentes" | "convidados">("dependentes");
  
  // Como é só visual, vou usar a mesma lista base para dar a sensação de fila de trabalho
  // e duplicá-la levemente só para ter dados nas duas abas
  const [dependentesFila, setDependentesFila] = useState(INITIAL_PENDING.slice(0, 2));
  const [convidadosFila, setConvidadosFila] = useState(INITIAL_PENDING.slice(2, 4));

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = (id: string, action: "aprovar" | "rejeitar", fila: "dependentes" | "convidados") => {
    setProcessingId(id);
    setTimeout(() => {
      if (fila === "dependentes") {
        setDependentesFila(prev => prev.filter(item => item.id !== id));
      } else {
        setConvidadosFila(prev => prev.filter(item => item.id !== id));
      }
      setProcessingId(null);
      toast.success(action === "aprovar" ? "Solicitação aprovada com sucesso!" : "Solicitação rejeitada.");
    }, 800);
  };

  const currentFila = activeTab === "dependentes" ? dependentesFila : convidadosFila;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fila de Trabalho</h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Aprovações pendentes de dependentes e patrocínios de convidados.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         {/* Tabs */}
         <div className="flex border-b border-gray-100">
           <button
             onClick={() => setActiveTab("dependentes")}
             className={`flex-1 flex items-center justify-center gap-2 py-4 text-[15px] font-semibold border-b-2 transition-all ${
               activeTab === "dependentes" ? "border-emerald-600 text-emerald-600 bg-emerald-50/30" : "border-transparent text-gray-500 hover:bg-gray-50"
             }`}
           >
             <Users size={18} />
             Dependentes
             {dependentesFila.length > 0 && (
               <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === "dependentes" ? "bg-emerald-100" : "bg-gray-100"}`}>
                 {dependentesFila.length}
               </span>
             )}
           </button>
           <button
             onClick={() => setActiveTab("convidados")}
             className={`flex-1 flex items-center justify-center gap-2 py-4 text-[15px] font-semibold border-b-2 transition-all ${
               activeTab === "convidados" ? "border-emerald-600 text-emerald-600 bg-emerald-50/30" : "border-transparent text-gray-500 hover:bg-gray-50"
             }`}
           >
             <FileText size={18} />
             Convidados
             {convidadosFila.length > 0 && (
               <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === "convidados" ? "bg-emerald-100" : "bg-gray-100"}`}>
                 {convidadosFila.length}
               </span>
             )}
           </button>
         </div>

         {/* Lista */}
         <div className="p-2 sm:p-6 bg-gray-50/30 min-h-[400px]">
           <AnimatePresence initial={false} mode="popLayout">
             {currentFila.map((item) => (
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
                     <div className="flex flex-wrap gap-2 mt-1">
                       <span className="text-[12px] font-semibold text-gray-500">{item.cpf}</span>
                       <span className="text-[11px] uppercase tracking-wider font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                         {item.type}
                       </span>
                     </div>
                   </div>
                 </div>

                 <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleAction(item.id, "rejeitar", activeTab)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-semibold text-[14px] transition-colors disabled:opacity-50"
                    >
                      <X size={16} strokeWidth={2.5} /> Rejeitar
                    </button>
                    <button
                      disabled={processingId === item.id}
                      onClick={() => handleAction(item.id, "aprovar", activeTab)}
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

           {currentFila.length === 0 && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-20 text-center"
             >
               <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle2 size={32} />
               </div>
               <p className="text-[18px] font-bold text-gray-900">Fila Vazia</p>
               <p className="text-[14px] text-gray-500 mt-1">Tudo aprovado nesta categoria.</p>
             </motion.div>
           )}
         </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
