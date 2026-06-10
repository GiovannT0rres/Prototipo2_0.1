import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ChevronDown,
  MapPin,
  AlertTriangle,
  Clock,
  Monitor,
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
import { PortariaDesktop } from "./PortariaDesktop";

type RevokeModalState = {
  isOpen: boolean;
  type: "titular" | "guest" | "pending";
  depId: string;
  guestId?: string;
  name: string;
  clubId?: string;
} | null;

// ── Slide-to-Approve Component ──────────────────────────────────────────────
function SlideToApprove({ onApprove }: { onApprove: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0); // 0-1
  const [done, setDone] = useState(false);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);

  const THRESHOLD = 0.78;

  const getTrackWidth = () => trackRef.current?.clientWidth ?? 260;
  const getThumbWidth = () => thumbRef.current?.clientWidth ?? 52;

  const handleStart = (clientX: number) => {
    if (done) return;
    setDragging(true);
    startXRef.current = clientX;
    startProgressRef.current = progress;
  };

  const handleMove = (clientX: number) => {
    if (!dragging || done) return;
    const maxX = getTrackWidth() - getThumbWidth() - 6;
    const delta = clientX - startXRef.current;
    const raw = startProgressRef.current + delta / maxX;
    const clamped = Math.max(0, Math.min(1, raw));
    setProgress(clamped);
    if (clamped >= THRESHOLD) {
      setDone(true);
      setDragging(false);
      setTimeout(() => {
        onApprove();
        setDone(false);
        setProgress(0);
      }, 380);
    }
  };

  const handleEnd = () => {
    if (!done) {
      setDragging(false);
      setProgress(0);
    }
  };

  const maxX = getTrackWidth() - getThumbWidth() - 6;
  const thumbX = Math.round(progress * maxX);
  const labelOpacity = Math.max(0, 1 - progress * 3);

  return (
    <div
      ref={trackRef}
      className="relative h-[52px] bg-blue-600 rounded-full select-none overflow-hidden"
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Track label */}
      <span
        className="absolute inset-0 flex items-center justify-center text-white/90 text-[15px] font-semibold pointer-events-none tracking-wide transition-opacity"
        style={{ opacity: labelOpacity }}
      >
        {done ? "Autorizado ✓" : "Deslize para autorizar →"}
      </span>

      {/* Thumb */}
      <div
        ref={thumbRef}
        className="absolute top-[3px] left-[3px] w-[46px] h-[46px] rounded-full bg-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all"
        style={{
          transform: `translateX(${thumbX}px)`,
          transition: dragging ? "none" : "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          backgroundColor: done ? "#22c55e" : "white",
        }}
        onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX); }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      >
        {done ? (
          <Check size={22} className="text-white" strokeWidth={3} />
        ) : (
          <ChevronRight size={22} className="text-blue-600" strokeWidth={2.5} />
        )}
      </div>
    </div>
  );
}



