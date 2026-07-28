import { useState } from "react";
import { ArrowLeft, HardHat, Briefcase, MessageCircleMore, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Props {
  cpfInicial: string;
  nomeInicial?: string;
  onVoltar: () => void;
  onConcluir: () => void;
}

export function CadastroPrestador({ cpfInicial, nomeInicial, onVoltar, onConcluir }: Props) {
  const [form, setForm] = useState({
    name: nomeInicial || "",
    cpf: cpfInicial, // Inicializa com o CPF que veio da tela de busca
    phone: "",
    empresa: "",
    tipo: "temporario",
    spot: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setForm({ ...form, cpf: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.cpf || !form.empresa) return;

    setIsSubmitting(true);

    // Cria o pré-cadastro + primeira autorização. Selfie/documento (e o background
    // check no Manager) só acontecem depois, quando o prestador falar com o Bot.
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      toast.success("Template para conclusão de cadastro enviado!");
    }, 1000);
  };

  const handleEnviarWhatsApp = () => {
    const phoneDigits = form.phone.replace(/\D/g, "");
    const text = encodeURIComponent(
      `Olá! A Portaria iniciou seu cadastro como Prestador de Serviço. Para concluir, envie uma selfie e um documento com foto: #${form.cpf.replace(/\D/g, "")}-cadastro#`
    );
    const target = phoneDigits ? `phone=55${phoneDigits}&` : "";
    window.open(`https://api.whatsapp.com/send?${target}text=${text}`, "_blank");
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Cadastrar Prestador</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Nome Completo</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Carlos Encanador"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">CPF</label>
                <input
                  required
                  value={form.cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Telefone (WhatsApp)</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Empresa (CNPJ)</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    required
                    value={form.empresa}
                    onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                    placeholder="Nome da Empresa ou CNPJ"
                    className="w-full bg-gray-50 border border-gray-200 pl-11 pr-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Tipo de Prestação</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, tipo: "temporario" })}
                    className={`py-3 px-2 rounded-xl text-[14px] font-bold border-2 transition-all ${
                      form.tipo === "temporario" ? "bg-gray-100 border-gray-900 text-gray-900" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    Temporário
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, tipo: "recorrente" })}
                    className={`py-3 px-2 rounded-xl text-[14px] font-bold border-2 transition-all ${
                      form.tipo === "recorrente" ? "bg-gray-100 border-gray-900 text-gray-900" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    Recorrente
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Destino no Clube</label>
                <input
                  value={form.spot}
                  onChange={(e) => setForm({ ...form, spot: e.target.value })}
                  placeholder="Ex: Cozinha, Manutenção, Apto 405"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-900 text-white font-bold text-[16px] py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <>
                      <HardHat size={20} /> Criar Pré-Cadastro
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-[22px] font-bold text-gray-900">Template para conclusão de cadastro enviado!</h2>
              <p className="text-[15px] text-gray-500 mt-2 max-w-sm">
                Para concluir, <strong className="text-gray-700">{form.name}</strong> precisa enviar selfie e
                documento com foto conversando com o Bot no WhatsApp. Depois disso, o
                acesso aguarda o background check no App Manager.
              </p>

              <div className="w-full max-w-xs mt-8 space-y-3">
                <button
                  onClick={handleEnviarWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold text-[15px] py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircleMore size={20} />
                  Enviar Link por WhatsApp
                </button>
                <button
                  onClick={onConcluir}
                  className="w-full bg-gray-100 text-gray-700 font-semibold text-[15px] py-3.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Voltar ao Menu <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
