// Tags + motor de consulta — spec §6.1. Sem JSX: pega Person/Authorization/
// PessoaConvidada do store e monta PessoaIndexada, uma vez por consulta, pra
// manter cada predicado de tag uma função pura de uma linha.
import type { Person, Authorization, Motivo } from "./types";
import { MOTIVOS, MOTIVO_COR, statusAutorizacao } from "./types";
import { getPessoas, getAutorizacoes, getPessoasConvidadas, getPessoa } from "./mocks/mockManagerStore";
import { MOCK_DENTRO_DO_CLUBE } from "./mocks/mockManager";

// titularId/inadimplente/categoriaTitulo não estão em Person — são campos
// extras do literal MOCK_PESSOAS (spec §6.1, nota).
export interface PessoaIndexada extends Person {
  titularId?: string;
  inadimplente?: boolean;
  autorizacoes: Authorization[];
  motivoAtual: Motivo | null;
  statusAtual: ReturnType<typeof statusAutorizacao> | null;
  vencendoHoje: boolean;
  dentroDoClube: boolean;
  statusCadastro: "aguardando-cadastro" | "aguardando-autorizacao" | null;
  convidadorId: string | null;
  eventoAtual: string | null;
  pessoaConvidadaId: string | null;
}

function ehHoje(iso: string): boolean {
  const d = new Date(iso);
  const hoje = new Date();
  return d.toDateString() === hoje.toDateString();
}

export function indexarPessoas(): PessoaIndexada[] {
  const pessoas = getPessoas() as (Person & { titularId?: string; inadimplente?: boolean })[];
  const autorizacoes = getAutorizacoes();
  const convidadas = getPessoasConvidadas().filter(
    (p) => p.status === "aguardando-cadastro" || p.status === "aguardando-autorizacao",
  );

  const indexadas: PessoaIndexada[] = pessoas.map((p) => {
    const authsDaPessoa = autorizacoes.filter((a) => a.personId === p.id);
    const vigente = authsDaPessoa.find((a) => !a.revogada && statusAutorizacao(a) === "vigente");
    const maisRecente = authsDaPessoa[0];
    const atual = vigente ?? maisRecente;
    return {
      ...p,
      autorizacoes: authsDaPessoa,
      motivoAtual: atual?.motivo ?? null,
      statusAtual: atual ? statusAutorizacao(atual) : null,
      vencendoHoje: authsDaPessoa.some(
        (a) => !a.revogada && statusAutorizacao(a) === "vigente" && !!a.periodoFim && ehHoje(a.periodoFim),
      ),
      dentroDoClube: MOCK_DENTRO_DO_CLUBE.includes(p.id),
      statusCadastro: null,
      convidadorId: null,
      eventoAtual: authsDaPessoa.find((a) => a.eventoId)?.eventoId ?? null,
      pessoaConvidadaId: null,
    };
  });

  // Pessoas ainda não materializadas (PessoaConvidada sem Person ainda) —
  // aparecem na busca mesmo sem autorização, com motivoAtual null (spec §3:
  // "uma pessoa aguardando autorização não tem tag de perfil ainda").
  const idsExistentes = new Set(indexadas.map((p) => p.id));
  convidadas.forEach((pc) => {
    if (idsExistentes.has(pc.id)) {
      const existente = indexadas.find((p) => p.id === pc.id)!;
      existente.statusCadastro = pc.status === "aguardando-cadastro" ? "aguardando-cadastro" : "aguardando-autorizacao";
      existente.convidadorId = pc.convidadorId;
      existente.pessoaConvidadaId = pc.id;
      return;
    }
    indexadas.push({
      id: pc.id,
      nome: pc.nome,
      cpf: pc.cpf,
      telefone: pc.telefone,
      avatar: pc.avatar,
      autorizacoes: [],
      motivoAtual: null,
      statusAtual: null,
      vencendoHoje: false,
      dentroDoClube: false,
      statusCadastro: pc.status === "aguardando-cadastro" ? "aguardando-cadastro" : "aguardando-autorizacao",
      convidadorId: pc.convidadorId,
      eventoAtual: null,
      pessoaConvidadaId: pc.id,
    });
  });

  return indexadas;
}

export interface Tag {
  id: string;
  label: string;
  secao: "cadastro" | "perfil" | "status" | "presenca" | "financeiro" | "evento" | "autorizador";
  cor: { text: string; bg: string; border: string; dot: string };
  aplica: (p: PessoaIndexada) => boolean;
}

