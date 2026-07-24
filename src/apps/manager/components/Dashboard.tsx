import { MOCK_DASHBOARD } from "../mocks/mockManager";
import { Users, Activity, CheckCircle, Clock } from "lucide-react";

export function Dashboard() {
  const stats = [
    { label: "Acessos Hoje", value: MOCK_DASHBOARD.totalAcessosHoje, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pendentes", value: MOCK_DASHBOARD.acessosPendentes, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Clubes Ativos", value: MOCK_DASHBOARD.clubesAtivos, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Visitantes (Semana)", value: MOCK_DASHBOARD.visitantesSemana, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
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

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
         <p className="text-gray-400 font-medium">Área reservada para gráficos e relatórios detalhados</p>
      </div>
    </div>
  );
}
