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
    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 flex flex-col h-full bg-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="w-14 h-14 flex items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm shrink-0"
        >
          <ArrowLeft size={24} strokeWidth={2.25} />
        </button>
        <div>
          <p className="font-bold text-gray-900 text-[17px]">Autorização</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 bg-gray-50 overflow-y-auto">
        <p className="text-[28px] text-gray-900 mb-6 leading-tight">
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
          <p className="text-[15px] font-semibold text-gray-500 uppercase tracking-wider mt-5 mb-2.5">
            Usados recentemente
          </p>
        )}

        <div className="flex flex-wrap gap-2.5 mt-3">
          {sugestoesFiltradas.map((s) => (
            <SugestaoChip key={s} label={s} icon={<MapPin size={16} strokeWidth={2.25} />} onClick={() => preencher(s)} />
          ))}
          {sugestoesFiltradas.length === 0 && (
            <p className="text-[17px] text-gray-500">Nenhuma sugestão encontrada — digite e confirme.</p>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-100 bg-white">
        <button
          onClick={confirmar}
          disabled={!destinoValido}
          className="w-full py-4 rounded-xl font-bold text-[21px] text-white transition-opacity disabled:opacity-45 bg-[#0F2744] flex justify-center items-center gap-2 min-h-[64px]"
        >
          Confirmar destino
        </button>
      </div>
    </motion.div>
  );
}
