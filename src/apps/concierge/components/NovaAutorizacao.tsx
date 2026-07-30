import { useState } from "react";
import { ArrowLeft, CheckCircle2, Check, ChevronDown, ChevronRight, Calendar, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ESPACOS } from "@/shared/data/spaces";

// Mesmo sentinel usado em Check-in/Autorizacoes.tsx — liberação pro clube
// inteiro em vez de um espaço específico.
const CLUBE_INTEIRO_ID = "all";

// Destinos de trabalho que não são "Espaços" formais (não têm controle de
// acesso próprio), mas são pra onde prestadores recorrentes realmente vão
// (ver CLAUDE.md §5 — bar e cozinha são os prestadores recorrentes reais).
const DESTINOS_PRESTADOR_EXTRA = [
  { id: "cozinha", name: "Cozinha" },
  { id: "manutencao", name: "Manutenção / Jardinagem" },
];

// Quem pode aparecer como responsável por patrocinar um acesso — sócio
// titular, familiar com autorização delegada, ou o próprio clube (caso de
// prestadores recorrentes sem um sócio específico por trás). Numa base real
// (ERP Forza) isso são centenas de nomes — por isso o campo é busca, não lista.
const AUTORIZADORES = [
  "João Silva (Titular)",
  "Ana Costa (Familiar)",
  "Roberto Almeida (Titular)",
  "Fernando Silva (Titular)",
  "Marcelo Costa (Titular)",
  "Patrícia Nogueira (Titular)",
  "Juliana Ferraz (Titular)",
  "Ricardo Mendes (Titular)",
  "Camila Duarte (Familiar)",
  "Eduardo Klein (Titular)",
  "Beatriz Costa (Familiar)",
  "Lucas Almeida (Familiar)",
  "Maria Silva (Familiar)",
  "João Pedro Silva (Familiar)",
  "Carlos Mendes (Titular)",
  "Pedro Almeida (Titular)",
  "Larissa Rocha (Titular)",
  "Bruno Ferraz (Titular)",
  "Diego Pinto (Titular)",
  "Fernanda Alves (Titular)",
  "Administração do Clube",
];

const TERMINO_PRESETS = ["1 Semana", "2 Semanas", "1 Mês", "2 Meses", "6 Meses"];

interface Props {
  dados: any;
  onConcluir: (novaAutorizacao?: any) => void;
  onVoltar: () => void;
}

