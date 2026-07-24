import { PortariaDesktop } from "./components/PortariaDesktop";
import { DashboardPresenca } from "./components/DashboardPresenca";

export const conciergeRoutes = [
  { index: true, Component: PortariaDesktop },
  { path: "presenca", Component: DashboardPresenca },
];
