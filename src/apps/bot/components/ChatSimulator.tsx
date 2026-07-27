import { useState, useEffect, useRef } from "react";
import { Mic, Paperclip, Smile, Camera, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MENU_MESSAGE, MENU_OPTIONS, SCENARIOS, type ChatMessage, type ScenarioId } from "../mocks/mockBot";

export function ChatSimulator() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scenario, setScenario] = useState<ScenarioId | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [finished, setFinished] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showMenu]);

  // Mensagem inicial do menu
  useEffect(() => {
    setIsTyping(true);
    const t = setTimeout(() => {
      setIsTyping(false);
      setMessages([MENU_MESSAGE]);
      setShowMenu(true);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Roda o script do cenário escolhido, mensagem por mensagem
  useEffect(() => {
    if (!scenario) return;
    const script = SCENARIOS[scenario];

    if (currentIndex >= script.length) {
      setFinished(true);
      return;
    }

    const next = script[currentIndex];
    const delay = next.type === "received" ? 1400 : 900;

    if (next.type === "received") {
      setIsTyping(true);
      const t = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, next]);
        setCurrentIndex((i) => i + 1);
      }, delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setMessages((prev) => [...prev, next]);
        setCurrentIndex((i) => i + 1);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [scenario, currentIndex]);

  const handleSelectScenario = (id: ScenarioId) => {
    const label = MENU_OPTIONS.find((o) => o.id === id)?.label || "";
    setShowMenu(false);
    setMessages((prev) => [
      ...prev,
      { id: `choice_${id}`, type: "sent", text: label, time: "10:00" },
    ]);
    setScenario(id);
    setCurrentIndex(0);
  };

  const handleRestart = () => {
    setMessages([MENU_MESSAGE]);
    setScenario(null);
    setCurrentIndex(0);
    setFinished(false);
    setShowMenu(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-[#e1f3fb] text-[12.5px] text-center px-4 py-1.5 rounded-lg w-fit mx-auto shadow-sm text-gray-700">
          Hoje
        </div>
        <div className="bg-[#fcefc6] text-[12.5px] text-center px-4 py-2 rounded-lg shadow-sm text-gray-700 max-w-[90%] mx-auto leading-relaxed">
          🔒 As mensagens e as chamadas são protegidas com a criptografia de ponta a ponta.
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.type === "sent" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[85%] rounded-lg p-2 shadow-sm relative ${msg.type === "sent" ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"}`}>
              <div className={`absolute top-0 w-3 h-3 ${msg.type === "sent" ? "right-[-6px] bg-[#dcf8c6]" : "left-[-6px] bg-white"}`} style={{ clipPath: msg.type === "sent" ? "polygon(0 0, 0 100%, 100% 0)" : "polygon(100% 0, 0 0, 100% 100%)" }}></div>

              {msg.isPass ? (
                <div className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm min-w-[200px]">
                  <div className="bg-[#075e54] text-white p-3 text-center">
                    <p className="font-bold text-[14px] uppercase tracking-wider">Passe de Acesso</p>
                    <p className="text-[11px] opacity-80">Clube Principal</p>
                  </div>
                  <div className="p-4 bg-white flex flex-col items-center justify-center">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FakePass123" alt="QR Code" className="w-32 h-32 mb-3" />
                    <p className="font-bold text-[16px] text-gray-900">{msg.passInfo?.name}</p>
                    <p className="text-[12px] font-medium text-gray-500 mt-1 uppercase tracking-wider">{msg.passInfo?.subtitle}</p>
                  </div>
                  <div className="p-3 border-t border-gray-100 text-center">
                    <button className="text-[14px] font-bold text-[#00a884] uppercase">Adicionar à Carteira</button>
                  </div>
                </div>
              ) : msg.isSelfieReply ? (
                <div className="flex flex-col items-center bg-gray-100 rounded-lg overflow-hidden w-40">
                  <img src="https://i.pravatar.cc/300?u=selfie-confirm" alt="Selfie enviada" className="w-full h-40 object-cover" />
                  <div className="w-full bg-white px-2 py-1.5 flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <Camera size={12} /> Foto enviada
                  </div>
                </div>
              ) : (
                <p className="text-[15px] text-gray-900 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              )}

              <div className="flex justify-end mt-1">
                <span className="text-[11px] text-gray-500 font-medium">{msg.time}</span>
                {msg.type === "sent" && (
                  <svg viewBox="0 0 16 15" width="16" height="15" className="ml-1 text-[#53bdeb]"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm relative w-16 h-10 flex items-center justify-center gap-1">
              <div className="absolute top-0 left-[-6px] w-3 h-3 bg-white" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}

        {/* Menu de opções (quick replies) */}
        <AnimatePresence>
          {showMenu && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2 items-end"
            >
              {MENU_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectScenario(opt.id)}
                  className="bg-white border border-[#00a884] text-[#00a884] font-semibold text-[14px] px-4 py-2.5 rounded-full shadow-sm hover:bg-[#00a884]/5 active:scale-95 transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão para reiniciar ao final do fluxo */}
        <AnimatePresence>
          {finished && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-600 font-semibold text-[13px] px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
              >
                <RotateCcw size={13} /> Voltar ao menu
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      <div className="bg-transparent p-2 z-10 shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-white rounded-[24px] min-h-[44px] flex items-center px-3 gap-3 shadow-sm opacity-60">
            <Smile size={24} className="text-gray-400" />
            <input
              type="text"
              disabled
              placeholder="Use os botões acima para responder"
              className="flex-1 bg-transparent py-3 focus:outline-none text-[15.5px]"
            />
            <Paperclip size={22} className="text-gray-400 -rotate-45" />
          </div>
          <div className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
            <Mic size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
