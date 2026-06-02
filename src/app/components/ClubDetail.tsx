import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  Maximize2,
  ChevronDown,
  Info,
  Send,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast, Toaster } from "sonner";

const DEPENDENTS_ACTIVE = [
  {
    id: "d1",
    name: "Maria Silva",
    type: "Familiar",
    avatar: "https://i.pravatar.cc/150?u=maria",
    pending: false,
    invites: 30,
    canManageAccess: true,
    guestList: [
      { id: "g1", name: "Lucas Silva", date: "01/06/2026" },
      { id: "g2", name: "Julia Silva", date: "01/06/2026" },
      { id: "g3", name: "Rafael Mendes", date: "31/05/2026" },
      { id: "g4", name: "Camila Rocha", date: "31/05/2026" },
      { id: "g5", name: "Pedro Henrique", date: "30/05/2026" },
      { id: "g6", name: "Fernanda Lima", date: "30/05/2026" },
      { id: "g7", name: "Gustavo Oliveira", date: "29/05/2026" },
      { id: "g8", name: "Isabela Santos", date: "29/05/2026" },
      { id: "g9", name: "Thiago Ferreira", date: "28/05/2026" },
      { id: "g10", name: "Larissa Costa", date: "28/05/2026" },
      { id: "g11", name: "Bruno Martins", date: "27/05/2026" },
      { id: "g12", name: "Amanda Pereira", date: "27/05/2026" },
      { id: "g13", name: "Diego Almeida", date: "26/05/2026" },
      { id: "g14", name: "Natalia Souza", date: "26/05/2026" },
      { id: "g15", name: "Marcos Paulo", date: "25/05/2026" },
      { id: "g16", name: "Carolina Ribeiro", date: "25/05/2026" },
      { id: "g17", name: "Felipe Gomes", date: "24/05/2026" },
      { id: "g18", name: "Juliana Barros", date: "24/05/2026" },
      { id: "g19", name: "Rodrigo Nunes", date: "23/05/2026" },
      { id: "g20", name: "Beatriz Campos", date: "23/05/2026" },
      { id: "g21", name: "Leonardo Dias", date: "22/05/2026" },
      { id: "g22", name: "Vanessa Teixeira", date: "22/05/2026" },
      { id: "g23", name: "André Moreira", date: "21/05/2026" },
      { id: "g24", name: "Patrícia Cardoso", date: "21/05/2026" },
      { id: "g25", name: "Eduardo Vieira", date: "20/05/2026" },
      { id: "g26", name: "Mariana Araújo", date: "20/05/2026" },
      { id: "g27", name: "Henrique Castro", date: "19/05/2026" },
      { id: "g28", name: "Débora Pinto", date: "19/05/2026" },
      { id: "g29", name: "Ricardo Lopes", date: "18/05/2026" },
      { id: "g30", name: "Aline Monteiro", date: "18/05/2026" },
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

const INITIAL_PENDING = [
  {
    id: "p1",
    name: "Enzo Rossi",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    email: "enzo.rossi@email.com",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    requestDate: "Hoje, 14:20",
    type: "dayuse",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // amanhã
  },
  {
    id: "p2",
    name: "Beatriz Oliveira",
    cpf: "987.654.321-11",
    phone: "(11) 91234-5678",
    email: "beatriz.oliveira@email.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    requestDate: "Ontem, 16:45",
    type: "familiar",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  },
];

export function ClubDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<
    "autorizacoes" | "ativos" | "historico"
  >("autorizacoes");
  const [expandedDependentId, setExpandedDependentId] = useState<string | null>(
    null,
  );

  // Salva o clube atual para o botão "Início" do menu inferior
  useEffect(() => {
    if (id) localStorage.setItem("lastClubId", id);
  }, [id]);

  // Estados de dados dinâmicos
  const [activeDependents, setActiveDependents] = useState(DEPENDENTS_ACTIVE);
  const [pendingRequests, setPendingRequests] = useState(INITIAL_PENDING);
  const [historyDependents, setHistoryDependents] =
    useState(DEPENDENTS_HISTORY);

  // Estado para o modal de selfie ampliada
  const [selectedSelfie, setSelectedSelfie] = useState<{
    name: string;
    avatar: string;
    cpf: string;
    phone: string;
  } | null>(null);

  // Função para atualizar campos de um item pendente
  const updateRequestField = (
    reqId: string,
    field: "type" | "startDate" | "endDate",
    value: string,
  ) => {
    setPendingRequests((prev) =>
      prev.map((req) => (req.id === reqId ? { ...req, [field]: value } : req)),
    );
  };

  // Função para autorizar
  const handleAccept = (req: (typeof INITIAL_PENDING)[0]) => {
    const typeLabelMap: Record<string, string> = {
      familiar: "Familiar",
      dayuse: "Day Use",
      cuidador: "Cuidador",
      prestador: "Prestador de Serviço",
    };

    const label = typeLabelMap[req.type] || "Visitante";

    const newActive = {
      id: `d_new_${Date.now()}`,
      name: req.name,
      type: label,
      avatar: req.avatar,
      pending: false,
      invites: 0,
      canManageAccess: req.type === "familiar",
      guestList: [],
    };

    setActiveDependents((prev) => [newActive, ...prev]);
    setPendingRequests((prev) => prev.filter((p) => p.id !== req.id));

    toast.success(`${req.name} foi autorizado(a) com sucesso como ${label}!`);
  };

  // Função para recusar
  const handleDecline = (req: (typeof INITIAL_PENDING)[0]) => {
    const newHistory = {
      id: `h_new_${Date.now()}`,
      name: req.name,
      status: "Recusado",
      endDate: new Date().toLocaleDateString("pt-BR"),
      cancelledBy: "Titular",
    };

    setHistoryDependents((prev) => [newHistory, ...prev]);
    setPendingRequests((prev) => prev.filter((p) => p.id !== req.id));

    toast.error(`A solicitação de ${req.name} foi recusada.`);
  };

  // Função para revogar convidado individual de um dependente
  const handleRevokeGuest = (
    depId: string,
    guestId: string,
    guestName: string,
  ) => {
    setActiveDependents((prev) =>
      prev.map((dep) => {
        if (dep.id !== depId) return dep;
        const updatedList = dep.guestList.filter((g) => g.id !== guestId);
        return {
          ...dep,
          guestList: updatedList,
          invites: updatedList.length,
        };
      }),
    );
    toast.error(`Acesso de ${guestName} foi revogado.`);
  };

  // Função para reenviar código de cadastro
  const handleResendCode = (depName: string) => {
    const text = encodeURIComponent(
      `Olá ${depName}, finalize seu cadastro pelo link: go.entradasegura.com.br/cadastro-${Date.now().toString(36)}`,
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    toast.success(`Código reenviado para ${depName} via WhatsApp!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={() => navigate("/clubes")}
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
        {/* Segmented Control */}
        <div className="bg-gray-200/80 p-0.5 rounded-lg flex mb-6">
          <button
            onClick={() => setActiveTab("autorizacoes")}
            className={`flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all relative ${
              activeTab === "autorizacoes"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Autorizações
            {pendingRequests.length > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("ativos")}
            className={`flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all ${
              activeTab === "ativos"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Ativos ({activeDependents.length})
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
        {activeTab === "ativos" && (
          <div className="space-y-3">
            {activeDependents.map((dep) => (
              <div
                key={dep.id}
                className="bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-gray-100"
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
                        onClick={() =>
                          setExpandedDependentId(
                            expandedDependentId === dep.id ? null : dep.id,
                          )
                        }
                        className="text-blue-600 text-[13px] font-medium mt-2 active:opacity-70 flex items-center"
                      >
                        {expandedDependentId === dep.id
                          ? "Ocultar convidados"
                          : `Ver ${dep.invites} convidados`}
                        <ChevronRight
                          size={14}
                          className={`ml-0.5 transition-transform ${expandedDependentId === dep.id ? "rotate-90" : ""}`}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {expandedDependentId === dep.id && dep.guestList && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[12px] uppercase font-semibold text-gray-500 tracking-wider">
                        Últimos convidados
                      </h4>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {dep.guestList.length} total
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {dep.guestList.slice(0, 5).map((guest) => (
                        <div
                          key={guest.id}
                          className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl"
                        >
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-gray-900">
                              {guest.name}
                            </span>
                            <span className="text-[12px] text-gray-500">
                              {guest.date}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleRevokeGuest(dep.id, guest.id, guest.name)
                            }
                            className="flex items-center text-red-500 text-[13px] font-medium"
                          >
                            <X size={14} className="mr-1" /> Revogar
                          </button>
                        </div>
                      ))}
                    </div>
                    {dep.guestList.length > 5 && (
                      <button
                        onClick={() =>
                          navigate(
                            `/club/${id}/guests?dep=${dep.id}&name=${encodeURIComponent(dep.name)}`,
                          )
                        }
                        className="w-full mt-1 py-2.5 bg-blue-50 text-blue-600 text-[14px] font-semibold rounded-xl active:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        Ver todos ({dep.guestList.length})
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => {
                      setActiveDependents((prev) =>
                        prev.filter((d) => d.id !== dep.id),
                      );
                      setHistoryDependents((prev) => [
                        {
                          id: `h_rev_${Date.now()}`,
                          name: dep.name,
                          status: "Revogado",
                          endDate: new Date().toLocaleDateString("pt-BR"),
                          cancelledBy: "Titular",
                        },
                        ...prev,
                      ]);
                      toast.error(`Acesso de ${dep.name} foi revogado.`);
                    }}
                    className="text-red-500 text-[15px] font-medium px-4 py-1 active:bg-red-50 rounded-lg transition-colors"
                  >
                    Revogar
                  </button>
                  {dep.pending && (
                    <button
                      onClick={() => handleResendCode(dep.name)}
                      className="mt-2 flex items-center gap-1.5 bg-[#25D366]/10 text-[#25D366] text-[13px] font-semibold px-3 py-1.5 rounded-lg active:bg-[#25D366]/20 transition-colors"
                    >
                      <Send size={13} />
                      Reenviar código via WhatsApp
                    </button>
                  )}
                </div>
              </div>
            ))}

            {activeDependents.length === 0 && (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-[15px]">
                  Nenhum dependente ou convidado ativo no momento.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "autorizacoes" && (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-gray-100 animate-in fade-in duration-300"
              >
                {/* Header: Selfie e Identidade Básica */}
                <div className="flex items-start">
                  <div
                    onClick={() =>
                      setSelectedSelfie({
                        name: req.name,
                        avatar: req.avatar,
                        cpf: req.cpf,
                        phone: req.phone,
                      })
                    }
                    className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer border border-gray-200 shadow-sm relative group overflow-hidden"
                  >
                    <img
                      src={req.avatar}
                      alt={req.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-200"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Maximize2 size={16} />
                    </div>
                  </div>

                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[17px] font-semibold text-gray-900 leading-tight">
                        {req.name}
                      </h3>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {req.requestDate}
                      </span>
                    </div>
                    <p className="text-[12px] text-blue-600 font-medium mt-0.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                      Aguardando autorização
                    </p>

                    <button
                      onClick={() =>
                        setSelectedSelfie({
                          name: req.name,
                          avatar: req.avatar,
                          cpf: req.cpf,
                          phone: req.phone,
                        })
                      }
                      className="text-[12px] font-semibold text-gray-500 mt-2 flex items-center gap-1 bg-gray-100/80 px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Info size={13} />
                      Ver selfie e dados
                    </button>
                  </div>
                </div>

                {/* Sub-card com Dados Básicos Compactos */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 text-[12px] text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100/80">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                      CPF
                    </span>
                    <span className="font-semibold text-gray-800">
                      {req.cpf}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                      Celular
                    </span>
                    <span className="font-semibold text-gray-800">
                      {req.phone}
                    </span>
                  </div>
                </div>

                <div className="my-3.5 border-t border-gray-100" />

                {/* Decisões de vigência e motivo */}
                <div className="space-y-3.5">
                  {/* Seletor de Motivo */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                      Motivo do Acesso
                    </label>
                    <div className="relative">
                      <select
                        value={req.type}
                        onChange={(e) =>
                          updateRequestField(req.id, "type", e.target.value)
                        }
                        className="w-full appearance-none bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                      >
                        <option value="familiar">Familiar</option>
                        <option value="dayuse">Day Use</option>
                        <option value="cuidador">Cuidador</option>
                        <option value="prestador">Prestador de Serviço</option>
                      </select>
                      <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Datas de Vigência */}
                  <div className="flex gap-3 mt-3">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                        A partir de
                      </label>
                      <input
                        type="date"
                        value={req.startDate}
                        onChange={(e) =>
                          updateRequestField(
                            req.id,
                            "startDate",
                            e.target.value,
                          )
                        }
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                        Válido Até
                      </label>
                      <input
                        type="date"
                        value={req.endDate}
                        onChange={(e) =>
                          updateRequestField(req.id, "endDate", e.target.value)
                        }
                        className="w-full bg-white border border-gray-200 px-3 py-2.5 rounded-xl text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 border-t border-gray-100 pt-3.5 mt-4">
                  <button
                    onClick={() => handleDecline(req)}
                    className="flex-1 bg-white border border-red-200 text-red-600 font-semibold text-[15px] py-2.5 rounded-xl active:bg-red-50 hover:bg-red-50/50 hover:border-red-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X size={16} />
                    Recusar
                  </button>
                  <button
                    onClick={() => handleAccept(req)}
                    className="flex-1 bg-blue-600 text-white font-semibold text-[15px] py-2.5 rounded-xl active:bg-blue-700 hover:bg-blue-700/90 shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check size={16} />
                    Autorizar
                  </button>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-3">
                  <Check size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 text-[16px] mb-1">
                  Tudo em dia!
                </h3>
                <p className="text-gray-500 text-[14px]">
                  Nenhuma solicitação de autorização pendente.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "historico" && (
          <div className="space-y-3">
            {historyDependents.map((item) => (
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
                    item.status === "Revogado" || item.status === "Recusado"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}

            {historyDependents.length === 0 && (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-[15px]">
                  Nenhum registro no histórico.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Overlay de Visualização de Selfie */}
      {selectedSelfie && (
        <div
          onClick={() => setSelectedSelfie(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Selfie Image Section */}
            <div className="relative aspect-[3/4] bg-gray-100">
              <img
                src={selectedSelfie.avatar}
                alt={selectedSelfie.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedSelfie(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Information Section */}
            <div className="p-5">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Validação de Identidade
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedSelfie.name}
              </h3>

              <div className="space-y-2.5 text-[14px]">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-medium">CPF</span>
                  <span className="font-semibold text-gray-800">
                    {selectedSelfie.cpf}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-400 font-medium">Celular</span>
                  <span className="font-semibold text-gray-800">
                    {selectedSelfie.phone}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSelfie(null)}
                className="w-full mt-5 bg-gray-900 text-white font-semibold text-[15px] py-3 rounded-xl active:bg-gray-800 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renderização do container de Toast da sonner */}
      <Toaster position="top-center" richColors />
    </div>
  );
}
