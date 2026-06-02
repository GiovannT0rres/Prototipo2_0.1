import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ChevronLeft, User, Calendar, Search, X } from "lucide-react";
import { toast, Toaster } from "sonner";

// Dados mock dos 30 convidados da Maria Silva
const ALL_GUESTS_DATA: Record<
  string,
  { id: string; name: string; date: string; status: string; avatar: string }[]
> = {
  d1: [
    {
      id: "g1",
      name: "Lucas Silva",
      date: "01/06/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=lucas",
    },
    {
      id: "g2",
      name: "Julia Silva",
      date: "01/06/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=julia",
    },
    {
      id: "g3",
      name: "Rafael Mendes",
      date: "31/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=rafael",
    },
    {
      id: "g4",
      name: "Camila Rocha",
      date: "31/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=camila",
    },
    {
      id: "g5",
      name: "Pedro Henrique",
      date: "30/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=pedroh",
    },
    {
      id: "g6",
      name: "Fernanda Lima",
      date: "30/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=fernanda",
    },
    {
      id: "g7",
      name: "Gustavo Oliveira",
      date: "29/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=gustavo",
    },
    {
      id: "g8",
      name: "Isabela Santos",
      date: "29/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=isabela",
    },
    {
      id: "g9",
      name: "Thiago Ferreira",
      date: "28/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=thiago",
    },
    {
      id: "g10",
      name: "Larissa Costa",
      date: "28/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=larissa",
    },
    {
      id: "g11",
      name: "Bruno Martins",
      date: "27/05/2026",
      status: "Expirado",
      avatar: "https://i.pravatar.cc/150?u=bruno",
    },
    {
      id: "g12",
      name: "Amanda Pereira",
      date: "27/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=amanda",
    },
    {
      id: "g13",
      name: "Diego Almeida",
      date: "26/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=diego",
    },
    {
      id: "g14",
      name: "Natalia Souza",
      date: "26/05/2026",
      status: "Expirado",
      avatar: "https://i.pravatar.cc/150?u=natalia",
    },
    {
      id: "g15",
      name: "Marcos Paulo",
      date: "25/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=marcos",
    },
    {
      id: "g16",
      name: "Carolina Ribeiro",
      date: "25/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=carolina",
    },
    {
      id: "g17",
      name: "Felipe Gomes",
      date: "24/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=felipe",
    },
    {
      id: "g18",
      name: "Juliana Barros",
      date: "24/05/2026",
      status: "Expirado",
      avatar: "https://i.pravatar.cc/150?u=juliana",
    },
    {
      id: "g19",
      name: "Rodrigo Nunes",
      date: "23/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=rodrigo",
    },
    {
      id: "g20",
      name: "Beatriz Campos",
      date: "23/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=beatrizc",
    },
    {
      id: "g21",
      name: "Leonardo Dias",
      date: "22/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=leonardo",
    },
    {
      id: "g22",
      name: "Vanessa Teixeira",
      date: "22/05/2026",
      status: "Expirado",
      avatar: "https://i.pravatar.cc/150?u=vanessa",
    },
    {
      id: "g23",
      name: "André Moreira",
      date: "21/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=andre",
    },
    {
      id: "g24",
      name: "Patrícia Cardoso",
      date: "21/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=patricia",
    },
    {
      id: "g25",
      name: "Eduardo Vieira",
      date: "20/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=eduardo",
    },
    {
      id: "g26",
      name: "Mariana Araújo",
      date: "20/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=mariana",
    },
    {
      id: "g27",
      name: "Henrique Castro",
      date: "19/05/2026",
      status: "Expirado",
      avatar: "https://i.pravatar.cc/150?u=henrique",
    },
    {
      id: "g28",
      name: "Débora Pinto",
      date: "19/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=debora",
    },
    {
      id: "g29",
      name: "Ricardo Lopes",
      date: "18/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=ricardo",
    },
    {
      id: "g30",
      name: "Aline Monteiro",
      date: "18/05/2026",
      status: "Ativo",
      avatar: "https://i.pravatar.cc/150?u=aline",
    },
  ],
};

const PAGE_SIZE = 10;

