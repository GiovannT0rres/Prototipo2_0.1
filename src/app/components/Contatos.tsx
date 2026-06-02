import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronDown, Check } from "lucide-react";
import { toast, Toaster } from "sonner";

// ATENÇÃO: Ajuste os caminhos de importação conforme a estrutura do seu projeto
import { CLUBS } from "./clubs"; 

// Mock dos contatos (Em um app real, isso viria de uma API ou de um Contexto)
const MOCK_CONTACTS = [
  {
    id: "c1",
    name: "Ana Silva Santos",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    email: "ana.silva@email.com",
  },
  {
    id: "c2",
    name: "Carlos Eduardo Lima",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    cpf: "987.654.321-11",
    phone: "(21) 99999-8888",
    email: "carlos.edu@email.com",
  },
  {
    id: "c3",
    name: "Mariana Costa Ramos",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    cpf: "456.123.789-22",
    phone: "(31) 98888-7777",
    email: "mari.costa@email.com",
  },
];

type ReauthorizeModalState = {
  isOpen: boolean;
  contact: typeof MOCK_CONTACTS[0];
} | null;

export function Contatos() {
  const navigate = useNavigate();
  
  // Estados locais da tela de contatos
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);
  const [reauthorizeModal, setReauthorizeModal] = useState<ReauthorizeModalState>(null);
  const [selectedClubId, setSelectedClubId] = useState(CLUBS[0]?.id || "1");

  const handleQuickReauthorize = (contact: typeof MOCK_CONTACTS[0]) => {
    const clubSelected = CLUBS.find((c) => c.id === selectedClubId);
    
    // TODO: Aqui você faria o POST para a sua API ou despacharia uma ação global
    // para adicionar este contato na lista de Ativos
    
    toast.success(`${contact.name} foi reautorizado em: ${clubSelected?.name}!`);
    setReauthorizeModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={() => navigate(-1)} // Volta para a tela anterior
            className="text-blue-600 flex items-center -ml-2 active:opacity-70"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
            <span className="text-[17px] -ml-1">Voltar</span>
          </button>
          <span className="text-[17px] font-semibold text-gray-900">
            Meus Contatos
          </span>
          <div className="w-10" /> {/* Espaçador para centralizar o título */}
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto w-full flex-1">
        <div className="mb-6">
          <p className="text-[14px] text-gray-500 leading-relaxed px-1">
            Pessoas que você já autorizou anteriormente. Toque em um contato para gerenciar detalhes ou renovar o acesso rapidamente.
          </p>
        </div>

        {/* LISTA DE CONTATOS FREQUENTES */}
        <div className="space-y-3 pb-10">
          {MOCK_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-gray-100 transition-all"
            >
              {/* Visualização Simplificada */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedContactId(expandedContactId === contact.id ? null : contact.id)}
              >
                <div className="flex items-center">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full border border-gray-100 object-cover shrink-0"
                  />
                  <div className="ml-3">
                    <h3 className="text-[16px] font-semibold text-gray-900 leading-tight">
                      {contact.name}
                    </h3>
                    <span className="text-[12px] text-gray-400 font-medium">
                      Ver detalhes
                    </span>
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-300 ${
                    expandedContactId === contact.id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Detalhes Expandidos (CPF, Telefone, E-mail + Ação de Reautorizar) */}
              {expandedContactId === contact.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3.5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        CPF
                      </span>
                      <span className="text-gray-800 font-semibold">{contact.cpf}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Telefone
                      </span>
                      <span className="text-gray-800 font-semibold">{contact.phone}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      E-mail
                    </span>
                    <span className="text-gray-800 font-semibold break-all">
                      {contact.email}
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSelectedClubId(CLUBS[0]?.id || "1");
                        setReauthorizeModal({ isOpen: true, contact });
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 active:bg-blue-800"
                    >
                      <Check size={18} />
                      Autorizar Novamente
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE REAUTORIZAÇÃO RÁPIDA */}
      {reauthorizeModal?.isOpen && (
        <div
          onClick={() => setReauthorizeModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center mb-4">
              <img
                src={reauthorizeModal.contact.avatar}
                alt={reauthorizeModal.contact.name}
                className="w-16 h-16 rounded-full border border-gray-200 object-cover shadow-sm mb-3"
              />
              <h3 className="text-[18px] font-bold text-gray-900 leading-tight">
                Nova Autorização Rápida
              </h3>
              <p className="text-[14px] text-gray-500 mt-1">
                Selecione o destino para{" "}
                <strong className="text-gray-700">{reauthorizeModal.contact.name}</strong>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Clube de Destino
                </label>
                <div className="relative">
                  <select
                    value={selectedClubId}
                    onChange={(e) => setSelectedClubId(e.target.value)}
                    className="w-full appearance-none bg-gray-50 px-3.5 py-3 rounded-xl border border-gray-200 text-[15px] text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500/20"
                  >
                    {CLUBS.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setReauthorizeModal(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold text-[15px] py-3.5 rounded-xl active:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleQuickReauthorize(reauthorizeModal.contact)}
                className="flex-1 bg-blue-600 text-white font-semibold text-[15px] py-3.5 rounded-xl active:bg-blue-700 shadow-sm transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}