import { useState } from "react";
import { Users, Search, Clock, ChevronDown } from "lucide-react";
import { MOCK_AUTHORIZATIONS } from "../mocks/mockConcierge";

export function DashboardPresenca() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("todos");

  // Filtra apenas quem tem status "No local"
  const noLocal = MOCK_AUTHORIZATIONS.filter(p => p.status === "No local");

  const filteredData = noLocal.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.spot.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === "prestador") return p.reason.includes("Prestador") || p.reason.includes("Manutenção");
    if (filter === "visitante") return p.reason.includes("Visitante");
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quem está no clube?</h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Visão em tempo real de visitantes e prestadores de serviço atualmente nas dependências.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou destino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>
          <div className="flex gap-2">
             {["todos", "visitante", "prestador"].map(f => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-3 rounded-xl text-[14px] font-bold capitalize transition-all ${
                   filter === f ? "bg-gray-900 text-white shadow-sm" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                 }`}
               >
                 {f === "todos" ? "Todos" : f + "s"}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map((person) => (
          <div key={person.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
             
             <img src={person.avatar} alt={person.name} className="w-20 h-20 rounded-full border-[3px] border-gray-50 object-cover shadow-sm mb-4" />
             
             <h3 className="text-[17px] font-bold text-gray-900 line-clamp-1">{person.name}</h3>
             
             <div className="flex items-center gap-1.5 mt-1.5 mb-4">
               <span className="text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                 {person.reason}
               </span>
             </div>

             <div className="w-full bg-gray-50 rounded-xl p-3 text-left space-y-2 mt-auto border border-gray-100/50">
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-gray-400 uppercase">Destino</span>
                   <span className="text-[13px] font-bold text-gray-900">{person.spot}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-gray-400 uppercase">Autorizado Por</span>
                   <span className="text-[13px] font-semibold text-gray-600">Roberto Almeida</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-gray-400 uppercase">Entrada</span>
                   <span className="text-[13px] font-medium text-gray-500 flex items-center gap-1"><Clock size={12}/> Hoje, 10:45</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 text-center">
           <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
             <Users size={32} />
           </div>
           <p className="text-[18px] font-bold text-gray-900">Ninguém encontrado</p>
           <p className="text-[14px] text-gray-500 mt-1">Não há pessoas no local que correspondam a este filtro.</p>
         </div>
      )}
    </div>
  );
}
