import { useState } from "react";
import { Users, MapPin, Clock, ShieldCheck } from "lucide-react";
import { ESPACOS } from "@/shared/data/spaces";
import { MOCK_PRESENCA } from "../mocks/mockManager";

export function MapaOperacional() {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const totalPessoas = Object.values(MOCK_PRESENCA).reduce((acc, lista) => acc + lista.length, 0);
  const espacosOcupados = Object.values(MOCK_PRESENCA).filter((lista) => lista.length > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mapa Operacional</h1>
        <p className="text-[14px] text-gray-500 mt-1">
          Quem está no clube agora, em qual espaço, e quem autorizou a entrada.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Pessoas no clube</p>
            <p className="text-[28px] font-extrabold text-gray-900 leading-none mt-1">{totalPessoas}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Espaços ocupados</p>
            <p className="text-[28px] font-extrabold text-gray-900 leading-none mt-1">{espacosOcupados} / {ESPACOS.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Atualizado</p>
            <p className="text-[16px] font-bold text-gray-900 mt-1">Agora mesmo</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ESPACOS.map((espaco) => {
          const pessoas = MOCK_PRESENCA[espaco.id] ?? [];
          const isOpen = selecionado === espaco.id;
          return (
            <div key={espaco.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setSelecionado(isOpen ? null : espaco.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${espaco.color}`}>
                    <MapPin size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[15px] font-bold text-gray-900">{espaco.name}</p>
                    <p className="text-[12px] text-gray-500">
                      {espaco.tipo}{espaco.ageRestriction ? ` • ${espaco.ageRestriction}` : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[13px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                    pessoas.length > 0 ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {pessoas.length}
                </span>
              </button>

              {pessoas.length > 0 && (
                <div className="divide-y divide-gray-50 border-t border-gray-100">
                  {pessoas.map((pessoa) => (
                    <div key={pessoa.id} className="flex items-center gap-3 px-5 py-3">
                      <img src={pessoa.avatar} alt={pessoa.name} className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 truncate">{pessoa.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{pessoa.tipo} • entrou {pessoa.entrada}</p>
                        {isOpen && (
                          <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                            <ShieldCheck size={12} className="shrink-0" /> {pessoa.autorizadoPor}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pessoas.length === 0 && (
                <div className="px-5 py-4 border-t border-gray-100 text-[12px] text-gray-400 font-medium">
                  Nenhuma pessoa neste espaço no momento.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
