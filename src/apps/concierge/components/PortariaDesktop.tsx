import { useState, useEffect } from "react";
import { Search, MapPin, CheckCircle2, ChevronDown, Camera, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import { CLUBS } from "@/shared/data/clubs";

export function PortariaDesktop() {
  const [selectedClub, setSelectedClub] = useState(CLUBS[0]?.id || "1");
  const [searchCpf, setSearchCpf] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  // LPR (Leitura de Placas) Feed
  const [lprFeed, setLprFeed] = useState([
    { id: "1", plate: "ABC-1234", name: "Fernando Silva", type: "Titular", time: "Agora", status: "Liberado", avatar: "https://i.pravatar.cc/150?u=fernando" },
  ]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCpf) return;
    setIsSearching(true);
    setSearchResult(null);
    
    setTimeout(() => {
      setIsSearching(false);
      setSearchResult({
         name: "Maria Souza",
         type: "Visitante",
         spot: "CAMPO 2",
         avatar: "https://i.pravatar.cc/150?u=maria",
         status: "Autorizado"
      });
    }, 800);
  };

  const handleSimulateLpr = () => {
    const plates = ["XYZ-9876", "QWE-1122", "AAA-0000", "BEE-5555"];
    const names = ["Carlos Mendes", "Ana Paula", "Roberto Alves", "Juliana Costa"];
    const randomIdx = Math.floor(Math.random() * plates.length);
    
    const newEntry = {
      id: Date.now().toString(),
      plate: plates[randomIdx],
      name: names[randomIdx],
      type: randomIdx % 2 === 0 ? "Dependente" : "Titular",
      time: "Agora",
      status: "Liberado",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[randomIdx])}&background=random`
    };

    setLprFeed((prev) => [newEntry, ...prev]);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#f0f2f5] overflow-hidden relative">
      
      {/* Top Header para o Clube no mobile, ou absolute no canto superior no desktop se quiser */}
      <div className="absolute top-4 right-6 z-20 hidden md:flex items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100">
         <MapPin className="text-gray-400 mx-2" size={16} />
         <select
           value={selectedClub}
           onChange={(e) => setSelectedClub(e.target.value)}
           className="appearance-none bg-transparent border-none text-[14px] font-bold text-gray-800 pr-6 cursor-pointer focus:outline-none"
         >
           {CLUBS.map((club) => (
             <option key={club.id} value={club.id}>{club.name}</option>
           ))}
         </select>
         <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Esquerda: Feed LPR (60%) */}
      <div className="w-full md:w-[60%] border-r border-gray-200 bg-gray-50 flex flex-col h-[50vh] md:h-screen">
        <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
           <div>
             <h2 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
               <Camera size={20} className="text-gray-400"/> LPR Cam 1
             </h2>
             <p className="text-[13px] text-green-600 font-semibold mt-0.5 flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online e Lendo
             </p>
           </div>
           <button 
             onClick={handleSimulateLpr}
             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold rounded-lg transition-colors"
           >
             Simular Leitura
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
           <AnimatePresence>
             {lprFeed.map((entry) => (
               <motion.div
                 key={entry.id}
                 initial={{ opacity: 0, x: -50, scale: 0.95 }}
                 animate={{ opacity: 1, x: 0, scale: 1 }}
                 className="bg-white rounded-2xl shadow-md border-l-4 border-l-green-500 p-4 flex items-center justify-between"
               >
                  <div className="flex items-center gap-4">
                     <img src={entry.avatar} alt={entry.name} className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover" />
                     <div>
                       <h3 className="text-[18px] font-bold text-gray-900">{entry.name}</h3>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider font-mono border border-gray-200">
                           {entry.plate}
                         </span>
                         <span className="text-[12px] font-semibold text-gray-500">{entry.type}</span>
                       </div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                     <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">{entry.time}</span>
                     <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-[14px]">
                        <CheckCircle2 size={18} /> {entry.status}
                     </div>
                  </div>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      </div>

      {/* Direita: Busca Manual (40%) */}
      <div className="w-full md:w-[40%] bg-white flex flex-col h-[50vh] md:h-screen">
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
           <div className="mb-8">
             <h2 className="text-[24px] font-bold text-gray-900">Validação Manual</h2>
             <p className="text-[14px] text-gray-500 mt-1">Busque pedestres ou veículos sem placa cadastrada.</p>
           </div>

           <form onSubmit={handleManualSearch} className="mb-8">
              <div className="relative">
                 <input
                   type="text"
                   value={searchCpf}
                   onChange={(e) => setSearchCpf(e.target.value)}
                   placeholder="Digite o CPF ou Nome..."
                   className="w-full bg-gray-50 border border-gray-300 rounded-2xl px-6 py-5 text-[18px] font-bold focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900 transition-all placeholder:font-medium"
                 />
                 <button
                   type="submit"
                   disabled={!searchCpf || isSearching}
                   className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 transition-colors"
                 >
                   {isSearching ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <Search size={22} />}
                 </button>
              </div>
           </form>

           <AnimatePresence mode="wait">
             {searchResult && (
               <motion.div
                 key="result"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-gray-50 rounded-3xl p-6 border border-gray-200"
               >
                  <div className="flex items-start justify-between mb-6">
                     <div className="flex items-center gap-4">
                        <img src={searchResult.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover" />
                        <div>
                           <h3 className="text-[20px] font-bold text-gray-900 leading-tight">{searchResult.name}</h3>
                           <p className="text-[14px] font-semibold text-gray-500">{searchResult.type}</p>
                        </div>
                     </div>
                     <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={14} /> Autorizado
                     </span>
                  </div>

                  <div className="space-y-4 mb-8">
                     <div className="bg-white rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Destino</span>
                        <span className="text-[15px] font-bold text-gray-900">{searchResult.spot}</span>
                     </div>
                  </div>

                  <button 
                    onClick={() => {
                      toast.success("Entrada registrada com sucesso!");
                      setSearchResult(null);
                      setSearchCpf("");
                    }}
                    className="w-full bg-gray-900 text-white font-bold text-[18px] py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all shadow-md"
                  >
                    <Check size={24} />
                    Liberar Entrada
                  </button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
