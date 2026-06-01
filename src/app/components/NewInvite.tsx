import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Copy, Check } from "lucide-react";

export function NewInvite() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const inviteUrl = "go.entradasegura.com.br/exemplo123";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Olá quero concluir o meu check-in: #f3a76d40-5434-42c4-b73f-62a0db7b4c07#`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans animate-in fade-in duration-300">
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center px-4 h-12">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 flex items-center -ml-2 active:opacity-70"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
            <span className="text-[17px] -ml-1">Voltar</span>
          </button>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto w-full flex-1 flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key">
            <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 1.5 1.5M15.5 7.5 14 6"></path>
          </svg>
        </div>

        <h1 className="text-[24px] font-bold tracking-tight text-gray-900 mb-2 text-center">
          iToken de Acesso
        </h1>
        <p className="text-center text-[15px] text-gray-500 mb-8 px-4 leading-relaxed">
          O convidado utilizará este link para realizar o cadastro e liberar o acesso.
        </p>

        <div className="w-full mb-6 relative">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
            Endereço do iToken
          </div>
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl py-3.5 pl-4 pr-12 text-[15px] text-gray-800 font-medium shadow-sm w-full">
            <span className="truncate">{inviteUrl}</span>
            <button
              onClick={handleCopy}
              className="absolute right-2.5 top-[38px] p-2 text-gray-400 hover:text-gray-600 active:scale-95 transition-all"
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <button 
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white font-semibold text-[17px] py-4 rounded-2xl active:bg-[#1da851] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
             <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
          </svg>
          Convidar via WhatsApp
        </button>
      </div>
    </div>
  );
}

