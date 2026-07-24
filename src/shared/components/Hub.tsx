import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Shield, Smartphone, BarChart3, MessageCircle } from "lucide-react";

export function Hub() {
  const navigate = useNavigate();

  const cards = [
    {
      id: "check-in",
      title: "Check-in",
      description: "App do Sócio (Convites, Dependentes, Contatos)",
      icon: Smartphone,
      color: "bg-blue-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
      path: "/check-in",
    },
    {
      id: "concierge",
      title: "Portaria",
      description: "App Desktop (Validação e Controle de Acesso)",
      icon: Shield,
      color: "bg-gray-900",
      textColor: "text-gray-900",
      bgLight: "bg-gray-100",
      path: "/concierge",
    },
    {
      id: "manager",
      title: "Manager",
      description: "Dashboard Administrativo e Logs",
      icon: BarChart3,
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
      path: "/manager",
    },
    {
      id: "bot",
      title: "WhatsApp Bot",
      description: "Simulador de Atendimento Automatizado",
      icon: MessageCircle,
      color: "bg-[#25D366]",
      textColor: "text-[#25D366]",
      bgLight: "bg-[#25D366]/10",
      path: "/bot",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Entrada Segura Hub
          </h1>
          <p className="text-[15px] text-gray-500">
            Selecione a aplicação que deseja acessar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                onClick={() => navigate(card.path)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col items-start text-left transition-all hover:shadow-md"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${card.bgLight} ${card.textColor} flex items-center justify-center mb-5`}
                >
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h2 className="text-[20px] font-bold text-gray-900 mb-1">
                  {card.title}
                </h2>
                <p className="text-[14px] text-gray-500 line-clamp-2">
                  {card.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