export function GuestListPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const depId = searchParams.get("dep") || "d1";
  const depName = searchParams.get("name") || "Convidados";

  const [guests, setGuests] = useState(ALL_GUESTS_DATA[depId] || []);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const visibleGuests = filteredGuests.slice(0, displayCount);
  const hasMore = displayCount < filteredGuests.length;

  // Grouped by date for iOS-style sections
  const groupedGuests = visibleGuests.reduce<
    Record<string, typeof visibleGuests>
  >((acc, guest) => {
    if (!acc[guest.date]) acc[guest.date] = [];
    acc[guest.date].push(guest);
    return acc;
  }, {});

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) =>
        Math.min(prev + PAGE_SIZE, filteredGuests.length),
      );
      setIsLoading(false);
    }, 400);
  }, [isLoading, hasMore, filteredGuests.length]);

  // Revogar acesso de um convidado
  const handleRevoke = (guestId: string, guestName: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    toast.error(`Acesso de ${guestName} foi revogado.`);
  };

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "100px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Reset display count on search
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* iOS-style Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/80">
        <div className="flex items-center justify-between px-4 h-11">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 flex items-center -ml-2 active:opacity-70 transition-opacity"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
            <span className="text-[17px] -ml-1">Voltar</span>
          </button>
          <span className="text-[17px] font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Autorizados
          </span>
          <div className="w-16" />
        </div>
      </div>

      {/* Subtitle + count */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">
          Convidados de {depName}
        </h2>
        <p className="text-[14px] text-gray-400 mt-0.5">
          {filteredGuests.length}{" "}
          {filteredGuests.length === 1 ? "pessoa" : "pessoas"}
        </p>
      </div>

      {/* iOS-style Search Bar */}
      <div className="bg-white px-4 py-2 border-b border-gray-100">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar convidado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100/80 rounded-xl pl-9 pr-4 py-2 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border focus:border-blue-300 transition-all"
          />
        </div>
      </div>

      {/* Guest List - iOS grouped style */}
      <div className="flex-1 pb-8">
        {Object.entries(groupedGuests).map(([date, dateGuests]) => (
          <div key={date}>
            {/* Section Header */}
            <div className="px-4 py-1.5 bg-gray-50">
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-gray-400" />
                <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
                  {date}
                </span>
              </div>
            </div>

            {/* Section Items */}
            <div className="bg-white">
              {dateGuests.map((guest, idx) => (
                <div
                  key={guest.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    idx !== dateGuests.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  } bg-white`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {/* Avatar */}
                    <img
                      src={guest.avatar}
                      alt={guest.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = "none";
                        img.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 hidden">
                      <User size={18} className="text-gray-500" />
                    </div>

                    {/* Info */}
                    <div className="ml-3 flex-1 min-w-0">
                      <span className="text-[15px] font-medium text-gray-900 block truncate">
                        {guest.name}
                      </span>
                      <span className="text-[13px] text-gray-500">{date}</span>
                    </div>
                  </div>

                  {/* Status e Botão Revogar */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        guest.status === "Ativo"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {guest.status}
                    </span>
                    <button
                      onClick={() => handleRevoke(guest.id, guest.name)}
                      className="flex items-center text-red-500 text-[12px] font-medium active:opacity-70 transition-opacity"
                    >
                      <X size={12} className="mr-0.5" /> Revogar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-6">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-[13px] text-gray-400 font-medium">
                Carregando...
              </span>
            </div>
          </div>
        )}

        {/* Infinite scroll sentinel */}
        {hasMore && !isLoading && <div ref={sentinelRef} className="h-1" />}

        {/* End of list */}
        {!hasMore && filteredGuests.length > 0 && (
          <div className="text-center py-6">
            <span className="text-[13px] text-gray-400">— Fim da lista —</span>
          </div>
        )}

        {/* Empty search state */}
        {filteredGuests.length === 0 && (
          <div className="text-center py-16 px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search size={22} className="text-gray-400" />
            </div>
            <p className="text-[15px] font-medium text-gray-700 mb-1">
              Nenhum resultado
            </p>
            <p className="text-[13px] text-gray-400">
              Tente buscar com outro nome.
            </p>
          </div>
        )}

        {/* Page indicator - iOS style progress */}
        {guests.length > PAGE_SIZE && (
          <div className="flex justify-center items-center gap-3 py-4">
            <span className="text-[12px] text-gray-400 font-medium">
              {Math.min(displayCount, filteredGuests.length)} de{" "}
              {filteredGuests.length}
            </span>
            <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(Math.min(displayCount, filteredGuests.length) / filteredGuests.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}
