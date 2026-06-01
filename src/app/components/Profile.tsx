import { useNavigate } from "react-router";
import { User, Settings, Bell, LogOut, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="pt-12 px-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        Perfil
      </h1>

      <div className="bg-white rounded-2xl p-4 flex items-center shadow-sm border border-gray-100 mb-6">
        <ImageWithFallback
          src="https://i.pravatar.cc/150?u=titular"
          alt="Avatar"
          className="w-16 h-16 rounded-full border border-gray-100 object-cover"
        />
        <div className="ml-4 flex-1">
          <h2 className="text-[19px] font-semibold text-gray-900 leading-tight">
            Fernando Silva
          </h2>
          <p className="text-[15px] text-gray-500 mt-0.5">Sócio Titular</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <button className="w-full flex items-center p-4 border-b border-gray-100 active:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
            <User size={18} />
          </div>
          <span className="flex-1 text-left text-[17px] text-gray-900">Meus Dados</span>
          <ChevronRight size={20} className="text-gray-300" />
        </button>

        <button className="w-full flex items-center p-4 border-b border-gray-100 active:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
            <Bell size={18} />
          </div>
          <span className="flex-1 text-left text-[17px] text-gray-900">Notificações</span>
          <ChevronRight size={20} className="text-gray-300" />
        </button>

        <button className="w-full flex items-center p-4 active:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mr-3">
            <Settings size={18} />
          </div>
          <span className="flex-1 text-left text-[17px] text-gray-900">Configurações</span>
          <ChevronRight size={20} className="text-gray-300" />
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-white rounded-2xl p-4 flex items-center justify-center shadow-sm border border-gray-100 text-red-600 font-semibold text-[17px] active:bg-red-50 transition-colors"
      >
        <LogOut size={20} className="mr-2" />
        Sair da Conta
      </button>
    </div>
  );
}
