import { Outlet } from "react-router";
import { Navigate } from "react-router";

import { CheckInLayout } from "./CheckInLayout";
import { Home } from "./components/Home";
import { ClubDetail } from "./components/ClubDetail";
import { GuestListPage } from "./components/GuestListPage";
import { Autorizacoes } from "./components/Autorizacoes";
import { Contatos } from "./components/Contatos";
import { GestaoDependentes } from "./components/GestaoDependentes";
import { PatrocinioConvidados } from "./components/PatrocinioConvidados";
import { EventosReservas } from "./components/EventosReservas";
import { Profile } from "@/shared/components/Profile";

function DefaultRedirect() {
  const lastClubId = localStorage.getItem("lastClubId") || "1";
  return <Navigate to={`/check-in/club/${lastClubId}`} replace />;
}

export const checkInRoutes = [
  { index: true, Component: DefaultRedirect },
  { path: "clubes", Component: Home },
  { path: "autorizacoes", Component: Autorizacoes },
  { path: "contatos", Component: Contatos },
  { path: "dependentes", Component: GestaoDependentes },
  { path: "patrocinio", Component: PatrocinioConvidados },
  { path: "reservas", Component: EventosReservas },
  { path: "profile", Component: Profile },
  { path: "club/:id", Component: ClubDetail },
  { path: "club/:id/guests", Component: GuestListPage },
];
