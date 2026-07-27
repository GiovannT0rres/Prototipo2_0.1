import { useNavigate } from "react-router";
import { MOCK_DASHBOARD, INITIAL_PENDING } from "../mocks/mockManager";
import { Users, Activity, CheckCircle, Clock, ArrowRight, ShieldAlert } from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Acessos Hoje", value: MOCK_DASHBOARD.totalAcessosHoje, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pendentes", value: MOCK_DASHBOARD.acessosPendentes, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Eventos Ativos", value: MOCK_DASHBOARD.eventosAtivos, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Visitantes (Semana)", value: MOCK_DASHBOARD.visitantesSemana, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

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

      {/* Cockpit de Autorizações */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900">Cockpit de Autorizações</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {INITIAL_PENDING.length} solicitações aguardando decisão agora.
            </p>
          </div>
          <button
            onClick={() => navigate("/manager/aprovacoes")}
            className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[14px] hover:text-emerald-700"
          >
            Ver fila completa <ArrowRight size={16} />
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {INITIAL_PENDING.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-3.5">
              <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-[12px] text-gray-500">{item.cpf} • {item.type}</p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 px-2 py-1 rounded-md shrink-0">
                Pendente
              </span>
            </div>
          ))}
          {INITIAL_PENDING.length === 0 && (
            <div className="px-6 py-8 text-center text-[14px] text-gray-400 font-medium">
              Nenhuma solicitação pendente no momento.
            </div>
          )}
        </div>
      </div>

      {/* Alertas de Segurança */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert size={18} className="text-red-500" />
          <h2 className="text-[17px] font-bold text-gray-900">Alertas de Segurança</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-red-800">Prestador com restrição encontrada</p>
              <p className="text-[12px] text-red-600 mt-0.5">Background check reprovado para um CPF cadastrado hoje. Verifique em Prestadores.</p>
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
