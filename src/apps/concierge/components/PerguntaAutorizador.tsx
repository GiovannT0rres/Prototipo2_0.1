import { useMemo, useState } from "react";
import { ArrowLeft, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { getRecentes, registrarRecente } from "../utils/recentSelections";
import { normalizeText } from "../utils/normalizeText";
import { SugestaoChip } from "./SugestaoChip";
import { CampoBuscaComOk } from "./CampoBuscaComOk";

// Quem pode aparecer como responsável por patrocinar um acesso — sócio
// titular, dependente com autorização delegada, ou o próprio clube (caso de
// prestadores recorrentes sem um sócio específico por trás). Numa base real
// (ERP Forza) isso são centenas de nomes — por isso o campo é busca, não lista.
const AUTORIZADORES = [
  "João Silva (Titular)",
  "Ana Costa (Dependente)",
  "Roberto Almeida (Titular)",
  "Fernando Silva (Titular)",
  "Marcelo Costa (Titular)",
  "Patrícia Nogueira (Titular)",
  "Juliana Ferraz (Titular)",
  "Ricardo Mendes (Titular)",
  "Camila Duarte (Dependente)",
  "Eduardo Klein (Titular)",
  "Beatriz Costa (Dependente)",
  "Lucas Almeida (Dependente)",
  "Maria Silva (Dependente)",
  "João Pedro Silva (Dependente)",
  "Carlos Mendes (Titular)",
  "Pedro Almeida (Titular)",
  "Larissa Rocha (Titular)",
  "Bruno Ferraz (Titular)",
  "Diego Pinto (Titular)",
  "Fernanda Alves (Titular)",
  "Administração do Clube",
];

const CHAVE_RECENTES = "pacc_concierge_autorizadores_recentes";

interface Props {
  onConfirmar: (autorizador: string) => void;
  onVoltar: () => void;
}

export function PerguntaAutorizador({ onConfirmar, onVoltar }: Props) {
  const [query, setQuery] = useState("");
  const [recentes] = useState(() => getRecentes(CHAVE_RECENTES));

  const recentesValidos = useMemo(() => recentes.filter((r) => AUTORIZADORES.includes(r)), [recentes]);

  // Recentes primeiro (quem a portaria mais usou), depois o resto da base.
  const listaOrdenada = useMemo(() => {
    const resto = AUTORIZADORES.filter((a) => !recentesValidos.includes(a));
    return [...recentesValidos, ...resto];
  }, [recentesValidos]);

  // Ao digitar, a lista vai ficando mais exata (filtra pelo texto); sem
  // digitar nada, mostra os recentes primeiro.
  const resultados = useMemo(() => {
    const base = query
      ? listaOrdenada.filter((o) => normalizeText(o).includes(normalizeText(query)))
      : listaOrdenada;
    return base.slice(0, 12);
  }, [query, listaOrdenada]);

  // Nomes de autorizador sempre levam sobrenome + qualificador entre
  // parênteses ("João Pedro Silva (Dependente)") — mais longos que destinos.
  // Grade de chips quebra/corta esses nomes em telas de 360-390px; lista
  // vertical não tem esse limite porque cada item ocupa a largura toda.
  const algumNomeLongo = useMemo(() => resultados.some((n) => n.length > 22), [resultados]);

  // Moeda só preenche a caixa — só a seta ao lado da busca avança de verdade,
  // pra não confirmar sem querer com um toque perto da moeda. A seta só
  // desbloqueia quando o texto bate com um autorizador de verdade da base.
  const preencher = (nome: string) => setQuery(nome);

  const autorizadorValido = AUTORIZADORES.find((a) => normalizeText(a) === normalizeText(query));

  const confirmar = () => {
    if (!autorizadorValido) return;
    registrarRecente(CHAVE_RECENTES, autorizadorValido);
    onConfirmar(autorizadorValido);
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
          Quem é o <strong className="font-bold">AUTORIZADOR</strong>?
        </p>

        <CampoBuscaComOk
          value={query}
          onChange={setQuery}
          onConfirmar={confirmar}
          placeholder="Buscar sócio autorizador..."
          podeConfirmar={!!autorizadorValido}
          autoFocus
        />

        {recentesValidos.length > 0 && !query && (
          <p className="text-[17px] font-semibold text-[var(--es-ink-3)] uppercase tracking-wider mt-5 mb-2.5">
            Usados recentemente
          </p>
        )}

        {resultados.length >= 7 || algumNomeLongo ? (
          <div className="flex flex-col gap-2.5 mt-3">
            {resultados.map((nome) => (
              <button
                key={nome}
                type="button"
                onClick={() => preencher(nome)}
                className="w-full text-left flex items-center gap-3 px-4 min-h-[56px] rounded-[14px] border-2 border-[var(--es-border)] bg-[var(--es-surface)] hover:border-[var(--es-border-strong)] active:scale-[0.99] transition-all"
              >
                <UserCheck size={20} strokeWidth={2.25} className="text-[var(--es-navy)] shrink-0" />
                <span className="text-[19px] font-medium text-[var(--es-ink)] truncate min-w-0 flex-1">{nome}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 mt-3">
            {resultados.map((nome) => (
              <SugestaoChip key={nome} label={nome} icon={<UserCheck size={16} strokeWidth={2.25} />} onClick={() => preencher(nome)} />
            ))}
          </div>
        )}
        {resultados.length === 0 && (
          <p className="text-[19px] text-[var(--es-ink-3)] mt-3">Nenhum autorizador encontrado.</p>
        )}
      </div>

      <div className="flex-shrink-0 p-6 pt-8 border-t border-[var(--es-border)] bg-[var(--es-surface)]">
        <button
          onClick={confirmar}
          disabled={!autorizadorValido}
          className="w-full py-4 rounded-[14px] font-semibold text-[21px] text-white transition-all active:scale-[0.98] disabled:opacity-45 bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] flex justify-center items-center gap-2 min-h-[64px]"
        >
          Confirmar autorizador
        </button>
      </div>
    </motion.div>
  );
}
