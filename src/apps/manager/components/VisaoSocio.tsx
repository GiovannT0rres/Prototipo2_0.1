import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { User, Phone, Mail, MapPin, DollarSign, AlertCircle, ChevronLeft, Users2, Ticket } from "lucide-react";
import {
  MOCK_SOCIOS,
  MOCK_DEPENDENTES_ADMIN,
  MOCK_CONVIDADOS_ADMIN,
} from "../mocks/mockManager";

const STATUS_STYLE: Record<string, string> = {
  Ativo: "bg-emerald-50 text-emerald-700",
  Pendente: "bg-amber-50 text-amber-700",
  Expirado: "bg-gray-100 text-gray-500",
  Bloqueado: "bg-red-50 text-red-700",
};

type Tab = "dependentes" | "convidados";

export function VisaoSocio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const socio = MOCK_SOCIOS.find((s) => s.id === id) ?? MOCK_SOCIOS[0];
  const dependentes = MOCK_DEPENDENTES_ADMIN.filter((d) => d.titularId === socio.id);
  const convidados = MOCK_CONVIDADOS_ADMIN.filter((c) => c.titularId === socio.id);

  const [tab, setTab] = useState<Tab>("dependentes");

  // Mocked state to simulate ERP toggle for demonstration
  const [isInadimplente, setIsInadimplente] = useState(socio.inadimplente);

  useEffect(() => {
    setIsInadimplente(socio.inadimplente);
  }, [socio.id, socio.inadimplente]);

  const TABS: { id: Tab; label: string; icon: typeof Users2; count: number }[] = [
    { id: "dependentes", label: "Dependentes", icon: Users2, count: dependentes.length },
    { id: "convidados", label: "Convidados", icon: Ticket, count: convidados.length },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
         <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-gray-600" />
         </button>
         <div>
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Visão do Sócio</h1>
           <p className="text-[14px] text-gray-500 mt-1">Detalhes completos integrados ao ERP Forza.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

         {/* Perfil Principal */}
         <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(socio.name)}&background=random&size=128`} alt={socio.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-sm" />
            <div className="flex-1 space-y-4">
               <div>
                 <h2 className="text-[22px] font-bold text-gray-900">{socio.name}</h2>
                 <p className="text-[14px] text-gray-500 font-medium">{socio.categoria} • Título Nº {socio.id}</p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-700">
                     <User size={16} className="text-gray-400" />
                     <span className="text-[14px] font-medium">CPF: {socio.cpf}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                     <Phone size={16} className="text-gray-400" />
                     <span className="text-[14px] font-medium">{socio.telefone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                     <Mail size={16} className="text-gray-400" />
                     <span className="text-[14px] font-medium">{socio.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                     <MapPin size={16} className="text-gray-400" />
                     <span className="text-[14px] font-medium">Porto Alegre Country Club</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Situação Financeira */}
         <div className={`rounded-2xl p-6 shadow-sm border transition-colors ${isInadimplente ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-500 mb-4">Situação Financeira</h3>

            <div className="flex flex-col items-center justify-center text-center space-y-3">
               <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm ${isInadimplente ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {isInadimplente ? <AlertCircle size={32} /> : <DollarSign size={32} />}
               </div>

               <div>
                 <p className={`text-[20px] font-bold ${isInadimplente ? 'text-red-700' : 'text-emerald-700'}`}>
                    {isInadimplente ? 'Inadimplente' : 'Adimplente'}
                 </p>
                 <p className={`text-[13px] font-medium mt-1 ${isInadimplente ? 'text-red-600' : 'text-emerald-600'}`}>
                    {isInadimplente ? 'Possui mensalidades em aberto. Acessos bloqueados.' : 'Todas as mensalidades estão em dia.'}
                 </p>
               </div>
            </div>

            <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between">
               <span className="text-[12px] font-bold text-gray-500">Simular Retorno ERP:</span>
               <button
                 onClick={() => setIsInadimplente(!isInadimplente)}
                 className="text-[12px] font-bold bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm active:scale-95 transition-transform"
               >
                 Alternar Status
               </button>
            </div>
         </div>

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4">
          <p className="text-[12px] text-gray-400 font-medium">
            Definido pelo próprio sócio no app Check-in — aqui é só consulta.
          </p>
        </div>
        <div className="flex border-b border-gray-100 mt-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] font-semibold border-b-2 transition-all ${
                  tab === t.id ? "border-emerald-600 text-emerald-600 bg-emerald-50/30" : "border-transparent text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                {t.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${tab === t.id ? "bg-emerald-100" : "bg-gray-100"}`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-5 space-y-3">
          {tab === "dependentes" && (
            dependentes.length === 0 ? (
              <p className="text-[13px] text-gray-400 font-medium py-2 text-center">Nenhum dependente vinculado a este titular.</p>
            ) : (
              dependentes.map((dep) => (
                <div key={dep.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                    <User size={18} />
                  </div>
                  <span className="text-[14px] font-semibold text-gray-800 flex-1">
                    {dep.name}
                  </span>
                  <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-md shrink-0 ${STATUS_STYLE[dep.status]}`}>
                    {dep.status}
                  </span>
                </div>
              ))
            )
          )}

          {tab === "convidados" && (
            convidados.length === 0 ? (
              <p className="text-[13px] text-gray-400 font-medium py-2 text-center">Nenhum convidado patrocinado por este titular.</p>
            ) : (
              convidados.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                    <Ticket size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-gray-800 truncate">{c.name}</p>
                    <p className="text-[12px] text-gray-500">{c.tipo}</p>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-md shrink-0 ${STATUS_STYLE[c.status]}`}>
                    {c.status}
                  </span>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
