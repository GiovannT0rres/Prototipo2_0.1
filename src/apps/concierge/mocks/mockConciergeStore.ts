// Camada de persistência do protótipo — sem backend real, mas sem descartar
// o que o porteiro acabou de cadastrar. Sem isso, uma pessoa registrada agora
// mesmo (visitante/prestador novo) sumia ao voltar pra Home: buscar o mesmo
// CPF de novo reiniciava o fluxo de "usuário novo" do zero, e a autorização
// criada não aparecia em lugar nenhum. Guarda em localStorage, ao lado dos
// mocks fixos de REGISTERED_PEOPLE/MOCK_AUTHORIZATIONS.
import { REGISTERED_PEOPLE, MOCK_AUTHORIZATIONS } from "./mockConcierge";

const CHAVE_PESSOAS = "pacc_concierge_pessoas_registradas";
const CHAVE_AUTORIZACOES = "pacc_concierge_autorizacoes_criadas";

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

export function buscarPessoaPorCpf(cpf: string): any | undefined {
  const extras = ler<any>(CHAVE_PESSOAS);
  return [...extras, ...REGISTERED_PEOPLE].find((p) => p.cpf === cpf);
}

export function registrarPessoaNova(pessoa: any) {
  const extras = ler<any>(CHAVE_PESSOAS).filter((p) => p.cpf !== pessoa.cpf);
  escrever(CHAVE_PESSOAS, [...extras, pessoa]);
}

export function buscarAutorizacoesPorCpf(cpf: string): any[] {
  const extras = ler<any>(CHAVE_AUTORIZACOES);
  return [...MOCK_AUTHORIZATIONS, ...extras].filter((a) => a.cpf === cpf);
}

export function registrarAutorizacaoNova(autorizacao: any) {
  const extras = ler<any>(CHAVE_AUTORIZACOES);
  escrever(CHAVE_AUTORIZACOES, [...extras, autorizacao]);
}