export function Autorizacoes() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [activeTab, setActiveTab] = useState<
    "autorizacoes" | "ativos" | "historico"
  >("autorizacoes");
  const [expandedDependentId, setExpandedDependentId] = useState<string | null>(null);
  const [showAllGuests, setShowAllGuests] = useState(false);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const [activeDependents, setActiveDependents] = useState(DEPENDENTS_ACTIVE);
  const [pendingRequests, setPendingRequests] = useState(INITIAL_PENDING);
  const [historyDependents, setHistoryDependents] = useState(DEPENDENTS_HISTORY);

  const [selectedSelfie, setSelectedSelfie] = useState<{
    name: string;
    avatar: string;
    cpf: string;
    phone: string;
  } | null>(null);

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
    const label = MOTIVOS_ACESSO.find((m) => m.id === req.type)?.label || "Visitante";
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
      startDate: req.startDate,
      type: MOTIVOS_ACESSO.find((m) => m.id === req.type)?.label || "Visitante",
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
          const updatedList = dep.guestList.filter((g) => g.id !== revokeModal.guestId);
          return { ...dep, guestList: updatedList, invites: updatedList.length };
        }),
      );
      toast.error(`Acesso de ${revokeModal.name} foi revogado.`);
    } else if (revokeModal.type === "titular") {
      setActiveDependents((prev) => prev.filter((d) => d.id !== revokeModal.depId));
      setHistoryDependents((prev) => [
        {
          id: `h_rev_${Date.now()}`,
          name: revokeModal.name,
          clubId: revokeModal.clubId || "1",
          status: "Revogado",
          endDate: new Date().toLocaleDateString("pt-BR"),
          cancelledBy: "Titular",
          startDate: new Date().toLocaleDateString("pt-BR"),
          type: "—",
        },
        ...prev,
      ]);
      toast.error(`Acesso de ${revokeModal.name} revogado.`);
    } else if (revokeModal.type === "pending") {
      setHistoryDependents((prev) => [
        {
          id: `h_new_${Date.now()}`,
          name: revokeModal.name,
          clubId: revokeModal.clubId || "1",
          status: "Recusado",
          endDate: new Date().toLocaleDateString("pt-BR"),
          cancelledBy: "Titular",
          startDate: new Date().toLocaleDateString("pt-BR"),
          type: "—",
        },
        ...prev,
      ]);
      setPendingRequests((prev) => prev.filter((p) => p.id !== revokeModal.depId));
      toast.error(`A solicitação de ${revokeModal.name} foi recusada.`);
    }
    setRevokeModal(null);
  };

  if (viewMode === "desktop") {
    return <PortariaDesktop onToggleView={() => setViewMode("mobile")} />;
  }

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col">
      {/* ── iOS Glassmorphism Navigation Bar ─────────────── */}
      <div className="bg-white/75 backdrop-blur-xl sticky top-0 z-20 border-b border-black/[0.08]">
        <div className="flex items-center justify-between px-4 h-[44px]">
          <button
            onClick={() => navigate("/clubes")}
            className="text-[#007AFF] flex items-center -ml-2 ios-press"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
            <span className="text-[17px] -ml-1 font-normal">Início</span>
          </button>
          <span className="text-[17px] font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Painel Geral
          </span>
          <button
            onClick={() => setViewMode("desktop")}
            className="flex items-center gap-1.5 text-[#007AFF] ios-press"
            title="Modo Portaria Desktop"
          >
            <Monitor size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>



      <div className="px-4 pt-3 max-w-md mx-auto w-full flex-1">
        {/* ── Segmented Control ─────────────────────────── */}
        <div className="bg-black/[0.065] p-[3px] rounded-[10px] flex mb-5">
          {(["autorizacoes", "ativos", "historico"] as const).map((tab) => {
            const labels = {
              autorizacoes: "Autorizações",
              ativos: `Ativos (${activeDependents.length})`,
              historico: "Histórico",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-[13px] font-semibold py-[6px] rounded-[8px] transition-all relative ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {labels[tab]}
                {tab === "autorizacoes" && pendingRequests.length > 0 && (
                  <span className="ml-1 bg-[#007AFF] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════
            ABA 1: AUTORIZAÇÕES (PENDENTES)
        ═══════════════════════════════════════════════ */}
        {activeTab === "autorizacoes" && (
          <div className="space-y-3 pb-10">
            {pendingRequests.length === 0 && (
              <div className="flex flex-col items-center py-16 px-6 text-center animate-fade-blur-in">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Check size={28} className="text-green-500" strokeWidth={2} />
                </div>
                <p className="text-[17px] font-semibold text-gray-800">Tudo em dia</p>
                <p className="text-[14px] text-gray-400 mt-1">Nenhuma autorização pendente.</p>
              </div>
            )}

            {pendingRequests.map((req, i) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl flex flex-col shadow-sm border border-black/[0.05] overflow-hidden animate-spring-slide-up ios-press"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Header clicável */}
                <div
                  className="flex items-center p-4 cursor-pointer"
                  onClick={() => setExpandedRequestId(expandedRequestId === req.id ? null : req.id)}
                >
                  <div
                    onClick={(e) => { e.stopPropagation(); setSelectedSelfie(req); }}
                    className="w-[60px] h-[60px] rounded-[14px] overflow-hidden border border-black/[0.06] shadow-sm shrink-0 cursor-pointer"
                  >
                    <img src={req.avatar} alt={req.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-3.5 flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[16px] font-semibold text-gray-900 leading-tight truncate">
                        {req.name}
                      </h3>
                      <span className="text-[11px] text-gray-400 ml-2 shrink-0">{req.requestDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 border border-amber-200 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                        <Clock size={9} />
                        Aguardando
                      </span>
                      <span className="text-[11px] text-gray-400">{req.cpf}</span>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-gray-300 ml-2 shrink-0 transition-transform duration-300 ${
                      expandedRequestId === req.id ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Conteúdo expansível */}
                {expandedRequestId === req.id && (
                  <div className="px-4 pb-5 space-y-4 border-t border-gray-100 pt-4 animate-fade-blur-in">
                    {/* Clube */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Clube de Destino
                      </label>
                      <div className="relative">
                        <select
                          value={req.clubId}
                          onChange={(e) => updateRequestField(req.id, "clubId", e.target.value)}
                          className="w-full appearance-none bg-[#f2f2f7] px-3.5 py-2.5 rounded-xl border-0 text-[15px] text-gray-900 font-semibold focus:ring-2 focus:ring-[#007AFF]/20"
                        >
                          {CLUBS.map((club) => (
                            <option key={club.id} value={club.id}>{club.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Motivo */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Motivo
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {MOTIVOS_ACESSO.map((motivo) => (
                          <button
                            key={motivo.id}
                            onClick={() => updateRequestField(req.id, "type", motivo.id)}
                            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                              req.type === motivo.id
                                ? "bg-gray-900 text-white"
                                : "bg-[#f2f2f7] text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {motivo.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Datas */}
                    <div className="flex gap-3">
                      {[
                        { field: "startDate" as const, label: "Entrada", value: req.startDate },
                        { field: "endDate" as const, label: "Saída", value: req.endDate },
                      ].map(({ field, label, value }) => (
                        <div key={field} className="flex-1 flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                          <input
                            type="date"
                            value={value}
                            onChange={(e) => updateRequestField(req.id, field, e.target.value)}
                            className="w-full bg-[#f2f2f7] border-0 px-3 py-2.5 rounded-xl text-[14px] text-gray-900 font-semibold"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Permitir convites */}
                    <div className="bg-[#f2f2f7] p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[14px] font-semibold text-gray-900">Permitir criar convites</span>
                        <p className="text-[12px] text-gray-400 mt-0.5">Será um Autorizador</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={req.canManageAccess}
                          onChange={(e) => updateRequestField(req.id, "canManageAccess", e.target.checked)}
                        />
                        <div className="w-[51px] h-[31px] bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[20px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[27px] after:w-[27px] after:transition-all after:shadow-sm peer-checked:bg-[#34C759]" />
                      </label>
                    </div>

                    {/* Slide to Approve + Recusar */}
                    <div className="space-y-2.5 pt-1">
                      <SlideToApprove
                        onApprove={() => {
                          handleAccept(req);
                          setExpandedRequestId(null);
                        }}
                      />
                      <button
                        onClick={() =>
                          setRevokeModal({ isOpen: true, type: "pending", depId: req.id, name: req.name, clubId: req.clubId })
                        }
                        className="w-full bg-[#f2f2f7] text-red-500 font-semibold text-[15px] py-3 rounded-xl ios-press"
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            ABA 2: ATIVOS
        ═══════════════════════════════════════════════ */}
        {activeTab === "ativos" && (
          <div className="space-y-2.5 pb-10">
            {activeDependents.map((dep, i) => {
              const userClub = CLUBS.find((c) => c.id === dep.clubId);
              const isExpanded = expandedDependentId === dep.id;

              return (
                <div
                  key={dep.id}
                  className="bg-white rounded-2xl flex flex-col shadow-sm border border-black/[0.05] overflow-hidden animate-spring-slide-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center p-4">
                    <ImageWithFallback
                      src={dep.avatar}
                      alt={dep.name}
                      className="w-[46px] h-[46px] rounded-full border border-black/[0.06] object-cover shrink-0 shadow-sm"
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <h3 className="text-[16px] font-semibold text-gray-900 leading-tight">{dep.name}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {userClub && (
                          <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-md uppercase tracking-wide ${userClub.color || "bg-gray-500"}`}>
                            {userClub.name}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
                          {dep.type}
                        </span>
                        {dep.canManageAccess && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-md uppercase tracking-wide">
                            Autorizador
                          </span>
                        )}
                      </div>

                      {dep.invites > 0 && (
                        <button
                          onClick={() => {
                            setExpandedDependentId(isExpanded ? null : dep.id);
                            setShowAllGuests(false);
                          }}
                          className="text-[#007AFF] text-[13px] font-medium mt-1.5 flex items-center ios-press"
                        >
                          {isExpanded ? "Ocultar últimas permissões" : `Últimas permissões (${dep.invites})`}
                          <ChevronRight
                            size={13}
                            className={`ml-0.5 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
                          />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setRevokeModal({ isOpen: true, type: "titular", depId: dep.id, name: dep.name, clubId: dep.clubId })
                      }
                      className="text-red-500 text-[14px] font-semibold px-3 py-1.5 rounded-xl bg-red-50 ios-press ml-2 shrink-0"
                    >
                      Revogar
                    </button>
                  </div>

                  {/* Últimas permissões */}
                  {isExpanded && dep.guestList && (
                    <div className="border-t border-gray-100 animate-fade-blur-in">
                      {(showAllGuests ? dep.guestList : dep.guestList.slice(0, 10)).map((guest, idx, arr) => (
                        <div
                          key={guest.id}
                          className={`flex items-center justify-between px-4 py-3 ${idx < arr.length - 1 ? "border-b border-gray-50" : ""}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-medium text-gray-900 truncate">{guest.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md uppercase">
                                {(guest as any).type || "Convidado"}
                              </span>
                              <span className="text-[12px] text-gray-400">
                                {(guest as any).startDate} – {(guest as any).endDate || guest.date}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setRevokeModal({ isOpen: true, type: "guest", depId: dep.id, guestId: guest.id, name: guest.name })
                            }
                            className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center ios-press ml-3 shrink-0"
                          >
                            <X size={13} className="text-red-500" strokeWidth={2.5} />
                          </button>
                        </div>
                      ))}
                      {dep.guestList.length > 10 && (
                        <button
                          onClick={() => navigate(`/club/${dep.clubId || "1"}/guests?dep=${dep.id}&name=${encodeURIComponent(dep.name)}`)}
                          className="w-full py-3.5 text-[#007AFF] font-semibold text-[14px] text-center border-t border-gray-100 ios-press bg-gray-50/50"
                        >
                          Ver todos →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            ABA 3: HISTÓRICO
        ═══════════════════════════════════════════════ */}
        {activeTab === "historico" && (
          <div className="space-y-2.5 pb-10">
            {historyDependents.map((item, i) => {
              const historicClub = CLUBS.find((c) => c.id === item.clubId);
              const isExpanded = expandedHistoryId === item.id;
              const isNegative = item.status === "Revogado" || item.status === "Recusado";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-black/[0.05] overflow-hidden ios-press animate-spring-slide-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                  onClick={() => setExpandedHistoryId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center px-4 py-3.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-semibold text-gray-900 truncate">{item.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={11} className="text-gray-400 shrink-0" />
                        <span className="text-[12px] font-medium text-gray-500 truncate">
                          {historicClub?.name || "Clube Geral"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          isNegative ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-300 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-gray-50 animate-fade-blur-in">
                      <div className="bg-[#f2f2f7] rounded-xl p-3.5 space-y-2.5 mt-2">
                        {[
                          { label: "Motivo", value: (item as any).type || "—" },
                          { label: "Início", value: (item as any).startDate || "—" },
                          { label: "Término", value: item.endDate },
                          { label: "Ação por", value: item.cancelledBy },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between items-center">
                            <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
                            <span className="text-[13px] font-semibold text-gray-800">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {historyDependents.length === 0 && (
              <div className="flex flex-col items-center py-16 text-center animate-fade-blur-in">
                <p className="text-[15px] font-medium text-gray-400">Nenhum histórico ainda.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal de Revogação ───────────────────────────── */}
      {revokeModal?.isOpen && (
        <div
          onClick={() => setRevokeModal(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-blur-in"
        >
          <div
            className="bg-white w-full max-w-sm rounded-t-[28px] overflow-hidden shadow-2xl flex flex-col animate-spring-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-5" />
            <div className="px-6 pb-4 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-[20px] font-bold text-gray-900 mb-2">
                {revokeModal.type === "pending" ? "Recusar?" : "Revogar Acesso?"}
              </h3>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
                Tem certeza que deseja {revokeModal.type === "pending" ? "recusar a solicitação" : "revogar o acesso"} de{" "}
                <strong className="text-gray-800">{revokeModal.name}</strong>?
              </p>
              <div className="w-full space-y-2.5">
                <button
                  onClick={confirmRevoke}
                  className="w-full bg-red-500 text-white font-semibold text-[16px] py-4 rounded-2xl ios-press shadow-sm"
                >
                  {revokeModal.type === "pending" ? "Sim, recusar" : "Sim, revogar"}
                </button>
                <button
                  onClick={() => setRevokeModal(null)}
                  className="w-full bg-[#f2f2f7] text-gray-600 font-semibold text-[16px] py-4 rounded-2xl ios-press"
                >
                  Cancelar
                </button>
              </div>
            </div>
            <div className="h-5" /> {/* Safe area */}
          </div>
        </div>
      )}

      {/* ── Modal Selfie ─────────────────────────────────── */}
      {selectedSelfie && (
        <div
          onClick={() => setSelectedSelfie(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-spring-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/4] bg-gray-100">
              <img src={selectedSelfie.avatar} alt={selectedSelfie.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedSelfie(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center ios-press"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-[18px] font-bold text-gray-900">{selectedSelfie.name}</h3>
              <p className="text-[14px] text-gray-500 mt-0.5">{selectedSelfie.cpf}</p>
              <button
                onClick={() => setSelectedSelfie(null)}
                className="w-full mt-4 bg-gray-900 text-white font-semibold text-[15px] py-3.5 rounded-2xl ios-press"
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
