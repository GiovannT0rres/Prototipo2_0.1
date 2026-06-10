import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ChevronLeft, User, Search, X, Clock } from "lucide-react";
import { toast, Toaster } from "sonner";

import { DEPENDENTS_ACTIVE } from "../../mock/mockAutorizacoes";

const PAGE_SIZE = 15;

export function GuestListPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const depId = searchParams.get("dep") || "d1";
  const depName = searchParams.get("name") || "Convidados";

  const dep = DEPENDENTS_ACTIVE.find((d) => d.id === depId);
  const initialGuests =
    dep?.guestList?.map((g) => ({
      ...g,
      status: "Ativo",
      avatar: `https://i.pravatar.cc/150?u=${g.id}`,
      type: (g as any).type || "Visitante",
      startDate: (g as any).startDate || (g as any).date,
      endDate: (g as any).endDate || (g as any).date,
    })) || [];

  const [guests, setGuests] = useState(initialGuests);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const visibleGuests = filteredGuests.slice(0, displayCount);
  const hasMore = displayCount < filteredGuests.length;

  // Grouped by startDate for iOS-style sections
  const groupedGuests = visibleGuests.reduce<
    Record<string, typeof visibleGuests>
  >((acc, guest) => {
    const key = guest.startDate || guest.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(guest);
    return acc;
  }, {});

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, filteredGuests.length));
      setIsLoading(false);
    }, 350);
  }, [isLoading, hasMore, filteredGuests.length]);

  const handleRevoke = (guestId: string, guestName: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    toast.error(`Acesso de ${guestName} foi revogado.`);
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "120px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => { setDisplayCount(PAGE_SIZE); }, [searchQuery]);

  const total = filteredGuests.length;
  const shown = Math.min(displayCount, total);
  const progressPct = total > 0 ? (shown / total) * 100 : 100;

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col font-sans">

      {/* ── iOS Navigation Bar ─────────────── */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-20 border-b border-black/[0.08]">
        <div className="flex items-center justify-between px-4 h-[44px]">
          <button
            onClick={() => navigate(-1)}
            className="text-[#007AFF] flex items-center -ml-2 ios-press"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
            <span className="text-[17px] -ml-1 font-normal">Voltar</span>
          </button>
          <span className="text-[17px] font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Autorizados
          </span>
          <div className="w-16" />
        </div>
      </div>

      {/* ── Subtitle ─────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3">
        <p className="text-[22px] font-bold text-gray-900 leading-tight">{depName}</p>
        <p className="text-[14px] text-gray-400 mt-0.5">
          {total} {total === 1 ? "permissão" : "permissões"}
        </p>
      </div>

      {/* ── Search Bar ───────────────────── */}
      <div className="bg-white px-4 py-2.5 border-b border-gray-100 sticky top-[44px] z-10">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f2f2f7] rounded-[10px] pl-8 pr-8 py-2 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none border-0"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center ios-press"
            >
              <X size={10} className="text-white" strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* ── Guest List ───────────────────── */}
      <div className="flex-1 pb-8">
        {Object.entries(groupedGuests).map(([date, dateGuests]) => (
          <div key={date}>
            {/* Section Header */}
            <div className="px-4 py-2 bg-[#f2f2f7]">
              <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
                Entrada: {date}
              </span>
            </div>

            {/* Section Items */}
            <div className="bg-white mx-0">
              {dateGuests.map((guest, idx) => (
                <div
                  key={guest.id}
                  className={`flex items-center justify-between px-4 py-3.5 ${
                    idx !== dateGuests.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={guest.avatar}
                        alt={guest.name}
                        className="w-[42px] h-[42px] rounded-full object-cover border border-black/[0.06] shadow-sm"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          img.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="w-[42px] h-[42px] rounded-full bg-gray-200 flex items-center justify-center shrink-0 hidden">
                        <User size={18} className="text-gray-500" />
                      </div>
                      {/* Status dot */}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          guest.status === "Ativo" ? "bg-green-500" : "bg-red-400"
                        }`}
                      />
                    </div>

                    {/* Info */}
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-[16px] font-semibold text-gray-900 truncate leading-tight">
                        {guest.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-[5px]">
                          {guest.type}
                        </span>
                        <span className="text-[12px] text-gray-400 flex items-center gap-0.5">
                          <Clock size={10} className="shrink-0" />
                          {guest.startDate}{guest.endDate !== guest.startDate ? ` – ${guest.endDate}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Revogar */}
                  <button
                    onClick={() => handleRevoke(guest.id, guest.name)}
                    className="ml-3 shrink-0 flex items-center gap-1 text-red-500 font-semibold text-[13px] bg-red-50 px-2.5 py-1.5 rounded-xl ios-press"
                  >
                    <X size={12} strokeWidth={2.5} />
                    Revogar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-[#007AFF] rounded-full animate-spin" />
          </div>
        )}

        {/* Infinite scroll sentinel */}
        {hasMore && !isLoading && <div ref={sentinelRef} className="h-1" />}

        {/* Progress bar */}
        {total > PAGE_SIZE && (
          <div className="flex justify-center items-center gap-3 py-5 px-6">
            <span className="text-[12px] text-gray-400 font-medium">{shown} de {total}</span>
            <div className="flex-1 h-[3px] bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
              <div
                className="h-full bg-[#007AFF] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Empty search */}
        {filteredGuests.length === 0 && (
          <div className="flex flex-col items-center py-20 px-6 text-center animate-fade-blur-in">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Search size={24} className="text-gray-300" />
            </div>
            <p className="text-[17px] font-semibold text-gray-700">Sem resultados</p>
            <p className="text-[14px] text-gray-400 mt-1">
              Tente buscar com outro nome.
            </p>
          </div>
        )}

        {/* End of list */}
        {!hasMore && filteredGuests.length > 0 && filteredGuests.length > PAGE_SIZE && (
          <div className="text-center py-6">
            <span className="text-[13px] text-gray-300 font-medium">— Fim da lista —</span>
          </div>
        )}
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}
