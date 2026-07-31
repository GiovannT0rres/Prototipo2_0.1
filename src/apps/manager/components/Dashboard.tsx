import { useNavigate } from "react-router";
import { MOCK_DASHBOARD, MOCK_PRESENCA } from "../mocks/mockManager";
import { ESPACOS } from "@/shared/data/spaces";
import { Users, Activity, CheckCircle, Clock, ArrowRight, ShieldAlert, MapPin, ShieldCheck } from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Acessos Hoje", value: MOCK_DASHBOARD.totalAcessosHoje, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pendentes", value: MOCK_DASHBOARD.acessosPendentes, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Eventos Ativos", value: MOCK_DASHBOARD.eventosAtivos, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Visitantes (Semana)", value: MOCK_DASHBOARD.visitantesSemana, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const totalPessoasNoClube = Object.values(MOCK_PRESENCA).reduce((acc, lista) => acc + lista.length, 0);
  const espacosOcupados = Object.values(MOCK_PRESENCA).filter((lista) => lista.length > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Operacional</h1>
        <p className="text-[14px] text-gray-500 mt-1">Visão geral do clube em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-[28px] font-extrabold text-gray-900 leading-none mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mapa Operacional — absorvido pra dentro do Dashboard (era uma tela
          própria em /manager/mapa; agora é uma seção aqui mesmo) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900">Mapa Operacional</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Visitantes e prestadores de serviço no clube agora, em qual espaço, e quem
              autorizou — sócios têm acesso livre e não aparecem aqui.
            </p>
          </div>
          <span className="text-[13px] font-semibold text-gray-500 shrink-0">
            {totalPessoasNoClube} no clube · {espacosOcupados}/{ESPACOS.length} espaços ocupados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ESPACOS.map((espaco) => {
            const pessoas = MOCK_PRESENCA[espaco.id] ?? [];
            return (
              <div key={espaco.id} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="w-full flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${espaco.color}`}>
                      <MapPin size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-[14px] font-bold text-gray-900">{espaco.name}</p>
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
                </div>

                {pessoas.length > 0 && (
                  <div className="divide-y divide-gray-50 border-t border-gray-100">
                    {pessoas.map((pessoa) => (
                      <div key={pessoa.id} className="flex items-center gap-3 px-4 py-2.5">
                        <img src={pessoa.avatar} alt={pessoa.name} className="w-8 h-8 rounded-full object-cover border border-gray-100 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 truncate">{pessoa.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{pessoa.tipo} • entrou {pessoa.entrada}</p>
                          <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1 truncate">
                            <ShieldCheck size={12} className="shrink-0" /> {pessoa.autorizadoPor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {pessoas.length === 0 && (
                  <div className="px-4 py-3 border-t border-gray-100 text-[12px] text-gray-400 font-medium">
                    Nenhuma pessoa neste espaço no momento.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alertas de Segurança */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-500" />
            <h2 className="text-[17px] font-bold text-gray-900">Alertas de Segurança</h2>
          </div>
          <button
            onClick={() => navigate("/manager/alertas")}
            className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[14px] hover:text-emerald-700"
          >
            Ver todos <ArrowRight size={16} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-red-800">Prestador com restrição encontrada</p>
              <p className="text-[12px] text-red-600 mt-0.5">Background check reprovado para um CPF cadastrado hoje na Concierge. O acesso não deve ser liberado na portaria.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-amber-800">Sócio inadimplente tentou gerar convite</p>
              <p className="text-[12px] text-amber-600 mt-0.5">Verifique a situação financeira em Visão do Sócio.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
