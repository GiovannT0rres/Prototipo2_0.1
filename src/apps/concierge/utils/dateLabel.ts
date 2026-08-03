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
export function labelDataCurta(data: Date): string {
  const hoje = hojeSemHora();
  if (mesmoDia(data, hoje)) return "hoje";
  if (mesmoDia(data, somarDias(hoje, 1))) return "amanhã";
  return `${DIAS_SEMANA[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`;
}

export function labelPeriodo(inicio: Date, fim: Date): string {
  if (mesmoDia(inicio, fim)) return `Só ${labelDataCurta(inicio)}`;
  return `${labelDataCurta(inicio)} até ${labelDataCurta(fim)}`;
}
