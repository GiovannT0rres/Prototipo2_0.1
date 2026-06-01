import { useNavigate } from "react-router";
import { ChevronRight, MapPin } from "lucide-react";

const CLUBS = [
  {
    id: "1",
    name: "Country Club São Paulo",
    matricula: "123456-0",
    color: "bg-blue-600",
  },
  {
    id: "2",
    name: "Clube Pinheiros",
    matricula: "88990-2",
    color: "bg-emerald-600",
  },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="pt-12 px-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        Meus Clubes
      </h1>

      <div className="space-y-3">
        {CLUBS.map((club) => (
          <div
            key={club.id}
            onClick={() => navigate(`/club/${club.id}`)}
            className="bg-white rounded-2xl p-4 flex items-center shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
          >
            {/* Club Logo / Avatar */}
            <div
              className={`w-14 h-14 rounded-xl ${club.color} flex items-center justify-center text-white shrink-0`}
            >
              <MapPin size={24} strokeWidth={1.5} />
            </div>

            {/* Club Info */}
            <div className="ml-4 flex-1">
              <h2 className="text-[17px] font-semibold text-gray-900 leading-tight">
                {club.name}
              </h2>
              <p className="text-[15px] text-gray-500 mt-0.5">
                Matrícula {club.matricula}
              </p>
            </div>

            {/* Chevron */}
            <ChevronRight className="text-gray-300 ml-2" size={20} strokeWidth={2} />
          </div>
        ))}
      </div>
    </div>
  );
}
