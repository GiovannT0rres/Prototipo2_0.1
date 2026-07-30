// Guarda as últimas escolhas de um campo de busca (Destino, Autorizador,
// Empresa) no localStorage, pra elas aparecerem primeiro como moeda de
// recomendação da próxima vez — sem precisar digitar de novo o que já foi
// usado antes. Aceita uma lista semente pra telas que já nascem com
// sugestões plausíveis (ex.: Empresa), mesmo sem histórico real ainda.
const MAX_RECENTES = 8;

export function getRecentes(chave: string, semente: string[] = []): string[] {
  try {
    const raw = localStorage.getItem(chave);
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage indisponível (modo privado etc.) — cai pra semente
  }
  return semente;
}

export function registrarRecente(chave: string, valor: string) {
  if (!valor) return;
  const atuais = getRecentes(chave).filter((v) => v !== valor);
  const atualizados = [valor, ...atuais].slice(0, MAX_RECENTES);
  try {
    localStorage.setItem(chave, JSON.stringify(atualizados));
  } catch {
    // sem drama — só não persiste
  }
}
