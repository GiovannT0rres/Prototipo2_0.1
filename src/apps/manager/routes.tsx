import { Dashboard } from "./components/Dashboard";
import { DashboardAprovacoes } from "./components/DashboardAprovacoes";
import { GestaoPrestadores } from "./components/GestaoPrestadores";
import { GestaoSocios } from "./components/GestaoSocios";
import { VisaoSocio } from "./components/VisaoSocio";
import { Logs } from "./components/Logs";
import { MapaOperacional } from "./components/MapaOperacional";
import { GestaoDependentes } from "./components/GestaoDependentes";
import { GestaoAccessManagers } from "./components/GestaoAccessManagers";
import { HierarquiaAutorizacoes } from "./components/HierarquiaAutorizacoes";
import { AlertasSeguranca } from "./components/AlertasSeguranca";

export const managerRoutes = [
  { index: true, Component: Dashboard },
  { path: "aprovacoes", Component: DashboardAprovacoes },
  { path: "prestadores", Component: GestaoPrestadores },
  { path: "socios", Component: GestaoSocios },
  { path: "socio/:id", Component: VisaoSocio },
  { path: "logs", Component: Logs },
  { path: "mapa", Component: MapaOperacional },
  { path: "dependentes", Component: GestaoDependentes },
  { path: "gestores-eventos", Component: GestaoAccessManagers },
  { path: "hierarquia", Component: HierarquiaAutorizacoes },
  { path: "alertas", Component: AlertasSeguranca },
];
