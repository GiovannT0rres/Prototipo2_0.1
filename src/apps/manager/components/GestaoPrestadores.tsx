import { useState } from "react";
import { Search, ShieldAlert, CheckCircle, Briefcase, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function GestaoPrestadores() {
  const [cpf, setCpf] = useState("");
  const [tipo, setTipo] = useState("temporario");
  const [empresa, setEmpresa] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [bgStatus, setBgStatus] = useState<"idle" | "approved" | "rejected">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf) return;
    
    setIsLoading(true);
    setBgStatus("idle");

    setTimeout(() => {
      setIsLoading(false);
      // Simula Aprovação para final par e Rejeição para final ímpar (só para testes)
      const lastDigit = parseInt(cpf.replace(/\D/g, "").slice(-1)) || 0;
      setBgStatus(lastDigit % 2 === 0 ? "approved" : "rejected");
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestão de Prestadores</h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Solicite o background check (análise de antecedentes) antes de liberar o acesso.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
             <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">CPF do Prestador</label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00 (Termine com par para aprovar, ímpar para reprovar)"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Tipo de Prestação</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipo("temporario")}
                    className={`py-3 px-2 rounded-xl text-[14px] font-semibold border-2 transition-all ${
                      tipo === "temporario" ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "bg-white border-gray-200 text-gray-500"
                    }`}
                  >
                    Temporário
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipo("recorrente")}
                    className={`py-3 px-2 rounded-xl text-[14px] font-semibold border-2 transition-all ${
                      tipo === "recorrente" ? "bg-emerald-50 border-emerald-600 text-emerald-700" : "bg-white border-gray-200 text-gray-500"
                    }`}
                  >
                    Recorrente
                  </button>
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Empresa (Opcional)</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Nome da Empresa ou CNPJ"
                    className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-3.5 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
             </div>

             <div className="pt-4 border-t border-gray-100">
               <button
                 type="submit"
                 disabled={isLoading || !cpf}
                 className="w-full bg-gray-900 text-white font-bold text-[16px] py-4 rounded-xl flex items-center justify-center gap-2 active:bg-gray-800 transition-all shadow-sm disabled:opacity-50"
               >
                 {isLoading ? (
                   <>
                     <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                     Consultando Antecedentes...
                   </>
                 ) : (
                   <>
                     <Search size={20} /> Solicitar Background Check
                   </>
                 )}
               </button>
             </div>
          </form>
        </div>

        {/* Resultado do Background Check */}
        <AnimatePresence mode="wait">
          {bgStatus !== "idle" && (
             <motion.div
               key={bgStatus}
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "auto" }}
               exit={{ opacity: 0, height: 0 }}
               className={`p-6 border-t ${bgStatus === "approved" ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}
             >
                <div className="flex items-start gap-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${bgStatus === "approved" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                      {bgStatus === "approved" ? <CheckCircle size={24} /> : <ShieldAlert size={24} />}
                   </div>
                   <div>
                      <h3 className={`text-[18px] font-bold ${bgStatus === "approved" ? "text-emerald-900" : "text-red-900"}`}>
                        {bgStatus === "approved" ? "Background Check Aprovado" : "Restrição Encontrada"}
                      </h3>
                      <p className={`text-[14px] mt-1 ${bgStatus === "approved" ? "text-emerald-700" : "text-red-700"}`}>
                        {bgStatus === "approved" 
                          ? "Nenhuma pendência encontrada. Você pode prosseguir com a autorização deste prestador de serviço." 
                          : "Foram encontradas inconsistências ou restrições criminais/financeiras vinculadas a este CPF."}
                      </p>
                      
                      {bgStatus === "approved" && (
                         <button className="mt-4 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-2">
                            Aprovar Acesso <ChevronRight size={16} />
                         </button>
                      )}
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
