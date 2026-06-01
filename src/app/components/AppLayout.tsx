import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { BottomTabBar } from "./BottomTabBar";

export function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-[80px]">
      <Outlet />
      <BottomTabBar />
    </div>
  );
}

