import { useState } from "react";
import {
  Search,
  Shield,
  Smartphone,
  MapPin,
  Calendar,
  Phone,
  CreditCard,
  CheckCircle2,
  X,
  ZoomIn,
  LogIn,
  ChevronDown,
  Navigation
} from "lucide-react";
import { Toaster } from "sonner";

/* ─── Mock Data Temporário ──────────────────────────────────── */
const CLUBS = [
  { id: "c1", name: "Condomínio Sunset" },
  { id: "c2", name: "Clube das Águas" },
  { id: "c3", name: "Residencial Bosque" },
];

const MOCK_AUTHORIZATIONS = [
  {
    id: "1",
    name: "João Silva",
    avatar: "https://i.pravatar.cc/150?u=joao",
    cpf: "111.222.333-44",
    phone: "(11) 98888-7777",
    spot: "MERCADO",
    reason: "Prestador de Serviço",
    details: "Reposição de Bebidas",
    period: "10/06 a 11/06",
    accessLocation: "Portão de Serviços",
    status: "No local",
    clubId: "c1",
  },
  {
    id: "2",
    name: "Maria Souza",
    avatar: "https://i.pravatar.cc/150?u=maria",
    cpf: "555.666.777-88",
    phone: "(11) 99999-0000",
    spot: "CAMPO 2",
    reason: "Visitante",
    details: "Jogo de Futebol",
    period: "10/06 a 10/06",
    accessLocation: "Portaria Principal",
    status: "Autorizado",
    clubId: "c1",
  },
  {
    id: "3",
    name: "Carlos Encanador",
    avatar: "https://i.pravatar.cc/150?u=carlos",
    cpf: "999.888.777-66",
    phone: "(11) 97777-5555",
    spot: "APTO 405",
    reason: "Manutenção",
    details: "Reparo Hidráulico",
    period: "05/06 a 15/06",
    accessLocation: "Garagem Subsolo",
    status: "No local",
    clubId: "c2",
  },
];

const TAGS = [
  { id: "todos", label: "Todos" },
  { id: "dentro", label: "No local" },
  { id: "autorizado", label: "Autorizados" },
  { id: "prestador", label: "Prestadores" },
  { id: "visitante", label: "Visitantes" },
];

/* ─── Types ─────────────────────────────────────────────────── */
type PhotoModalState = {
  name: string;
  avatar: string;
  cpf: string;
  phone: string;
  reason: string;
  spot: string;
} | null;

