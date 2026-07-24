import { useState } from "react";
import { Search, ChevronDown, Filter, FileText, Database } from "lucide-react";
import { LOGS } from "../mocks/mockManager";

export function Logs() {
  const [searchQuery, setSearchQuery] = useState("");

  const getIconAndColor = (tipo: string) => {
    switch (tipo) {
      case "criacao":
        return { color: "text-emerald-600", bg: "bg-emerald-50", label: "Criação" };
      case "acesso":
        return { color: "text-blue-600", bg: "bg-blue-50", label: "Acesso" };
      case "revogacao":
        return { color: "text-red-600", bg: "bg-red-50", label: "Revogação" };
      case "sistema":
        return { color: "text-gray-600", bg: "bg-gray-100", label: "Sistema" };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100", label: "Log" };
    }
  };

  const filteredLogs = LOGS.filter((log) => 
    log.usuario.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.acao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.detalhes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Movimentações</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            Histórico completo de ações no sistema.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-[14px] shadow-sm hover:bg-gray-50 transition-colors">
          <FileText size={16} />
          Exportar Relatório
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por usuário, ação ou detalhes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold text-[14px] hover:bg-gray-100 transition-colors">
            <Filter size={16} />
            Filtros
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const theme = getIconAndColor(log.tipo);
            return (
              <div key={log.id} className="flex flex-col md:flex-row md:items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors gap-4">
                 <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.color}`}>
                       <Database size={20} />
                    </div>
                    <div>
                       <p className="text-[15px] font-bold text-gray-900">{log.acao}</p>
                       <p className="text-[13px] text-gray-500 mt-0.5">{log.detalhes}</p>
                    </div>
                 </div>
                 <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4 mt-2 md:mt-0 gap-2 md:gap-1">
                    <span className="text-[13px] font-semibold text-gray-700">{log.usuario}</span>
                    <span className="text-[12px] text-gray-400">{log.data}</span>
                 </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
             <div className="py-12 text-center text-gray-500 font-medium">
               Nenhum log encontrado para esta busca.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
