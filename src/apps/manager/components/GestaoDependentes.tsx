import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Lock, Unlock, ChevronRight, Users2 } from "lucide-react";
import { MOCK_DEPENDENTES_ADMIN } from "../mocks/mockManager";

type Status = "Ativo" | "Pendente" | "Bloqueado";

const STATUS_STYLE: Record<Status, string> = {
  Ativo: "bg-emerald-50 text-emerald-700",
  Pendente: "bg-amber-50 text-amber-700",
  Bloqueado: "bg-red-50 text-red-700",
};

export function GestaoDependentes() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [dependentes, setDependentes] = useState(MOCK_DEPENDENTES_ADMIN);

  const filtrados = dependentes.filter((dep) =>
    [dep.name, dep.titular, dep.tipo].some((campo) =>
      campo.toLowerCase().includes(query.toLowerCase())
    )
  );

  const toggleBloqueio = (id: string) => {
    setDependentes((prev) =>
      prev.map((dep) =>
        dep.id === id
          ? { ...dep, status: dep.status === "Bloqueado" ? "Ativo" : "Bloqueado" }
          : dep
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gerenciar Dependentes</h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Visão administrativa de todos os dependentes vinculados a titulares do clube.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por dependente, titular ou parentesco..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="space-y-3">
          {filtrados.map((dep) => (
            <div
              key={dep.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <Users2 size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-gray-900 truncate">{dep.name}</p>
                  <p className="text-[12px] text-gray-500">
                    {dep.tipo} • {dep.idade} anos
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/manager/socio/${dep.titularId}`)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
              >
                Titular: {dep.titular} <ChevronRight size={14} />
              </button>

              <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md shrink-0 ${STATUS_STYLE[dep.status as Status]}`}>
                {dep.status}
              </span>

              <button
                onClick={() => toggleBloqueio(dep.id)}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-[13px] transition-colors shrink-0 ${
                  dep.status === "Bloqueado"
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                {dep.status === "Bloqueado" ? <Unlock size={14} /> : <Lock size={14} />}
                {dep.status === "Bloqueado" ? "Desbloquear" : "Bloquear"}
              </button>
            </div>
          ))}

          {filtrados.length === 0 && (
            <div className="py-12 text-center text-gray-500 font-medium">
              Nenhum dependente encontrado para esta busca.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