/* ─── Components ────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  if (status === "No local") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700 border border-green-200">
        <LogIn size={12} /> No local
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
      <CheckCircle2 size={12} /> Autorizado
    </span>
  );
}

function PhotoModal({ person, onClose }: { person: PhotoModalState; onClose: () => void }) {
  if (!person) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm mx-4 animate-spring-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={person.avatar} alt={person.name} className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xl font-bold">{person.name}</p>
            <p className="text-sm opacity-80 mt-0.5 font-medium flex items-center gap-1.5">
              <Navigation size={13} /> Destino: {person.spot}
            </p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <CreditCard size={16} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">CPF</p>
              <p className="text-sm font-semibold">{person.cpf}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Phone size={16} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Telefone</p>
              <p className="text-sm font-semibold">{person.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-2 bg-gray-900 text-white font-semibold text-[15px] py-3 rounded-2xl hover:bg-gray-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
interface PortariaDesktopProps {
  onToggleView?: () => void;
}

export function PortariaDesktop({ onToggleView }: PortariaDesktopProps) {
  const [selectedClub, setSelectedClub] = useState(CLUBS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("todos");
  const [photoModal, setPhotoModal] = useState<PhotoModalState>(null);

  /* ── Filtros combinados ── */
  const filteredData = MOCK_AUTHORIZATIONS.filter((req) => {
    if (req.clubId !== selectedClub) return false;

    const matchSearch =
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.cpf.includes(searchQuery) ||
      req.spot.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchSearch) return false;

    if (activeTag === "dentro") return req.status === "No local";
    if (activeTag === "autorizado") return req.status === "Autorizado";
    if (activeTag === "prestador") return req.reason.includes("Prestador") || req.reason.includes("Manutenção");
    if (activeTag === "visitante") return req.reason.includes("Visitante");
    
    return true; 
  });

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      {/* ── Top Bar ────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-[70px] flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[15px] font-extrabold text-gray-900 leading-tight">PORTARIA</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mt-0.5">
                  Painel de Leitura
                </p>
              </div>
            </div>

            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

            {/* Seletor Multi-Condomínio Minimalista */}
            <div className="relative hidden md:flex items-center">
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="appearance-none bg-transparent border-none text-[15px] font-bold text-gray-800 pr-6 py-2 cursor-pointer focus:outline-none focus:ring-0"
              >
                {CLUBS.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-[13px] text-gray-500 font-medium hidden lg:block capitalize">
              {today}
            </p>
            {onToggleView && (
              <button
                onClick={onToggleView}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-[13px] font-semibold rounded-xl hover:bg-gray-800 transition-colors shrink-0"
              >
                <Smartphone size={15} />
                <span className="hidden sm:inline">Modo Celular</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        
        {/* ── Área de Busca e Tags ──────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou local (ex: Mercado, Apto)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mr-2">
              Filtros:
            </span>
            {TAGS.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(tag.id)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all border ${
                  activeTag === tag.id
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Lista Principal (Visão Única) ─────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Tabela Header (7 Colunas agora) */}
          <div className="grid grid-cols-[72px_1.5fr_1fr_1.5fr_1fr_1.2fr_120px] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
            {["Foto", "Visitante / ID", "Destino", "Motivo", "Período", "Entrada", "Status"].map((h) => (
              <span key={h} className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                {h}
              </span>
            ))}
          </div>

          {/* Linhas */}
          <div className="divide-y divide-gray-50">
            {filteredData.length === 0 ? (
              <div className="p-16 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                  <Search size={28} className="text-gray-300" />
                </div>
                <p className="text-lg font-bold text-gray-800">Nenhum registro encontrado</p>
                <p className="text-sm text-gray-400 mt-1">Nenhum acesso para este filtro hoje.</p>
              </div>
            ) : (
              filteredData.map((req) => (
                <div
                  key={req.id}
                  className="grid grid-cols-[72px_1.5fr_1fr_1.5fr_1fr_1.2fr_120px] gap-4 px-6 py-5 items-center hover:bg-gray-50/70 transition-colors group"
                >
                  {/* Foto */}
                  <div className="relative">
                    <img
                      src={req.avatar}
                      alt={req.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 shadow-sm cursor-pointer group-hover:border-blue-300 transition-colors"
                      onClick={() =>
                        setPhotoModal({
                          name: req.name,
                          avatar: req.avatar,
                          cpf: req.cpf,
                          phone: req.phone,
                          reason: req.reason,
                          spot: req.spot
                        })
                      }
                    />
                    <button
                      onClick={() =>
                        setPhotoModal({
                          name: req.name,
                          avatar: req.avatar,
                          cpf: req.cpf,
                          phone: req.phone,
                          reason: req.reason,
                          spot: req.spot
                        })
                      }
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ZoomIn size={11} className="text-white" />
                    </button>
                  </div>

                  {/* Nome / CPF */}
                  <div className="min-w-0 pr-2">
                    <p className="text-[14px] font-bold text-gray-900 truncate">{req.name}</p>
                    <p className="text-[12px] text-gray-500 font-mono mt-0.5">{req.cpf}</p>
                  </div>

                  {/* Destino (Spot) */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-gray-900 text-white uppercase tracking-wider">
                      {req.spot}
                    </span>
                  </div>

                  {/* Motivo */}
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-bold bg-gray-100 text-gray-700 border border-gray-200 mb-1">
                      {req.reason}
                    </span>
                    <p className="text-[12px] text-gray-500 line-clamp-1">{req.details}</p>
                  </div>

                  {/* Período (Dias) */}
                  <div className="text-[13px] text-gray-700 font-medium flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{req.period}</span>
                  </div>

                  {/* Local de Acesso */}
                  <div className="text-[13px] text-gray-700 font-medium flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{req.accessLocation}</span>
                  </div>

                  {/* Status */}
                  <div>
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      <PhotoModal person={photoModal} onClose={() => setPhotoModal(null)} />
      <Toaster position="top-right" richColors />
    </div>
  );
}