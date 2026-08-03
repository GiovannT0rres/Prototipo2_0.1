import { useMemo, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { ESPACOS } from "@/shared/data/spaces";
import { getRecentes, registrarRecente } from "../utils/recentSelections";
import { normalizeText } from "../utils/normalizeText";
import { SugestaoChip } from "./SugestaoChip";
import { CampoBuscaComOk } from "./CampoBuscaComOk";

// Destinos de trabalho que não são "Espaços" formais (sem controle de acesso
// próprio), mas são pra onde prestadores recorrentes realmente vão (ver
// CLAUDE.md §5 — bar e cozinha são os prestadores recorrentes reais).
const DESTINOS_PRESTADOR_EXTRA = ["Cozinha", "Manutenção / Jardinagem"];

const CHAVE_RECENTES = "pacc_concierge_destinos_recentes";

interface Props {
  motivo: string;
  onConfirmar: (destino: string) => void;
  onVoltar: () => void;
}

export function PerguntaDestino({ motivo, onConfirmar, onVoltar }: Props) {
  const [destino, setDestino] = useState("");
  const [recentes] = useState(() => getRecentes(CHAVE_RECENTES));

  const isPrestador = motivo === "Prestador de Serviço";
  const opcoesBase = isPrestador
    ? [...ESPACOS.map((e) => e.name), ...DESTINOS_PRESTADOR_EXTRA]
    : [...ESPACOS.map((e) => e.name), "Clube Inteiro (Convidado Patrocinado)"];

  const recentesValidos = useMemo(() => recentes.filter((r) => opcoesBase.includes(r)), [recentes, opcoesBase]);

  // Recentes válidos pra este motivo aparecem primeiro — o resto completa a lista.
  const sugestoesOrdenadas = useMemo(() => {
    const resto = opcoesBase.filter((o) => !recentesValidos.includes(o));
    return [...recentesValidos, ...resto];
  }, [recentesValidos, opcoesBase]);

  // Ao digitar, a lista vai ficando mais exata (filtra pelo texto); sem
  // digitar nada, mostra os recentes primeiro seguidos dos demais.
  const sugestoesFiltradas = destino
    ? sugestoesOrdenadas.filter((s) => normalizeText(s).includes(normalizeText(destino)))
    : sugestoesOrdenadas;

  // Moeda só preenche a caixa — só a seta ao lado da busca avança de verdade,
  // pra não confirmar sem querer com um toque perto da moeda. A seta só
  // desbloqueia quando o texto bate com um destino de verdade da lista.
  const preencher = (valor: string) => setDestino(valor);

  const destinoValido = opcoesBase.find((o) => normalizeText(o) === normalizeText(destino));

  const confirmar = () => {
    if (!destinoValido) return;
    registrarRecente(CHAVE_RECENTES, destinoValido);
    onConfirmar(destinoValido);
  };

  return (
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-[var(--es-surface)]">
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

      <div className="flex-1 flex flex-col p-6 bg-[var(--es-bg)] overflow-y-auto">
        <p className="text-[28px] font-semibold text-[var(--es-ink)] mb-6 leading-tight tracking-[-0.01em]">
          Qual o <strong className="font-bold">DESTINO</strong>?
        </p>

        <CampoBuscaComOk
          value={destino}
          onChange={setDestino}
          onConfirmar={confirmar}
          placeholder="Digite o destino..."
          podeConfirmar={!!destinoValido}
          autoFocus
        />

        {recentesValidos.length > 0 && !destino && (
          <p className="text-[17px] font-semibold text-[var(--es-ink-3)] uppercase tracking-wider mt-5 mb-2.5">
            Usados recentemente
          </p>
        )}

        {/* 7+ resultados vira lista vertical (varredura em um eixo); até 6,
            grade de chips (design.md §14.5/§7.3). */}
        {sugestoesFiltradas.length >= 7 ? (
          <div className="flex flex-col gap-2.5 mt-3">
            {sugestoesFiltradas.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => preencher(s)}
                className="w-full text-left flex items-center gap-3 px-4 min-h-[56px] rounded-[14px] border-2 border-[var(--es-border)] bg-[var(--es-surface)] hover:border-[var(--es-border-strong)] active:scale-[0.99] transition-all"
              >
                <MapPin size={20} strokeWidth={2.25} className="text-[var(--es-navy)] shrink-0" />
                <span className="text-[19px] font-medium text-[var(--es-ink)]">{s}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 mt-3">
            {sugestoesFiltradas.map((s) => (
              <SugestaoChip key={s} label={s} icon={<MapPin size={16} strokeWidth={2.25} />} onClick={() => preencher(s)} />
            ))}
          </div>
        )}
        {sugestoesFiltradas.length === 0 && (
          <p className="text-[19px] text-[var(--es-ink-3)] mt-3">Nenhuma sugestão encontrada — digite e confirme.</p>
        )}
      </div>

      <div className="flex-shrink-0 p-6 pt-8 border-t border-[var(--es-border)] bg-[var(--es-surface)]">
        <button
          onClick={confirmar}
          disabled={!destinoValido}
          className="w-full py-4 rounded-[14px] font-semibold text-[21px] text-white transition-all active:scale-[0.98] disabled:opacity-45 bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] flex justify-center items-center gap-2 min-h-[64px]"
        >
          Confirmar destino
        </button>
      </div>
    </motion.div>
  );
}
