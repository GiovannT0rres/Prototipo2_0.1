import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const DEPENDENTS_ACTIVE = [
  {
    id: "d1",
    name: "Maria Silva",
    type: "Familiar",
    avatar: "https://i.pravatar.cc/150?u=maria",
    pending: false,
    invites: 2,
    canManageAccess: true, // <-- Adicionada a flag para o balão verde
    guestList: [
      { id: "g1", name: "Lucas Silva", date: "Hoje" },
      { id: "g2", name: "Julia Silva", date: "15/06/2026" }
    ],
  },
  {
    id: "d2",
    name: "João Pedro",
    type: "Familiar",
    avatar: "https://i.pravatar.cc/150?u=joao",
    pending: true,
    invites: 0,
    canManageAccess: false,
    guestList: [],
  },
  {
    id: "d3",
    name: "Carlos (Motorista)",
    type: "Prestador de Serviço",
    avatar: "https://i.pravatar.cc/150?u=carlos",
    pending: false,
    invites: 0,
    canManageAccess: false,
    guestList: [],
  },
];

const DEPENDENTS_HISTORY = [
  {
    id: "h1",
    name: "Ana Costa",
    status: "Expirado",
    endDate: "12/05/2026",
    cancelledBy: "Sistema",
  },
  {
    id: "h2",
    name: "Roberto Almeida",
    status: "Revogado",
    endDate: "10/05/2026",
    cancelledBy: "Titular",
  },
];

export function ClubDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"ativos" | "historico">("ativos");
  const [expandedDependentId, setExpandedDependentId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 flex items-center -ml-2 active:opacity-70"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
            <span className="text-[17px] -ml-1">Clubes</span>
          </button>
          
          <button
            onClick={() => navigate(`/club/${id}/new-invite`)}
            className="text-blue-600 active:opacity-70 p-1"
          >
            <Plus size={28} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto w-full flex-1">
        {/* Page Title */}
        <div className="mb-6 mt-2">
        </div>

        {/* Segmented Control */}
        <div className="bg-gray-200/80 p-0.5 rounded-lg flex mb-6">
          <button
            onClick={() => setActiveTab("ativos")}
            className={`flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all ${
              activeTab === "ativos"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all ${
              activeTab === "historico"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Histórico
          </button>
        </div>

        {/* List Content */}
        {activeTab === "ativos" ? (
          <div className="space-y-3">
            {DEPENDENTS_ACTIVE.map((dep) => (
              <div
                key={dep.id}
                className="bg-white rounded-2xl p-4 flex flex-col shadow-sm"
              >
                <div className="flex items-start">
                  <ImageWithFallback
                    src={dep.avatar}
                    alt={dep.name}
                    className="w-12 h-12 rounded-full border border-gray-100 object-cover shrink-0"
                  />
                  <div className="ml-3 flex-1">
                    <h3 className="text-[17px] font-semibold text-gray-900">
                      {dep.name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[12px] font-medium rounded-md">
                        {dep.type}
                      </span>
                      
                      {/* Nova Tag: Gestão de Acesso */}
                      {dep.canManageAccess && (
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[12px] font-medium rounded-md">
                          Gestão de acesso
                        </span>
                      )}

                      {dep.pending && (
                        <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-[12px] font-medium rounded-md">
                          Aguardando Cadastro
                        </span>
                      )}
                    </div>

                    {dep.invites > 0 && (
                      <button
                        onClick={() => setExpandedDependentId(expandedDependentId === dep.id ? null : dep.id)}
                        className="text-blue-600 text-[13px] font-medium mt-2 active:opacity-70 flex items-center"
                      >
                        {expandedDependentId === dep.id ? 'Ocultar convidados' : `Ver ${dep.invites} convidados`}
                        <ChevronRight 
                          size={14} 
                          className={`ml-0.5 transition-transform ${expandedDependentId === dep.id ? 'rotate-90' : ''}`} 
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de Convidados (Expanded) */}
                {expandedDependentId === dep.id && dep.guestList && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                    <h4 className="text-[12px] uppercase font-semibold text-gray-500 tracking-wider">Convidados</h4>
                    <div className="flex flex-col gap-2">
                      {dep.guestList.map(guest => (
                        <div key={guest.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                          <span className="text-[14px] font-medium text-gray-900">{guest.name}</span>
                          <span className="text-[12px] text-gray-500">{guest.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <button className="text-red-500 text-[15px] font-medium px-4 py-1 active:bg-red-50 rounded-lg transition-colors">
                    Revogar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {DEPENDENTS_HISTORY.map((item) => (
              <div
                key={item.id}
                className="bg-white/60 rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100/50 grayscale-[20%] opacity-80"
              >
                <div>
                  <h3 className="text-[17px] font-medium text-gray-800">
                    {item.name}
                  </h3>
                  <div className="text-[13px] text-gray-500 mt-0.5 flex flex-col">
                    <span>Até: {item.endDate}</span>
                    <span>Por: {item.cancelledBy}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 text-[12px] font-medium rounded-md ${
                    item.status === "Revogado"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}