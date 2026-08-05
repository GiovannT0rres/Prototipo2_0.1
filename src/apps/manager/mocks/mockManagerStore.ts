// Tudo que o Manager cria ou modifica — pessoas, autorizações, convites,
// pessoas convidadas — sem backend real, guarda em localStorage pra
// sobreviver a navegação entre telas e recarregamentos, do mesmo jeito que
// já fizemos no Concierge.
//
// Redesign: unifica os 7 formatos fragmentados que existiam (MOCK_SOCIOS,
// MOCK_DEPENDENTES_ADMIN, AcessoCriado, PessoaConvidada, etc.) em um único
// Person + Authorization[]. MOCK_PESSOAS (mockManager.ts) é a semente
// estática; toda pessoa nova criada pelo Manager entra aqui, no
// localStorage, e as duas fontes são combinadas por getPessoas().
import { MOCK_PESSOAS } from "./mockManager";
import type { Authorization, Motivo, Person } from "../types";

const CHAVE_PESSOAS = "pacc_manager_pessoas";
const CHAVE_AUTORIZACOES = "pacc_manager_autorizacoes_v2";
const CHAVE_CONVITES = "pacc_manager_convites";
const CHAVE_PESSOAS_CONVIDADAS = "pacc_manager_pessoas_convidadas_v2";

function ler<T>(chave: string): T[] {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Dispara um evento pra quem estiver montado nesta mesma aba (a Sidebar
// global e a tela de Pendências, por exemplo, são componentes irmãos que
// leem a mesma chave — o evento "storage" nativo só dispara em OUTRAS abas,
// então sem isso a tela não percebe uma escrita feita pelo modal da sidebar).
const CHAVE_EVENTO = "pacc_manager_store_atualizado";

function escrever<T>(chave: string, valor: T[]) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    window.dispatchEvent(new CustomEvent(CHAVE_EVENTO, { detail: chave }));
  } catch {
    // sem drama — só não persiste
  }
}

export function onStoreAtualizado(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(CHAVE_EVENTO, handler);
  return () => window.removeEventListener(CHAVE_EVENTO, handler);
}

// ============================================================
// PESSOAS — MOCK_PESSOAS (estático, "ERP") + pessoas criadas nesta sessão
// ============================================================
export function getPessoas(): Person[] {
  return [...MOCK_PESSOAS, ...ler<Person>(CHAVE_PESSOAS)];
}

export function getPessoa(id: string): Person | undefined {
  return getPessoas().find((p) => p.id === id);
}

export function buscarPessoas(query: string): Person[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getPessoas().filter((p) => p.nome.toLowerCase().includes(q) || p.cpf.includes(q));
}

export function buscarPessoaPorCpf(cpf: string): Person | undefined {
  return getPessoas().find((p) => p.cpf === cpf);
}

// Mesmo mock de retorno de BigDataCorp usado no Concierge (PortariaWizard.tsx)
// — mesmo CPF não encontrado nas bases do clube já retorna nome completo,
// então o cadastro nunca pede pro Manager digitar isso do zero, só confirmar.
export function buscarNomeBigDataCorp(_cpf: string): string {
  return "Carlos Eduardo Faria";
}

export function registrarPessoa(pessoa: Person): void {
  escrever(CHAVE_PESSOAS, [pessoa, ...ler<Person>(CHAVE_PESSOAS)]);
}

