import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Logs } from "./components/Logs";
import { Profile } from "./components/Profile";
import { ClubDetail } from "./components/ClubDetail";
import { GuestListPage } from "./components/GuestListPage";
import { Autorizacoes } from "./components/Autorizacoes"; 
import { Contatos } from "./components/Contatos";// IMPORTAR A NOVA PÁGINA

function DefaultRedirect() {
  const lastClubId = localStorage.getItem("lastClubId") || "1";
  return <Navigate to={`/club/${lastClubId}`} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: DefaultRedirect },
      { path: "clubes", Component: Home },
      { path: "autorizacoes", Component: Autorizacoes }, // NOVA ROTA AQUI
      { path: "logs", Component: Logs },
      { path: "profile", Component: Profile },
      { path: "club/:id", Component: ClubDetail }, // O ClubDetail agora é o ecrã do convite
      { path: "club/:id/guests", Component: GuestListPage },
      { path: "contatos", Component: Contatos },
    ],
  },
]);