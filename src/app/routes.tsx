import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Logs } from "./components/Logs";
import { Profile } from "./components/Profile";
import { ClubDetail } from "./components/ClubDetail";
import { NewInvite } from "./components/NewInvite";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: Home },
      { path: "logs", Component: Logs },
      { path: "profile", Component: Profile },
      { path: "club/:id", Component: ClubDetail },
      { path: "club/:id/new-invite", Component: NewInvite },
    ],
  },
]);