// ============================================================
// AUTORIZAÇÕES — o objeto central do sistema. Uma pessoa acumula N
// autorizações simultâneas (ex.: Campo de Golfe dia 1-5 e Bar dia 3-8).
// Sócio Titular/Dependente nascem com periodoFim null (ligado ao status de
// associação, não expira por data — ver types.ts `acessoLivre`).
// ============================================================
function seedAutorizacoes(): Authorization[] {
  return [
    { id: "auth-8493", personId: "8493", motivo: "Sócio Titular", periodoInicio: null, periodoFim: null, autorizadorId: null, autorizadorLabel: "Administração do Clube", revogada: false, criadaEm: "01/01/2020" },
    { id: "auth-5521", personId: "5521", motivo: "Sócio Titular", periodoInicio: null, periodoFim: null, autorizadorId: null, autorizadorLabel: "Administração do Clube", revogada: false, criadaEm: "01/01/2020" },
    { id: "auth-3390", personId: "3390", motivo: "Sócio Titular", periodoInicio: null, periodoFim: null, autorizadorId: null, autorizadorLabel: "Administração do Clube", revogada: false, criadaEm: "01/01/2020" },
    { id: "auth-6702", personId: "6702", motivo: "Sócio Titular", periodoInicio: null, periodoFim: null, autorizadorId: null, autorizadorLabel: "Administração do Clube", revogada: false, criadaEm: "01/01/2020" },
    { id: "auth-dep1", personId: "dep1", motivo: "Dependente", periodoInicio: null, periodoFim: null, autorizadorId: "8493", revogada: false, criadaEm: "01/01/2020" },
    { id: "auth-dep2", personId: "dep2", motivo: "Dependente", periodoInicio: null, periodoFim: null, autorizadorId: "8493", revogada: false, criadaEm: "01/01/2020" },
    { id: "auth-dep3", personId: "dep3", motivo: "Dependente", periodoInicio: null, periodoFim: null, autorizadorId: "5521", revogada: false, criadaEm: "01/01/2020" },
    { id: "auth-dep4", personId: "dep4", motivo: "Dependente", periodoInicio: null, periodoFim: null, autorizadorId: "5521", revogada: false, criadaEm: "01/01/2020" },
    { id: "auth-dep5", personId: "dep5", motivo: "Dependente", periodoInicio: null, periodoFim: null, autorizadorId: "3390", revogada: false, criadaEm: "01/01/2020" },
    { id: "auth-cv1", personId: "cv1", motivo: "Visitante", periodoInicio: "2026-08-01T00:00", periodoFim: "2026-08-05T23:59", autorizadorId: "8493", revogada: false, criadaEm: "28/07/2026" },
    { id: "auth-cv2", personId: "cv2", motivo: "Visitante", periodoInicio: "2026-07-10T00:00", periodoFim: "2026-07-15T23:59", autorizadorId: "8493", revogada: false, criadaEm: "05/07/2026" },
    { id: "auth-cv3", personId: "cv3", motivo: "Visitante", periodoInicio: "2026-08-03T00:00", periodoFim: "2026-08-08T23:59", autorizadorId: "5521", eventoId: "baile-debutantes-2026", revogada: false, criadaEm: "29/07/2026" },
    // Delegação (ex-MOCK_ACCESS_MANAGERS) modelada como autorização — spec §6.5.
    { id: "auth-am1", personId: "am1", motivo: "Equipe Administrativa", periodoInicio: "2026-08-22T00:00", periodoFim: "2026-08-23T02:00", autorizadorId: "8493", eventoId: "baile-debutantes-2026", revogada: false, criadaEm: "20/07/2026" },
    { id: "auth-am2", personId: "am2", motivo: "Equipe Administrativa", periodoInicio: null, periodoFim: null, autorizadorId: null, autorizadorLabel: "Administração do Clube", revogada: false, criadaEm: "01/01/2020" },
  ];
}

export function getAutorizacoes(): Authorization[] {
  const persistidas = ler<Authorization>(CHAVE_AUTORIZACOES);
  if (persistidas.length > 0 || localStorage.getItem(CHAVE_AUTORIZACOES) !== null) {
    return persistidas;
  }
  const semente = seedAutorizacoes();
  escrever(CHAVE_AUTORIZACOES, semente);
  return semente;
}

export function getAutorizacoesDaPessoa(personId: string): Authorization[] {
  return getAutorizacoes().filter((a) => a.personId === personId);
}

export function concederAutorizacao(dados: Omit<Authorization, "id" | "revogada" | "criadaEm">): Authorization {
  const nova: Authorization = {
    ...dados,
    id: `auth-${Date.now()}`,
    revogada: false,
    criadaEm: "Agora mesmo",
  };
  escrever(CHAVE_AUTORIZACOES, [nova, ...getAutorizacoes()]);
  return nova;
}

