import { createBrowserRouter } from "react-router";

// Shared
import { Hub } from "@/shared/components/Hub";
import { Login } from "@/shared/components/Login";

// Apps Routes
import { CheckInLayout } from "@/apps/check-in/CheckInLayout";
import { checkInRoutes } from "@/apps/check-in/routes";

import { ConciergeLayout } from "@/apps/concierge/ConciergeLayout";
import { conciergeRoutes } from "@/apps/concierge/routes";

import { ManagerLayout } from "@/apps/manager/ManagerLayout";
import { managerRoutes } from "@/apps/manager/routes";

import { BotLayout } from "@/apps/bot/BotLayout";
import { botRoutes } from "@/apps/bot/routes";

export const router = createBrowserRouter([
  { path: "/", Component: Hub },
  { path: "/login", Component: Login },
  
  // Check-in App
  {
    path: "/check-in",
    Component: CheckInLayout,
    children: checkInRoutes,
  },

  // Concierge App
  {
    path: "/concierge",
    Component: ConciergeLayout,
    children: conciergeRoutes,
  },

  // Manager App
  {
    path: "/manager",
    Component: ManagerLayout,
    children: managerRoutes,
  },

  // Bot App
  {
    path: "/bot",
    Component: BotLayout,
    children: botRoutes,
  },
]);