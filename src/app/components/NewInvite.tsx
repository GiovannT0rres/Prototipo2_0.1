import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Copy, Check } from "lucide-react";

export function NewInvite() {
  const navigate = useNavigate();
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
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

      <div className="p-4 pt-6 max-w-md mx-auto w-full flex-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          Novo Convite
        </h1>

        {!isGenerated ? (
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-4">
              {/* Picker / Select */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wide ml-1">
                  Motivo do Convite
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-white px-4 py-3.5 rounded-xl border border-gray-200 text-[17px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione um motivo...
                    </option>
                    <option value="familiar">Familiar</option>
                    <option value="dayuse">Day Use</option>
                    <option value="cuidador">Cuidador</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronLeft size={16} className="text-gray-400 rotate-[-90deg]" />
                  </div>
                </div>
              </div>

              {/* Data Início e Fim */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wide ml-1">
                  Validade do Acesso
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="text-[14px] text-gray-600 ml-1">Início</span>
                    <input
                      type="date"
                      className="w-full appearance-none bg-white px-4 py-3 rounded-xl border border-gray-200 text-[17px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="text-[14px] text-gray-600 ml-1">Fim</span>
                    <input
                      type="date"
                      className="w-full appearance-none bg-white px-4 py-3 rounded-xl border border-gray-200 text-[17px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold text-[17px] py-3.5 rounded-xl active:bg-blue-700 transition-colors mt-4"
            >
              Gerar Link de Convite
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center pt-8 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
              <Check size={32} strokeWidth={2} />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Convite Gerado!
            </h2>
            <p className="text-center text-[15px] text-gray-500 mb-8 px-4">
              O convidado finalizará o cadastro com nosso assistente virtual.
            </p>

            <div className="w-full mb-6 relative">
              <input
                type="text"
                readOnly
                value="https://clube.app/convite/ab12cd34"
                className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-4 pr-12 text-[15px] text-gray-600 outline-none"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 active:scale-95 transition-all"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>

            <button className="w-full bg-[#25D366] text-white font-semibold text-[17px] py-3.5 rounded-xl active:bg-[#1da851] transition-colors flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
                 <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
              </svg>
              Convidar via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
