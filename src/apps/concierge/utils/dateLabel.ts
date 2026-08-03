const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function hojeSemHora(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function mesmoDia(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function somarDias(data: Date, dias: number): Date {
  const d = new Date(data);
  d.setDate(d.getDate() + dias);
  return d;
}

// "hoje" / "amanhã" / "sex, 22 de agosto" — porteiro nunca precisa decorar
// dia da semana pra reconhecer a data (Princípio 4, reconhecimento > memorização).
// Usado só nas telas de pergunta (texto auxiliar curto, uma data por vez).
export function labelDataCurta(data: Date): string {
  const hoje = hojeSemHora();
  if (mesmoDia(data, hoje)) return "hoje";
  if (mesmoDia(data, somarDias(hoje, 1))) return "amanhã";
  return `${DIAS_SEMANA[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`;
}

function dois(n: number): string {
  return String(n).padStart(2, "0");
}

// "sex, 22/08/26" — formato numérico compacto pro resumo final: evita "hoje"/
// "amanhã" (ambíguo num registro que pode ser revisado dias depois) e evita a
// versão por extenso, que é o que estourava o card de resumo (design.md §7.3,
// piso de 17px não cabia "sex, 22 de agosto até sáb, 5 de setembro" numa linha).
export function labelDataNumerica(data: Date): string {
  const ano2 = String(data.getFullYear()).slice(-2);
  return `${DIAS_SEMANA[data.getDay()]}, ${dois(data.getDate())}/${dois(data.getMonth() + 1)}/${ano2}`;
}

// Versão compacta de uma linha só — usada em contextos de espaço apertado
// (card de autorização no Perfil da Pessoa, texto de sucesso).
export function labelPeriodo(inicio: Date, fim: Date): string {
  if (mesmoDia(inicio, fim)) return `Só ${labelDataNumerica(inicio)}`;
  return `${labelDataNumerica(inicio)} – ${labelDataNumerica(fim)}`;
}

// Início e fim como linhas separadas — usada no resumo de revisão
// (PerguntaObservacoes), onde cada data ganha sua própria linha em vez de
// disputar espaço numa string só.
export function labelPeriodoLinhas(inicio: Date, fim: Date): { inicio: string; fim: string | null } {
  if (mesmoDia(inicio, fim)) return { inicio: labelDataNumerica(inicio), fim: null };
  return { inicio: labelDataNumerica(inicio), fim: labelDataNumerica(fim) };
}
