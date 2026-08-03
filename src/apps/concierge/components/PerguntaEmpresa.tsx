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
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full min-h-0 bg-[var(--es-surface)]">
      <div className="flex-shrink-0 h-16 px-4 border-b border-[var(--es-border)] flex items-center gap-3 bg-[var(--es-surface)]">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <p className="font-semibold text-[var(--es-ink)] text-[17px]">Autorização</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col p-6 bg-[var(--es-bg)] overflow-y-auto">
        <p className="text-[28px] font-semibold text-[var(--es-ink)] mb-6 leading-tight tracking-[-0.01em]">
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
          <p className="text-[17px] font-semibold text-[var(--es-ink-3)] uppercase tracking-wider mt-5 mb-2.5">
            Empresas recentes
          </p>
        )}

        <div className="flex flex-wrap gap-2.5 mt-3">
          {sugestoesFiltradas.map((nome) => (
            <SugestaoChip key={nome} label={nome} icon={<Building2 size={16} strokeWidth={2.25} />} onClick={() => preencher(nome)} />
          ))}
          {!empresa && (
            <SugestaoChip label="Autônomo" icon={<UserX size={16} strokeWidth={2.25} />} tone="neutro" onClick={() => onConfirmar("")} />
          )}
        </div>
      </div>

      <div className="flex-shrink-0 p-6 pt-8 border-t border-[var(--es-border)] bg-[var(--es-surface)]">
        <button
          onClick={confirmar}
          disabled={!empresa}
          className="w-full py-4 rounded-[14px] font-semibold text-[21px] text-white transition-all active:scale-[0.98] disabled:opacity-45 bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] flex justify-center items-center gap-2 min-h-[64px]"
        >
          Confirmar empresa
        </button>
      </div>
    </motion.div>
  );
}
