import { NavLink } from "react-router";
import { Home, List, User } from "lucide-react";

export function BottomTabBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 pb-4 pt-1">
      <div className="flex justify-around items-center h-[50px] px-2 mt-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full gap-1 ${
              isActive ? "text-blue-600" : "text-gray-400"
            }`
          }
          end
        >
          <Home size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Início</span>
        </NavLink>

        <NavLink
          to="/logs"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full gap-1 ${
              isActive ? "text-blue-600" : "text-gray-400"
            }`
          }
        >
          <List size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Catraca</span>
        </NavLink>

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
