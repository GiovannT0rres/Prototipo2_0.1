import { useState } from "react";
import { Plus, Users, UserPlus, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import { DEPENDENTS_ACTIVE } from "../mocks/mockCheckIn";

export function GestaoDependentes() {

  const [dependents, setDependents] = useState(DEPENDENTS_ACTIVE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", cpf: "", birthDate: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cpf) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newDep = {
        id: `d_${Date.now()}`,
        name: formData.name,
        type: "Dependente",
        birthDate: formData.birthDate,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
        pending: true,
        invites: 0,
        canManageAccess: false,
        guestList: []
      };

      setDependents((prev) => [newDep, ...prev]);
      setIsModalOpen(false);
      setFormData({ name: "", cpf: "", birthDate: "" });
      setIsLoading(false);
      
      toast.success("Solicitação enviada com sucesso! Aguarde a aprovação do clube.");
    }, 1000);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setFormData({ ...formData, cpf: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-12">
          <div className="w-10" />
          <span className="text-[17px] font-semibold text-gray-900">
            Dependentes
          </span>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[14px] text-gray-500 px-1">
            Gerencie os acessos familiares da sua titularidade.
          </p>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {dependents.map((dep) => (
              <motion.div
                key={dep.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={dep.avatar}
                      alt={dep.name}
                      className={`w-12 h-12 rounded-full border-2 ${dep.pending ? 'border-amber-400' : 'border-gray-100'} object-cover shrink-0`}
                    />
                    {dep.pending && (
                      <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white rounded-full p-0.5">
                        <AlertCircle size={12} />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-[16px] font-semibold text-gray-900 leading-tight">
                      {dep.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-[5px]">
                         {dep.type}
                       </span>
                       {dep.pending && (
                         <span className="text-[11px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-[5px]">
                           Em Análise
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {dependents.length === 0 && (
             <div className="py-12 flex flex-col items-center justify-center text-center">
                <Users size={40} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhum dependente cadastrado.</p>
             </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 active:bg-blue-700 transition-colors"
        >
          <Plus size={26} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Add Dependent Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-sm rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl flex flex-col pt-2 pb-6 px-6 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />
              
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:scale-95 transition-transform"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <UserPlus size={20} />
                 </div>
                 <div>
                    <h2 className="text-[19px] font-bold text-gray-900">Novo Dependente</h2>
                    <p className="text-[13px] text-gray-500">Preencha os dados do dependente.</p>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">CPF</label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Data de Nascimento</label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="text-[12px] text-gray-400 px-1">Usada para liberar áreas com restrição de idade (ex: Novo Bar, 18+).</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-blue-600 text-white font-semibold text-[16px] py-4 rounded-xl flex items-center justify-center gap-2 active:bg-blue-700 disabled:opacity-70 transition-all shadow-sm"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    "Solicitar Inclusão"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="top-center" richColors />
    </div>
  );
}
