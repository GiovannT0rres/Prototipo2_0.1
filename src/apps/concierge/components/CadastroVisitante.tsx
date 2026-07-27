import { useState } from "react";
import { ArrowLeft, UserPlus, Camera, CheckCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";

import { ESPACOS } from "@/shared/data/spaces";

// Tipos de acesso reais do clube (ver respostas_PERGUNTAS-PARA-O-CLUBE, seções A e F):
// visitante social (1 dia), visitante jogador (múltiplos dias), prestador de serviço,
// funcionário. Hoje a portaria só coleta CPF em papel — este cadastro digitaliza isso.
const TIPOS_VISITANTE = [
  { id: "social", label: "Convidado Social (1 dia)" },
  { id: "jogador", label: "Convidado Jogador" },
  { id: "prestador", label: "Prestador de Serviço" },
  { id: "funcionario", label: "Funcionário" },
];

interface Props {
  cpfInicial: string;
  onVoltar: () => void;
  onConcluir: () => void;
}

export function CadastroVisitante({ cpfInicial, onVoltar, onConcluir }: Props) {
  const [form, setForm] = useState({
    name: "",
    cpf: cpfInicial, // Inicializa com o CPF que veio da tela de busca
    phone: "",
    placa: "", // A liberação hoje é majoritariamente por placa (LPR já existe na portaria)
    tipo: TIPOS_VISITANTE[0].id,
    espacoId: ESPACOS[0]?.id || "1",
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
    if (!form.name || !form.cpf) return;
    
    setIsSubmitting(true);
    
    // Simulação de chamada na API
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      toast.success("Visitante cadastrado com sucesso!");
      
      // Aguarda 2 segundos para o usuário ler a mensagem de sucesso e conclui
      setTimeout(() => {
        onConcluir();
      }, 2000);
    }, 1000);
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Cadastrar Visitante</p>
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
              <div className="flex flex-col items-center gap-3 pb-2">
                <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
                  <Camera size={26} />
                </div>
                <button type="button" className="text-[13px] font-semibold text-gray-900">
                  Capturar Foto
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Nome Completo</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Fernando Oliveira"
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
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Telefone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Tipo de Acesso</label>
                <div className="flex flex-wrap gap-2">
                  {TIPOS_VISITANTE.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, tipo: t.id })}
                      className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                        form.tipo === t.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Espaço de Destino</label>
                <div className="relative">
                  <select
                    value={form.espacoId}
                    onChange={(e) => setForm({ ...form, espacoId: e.target.value })}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900"
                  >
                    {ESPACOS.map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Placa do Veículo (opcional)</label>
                <input
                  value={form.placa}
                  onChange={(e) => setForm({ ...form, placa: e.target.value.toUpperCase() })}
                  placeholder="ABC1D23"
                  maxLength={7}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900 uppercase"
                />
                <p className="text-[12px] text-gray-400 px-1">O LPR do clube já libera acesso por placa — vincula esta pessoa ao veículo.</p>
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
                      <UserPlus size={20} /> Concluir Cadastro
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
              className="p-10 flex flex-col items-center justify-center h-full text-center mt-10"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-[22px] font-bold text-gray-900">Visitante Cadastrado!</h2>
              <p className="text-[15px] text-gray-500 mt-2 max-w-sm">
                Retornando ao menu principal...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster position="top-center" richColors />
    </motion.div>
  );
}