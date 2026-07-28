import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronDown, Copy, Check } from "lucide-react";

import { MOCK_CONTACTS } from "../mocks/mockCheckIn";

export function Contatos() {
  const navigate = useNavigate();

  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Convites são sempre um código que o convidado usa para conversar com o Bot
  // e concluir o próprio cadastro — nunca uma liberação instantânea pelo app.
  const inviteUrl = (contactId: string) => `go.paccclube.com.br/convite/${contactId}`;

  const handleCopy = (contact: (typeof MOCK_CONTACTS)[0]) => {
    navigator.clipboard.writeText(inviteUrl(contact.id));
    setCopiedId(contact.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsApp = (contact: (typeof MOCK_CONTACTS)[0]) => {
    const phoneDigits = contact.phone.replace(/\D/g, "");
    const text = encodeURIComponent(`Olá quero concluir o meu check-in: #${contact.id}-conv2026#`);
    window.open(`https://api.whatsapp.com/send?phone=55${phoneDigits}&text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 flex items-center -ml-2 active:opacity-70"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
            <span className="text-[17px] -ml-1">Voltar</span>
          </button>
          <span className="text-[17px] font-semibold text-gray-900">
            Meus Contatos
          </span>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto w-full flex-1">
        <div className="mb-6">
          <p className="text-[14px] text-gray-500 leading-relaxed px-1">
            Como os contatos salvos no seu celular. Toque em alguém para reenviar
            o convite de acesso por WhatsApp — o próprio convidado conclui o
            cadastro conversando com o Bot do clube.
          </p>
        </div>

        <div className="space-y-3 pb-10">
          {MOCK_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-4 flex flex-col shadow-sm border border-gray-100 transition-all"
            >
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
                      {contact.phone}
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

                  <div className="pt-1">
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Endereço do Convite
                    </span>
                    <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl py-3 pl-3.5 pr-11 text-[14px] text-gray-800 font-medium">
                      <span className="truncate">{inviteUrl(contact.id)}</span>
                      <button
                        onClick={() => handleCopy(contact)}
                        className="absolute right-2.5 p-1.5 text-gray-400 hover:text-gray-600 active:scale-95 transition-all"
                      >
                        {copiedId === contact.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleWhatsApp(contact)}
                    className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold text-[15px] py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                    </svg>
                    Convidar via WhatsApp
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
