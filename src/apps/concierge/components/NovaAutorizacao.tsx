import { useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ESPACOS } from "@/shared/data/spaces";

// Mesmo sentinel usado em Check-in/Autorizacoes.tsx — liberação pro clube
// inteiro em vez de um espaço específico.
const CLUBE_INTEIRO_ID = "all";

interface Props {
  dados: any;
  onConcluir: () => void;
  onVoltar: () => void;
}

export function NovaAutorizacao({ dados, onConcluir, onVoltar }: Props) {
  // O perfil já foi definido no cadastro da pessoa (Check-in, evento ou
  // CadastroVisitante/CadastroPrestador do Concierge) — a portaria só
  // consulta, não redefine quem a pessoa é.
  const perfil: string = dados?.type || "Visitante";
  const temLivreAcesso = perfil === "Sócio Titular" || perfil === "Familiar";
  const isPrestador = perfil === "Prestador de Serviço";

  const [espacoId, setEspacoId] = useState(
    temLivreAcesso ? CLUBE_INTEIRO_ID : ESPACOS[0]?.id || "1"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const destinoLabel =
        espacoId === CLUBE_INTEIRO_ID
          ? "Clube Inteiro"
          : ESPACOS.find((c) => c.id === espacoId)?.name;
      toast.success(`Acesso autorizado: ${dados?.name} → ${destinoLabel}`);
      setTimeout(onConcluir, 1500);
    }, 1000);
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Nova Autorização</p>
          <p className="text-[12px] text-gray-500 font-medium">{dados?.name || "Usuário"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider block">Perfil</label>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
            <span className="text-[15px] font-bold text-gray-900">{perfil}</span>
            <p className="text-[12px] text-gray-400 mt-0.5">Definido no cadastro da pessoa — não é redefinido aqui.</p>
          </div>
        </div>

        {temLivreAcesso ? (
          <div className="bg-gray-50 p-3.5 rounded-xl text-[13px] text-gray-500 font-medium">
            {perfil === "Sócio Titular" ? "Sócio" : "Dependente"} tem livre acesso a todos os espaços do clube —
            sem espaço de destino a definir.
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider block">Espaço de Destino</label>
            <div className="relative">
              <select
                value={espacoId}
                onChange={(e) => setEspacoId(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-semibold text-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none"
              >
                {ESPACOS.map((espaco) => (
                  <option key={espaco.id} value={espaco.id}>{espaco.name}</option>
                ))}
                {!isPrestador && (
                  <option value={CLUBE_INTEIRO_ID}>Clube Inteiro (Convidado Patrocinado)</option>
                )}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {!temLivreAcesso && (
          <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-[13px] text-amber-800 font-medium">
            Responsável por este acesso: <strong>Portaria (você)</strong>. Como não há sócio patrocinando essa
            entrada, quem autoriza e registra é a própria portaria.
          </div>
        )}
      </form>

      <div className="p-6 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold text-[16px] text-white bg-gray-900 hover:bg-gray-800 transition-all flex justify-center items-center gap-2"
        >
          {isSubmitting ? "Processando..." : <><CheckCircle2 size={20} /> Salvar e Liberar</>}
        </button>
      </div>
    </motion.div>
  );
}
