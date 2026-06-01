import { NavLink, useNavigate } from "react-router";
import { Home, List, User } from "lucide-react";

export function BottomTabBar() {
  const navigate = useNavigate();

  const handleInicioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const lastClubId = localStorage.getItem("lastClubId");
    if (lastClubId) {
      navigate(`/club/${lastClubId}`);
    } else {
      navigate("/");
    }
  };

  // Verifica se estamos na rota de um clube para destacar o botão Início
  const isClubRoute = location.pathname.startsWith("/club/") || location.pathname === "/";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 pb-4 pt-1">
      <div className="flex justify-around items-center h-[50px] px-2 mt-1">
        <NavLink
          to="/logs"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full gap-1 ${
              isActive ? "text-blue-600" : "text-gray-400"
            }`
          }
        >
          <List size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Entradas</span>
        </NavLink>

        <button
          onClick={handleInicioClick}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
            isClubRoute ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <Home size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Início</span>
        </button>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full gap-1 ${
              isActive ? "text-blue-600" : "text-gray-400"
            }`
          }
        >
          <User size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Perfil</span>
        </NavLink>
      </div>
    </div>
  );
}
