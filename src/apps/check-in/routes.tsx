import { Navigate } from "react-router";

import { Home } from "./components/Home";
import { EspacoDetail } from "./components/EspacoDetail";
import { GuestListPage } from "./components/GuestListPage";
import { Autorizacoes } from "./components/Autorizacoes";
import { Contatos } from "./components/Contatos";
import { GestaoDependentes } from "./components/GestaoDependentes";
import { PatrocinioConvidados } from "./components/PatrocinioConvidados";
import { EventosReservas } from "./components/EventosReservas";
import { Profile } from "@/shared/components/Profile";

function DefaultRedirect() {
  return <Navigate to="/check-in/espacos" replace />;
}

export const checkInRoutes = [
  { index: true, Component: DefaultRedirect },
  { path: "espacos", Component: Home },
  { path: "autorizacoes", Component: Autorizacoes },
  { path: "contatos", Component: Contatos },
  { path: "dependentes", Component: GestaoDependentes },
  { path: "patrocinio", Component: PatrocinioConvidados },
  { path: "reservas", Component: EventosReservas },
  { path: "profile", Component: Profile },
  { path: "espaco/:id", Component: EspacoDetail },
  { path: "espaco/:id/guests", Component: GuestListPage },
];
