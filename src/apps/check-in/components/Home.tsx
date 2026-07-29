import { useNavigate } from "react-router";
import { ChevronRight, Building2, FileText, Contact, Users, UserPlus, Calendar } from "lucide-react";
import { useRef, useState } from "react";

import { CLUBS } from "../../../shared/data/clubs";

interface Authorization {
  id: string;
  title: string;
  status: string;
  date: string;
}

const AUTHORIZATIONS: Authorization[] = [
  { id: "101", title: "Entrada de Visitante (João)", status: "Aprovado", date: "Hoje, 14:30" },
  { id: "102", title: "Reserva do Salão Social 1", status: "Pendente", date: "Amanhã, 10:00" },
];

export function Home() {
  const navigate = useNavigate();

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 2. FUNÇÕES DO MOUSE
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (!sliderRef.current) return;
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault(); 
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.0; 
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">

      {/* SEÇÃO DOS CLUBES — gerar convite/passe de acesso por clube */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          Clubes
        </h1>
        {/* CONTÊINER COM EVENTOS DE ARRASTO */}
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto gap-4 pb-4 snap-x select-none scrollbar-hide ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
        >
          {CLUBS.map((club) => (
            <div
              key={club.id}
              onClick={() => {
                if (!isDragging) navigate(`/check-in/clube/${club.id}`);
              }}
              className="bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-gray-100 active:scale-[0.98] transition-transform w-40 h-40 shrink-0 snap-start"
            >
              <div className={`w-12 h-12 rounded-full ${club.color} flex items-center justify-center text-white`}>
                <Building2 size={22} strokeWidth={1.5} />
              </div>

              <div>
                <h2 className="text-[15px] font-semibold text-gray-900 leading-tight line-clamp-2">
                  {club.name}
                </h2>
                {club.matricula && (
                  <p className="text-[13px] text-gray-500 mt-1">
                    Matrícula {club.matricula}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 my-2" />

      {/* ATALHOS — mesmas seções já disponíveis na barra lateral, em formato de grid pra tela larga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[
          { path: "/check-in/autorizacoes", label: "Autorizações", icon: FileText },
          { path: "/check-in/contatos", label: "Contatos", icon: Contact },
          { path: "/check-in/dependentes", label: "Gestão de Dependentes", icon: Users },
          { path: "/check-in/patrocinio", label: "Patrocínio de Visitantes", icon: UserPlus },
          { path: "/check-in/reservas", label: "Eventos e Reservas", icon: Calendar },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="bg-white flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <item.icon size={20} strokeWidth={2} />
              </div>
              <span className="text-[15px] font-medium text-gray-900">
                {item.label}
              </span>
            </div>
            <ChevronRight size={20} className="text-gray-400 shrink-0" strokeWidth={1.5} />
          </button>
        ))}
      </div>

    </div>
  );
}