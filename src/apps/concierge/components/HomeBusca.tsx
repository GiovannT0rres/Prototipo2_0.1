import { useState, useMemo } from "react";
import { Search, RefreshCw, LogOut, Clock, Users, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { normalizeText } from "../utils/normalizeText";

// CPF de teste (Maria Souza, Visitante já cadastrada com autorizações ativas
// em MOCK_AUTHORIZATIONS) — testa o caminho "pessoa existente". Qualquer
// outro CPF de 11 dígitos que não esteja nos mocks já cai no caminho "usuário
// novo" naturalmente, então uma dica só cobre os dois fluxos. Dica de
// protótipo (design.md §14.1 já sinalizou isso antes) — remover do build de
// produção quando o app deixar de ser demo/teste.
const CPF_TESTE_EXISTENTE = "555.666.777-88";

interface Props {
  onBuscar: (cpf: string) => void;
  pessoasNoLocal: any[];
  onSaida: (id: string, nome: string) => void;
}

export function HomeBusca({ onBuscar, pessoasNoLocal, onSaida }: Props) {
  // Estado do input principal (Busca de CPF para nova entrada)
  const [cpfPrincipal, setCpfPrincipal] = useState("");

  // Estados da lista de pessoas no local
  const [filtroLista, setFiltroLista] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- LÓGICA DO INPUT PRINCIPAL ---
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpfPrincipal(value);
  };

  const handleBuscarNovo = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpfPrincipal.length === 14) onBuscar(cpfPrincipal);
  };

  // --- LÓGICA DA LISTA ---
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simula uma requisição ao servidor para checar outras portarias
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Lista atualizada com sucesso!");
    }, 1000);
  };

  const censurarCpf = (cpf: string) => {
    return cpf.replace(/^\d{3}/, "***").replace(/\d{2}$/, "**");
  };

  // Filtra a lista pelo nome ou CPF digitado no input de filtro. Bug corrigido:
  // ao digitar um nome (sem dígitos), a comparação por CPF virava uma busca
  // por string vazia — e "".includes("") é sempre true, então a lista nunca
  // filtrava de verdade. Agora só compara CPF quando a busca tem dígitos.
  const listaFiltrada = useMemo(() => {
    const queryNorm = normalizeText(filtroLista);
    const queryDigits = filtroLista.replace(/\D/g, "");
    return pessoasNoLocal.filter((p) => {
      const nomeConfere = normalizeText(p.name).includes(queryNorm);
      const cpfConfere = queryDigits.length > 0 && p.cpf.replace(/\D/g, "").includes(queryDigits);
      return nomeConfere || cpfConfere;
    });
  }, [filtroLista, pessoasNoLocal]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 h-full min-h-0 overflow-y-auto bg-[var(--es-bg)]">

      {/* Busca de CPF rola junto com o resto da página — antes eram duas
          áreas de scroll independentes (busca fixa + lista com scroll
          próprio), e em telas efetivamente baixas (zoom de acessibilidade,
          S24 FE real) a lista ficava espremida a poucos pixels de altura,
          praticamente invisível mesmo rolando. Um scroll só, sem altura
          calculada por flex, nunca zera — dá pra ver todo mundo no clube. */}
      <div className="bg-[var(--es-surface)] p-6 shadow-sm">
        <form onSubmit={handleBuscarNovo} className="relative">
          <label className="text-[16px] font-semibold text-[var(--es-ink-2)] uppercase tracking-wider mb-2 block">
            Iniciar Atendimento
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              value={cpfPrincipal}
              onChange={handleCpfChange}
              placeholder="CPF"
              autoFocus
              className="flex-1 min-w-0 bg-[var(--es-bg)] border-2 border-[var(--es-border-strong)] rounded-[14px] px-5 py-4 text-[19px] font-bold tabular-nums focus:outline-none focus:ring-4 focus:ring-[rgba(15,39,68,0.12)] focus:border-[var(--es-navy)] transition-all placeholder:font-medium tracking-wide text-[var(--es-ink)] min-h-[58px]"
            />
            <button
              type="submit"
              disabled={cpfPrincipal.length < 14}
              className="h-16 px-6 rounded-[14px] font-semibold text-[17px] text-white transition-all active:scale-[0.98] disabled:opacity-45 bg-[var(--es-navy)] hover:bg-[var(--es-navy-press)] flex justify-center items-center gap-2 shrink-0"
            >
              <Search size={22} strokeWidth={2.25} /> <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>
        </form>

        {/* Nota de protótipo — orienta quem está testando a demo, não é
            conteúdo de produção (ver comentário de CPF_TESTE_EXISTENTE). */}
        <div className="mt-3 flex items-center gap-2 px-3.5 py-2.5 rounded-[12px] bg-[var(--es-warning-soft)] text-[var(--es-warning)]">
          <FlaskConical size={16} strokeWidth={2.25} className="shrink-0" />
          <p className="text-[16px] font-medium leading-snug">
            Teste: <span className="font-bold tabular-nums">{CPF_TESTE_EXISTENTE}</span> = cadastro existente.
          </p>
        </div>
      </div>

      {/* ================= SEÇÃO INFERIOR: PESSOAS NO LOCAL (secundária) ================= */}
      <div className="flex flex-col">

        {/* Controles da Lista */}
        <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-bold text-[var(--es-ink)]">Quem está no clube</h2>
            <span className="bg-[var(--es-navy-soft)] text-[var(--es-navy)] text-[16px] font-bold px-2.5 py-0.5 rounded-full">
              {pessoasNoLocal.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-52">
              <Search size={18} strokeWidth={2.25} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--es-ink-3)]" />
              <input
                type="text"
                value={filtroLista}
                onChange={(e) => setFiltroLista(e.target.value)}
                placeholder="Filtrar nome/CPF..."
                className="w-full bg-[var(--es-surface)] border-2 border-[var(--es-border)] rounded-[14px] pl-11 pr-3 py-3 text-[16px] focus:outline-none focus:ring-4 focus:ring-[rgba(15,39,68,0.12)] focus:border-[var(--es-navy)] text-[var(--es-ink)] min-h-[50px]"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Atualizar lista"
              title="Atualizar lista"
              className="w-[50px] h-[50px] flex items-center justify-center shrink-0 bg-[var(--es-surface)] border-2 border-[var(--es-border)] rounded-[14px] text-[var(--es-ink-2)] hover:bg-[var(--es-bg)] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={22} strokeWidth={2.25} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Lista — rola junto com o resto da página (scroll único da Home,
            não uma área própria com altura calculada por flex). */}
        <div className="px-6 pb-6">
          <div className="space-y-3 mt-2">
            <AnimatePresence>
              {listaFiltrada.map((pessoa) => (
                <motion.div
                  key={pessoa.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[var(--es-surface)] p-4 rounded-[14px] border border-[var(--es-border)] shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={pessoa.avatar}
                      alt={pessoa.name}
                      className="w-14 h-14 rounded-full object-cover border border-[var(--es-border)] shrink-0"
                    />
                    <div>
                      <p className="text-[17px] font-bold text-[var(--es-ink)]">{pessoa.name}</p>
                      <p className="text-[16px] text-[var(--es-ink-3)] font-medium tabular-nums mt-0.5">
                        {censurarCpf(pessoa.cpf)}
                      </p>
                      <p className="text-[16px] text-[var(--es-ink-3)] mt-1 flex items-center gap-1.5 font-medium">
                        <Clock size={18} strokeWidth={2.25} /> Entrada: {pessoa.entrada}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSaida(pessoa.id, pessoa.name)}
                    className="w-full sm:w-auto min-h-[50px] px-5 py-3 bg-[var(--es-danger-soft)] text-[var(--es-danger)] hover:brightness-95 rounded-[14px] text-[16px] font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut size={22} strokeWidth={2.25} /> Registrar Saída
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {listaFiltrada.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-[50px] h-[50px] bg-[var(--es-bg)] text-[var(--es-ink-3)] rounded-full flex items-center justify-center mb-3">
                  <Users size={24} strokeWidth={2.25} />
                </div>
                {pessoasNoLocal.length === 0 ? (
                  <>
                    <p className="text-[17px] font-bold text-[var(--es-ink)]">Ninguém no clube no momento</p>
                    <p className="text-[16px] text-[var(--es-ink-3)] mt-1">
                      Assim que alguém der entrada, a pessoa aparece aqui.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[17px] font-bold text-[var(--es-ink)]">Nenhuma pessoa encontrada</p>
                    <p className="text-[16px] text-[var(--es-ink-3)] mt-1">
                      Não há registros que correspondam à sua busca atual.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}