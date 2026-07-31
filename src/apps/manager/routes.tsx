import { Dashboard } from "./components/Dashboard";
import { DashboardAprovacoes } from "./components/DashboardAprovacoes";
import { GestaoSociosHub } from "./components/GestaoSociosHub";
import { VisaoSocio } from "./components/VisaoSocio";
import { AlertasSeguranca } from "./components/AlertasSeguranca";

export const managerRoutes = [
  { index: true, Component: Dashboard },
  { path: "aprovacoes", Component: DashboardAprovacoes },
  { path: "socios", Component: GestaoSociosHub },
  { path: "socio/:id", Component: VisaoSocio },
  { path: "alertas", Component: AlertasSeguranca },
];