// Item de lista compacto que expande ao tocar ("lista que abre") — usado
// tanto pro Destino quanto pro Autorizador, pra não repetir o padrão duas vezes.
function CampoLista({
  label,
  valorSelecionado,
  opcoes,
  aberto,
  onToggle,
  onSelecionar,
}: {
  label: string;
  valorSelecionado: string;
  opcoes: string[];
  aberto: boolean;
  onToggle: () => void;
  onSelecionar: (valor: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider block">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-semibold text-gray-900"
      >
        <span>{valorSelecionado}</span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl border border-gray-200 divide-y divide-gray-100"
          >
            {opcoes.map((opcao) => (
              <button
                key={opcao}
                type="button"
                onClick={() => onSelecionar(opcao)}
                className={`w-full text-left px-4 py-3 text-[14px] font-medium flex items-center justify-between ${
                  opcao === valorSelecionado ? "bg-gray-50 text-gray-900 font-bold" : "bg-white text-gray-600"
                }`}
              >
                {opcao}
                {opcao === valorSelecionado ? (
                  <Check size={16} />
                ) : (
                  <ChevronRight size={16} className="text-gray-300" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Chip minimalista estilo iOS — cheio e azul quando selecionado, plano
// (sem borda pesada) quando não. Usado no seletor de período.
function Chip({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
        selected ? "bg-blue-500 text-white" : "bg-white text-gray-600 border border-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// Autorizador tem potencialmente centenas de opções (base real de sócios) —
// em vez de lista fixa, é busca por texto + moedas com os resultados.
function SeletorAutorizador({
  valorSelecionado,
  opcoes,
  onSelecionar,
}: {
  valorSelecionado: string;
  opcoes: string[];
  onSelecionar: (valor: string) => void;
}) {
  const [buscando, setBuscando] = useState(false);
  const [query, setQuery] = useState("");

  const resultados = (query
    ? opcoes.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : opcoes
  ).slice(0, 8);

  if (!buscando) {
    return (
      <div className="space-y-1.5">
        <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider block">Autorizador</label>
        <button
          type="button"
          onClick={() => { setBuscando(true); setQuery(""); }}
          className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-semibold text-gray-900"
        >
          <span>{valorSelecionado}</span>
          <span className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Trocar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider block">Autorizador</label>
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar sócio autorizador..."
          className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900"
        />
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {resultados.map((nome) => (
          <Chip
            key={nome}
            label={nome}
            selected={nome === valorSelecionado}
            onClick={() => { onSelecionar(nome); setBuscando(false); }}
          />
        ))}
        {resultados.length === 0 && (
          <p className="text-[13px] text-gray-400">Nenhum autorizador encontrado.</p>
        )}
      </div>
    </div>
  );
}

export function NovaAutorizacao({ dados, onConcluir, onVoltar }: Props) {
  const motivoConhecido = !!dados?.type;

  const [motivoEscolhido, setMotivoEscolhido] = useState<"Visitante" | "Prestador de Serviço">("Visitante");
  const perfil: string = motivoConhecido ? dados.type : motivoEscolhido;
  const temLivreAcesso = perfil === "Sócio Titular" || perfil === "Familiar";
  const isPrestador = perfil === "Prestador de Serviço";
  const [cnpj, setCnpj] = useState("");

  const opcoesDestino = isPrestador
    ? [...ESPACOS.map((e) => e.name), ...DESTINOS_PRESTADOR_EXTRA.map((e) => e.name)]
    : [...ESPACOS.map((e) => e.name), "Clube Inteiro (Convidado Patrocinado)"];

  const [destino, setDestino] = useState(opcoesDestino[0]);
  const [destinoAberto, setDestinoAberto] = useState(false);
  const [autorizador, setAutorizador] = useState(AUTORIZADORES[0]);

  const [inicio, setInicio] = useState<"hoje" | "data">("hoje");
  const [inicioData, setInicioData] = useState("");
  const [termino, setTermino] = useState<string>(TERMINO_PRESETS[0]);
  const [terminoData, setTerminoData] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMotivo = (novoMotivo: "Visitante" | "Prestador de Serviço") => {
    setMotivoEscolhido(novoMotivo);
    const novasOpcoes = novoMotivo === "Prestador de Serviço"
      ? [...ESPACOS.map((e) => e.name), ...DESTINOS_PRESTADOR_EXTRA.map((e) => e.name)]
      : [...ESPACOS.map((e) => e.name), "Clube Inteiro (Convidado Patrocinado)"];
    setDestino(novasOpcoes[0]);
  };

  const periodoLabel = () => {
    const de = inicio === "hoje" ? "Hoje" : inicioData || "data a definir";
    const ate = termino === "Escolher data" ? (terminoData || "data a definir") : termino;
    return `${de} até ${ate}`;
  };

  // Pessoa já cadastrada pode acumular várias autorizações — cada uma com seu
  // próprio destino, autorizador e período (ex.: autorizador X libera só o
  // bar, autorizador Y libera só o campo de golfe). Um cadastro novo só tem
  // uma autorização mesmo, a que acabou de ser criada aqui.
  const jaCadastrado = !!dados?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      const novaAutorizacao = !temLivreAcesso
        ? {
            id: `auth-${Date.now()}`,
            name: dados?.name,
            avatar: dados?.avatar,
            cpf: dados?.cpf,
            type: perfil,
            destino,
            autorizador,
            periodo: periodoLabel(),
            status: "Fora do clube",
            entrada: null,
          }
        : undefined;

      setTimeout(() => onConcluir(jaCadastrado ? novaAutorizacao : undefined), 2000);
    }, 1000);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center h-full bg-white p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-[#E9FBF0] text-[#30B855] flex items-center justify-center mb-5"
        >
          <CheckCircle2 size={44} strokeWidth={1.75} />
        </motion.div>
        <h2 className="text-[20px] font-semibold text-gray-900">Autorização criada</h2>
        <p className="text-[14px] text-gray-500 mt-1.5 max-w-xs leading-relaxed">
          {dados?.name || "Usuário"} está autorizado.
        </p>
        <p className="text-[12px] text-gray-400 mt-6">
          {jaCadastrado ? "Voltando ao perfil…" : "Voltando ao início…"}
        </p>
      </motion.div>
    );
  }

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
            {/* Motivo — só é escolhido aqui quando ainda não sabemos quem é a
                pessoa (novo cadastro). Quem já tem perfil definido só consulta. */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider block">Motivo</label>
              {motivoConhecido ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
                  <span className="text-[15px] font-bold text-gray-900">{perfil}</span>
                  <p className="text-[12px] text-gray-400 mt-0.5">Definido no cadastro da pessoa — não é redefinido aqui.</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  {(["Visitante", "Prestador de Serviço"] as const).map((opcao) => (
                    <button
                      key={opcao}
                      type="button"
                      onClick={() => handleMotivo(opcao)}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-[14px] font-bold transition-colors ${
                        motivoEscolhido === opcao
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isPrestador && (
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider block">CNPJ</label>
                <input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="Opcional"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 text-gray-900"
                />
              </div>
            )}

            {temLivreAcesso ? (
              <div className="bg-gray-50 p-3.5 rounded-xl text-[13px] text-gray-500 font-medium">
                {perfil === "Sócio Titular" ? "Sócio" : "Dependente"} tem livre acesso a todos os espaços do clube —
                sem espaço de destino, autorizador ou período a definir.
              </div>
            ) : (
              <>
                <CampoLista
                  label="Destino"
                  valorSelecionado={destino}
                  opcoes={opcoesDestino}
                  aberto={destinoAberto}
                  onToggle={() => setDestinoAberto((v) => !v)}
                  onSelecionar={(v) => { setDestino(v); setDestinoAberto(false); }}
                />

                <SeletorAutorizador
                  valorSelecionado={autorizador}
                  opcoes={AUTORIZADORES}
                  onSelecionar={setAutorizador}
                />

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider block">Período</label>

                  <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                    <div>
                      <p className="text-[14px] font-bold text-gray-900 mb-2.5">Inicia</p>
                      <div className="flex flex-wrap gap-2">
                        <Chip label="Hoje" selected={inicio === "hoje"} onClick={() => setInicio("hoje")} />
                        <Chip
                          label="Escolher data"
                          icon={<Calendar size={13} />}
                          selected={inicio === "data"}
                          onClick={() => setInicio("data")}
                        />
                      </div>
                      {inicio === "data" && (
                        <input
                          type="date"
                          value={inicioData}
                          onChange={(e) => setInicioData(e.target.value)}
                          className="mt-2.5 w-full bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-[14px] font-medium text-gray-900"
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-[14px] font-bold text-gray-900 mb-2.5">Termina em</p>
                      <div className="flex flex-wrap gap-2">
                        {TERMINO_PRESETS.map((preset) => (
                          <Chip key={preset} label={preset} selected={termino === preset} onClick={() => setTermino(preset)} />
                        ))}
                        <Chip
                          label="Escolher data"
                          icon={<Calendar size={13} />}
                          selected={termino === "Escolher data"}
                          onClick={() => setTermino("Escolher data")}
                        />
                      </div>
                      {termino === "Escolher data" && (
                        <input
                          type="date"
                          value={terminoData}
                          onChange={(e) => setTerminoData(e.target.value)}
                          className="mt-2.5 w-full bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-[14px] font-medium text-gray-900"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {!temLivreAcesso && (
              <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-[13px] text-amber-800 font-medium">
                Responsável por este acesso: <strong>{autorizador}</strong>.
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
