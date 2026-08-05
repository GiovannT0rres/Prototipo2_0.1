import { Busca } from "./components/Busca";
import { Perfil } from "./components/Perfil";
import { Notificacoes } from "./components/Notificacoes";

export const managerRoutes = [
  { index: true, Component: Busca },
  { path: "pessoa/:id", Component: Perfil },
  { path: "notificacoes", Component: Notificacoes },
];