const CINZA = { text: "text-gray-700", bg: "bg-gray-50", border: "border-gray-400", dot: "bg-gray-400" };
const AMARELO = { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-500", dot: "bg-amber-500" };
const AZUL = { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-500", dot: "bg-blue-500" };
const VERDE = { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-500", dot: "bg-emerald-500" };
const ROXO = { text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-500", dot: "bg-purple-500" };
const VERMELHO = { text: "text-red-700", bg: "bg-red-50", border: "border-red-500", dot: "bg-red-500" };

const EVENTOS_CONHECIDOS: Record<string, string> = {
  "baile-debutantes-2026": "Baile de Debutantes",
};

export function tagsDisponiveis(pessoas: PessoaIndexada[]): Tag[] {
  const tags: Tag[] = [
    { id: "cadastro:aguardando-autorizacao", label: "Aguardando Autorização", secao: "cadastro", cor: AMARELO, aplica: (p) => p.statusCadastro === "aguardando-autorizacao" },
    { id: "cadastro:aguardando-cadastro", label: "Aguardando Cadastro", secao: "cadastro", cor: AZUL, aplica: (p) => p.statusCadastro === "aguardando-cadastro" },
    { id: "status:vencendo-hoje", label: "Vencendo hoje", secao: "status", cor: AMARELO, aplica: (p) => p.vencendoHoje },
    { id: "status:vigente", label: "Vigente", secao: "status", cor: VERDE, aplica: (p) => p.statusAtual === "vigente" },
    { id: "status:expirada", label: "Expirada", secao: "status", cor: CINZA, aplica: (p) => p.statusAtual === "expirada" },
    { id: "status:sem-autorizacao", label: "Sem autorização vigente", secao: "status", cor: CINZA, aplica: (p) => p.statusAtual !== "vigente" && p.statusCadastro === null },
    { id: "presenca:dentro", label: "No clube agora", secao: "presenca", cor: VERDE, aplica: (p) => p.dentroDoClube },
    { id: "financeiro:inadimplente", label: "Inadimplente no Forza", secao: "financeiro", cor: VERMELHO, aplica: (p) => !!p.inadimplente },
  ];

  MOTIVOS.forEach((motivo) => {
    tags.push({
      id: `perfil:${motivo}`,
      label: motivo,
      secao: "perfil",
      cor: MOTIVO_COR[motivo],
      aplica: (p) => p.motivoAtual === motivo,
    });
  });

  const eventosPresentes = new Set(pessoas.map((p) => p.eventoAtual).filter((e): e is string => !!e));
  eventosPresentes.forEach((eventoId) => {
    tags.push({
      id: `evento:${eventoId}`,
      label: EVENTOS_CONHECIDOS[eventoId] ?? eventoId,
      secao: "evento",
      cor: ROXO,
      aplica: (p) => p.eventoAtual === eventoId,
    });
  });

  const autorizadoresPresentes = new Map<string, string>();
  pessoas.forEach((p) => {
    p.autorizacoes.forEach((a) => {
      if (a.autorizadorId) {
        const nomeAutorizador = getPessoa(a.autorizadorId)?.nome;
        if (nomeAutorizador) autorizadoresPresentes.set(a.autorizadorId, nomeAutorizador);
      }
    });
  });
  autorizadoresPresentes.forEach((nome, id) => {
    tags.push({
      id: `autorizador:${id}`,
      label: `Autorizado por ${nome}`,
      secao: "autorizador",
      cor: CINZA,
      aplica: (p) => p.autorizacoes.some((a) => a.autorizadorId === id),
    });
  });

  return tags;
}

function normalizar(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function executarConsulta(pessoas: PessoaIndexada[], texto: string, tagIds: string[]): PessoaIndexada[] {
  const tags = tagsDisponiveis(pessoas);
  let resultado = pessoas;
  tagIds.forEach((id) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) resultado = resultado.filter(tag.aplica);
  });
  const q = texto.trim();
  if (q) {
    const nq = normalizar(q);
    resultado = resultado.filter(
      (p) =>
        normalizar(p.nome).includes(nq) ||
        p.cpf.includes(q) ||
        (p.motivoAtual !== null && normalizar(p.motivoAtual).includes(nq)),
    );
  }
  return resultado;
}

export function sugerir(
  pessoas: PessoaIndexada[],
  tagsBase: Tag[],
  texto: string,
): { pessoas: PessoaIndexada[]; tags: Tag[] } {
  const q = texto.trim();
  if (!q) return { pessoas: [], tags: [] };
  const nq = normalizar(q);
  const scoreTexto = (t: string) => {
    const i = normalizar(t).indexOf(nq);
    return i < 0 ? -1 : (i === 0 ? 100 : 50) - i;
  };
  const pessoasRanqueadas = pessoas
    .map((p) => ({ p, s: Math.max(scoreTexto(p.nome), p.cpf.includes(q) ? 80 : -1) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 7)
    .map((x) => x.p);
  const tagsRanqueadas = tagsBase
    .map((t) => ({ t, s: scoreTexto(t.label) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 5)
    .map((x) => x.t);
  return { pessoas: pessoasRanqueadas, tags: tagsRanqueadas };
}

export function pessoasRecentes(pessoas: PessoaIndexada[], ids: string[]): PessoaIndexada[] {
  return ids.map((id) => pessoas.find((p) => p.id === id)).filter((p): p is PessoaIndexada => !!p);
}

export function pendenciasAbertas(pessoas: PessoaIndexada[]): PessoaIndexada[] {
  return pessoas.filter((p) => p.statusCadastro === "aguardando-autorizacao");
}

export function quemAutorizou(pessoas: PessoaIndexada[], personId: string): PessoaIndexada | undefined {
  const pessoa = pessoas.find((p) => p.id === personId);
  const auth = pessoa?.autorizacoes.find((a) => !a.revogada) ?? pessoa?.autorizacoes[0];
  if (!auth?.autorizadorId) return undefined;
  return pessoas.find((p) => p.id === auth.autorizadorId);
}

export function quemEstaPessoaAutorizou(pessoas: PessoaIndexada[], personId: string): PessoaIndexada[] {
  return pessoas.filter((p) => p.autorizacoes.some((a) => a.autorizadorId === personId));
}
