import { useNavigate } from "react-router";
import { ChevronRight, MapPin, FileText, Contact, Users, UserPlus, Calendar } from "lucide-react";
import { useRef, useState } from "react";

import { CLUBS } from "@/shared/data/clubs";

interface Authorization {
  id: string;
  title: string;
  status: string;
  date: string;
}

const AUTHORIZATIONS: Authorization[] = [
  { id: "101", title: "Entrada de Visitante (João)", status: "Aprovado", date: "Hoje, 14:30" },
  { id: "102", title: "Reserva da Churrasqueira", status: "Pendente", date: "Amanhã, 10:00" },
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
    <div className="pt-12 max-w-md mx-auto pb-10">
      
      {/* SEÇÃO DOS CLUBES */}
      <div className="px-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          Portarias
        </h1>
        {/* CONTÊINER COM EVENTOS DE ARRASTO */}
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x select-none scrollbar-hide ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
        >
          {CLUBS.map((club) => (
            <div
              key={club.id}
              onClick={() => {
                if (!isDragging) navigate(`/check-in/club/${club.id}`);
              }}
              className="bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-gray-100 active:scale-[0.98] transition-transform w-40 h-40 shrink-0 snap-start"
            >
              <div className={`w-12 h-12 rounded-full ${club.color} flex items-center justify-center text-white`}>
                <MapPin size={22} strokeWidth={1.5} />
              </div>

              <div>
                <h2 className="text-[15px] font-semibold text-gray-900 leading-tight line-clamp-2">
                  {club.name}
                </h2>
                <p className="text-[13px] text-gray-500 mt-1">
                  Mat. {club.matricula}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-100 my-2" />

      {/* BOTÃO DE AUTORIZAÇÕES */}
      <div className="px-4 mt-6">
        <button
          onClick={() => navigate('/check-in/autorizacoes')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] active:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText size={20} strokeWidth={2} />
            </div>
            <span className="text-[17px] font-medium text-gray-900">
              Autorizações
            </span>
          </div>
          <ChevronRight size={22} className="text-gray-400" strokeWidth={1.5} />
        </button>
      </div>

      {/* BOTÃO DE CONTATOS */}
      <div className="px-4 mt-6">
        <button
          onClick={() => navigate('/check-in/contatos')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] active:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Contact size={20} strokeWidth={2} />
            </div>
            <span className="text-[17px] font-medium text-gray-900">
              Contatos
            </span>
          </div>
          <ChevronRight size={22} className="text-gray-400" strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-4 mt-6">
        <button
          onClick={() => navigate('/check-in/dependentes')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] active:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} strokeWidth={2} />
            </div>
            <span className="text-[17px] font-medium text-gray-900">
              Gestão de Dependentes
            </span>
          </div>
          <ChevronRight size={22} className="text-gray-400" strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-4 mt-6">
        <button
          onClick={() => navigate('/check-in/patrocinio')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] active:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <UserPlus size={20} strokeWidth={2} />
            </div>
            <span className="text-[17px] font-medium text-gray-900">
              Patrocínio de Visitantes
            </span>
          </div>
          <ChevronRight size={22} className="text-gray-400" strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-4 mt-6">
        <button
          onClick={() => navigate('/check-in/reservas')}
          className="w-full bg-white flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] active:bg-gray-50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar size={20} strokeWidth={2} />
            </div>
            <span className="text-[17px] font-medium text-gray-900">
              Eventos e Reservas
            </span>
          </div>
          <ChevronRight size={22} className="text-gray-400" strokeWidth={1.5} />
        </button>
      </div>

    </div>
  );
}
