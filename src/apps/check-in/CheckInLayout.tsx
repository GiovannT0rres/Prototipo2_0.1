import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Home } from "lucide-react";
import { BottomTabBar } from "./components/BottomTabBar";

export function CheckInLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-[80px]">
      <button
        onClick={() => navigate("/")}
        className="fixed top-3 right-3 z-50 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-full shadow-sm active:scale-95 transition-transform"
        title="Voltar ao Hub"
      >
        <Home size={17} className="text-gray-600" strokeWidth={1.8} />
      </button>
      <Outlet />
      <BottomTabBar />
    </div>
  );
}
