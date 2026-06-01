import { Outlet } from "react-router";
import { BottomTabBar } from "./BottomTabBar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-[80px]">
      <Outlet />
      <BottomTabBar />
    </div>
  );
}
