// Tudo que o Manager cria direto pela tela Ativar (usuários, convites,
// pessoas que completaram cadastro via convite) — sem backend real, guarda em
// localStorage pra sobreviver a navegação entre telas e recarregamentos, do
// mesmo jeito que já fizemos no Concierge.
import { MOCK_SOCIOS } from "./mockManager";

const CHAVE_ACESSOS_CRIADOS = "pacc_manager_acessos_criados";
const CHAVE_CONVITES = "pacc_manager_convites";
const CHAVE_PESSOAS_CONVIDADAS = "pacc_manager_pessoas_convidadas";

function ler<T>(chave: string): T[] {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function escrever<T>(chave: string, valor: T[]) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // sem drama — só não persiste
  }
}

// ============================================================
// CRIAR USUÁRIO — pessoa cadastrada direto pelo Manager (com ou
// sem autorização, dependendo da categoria)
// ============================================================
export interface AcessoCriado {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  placa?: string;
  avatar: string;
  categoria: "Visitante" | "Sócio Titular" | "Sócio Dependente" | "Prestador de Serviço";
  titularVinculado?: string;
  empresa?: string;
  destino?: string;
  autorizador?: string;
  periodo?: string;
  observacoes?: string;
  criadoEm: string;
}

export function getAcessosCriados(): AcessoCriado[] {
  return ler<AcessoCriado>(CHAVE_ACESSOS_CRIADOS);
}

export function registrarAcessoCriado(acesso: AcessoCriado) {
  escrever(CHAVE_ACESSOS_CRIADOS, [acesso, ...getAcessosCriados()]);
}

// Busca por CPF — igual à lógica do Concierge (existe ou é pessoa nova) —
// só que aqui a base é a do Manager: sócios do ERP (MOCK_SOCIOS) + quem já
// foi criado nesta sessão via "Criar Usuário".
export interface PessoaEncontrada {
  nome: string;
  cpf: string;
  categoria: string;
  avatar: string;
}

export function buscarPessoaPorCpfManager(cpf: string): PessoaEncontrada | undefined {
  const criado = getAcessosCriados().find((a) => a.cpf === cpf);
  if (criado) {
    return { nome: criado.nome, cpf: criado.cpf, categoria: criado.categoria, avatar: criado.avatar };
  }
  const socio = MOCK_SOCIOS.find((s) => s.cpf === cpf);
  if (socio) {
    return { nome: socio.name, cpf: socio.cpf, categoria: "Sócio Titular", avatar: `https://i.pravatar.cc/150?u=${socio.id}` };
  }
  return undefined;
}

// Mesmo mock de retorno de BigDataCorp usado no Concierge (PortariaWizard.tsx)
// — mesmo CPF não encontrado nas bases do clube já retorna nome completo,
// então o cadastro nunca pede pro Manager digitar isso do zero, só confirmar.
export function buscarNomeBigDataCorp(_cpf: string): string {
  return "Carlos Eduardo Faria";
}

// ============================================================
// CONVITES — link único que várias pessoas podem usar pra conversar
// com o Bot e completar o cadastro. "Aberto" não tem nada pré-definido
// (Manager configura pessoa por pessoa depois); "predefinido" já nasce
// com motivo/destino/autorizador/período prontos (uso em lote, ex.: evento).
// ============================================================
export interface Convite {
  id: string;
  tipo: "aberto" | "predefinido";
  label: string;
  url: string;
  criadoEm: string;
  motivo?: "Visitante" | "Prestador de Serviço" | "Dependente";
  destino?: string;
  autorizador?: string;
  periodo?: string;
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
// define motivo/destino/autorizador/período um por um, ou revoga).
// Convite predefinido → nasce já com tudo preenchido, "aguardando-aceite"
// (Manager só aceita ou recusa — e pode aceitar várias de uma vez).
// ============================================================
export interface PessoaConvidada {
  id: string;
  conviteId: string;
  tipoConvite: "aberto" | "predefinido";
  nome: string;
  cpf: string;
  telefone: string;
  avatar: string;
  motivo?: string;
  destino?: string;
  autorizador?: string;
  periodo?: string;
  observacoes?: string;
  status: "aguardando-configuracao" | "aguardando-aceite" | "aceito" | "recusado";
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
export function simularConclusaoCadastro(convite: Convite): PessoaConvidada {
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
    destino: convite.tipo === "predefinido" ? convite.destino : undefined,
    autorizador: convite.tipo === "predefinido" ? convite.autorizador : undefined,
    periodo: convite.tipo === "predefinido" ? convite.periodo : undefined,
    observacoes: convite.tipo === "predefinido" ? convite.observacoes : undefined,
    status: convite.tipo === "predefinido" ? "aguardando-aceite" : "aguardando-configuracao",
    completadoEm: "Agora mesmo",
  };
  escrever(CHAVE_PESSOAS_CONVIDADAS, [pessoa, ...getPessoasConvidadas()]);
  return pessoa;
}

export function configurarPessoaConvidada(
  id: string,
  dados: { motivo: string; destino: string; autorizador: string; periodo: string; observacoes?: string },
) {
  const atualizados = getPessoasConvidadas().map((p) =>
    p.id === id ? { ...p, ...dados, status: "aceito" as const } : p,
  );
  escrever(CHAVE_PESSOAS_CONVIDADAS, atualizados);
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
}
