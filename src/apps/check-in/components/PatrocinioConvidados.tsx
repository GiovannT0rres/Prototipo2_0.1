import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Search, Calendar, UserPlus, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";

export function PatrocinioConvidados() {
  const navigate = useNavigate();
  
  const [cpf, setCpf] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [guestFound, setGuestFound] = useState<{name: string} | null>(null);
  
  const [visitType, setVisitType] = useState("social");
  const [dateStr, setDateStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(value);
    
    if (value.length === 14 && !guestFound) {
       handleSearch();
    } else if (value.length < 14) {
       setGuestFound(null);
       setSuccess(false);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setGuestFound({ name: "Carlos Eduardo Mendes" }); // Simula que achou a pessoa
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestFound || !dateStr) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      toast.success("Convite patrocinado gerado com sucesso!");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 flex items-center -ml-2 active:opacity-70"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
            <span className="text-[17px] -ml-1">Voltar</span>
          </button>
          <span className="text-[17px] font-semibold text-gray-900">
            Convites
          </span>
          <div className="w-10" /> 
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto w-full flex-1">
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-gray-900">Patrocínio</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Gere um convite direto informando o CPF do visitante.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative">
             <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">CPF do Convidado</label>
             <div className="relative">
               <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                 type="text"
                 value={cpf}
                 onChange={handleCpfChange}
                 placeholder="000.000.000-00"
                 className="w-full bg-gray-50 border border-gray-200 pl-12 pr-4 py-3.5 rounded-xl text-[16px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
               />
               {isSearching && (
                 <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                 </div>
               )}
             </div>
          </div>

          <AnimatePresence>
            {guestFound && !success && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
                  
                  <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                       <UserPlus size={20} />
                     </div>
                     <div>
                       <p className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Pessoa Localizada</p>
                       <p className="text-[15px] font-semibold text-gray-900">{guestFound.name}</p>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Tipo de Visita</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button
                         type="button"
                         onClick={() => setVisitType("social")}
                         className={`py-3 px-2 rounded-xl text-[14px] font-semibold border-2 transition-all ${
                           visitType === "social" 
                            ? "bg-blue-50 border-blue-600 text-blue-700" 
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                         }`}
                       >
                         Social (1 Dia)
                       </button>
                       <button
                         type="button"
                         onClick={() => setVisitType("jogador")}
                         className={`py-3 px-2 rounded-xl text-[14px] font-semibold border-2 transition-all ${
                           visitType === "jogador" 
                            ? "bg-blue-50 border-blue-600 text-blue-700" 
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                         }`}
                       >
                         Esportiva
                       </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Data do Acesso</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-3 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white font-semibold text-[16px] py-4 rounded-xl flex items-center justify-center gap-2 active:bg-blue-700 transition-all shadow-sm disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      "Confirmar Patrocínio"
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} strokeWidth={2} />
                </div>
                <h2 className="text-[20px] font-bold text-gray-900 mb-2">Convite Liberado!</h2>
                <p className="text-[14px] text-gray-500 mb-6">
                  {guestFound?.name} agora pode acessar o clube na data informada.
                </p>
                <button
                  onClick={() => {
                     setCpf("");
                     setGuestFound(null);
                     setSuccess(false);
                     setDateStr("");
                  }}
                  className="w-full bg-gray-100 text-gray-700 font-semibold text-[15px] py-3.5 rounded-xl active:bg-gray-200 transition-all"
                >
                  Novo Convite
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