export function editarAutorizacao(id: string, dados: { periodoInicio?: string | null; periodoFim?: string | null }): void {
  const atualizadas = getAutorizacoes().map((a) => (a.id === id ? { ...a, ...dados } : a));
  escrever(CHAVE_AUTORIZACOES, atualizadas);
}

export function revogarAutorizacao(id: string): void {
  const atualizadas = getAutorizacoes().map((a) => (a.id === id ? { ...a, revogada: true } : a));
  escrever(CHAVE_AUTORIZACOES, atualizadas);
}

// ============================================================
// CONVITES — link único que várias pessoas podem usar pra conversar
// com o Bot e completar o cadastro. "Aberto" não tem nada pré-definido
// (Manager configura pessoa por pessoa depois); "predefinido" já nasce
// com motivo/espaço/autorizador/período prontos (uso em lote, ex.: evento).
// ============================================================
export interface Convite {
  id: string;
  tipo: "aberto" | "predefinido";
  label: string;
  url: string;
  criadoEm: string;
  motivo?: Motivo;
  autorizador?: string;
  periodoInicio?: string;
  periodoFim?: string;
  observacoes?: string;
}

export function getConvites(): Convite[] {
  return ler<Convite>(CHAVE_CONVITES);
}

export function revogarConvite(id: string) {
  escrever(CHAVE_CONVITES, getConvites().filter((c) => c.id !== id));
}

export function criarConvite(dados: Omit<Convite, "id" | "url" | "criadoEm">): Convite {
  const token = Math.random().toString(36).slice(2, 9);
  const convite: Convite = {
    ...dados,
    id: `cv-${Date.now()}`,
    url: `https://pacc.clube/convite/${token}`,
    criadoEm: "Agora mesmo",
  };
  escrever(CHAVE_CONVITES, [convite, ...getConvites()]);
  return convite;
}

// ============================================================
// PESSOAS CONVIDADAS — quem completou o cadastro com o Bot usando um
// convite. Convite aberto → nasce "aguardando-configuracao" (Manager
// define motivo/espaço/autorizador/período um por um, ou revoga).
// Convite predefinido → nasce já com tudo preenchido, "aguardando-aceite"
// (Manager só aceita ou recusa — e pode aceitar várias de uma vez). Ao
// aceitar, vira Person + Authorization de verdade (ver aceitarPessoasConvidadas).
// ============================================================
export interface PessoaConvidada {
  id: string;
  conviteId: string;
  tipoConvite: "aberto" | "predefinido";
  nome: string;
  cpf: string;
  telefone: string;
  avatar: string;
  motivo?: Motivo;
  autorizadorId?: string | null;
  autorizadorLabel?: string;
  periodoInicio?: string;
  periodoFim?: string;
  observacoes?: string;
  status: "aguardando-cadastro" | "aguardando-autorizacao" | "aceito" | "recusado";
  // Quem enviou o convite — dono da pendência quando status é
  // "aguardando-autorizacao" (spec §1.2/§6.2.1). O Manager pode assumir,
  // mas por padrão é dessa pessoa.
  convidadorId: string;
  completadoEm: string;
}

const NOMES_MOCK = [
  "Beatriz Andrade", "Rafael Souza", "Camila Torres", "Lucas Martins",
  "Juliana Prado", "Felipe Rocha", "Marina Alves", "Gustavo Lima",
  "Isabela Farias", "Thiago Ramos",
];

function cpfAleatorio() {
  const n = () => Math.floor(100 + Math.random() * 900);
  const d = () => Math.floor(10 + Math.random() * 90);
  return `${n()}.${n()}.${n()}-${d()}`;
}

export function getPessoasConvidadas(): PessoaConvidada[] {
  return ler<PessoaConvidada>(CHAVE_PESSOAS_CONVIDADAS);
}

