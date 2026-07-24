import { useState, useEffect, useRef } from "react";
import { Mic, Paperclip, Smile, Send } from "lucide-react";
import { MOCK_CHAT } from "../mocks/mockBot";

export function ChatSimulator() {
  const [messages, setMessages] = useState<typeof MOCK_CHAT>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (currentIndex < MOCK_CHAT.length) {
      const nextMessage = MOCK_CHAT[currentIndex];
      
      if (nextMessage.type === "received") {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, nextMessage]);
          setCurrentIndex((prev) => prev + 1);
        }, 1500); // 1.5s typing
      } else {
        // Aguarda input do usuário para simular a mensagem "sent"
        // Neste simulador, vamos avançar automaticamente apenas para demonstração após 2s
        setTimeout(() => {
          setMessages((prev) => [...prev, nextMessage]);
          setCurrentIndex((prev) => prev + 1);
        }, 2000);
      }
    }
  }, [currentIndex]);

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
               {/* Seta do balão */}
               <div className={`absolute top-0 w-3 h-3 ${msg.type === "sent" ? "right-[-6px] bg-[#dcf8c6]" : "left-[-6px] bg-white"}`} style={{ clipPath: msg.type === "sent" ? "polygon(0 0, 0 100%, 100% 0)" : "polygon(100% 0, 0 0, 100% 100%)" }}></div>
               {msg.isPass ? (
                 <div className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm min-w-[200px]">
                   <div className="bg-[#075e54] text-white p-3 text-center">
                     <p className="font-bold text-[14px] uppercase tracking-wider">Passe de Acesso</p>
                     <p className="text-[11px] opacity-80">Clube Principal</p>
                   </div>
                   <div className="p-4 bg-white flex flex-col items-center justify-center">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FakePass123" alt="QR Code" className="w-32 h-32 mb-3" />
                      <p className="font-bold text-[16px] text-gray-900">João da Silva</p>
                      <p className="text-[12px] font-medium text-gray-500 mt-1 uppercase tracking-wider">Day Use • 15/06</p>
                   </div>
                   <div className="p-3 border-t border-gray-100 text-center">
                      <button className="text-[14px] font-bold text-[#00a884] uppercase">Adicionar à Carteira</button>
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
        <div ref={bottomRef} />
      </div>

      <div className="bg-transparent p-2 z-10 shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-white rounded-[24px] min-h-[44px] flex items-center px-3 gap-3 shadow-sm">
            <Smile size={24} className="text-gray-400" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Mensagem"
              className="flex-1 bg-transparent py-3 focus:outline-none text-[15.5px]"
            />
            <Paperclip size={22} className="text-gray-400 -rotate-45" />
          </div>
          <div className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
            {inputText.length > 0 ? <Send size={20} className="ml-1" /> : <Mic size={24} />}
          </div>
        </div>
      </div>
    </div>
  );
}
