import { Clock } from "lucide-react";

const LOGS = [
  {
    id: "l1",
    name: "Fernando Silva",
    role: "Titular",
    location: "Portaria Principal",
    date: "Hoje",
    time: "10:30 AM",
    type: "entry",
  },
  {
    id: "l2",
    name: "Maria Silva",
    role: "Filho(a)",
    location: "Piscina Coberta",
    date: "Hoje",
    time: "09:15 AM",
    type: "entry",
  },
  {
    id: "l3",
    name: "Carlos (Motorista)",
    role: "Prestador",
    location: "Estacionamento Subsolo",
    date: "Ontem",
    time: "05:45 PM",
    type: "exit",
  },
  {
    id: "l4",
    name: "Fernando Silva",
    role: "Titular",
    location: "Portaria Principal",
    date: "Ontem",
    time: "08:00 AM",
    type: "entry",
  },
];

export function Logs() {
  return (
    <div className="pt-12 px-4 max-w-md mx-auto h-full flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        Movimentações
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {LOGS.map((log, index) => (
          <div
            key={log.id}
            className={`p-4 flex items-start ${
              index !== LOGS.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="mt-1 bg-gray-100 p-2 rounded-full text-gray-500 mr-3 shrink-0">
              <Clock size={16} strokeWidth={2} />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">
                  {log.name}
                </h3>
                <span className="text-[13px] text-gray-500 ml-2 whitespace-nowrap">
                  {log.date}, {log.time}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[13px] text-gray-500">{log.role}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-[13px] font-medium text-gray-700">
                  {log.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
