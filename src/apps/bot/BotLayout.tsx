import { Outlet } from "react-router";
import { ArrowLeft, Home, MoreVertical, Phone, Video } from "lucide-react";
import { useNavigate } from "react-router";

export function BotLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#ece5dd] font-sans flex flex-col items-center">
      <div className="w-full max-w-md h-screen flex flex-col shadow-2xl relative bg-[#e5ddd5]">
         {/* Fundo do WhatsApp (simulado) */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")', backgroundSize: 'cover' }}></div>

        {/* Header Verde do WhatsApp */}
        <div className="bg-[#075e54] text-white flex items-center justify-between px-3 py-3 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="active:bg-white/20 p-1 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=bot" alt="Bot" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[16px] leading-tight">Clube Bot</span>
                <span className="text-[12px] text-white/80">online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Video size={20} />
            <Phone size={20} />
            <button onClick={() => navigate("/")} title="Voltar ao Hub" className="active:opacity-70 transition-opacity">
              <Home size={20} />
            </button>
            <MoreVertical size={20} />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
