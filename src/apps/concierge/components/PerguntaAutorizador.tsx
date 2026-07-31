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
  const resultados = (query
    ? listaOrdenada.filter((o) => normalizeText(o).includes(normalizeText(query)))
    : listaOrdenada
  ).slice(0, 12);

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
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-2.5">
            Usados recentemente
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {resultados.map((nome) => (
            <SugestaoChip key={nome} label={nome} icon={<UserCheck size={14} />} onClick={() => preencher(nome)} />
          ))}
          {resultados.length === 0 && (
            <p className="text-[13px] text-gray-400">Nenhum autorizador encontrado.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