// Simula alguém completando o cadastro pelo Bot usando este convite — não
// existe integração real com o app Bot no protótipo, então isso cumpre o
// papel de "a pessoa terminou de conversar com o Bot agora" pra fins de
// demonstração (mesmo padrão do botão "Simular Retorno ERP" em VisaoSocio.tsx).
export function simularConclusaoCadastro(convite: Convite, convidadorId: string): PessoaConvidada {
  const nome = NOMES_MOCK[Math.floor(Math.random() * NOMES_MOCK.length)];
  const pessoa: PessoaConvidada = {
    id: `pc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    conviteId: convite.id,
    tipoConvite: convite.tipo,
    nome,
    cpf: cpfAleatorio(),
    telefone: `(51) 9${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`,
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(nome)}${Date.now()}`,
    motivo: convite.tipo === "predefinido" ? convite.motivo : undefined,
    autorizadorId: convite.tipo === "predefinido" ? null : undefined,
    autorizadorLabel: convite.tipo === "predefinido" ? convite.autorizador : undefined,
    periodoInicio: convite.tipo === "predefinido" ? convite.periodoInicio : undefined,
    periodoFim: convite.tipo === "predefinido" ? convite.periodoFim : undefined,
    observacoes: convite.tipo === "predefinido" ? convite.observacoes : undefined,
    status: "aguardando-autorizacao",
    convidadorId,
    completadoEm: "Agora mesmo",
  };
  escrever(CHAVE_PESSOAS_CONVIDADAS, [pessoa, ...getPessoasConvidadas()]);
  return pessoa;
}

// Materializa a pessoa convidada em Person + Authorization reais assim que
// é aceita/configurada — é isso que costura convite → roster → autorizações
// num ciclo completo (antes eram bases separadas que não se falavam).
function materializarPessoaConvidada(p: PessoaConvidada): void {
  if (!getPessoas().some((pessoa) => pessoa.cpf === p.cpf)) {
    registrarPessoa({ id: p.id, nome: p.nome, cpf: p.cpf, telefone: p.telefone, avatar: p.avatar });
  }
  if (p.motivo) {
    concederAutorizacao({
      personId: p.id,
      motivo: p.motivo,
      periodoInicio: p.periodoInicio || null,
      periodoFim: p.periodoFim || null,
      autorizadorId: p.autorizadorId ?? null,
      autorizadorLabel: p.autorizadorLabel,
      observacoes: p.observacoes,
    });
  }
}

export function configurarPessoaConvidada(
  id: string,
  dados: { motivo: Motivo; autorizadorId: string | null; autorizadorLabel?: string; periodoInicio: string; periodoFim: string; observacoes?: string },
) {
  const atualizados = getPessoasConvidadas().map((p) =>
    p.id === id ? { ...p, ...dados, status: "aceito" as const } : p,
  );
  escrever(CHAVE_PESSOAS_CONVIDADAS, atualizados);
  const pessoa = atualizados.find((p) => p.id === id);
  if (pessoa) materializarPessoaConvidada(pessoa);
}

export function revogarPessoaConvidada(id: string) {
  escrever(CHAVE_PESSOAS_CONVIDADAS, getPessoasConvidadas().filter((p) => p.id !== id));
}

export function recusarPessoaConvidada(id: string) {
  const atualizados = getPessoasConvidadas().map((p) =>
    p.id === id ? { ...p, status: "recusado" as const } : p,
  );
  escrever(CHAVE_PESSOAS_CONVIDADAS, atualizados);
}

export function recusarPessoasConvidadas(ids: string[]) {
  const atualizados = getPessoasConvidadas().map((p) =>
    ids.includes(p.id) ? { ...p, status: "recusado" as const } : p,
  );
  escrever(CHAVE_PESSOAS_CONVIDADAS, atualizados);
}

export function aceitarPessoasConvidadas(ids: string[]) {
  const atualizados = getPessoasConvidadas().map((p) =>
    ids.includes(p.id) ? { ...p, status: "aceito" as const } : p,
  );
  escrever(CHAVE_PESSOAS_CONVIDADAS, atualizados);
  atualizados.filter((p) => ids.includes(p.id)).forEach(materializarPessoaConvidada);
}
