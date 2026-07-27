import { Dashboard } from "./components/Dashboard";
import { DashboardAprovacoes } from "./components/DashboardAprovacoes";
import { GestaoPrestadores } from "./components/GestaoPrestadores";
import { VisaoSocio } from "./components/VisaoSocio";
import { Logs } from "./components/Logs";

export const managerRoutes = [
  { index: true, Component: Dashboard },
  { path: "aprovacoes", Component: DashboardAprovacoes },
  { path: "prestadores", Component: GestaoPrestadores },
  { path: "socio/:id", Component: VisaoSocio },
  { path: "logs", Component: Logs },
];
