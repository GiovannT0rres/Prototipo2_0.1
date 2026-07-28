import { useState } from "react";
import { Users, ShieldCheck, Database } from "lucide-react";
import { GestaoSocios } from "./GestaoSocios";
import { GestaoAccessManagers } from "./GestaoAccessManagers";
import { Logs } from "./Logs";

type Tab = "socios" | "access-managers" | "historico";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "socios", label: "Sócios", icon: Users },
  { id: "access-managers", label: "Access Managers", icon: ShieldCheck },
  { id: "historico", label: "Histórico", icon: Database },
];

export function GestaoSociosHub() {
  const [tab, setTab] = useState<Tab>("socios");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition-colors ${
                tab === t.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "socios" && <GestaoSocios />}
      {tab === "access-managers" && <GestaoAccessManagers />}
      {tab === "historico" && <Logs />}
    </div>
  );
}
