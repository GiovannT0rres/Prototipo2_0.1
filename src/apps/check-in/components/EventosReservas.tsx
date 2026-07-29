import { useState } from "react";
import { Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";

const ESPACOS = [
  { id: "churras", name: "Churrasqueira Principal", capacity: "Até 30 pessoas", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" },
  { id: "quadra", name: "Quadra de Tênis 1", capacity: "Até 4 pessoas", image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80" },
  { id: "salao", name: "Salão de Festas", capacity: "Até 100 pessoas", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80" },
];

const HORARIOS = ["08:00 - 12:00", "13:00 - 17:00", "18:00 - 22:00"];

export function EventosReservas() {

  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservations, setReservations] = useState<{space: string, date: string, time: string}[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpace || !date || !time) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setReservations((prev) => [
        { space: ESPACOS.find(e => e.id === selectedSpace)?.name || "", date, time },
        ...prev
      ]);
      toast.success("Espaço reservado com sucesso!");
      
      // Reset form
      setSelectedSpace(null);
      setDate("");
      setTime(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-24">
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-12">
          {/* Sem botão de "Voltar" aqui — a navegação global (sidebar/drawer) já cobre isso, não precisa de dois menus */}
          <div className="w-10" />
          <span className="text-[17px] font-semibold text-gray-900">
            Reservas
          </span>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto w-full flex-1">
        
        {/* Minhas Reservas */}
        {reservations.length > 0 && (
          <div className="mb-8 space-y-3">
             <h2 className="text-[14px] font-bold text-gray-400 uppercase tracking-wider mb-2">Minhas Reservas</h2>
             <AnimatePresence>
                {reservations.map((res, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-green-100 relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 w-2 h-full bg-green-500" />
                     <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                           <CheckCircle2 size={20} />
                        </div>
                        <div>
                           <p className="text-[16px] font-bold text-gray-900">{res.space}</p>
                           <div className="flex items-center gap-3 mt-1.5 text-[13px] text-gray-500 font-medium">
                              <span className="flex items-center gap-1"><Calendar size={14}/> {res.date.split('-').reverse().join('/')}</span>
                              <span className="flex items-center gap-1"><Clock size={14}/> {res.time}</span>
                           </div>
                           <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                             Planejado
                           </span>
                        </div>
                     </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-gray-900">Nova Reserva</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Escolha o espaço, a data e o horário.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-3">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Espaço</label>
            <div className="flex overflow-x-auto gap-3 pb-2 snap-x hide-scrollbar -mx-4 px-4">
              {ESPACOS.map((espaco) => (
                <button
                  key={espaco.id}
                  type="button"
                  onClick={() => setSelectedSpace(espaco.id)}
                  className={`relative w-40 shrink-0 rounded-2xl overflow-hidden snap-center text-left border-2 transition-all ${
                    selectedSpace === espaco.id ? "border-blue-600" : "border-transparent shadow-sm"
                  }`}
                >
                  <img src={espaco.image} alt={espaco.name} className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[13px] font-bold leading-tight">{espaco.name}</p>
                    <p className="text-[10px] text-white/80 mt-0.5 flex items-center gap-1"><UsersIcon size={10} /> {espaco.capacity}</p>
                  </div>
                  {selectedSpace === espaco.id && (
                     <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white" />
                     </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedSpace && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-6 overflow-hidden"
              >
                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Data</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 pl-11 pr-4 py-3.5 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Horário</label>
                  <div className="grid grid-cols-2 gap-3">
                    {HORARIOS.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setTime(h)}
                        className={`py-3 px-2 rounded-xl text-[14px] font-semibold border-2 transition-all ${
                          time === h
                           ? "bg-blue-50 border-blue-600 text-blue-700" 
                           : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 shadow-sm"
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!date || !time || isSubmitting}
                  className="w-full bg-blue-600 text-white font-semibold text-[16px] py-4 rounded-xl flex items-center justify-center gap-2 active:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    "Confirmar Reserva"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </form>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
       <circle cx="9" cy="7" r="4" />
       <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
       <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
