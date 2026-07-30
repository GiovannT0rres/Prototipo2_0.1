import { useMemo, useState } from "react";
import { ArrowLeft, Building2, UserX } from "lucide-react";
import { motion } from "motion/react";
import { getRecentes, registrarRecente } from "../utils/recentSelections";
import { normalizeText } from "../utils/normalizeText";
import { SugestaoChip } from "./SugestaoChip";
import { CampoBuscaComOk } from "./CampoBuscaComOk";

// Semente plausível pra quem ainda não tem histórico real — prestadores
// recorrentes de evento são exatamente o perfil descrito no PRD (catering,
// som/luz, logística), então já nasce útil mesmo no primeiro uso.
const EMPRESAS_SEMENTE = ["Styllus Catering", "Som & Luz Eventos", "Logística Global Eventos"];

const CHAVE_RECENTES = "pacc_concierge_empresas_recentes";

interface Props {
  onConfirmar: (empresa: string) => void;
  onVoltar: () => void;
}

export function PerguntaEmpresa({ onConfirmar, onVoltar }: Props) {
  const [empresa, setEmpresa] = useState("");
  const [recentes] = useState(() => getRecentes(CHAVE_RECENTES, EMPRESAS_SEMENTE));

  const sugestoesFiltradas = useMemo(() => {
    if (!empresa) return recentes;
    return recentes.filter((r) => normalizeText(r).includes(normalizeText(empresa)));
  }, [empresa, recentes]);

  // Moeda só preenche a caixa — só a seta ao lado da busca avança de verdade,
  // pra não confirmar sem querer com um toque perto da moeda. Diferente de
  // Destino/Autorizador, aqui o texto não precisa bater com nada conhecido —
  // empresa é campo aberto, o prestador pode ser de uma empresa nova de
  // verdade que o clube nunca atendeu antes.
  const preencher = (valor: string) => setEmpresa(valor);

  const confirmar = () => {
    if (!empresa) return;
    registrarRecente(CHAVE_RECENTES, empresa);
    onConfirmar(empresa);
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <button onClick={onVoltar} className="p-2 rounded-xl bg-white text-gray-600 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Autorização</p>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-50">
        <p className="text-[22px] text-gray-900 mb-6 leading-tight">
          Para qual <strong className="font-bold">EMPRESA</strong> está prestando serviço?
        </p>

        <CampoBuscaComOk
          value={empresa}
          onChange={setEmpresa}
          onConfirmar={confirmar}
          placeholder="Digite o nome da empresa..."
          podeConfirmar={!!empresa}
          autoFocus
        />

        {sugestoesFiltradas.length > 0 && !empresa && (
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-2.5">
            Empresas recentes
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {sugestoesFiltradas.map((nome) => (
            <SugestaoChip key={nome} label={nome} icon={<Building2 size={14} />} onClick={() => preencher(nome)} />
          ))}
          {!empresa && (
            <SugestaoChip label="Autônomo" icon={<UserX size={14} />} tone="neutro" onClick={() => onConfirmar("")} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
