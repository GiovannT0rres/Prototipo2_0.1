import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ChevronDown,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast, Toaster } from "sonner";

import { CLUBS } from "./clubs";
import {
  DEPENDENTS_ACTIVE,
  DEPENDENTS_HISTORY,
  INITIAL_PENDING,
  MOTIVOS_ACESSO,
} from "../../mock/mockAutorizacoes";

// Tipo para controlar o Pop-up de Revogação
type RevokeModalState = {
  isOpen: boolean;
  type: "titular" | "guest" | "pending";
  depId: string;
  guestId?: string;
  name: string;
  clubId?: string;
} | null;

export function Autorizacoes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "autorizacoes" | "ativos" | "historico"
  >("autorizacoes");
  const [expandedDependentId, setExpandedDependentId] = useState<string | null>(
    null,
  );

  const [activeDependents, setActiveDependents] = useState(DEPENDENTS_ACTIVE);
  const [pendingRequests, setPendingRequests] = useState(INITIAL_PENDING);
  const [historyDependents, setHistoryDependents] =
    useState(DEPENDENTS_HISTORY);

  const [selectedSelfie, setSelectedSelfie] = useState<{
    name: string;
    avatar: string;
    cpf: string;
    phone: string;
  } | null>(null);

  // Novo estado para o Pop-up de confirmação de revogação
  const [revokeModal, setRevokeModal] = useState<RevokeModalState>(null);

  const updateRequestField = (
    reqId: string,
    field: "type" | "startDate" | "endDate" | "clubId" | "canManageAccess",
    value: string | boolean,
  ) => {
    setPendingRequests((prev) =>
      prev.map((req) => (req.id === reqId ? { ...req, [field]: value } : req)),
    );
  };

  const handleAccept = (req: (typeof INITIAL_PENDING)[0]) => {
    const label =
      MOTIVOS_ACESSO.find((m) => m.id === req.type)?.label || "Visitante";
    const clubSelected = CLUBS.find((c) => c.id === req.clubId);

    const newActive = {
      id: `d_new_${Date.now()}`,
      name: req.name,
      type: label,
      clubId: req.clubId,
      avatar: req.avatar,
      pending: false,
      invites: 0,
      canManageAccess: req.canManageAccess,
      guestList: [],
    };

    setActiveDependents((prev) => [newActive, ...prev]);
    setPendingRequests((prev) => prev.filter((p) => p.id !== req.id));

    toast.success(`${req.name} autorizado em: ${clubSelected?.name}!`);
  };

  const handleDecline = (req: (typeof INITIAL_PENDING)[0]) => {
    const newHistory = {
      id: `h_new_${Date.now()}`,
      name: req.name,
      clubId: req.clubId,
      status: "Recusado",
      endDate: new Date().toLocaleDateString("pt-BR"),
      cancelledBy: "Titular",
    };

    setHistoryDependents((prev) => [newHistory, ...prev]);
    setPendingRequests((prev) => prev.filter((p) => p.id !== req.id));
    toast.error(`A solicitação de ${req.name} foi recusada.`);
  };

  const confirmRevoke = () => {
    if (!revokeModal) return;

    if (revokeModal.type === "guest") {
      setActiveDependents((prev) =>
        prev.map((dep) => {
          if (dep.id !== revokeModal.depId) return dep;
          const updatedList = dep.guestList.filter(
            (g) => g.id !== revokeModal.guestId,
          );
          return {
            ...dep,
            guestList: updatedList,
            invites: updatedList.length,
          };
        }),
      );
      toast.error(`Acesso de ${revokeModal.name} foi revogado.`);
    } else if (revokeModal.type === "titular") {
      setActiveDependents((prev) =>
        prev.filter((d) => d.id !== revokeModal.depId),
      );
      setHistoryDependents((prev) => [
        {
          id: `h_rev_${Date.now()}`,
          name: revokeModal.name,
          clubId: revokeModal.clubId || "1",
          status: "Revogado",
          endDate: new Date().toLocaleDateString("pt-BR"),
          cancelledBy: "Titular",
        },
        ...prev,
      ]);
      toast.error(`Acesso de ${revokeModal.name} revogado.`);
    } else if (revokeModal.type === "pending") {
      // NOVA LÓGICA: RECUSAR PENDENTE
      setHistoryDependents((prev) => [
        {
          id: `h_new_${Date.now()}`,
          name: revokeModal.name,
          clubId: revokeModal.clubId || "1",
          status: "Recusado",
          endDate: new Date().toLocaleDateString("pt-BR"),
          cancelledBy: "Titular",
        },
        ...prev,
      ]);
      setPendingRequests((prev) =>
        prev.filter((p) => p.id !== revokeModal.depId),
      );
      toast.error(`A solicitação de ${revokeModal.name} foi recusada.`);
    }

    setRevokeModal(null);
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
            <span className="text-[17px] -ml-1">Início</span>
          </button>
          <span className="text-[17px] font-semibold text-gray-900">
            Painel Geral
          </span>
          <div className="w-6" />
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto w-full flex-1">
        {/* Segmented Control */}
        <div className="bg-gray-200/80 p-0.5 rounded-lg flex mb-6">
          <button
            onClick={() => setActiveTab("autorizacoes")}
            className={`flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all relative ${activeTab === "autorizacoes" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Autorizações{" "}
            {pendingRequests.length > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("ativos")}
            className={`flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all ${activeTab === "ativos" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Ativos ({activeDependents.length})
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all ${activeTab === "historico" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Histórico
          </button>
        </div>

        {/* ABA 1: AUTORIZAÇÕES (PENDENTES) */}
        {activeTab === "autorizacoes" && (
          <div className="space-y-4 pb-10">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-gray-100"
              >
                <div className="flex items-start">
                  <div
                    onClick={() => setSelectedSelfie(req)}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <img
                      src={req.avatar}
                      alt={req.name}
                      className="w-full h-full object-cover"
                    />
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
                    <p className="text-[12px] text-blue-600 font-medium mt-0.5">
                      Aguardando autorização
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Clube de Destino
                    </label>
                    <div className="relative">
                      <select
                        value={req.clubId}
                        onChange={(e) =>
                          updateRequestField(req.id, "clubId", e.target.value)
                        }
                        className="w-full appearance-none bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-200 text-[14px] text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                      >
                        {CLUBS.map((club) => (
                          <option key={club.id} value={club.id}>
                            {club.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Motivo do Acesso
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {MOTIVOS_ACESSO.map((motivo) => (
                        <button
                          key={motivo.id}
                          onClick={() =>
                            updateRequestField(req.id, "type", motivo.id)
                          }
                          className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                            req.type === motivo.id
                              ? "bg-gray-900 text-white shadow-sm"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {motivo.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Entrada
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
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-[14px] text-gray-900 font-semibold"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Saída
                      </label>
                      <input
                        type="date"
                        value={req.endDate}
                        onChange={(e) =>
                          updateRequestField(req.id, "endDate", e.target.value)
                        }
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-[14px] text-gray-900 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-gray-900">
                        Permitir criar convites?
                      </span>
                      <span className="text-[12px] text-gray-500">
                        Esta pessoa será um Autorizador.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={req.canManageAccess}
                        onChange={(e) =>
                          updateRequestField(
                            req.id,
                            "canManageAccess",
                            e.target.checked,
                          )
                        }
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-gray-100 pt-3.5 mt-4">
                  <button
                    onClick={() =>
                      setRevokeModal({
                        isOpen: true,
                        type: "pending",
                        depId: req.id,
                        name: req.name,
                        clubId: req.clubId,
                      })
                    }
                    className="flex-1 bg-white border border-red-200 text-red-600 font-semibold text-[15px] py-2.5 rounded-xl active:bg-red-50 flex items-center justify-center gap-1.5"
                  >
                    <X size={16} />
                    Recusar
                  </button>
                  <button
                    onClick={() => handleAccept(req)}
                    className="flex-1 bg-blue-600 text-white font-semibold text-[15px] py-2.5 rounded-xl active:bg-blue-700 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Check size={16} />
                    Autorizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA 2: ATIVOS */}
        {activeTab === "ativos" && (
          <div className="space-y-3 pb-10">
            {activeDependents.map((dep) => {
              const userClub = CLUBS.find((c) => c.id === dep.clubId);

              return (
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
                        <span
                          className={`inline-block px-2 py-0.5 text-white text-[11px] font-bold rounded-md ${userClub?.color || "bg-gray-500"}`}
                        >
                          {userClub?.name || "Clube"}
                        </span>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-md uppercase">
                          {dep.type}
                        </span>

                        {dep.canManageAccess && (
                          <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold rounded-md uppercase">
                            Autorizador
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
                          className="text-blue-600 text-[13px] font-medium mt-2 flex items-center"
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
                      {dep.guestList.map((guest) => (
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
                            // ABRE O MODAL AO INVÉS DE REVOGAR DIRETO
                            onClick={() =>
                              setRevokeModal({
                                isOpen: true,
                                type: "guest",
                                depId: dep.id,
                                guestId: guest.id,
                                name: guest.name,
                              })
                            }
                            className="text-red-500 text-[13px] font-medium flex items-center"
                          >
                            <X size={14} className="mr-1" /> Revogar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      // ABRE O MODAL AO INVÉS DE REVOGAR DIRETO
                      onClick={() =>
                        setRevokeModal({
                          isOpen: true,
                          type: "titular",
                          depId: dep.id,
                          name: dep.name,
                          clubId: dep.clubId,
                        })
                      }
                      className="text-red-500 text-[15px] font-medium px-4 py-1 active:bg-red-50 rounded-lg"
                    >
                      Revogar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ABA 3: HISTÓRICO GERAL */}
        {activeTab === "historico" && (
          <div className="space-y-3 pb-10">
            {historyDependents.map((item) => {
              const historicClub = CLUBS.find((c) => c.id === item.clubId);
              return (
                <div
                  key={item.id}
                  className="bg-white/60 rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100/50 opacity-80"
                >
                  <div>
                    <h3 className="text-[17px] font-medium text-gray-800">
                      {item.name}
                    </h3>
                    <div className="text-[13px] text-gray-500 mt-0.5 flex flex-col">
                      <span className="flex items-center gap-1 text-[12px] font-semibold text-gray-700 mt-0.5">
                        <MapPin size={12} />{" "}
                        {historicClub?.name || "Clube Geral"}
                      </span>
                      <span className="mt-1">
                        Até: {item.endDate} | Por: {item.cancelledBy}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[12px] font-medium rounded-md ${item.status === "Revogado" || item.status === "Recusado" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"}`}
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE REVOGAÇÃO/RECUSA */}
      {revokeModal?.isOpen && (
        <div
          onClick={() => setRevokeModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={28} strokeWidth={1.5} />
              </div>

              {/* Título dinâmico */}
              <h3 className="text-[20px] font-bold text-gray-900 mb-2">
                {revokeModal.type === "pending"
                  ? "Recusar Solicitação?"
                  : "Revogar Acesso?"}
              </h3>

              {/* Texto dinâmico */}
              <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
                Tem certeza que deseja{" "}
                {revokeModal.type === "pending"
                  ? "recusar a solicitação"
                  : "revogar o acesso"}{" "}
                de <strong className="text-gray-800">{revokeModal.name}</strong>
                ? Esta ação não pode ser desfeita.
              </p>

              <div className="w-full flex gap-3">
                <button
                  onClick={() => setRevokeModal(null)}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold text-[16px] py-3.5 rounded-xl active:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>

                {/* Botão dinâmico */}
                <button
                  onClick={confirmRevoke}
                  className="flex-1 bg-red-500 text-white font-semibold text-[16px] py-3.5 rounded-xl active:bg-red-600 shadow-sm transition-colors"
                >
                  {revokeModal.type === "pending"
                    ? "Sim, recusar"
                    : "Sim, revogar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualização de Selfie */}
      {selectedSelfie && (
        <div
          onClick={() => setSelectedSelfie(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/4] bg-gray-100">
              <img
                src={selectedSelfie.avatar}
                alt={selectedSelfie.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedSelfie(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedSelfie.name}
              </h3>
              <button
                onClick={() => setSelectedSelfie(null)}
                className="w-full bg-gray-900 text-white font-semibold text-[15px] py-3 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}
