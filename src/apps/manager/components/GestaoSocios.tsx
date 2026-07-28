import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronRight, User } from "lucide-react";
import { MOCK_SOCIOS } from "../mocks/mockManager";

export function GestaoSocios() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtrados = MOCK_SOCIOS.filter((s) =>
    [s.name, s.cpf, s.categoria].some((campo) => campo.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gerenciar Sócios</h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Roster de titulares, integrado à situação financeira do ERP Forza.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, CPF ou categoria..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="space-y-3">
          {filtrados.map((socio) => (
            <button
              key={socio.id}
              onClick={() => navigate(`/manager/socio/${socio.id}`)}
              className="w-full flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-gray-900 truncate">{socio.name}</p>
                <p className="text-[12px] text-gray-500">
                  Título {socio.id} • {socio.categoria} • {socio.cpf}
                </p>
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md shrink-0 ${
                  socio.inadimplente ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {socio.inadimplente ? "Inadimplente" : "Adimplente"}
              </span>
              <ChevronRight size={18} className="text-gray-300 shrink-0" />
            </button>
          ))}

          {filtrados.length === 0 && (
            <div className="py-12 text-center text-gray-500 font-medium">
              Nenhum sócio encontrado para esta busca.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
