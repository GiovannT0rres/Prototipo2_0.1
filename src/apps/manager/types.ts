// Modelo unificado do redesign — a Autorização (não a Pessoa, não o
// Convite) é o objeto central do sistema.
//
// 05/08/2026: espaço sai da autorização — a área permitida é pré-definida
// no perfil de acesso (motivo), que vive fora deste app (spec §1.1).
// autorizador vira referência (autorizadorId) em vez de string livre, pra
// permitir link pro perfil de quem autorizou (spec §6.2). eventoId entra
// como rótulo de agrupamento puro, sem significado de local (spec §1.1).

export type Motivo =
  | "Sócio Titular"
  | "Dependente"
  | "Prestador de Serviço"
  | "Visitante"
  | "Equipe Administrativa"
  | "Porteiro";

export const MOTIVOS: Motivo[] = [
  "Sócio Titular",
  "Dependente",
  "Prestador de Serviço",
  "Visitante",
  "Equipe Administrativa",
  "Porteiro",
];

// Cor por motivo — convenção existente (Visitante âmbar, Prestador azul,
// Dependente verde) estendida pros 3 motivos novos.
export const MOTIVO_COR: Record<Motivo, { text: string; bg: string; border: string; dot: string }> = {
  "Sócio Titular": { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-600", dot: "bg-emerald-500" },
  "Dependente": { text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-600", dot: "bg-teal-500" },
  "Prestador de Serviço": { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-600", dot: "bg-blue-500" },
  "Visitante": { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-600", dot: "bg-amber-500" },
  "Equipe Administrativa": { text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-600", dot: "bg-purple-500" },
  "Porteiro": { text: "text-slate-700", bg: "bg-slate-50", border: "border-slate-600", dot: "bg-slate-500" },
};

// Autoridade do perfil — o que cada motivo PODE autorizar. Informativo
// nesta rodada (spec §1.2/§9): aparece como texto no perfil da pessoa,
// não é aplicado como regra (nenhum botão é desabilitado por isso).
export const PERFIL_AUTORIDADE: Record<Motivo, string> = {
  "Sócio Titular": "Autoriza dependentes, visitantes e prestadores de serviço",
  "Dependente": "Autoriza visitantes",
  "Visitante": "Não autoriza ninguém",
  "Prestador de Serviço": "Autoriza outros prestadores da mesma empresa",
  "Equipe Administrativa": "Autoriza qualquer perfil, dentro da própria validade",
  "Porteiro": "Não autoriza — só registra entrada e saída",
};

export interface Person {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  placa?: string;
  avatar: string;
}

export type AuthorizationStatus = "vigente" | "futura" | "expirada" | "revogada";

export interface Authorization {
  id: string;
  personId: string;
  motivo: Motivo;
  // Person.id de quem autorizou, quando o autorizador é uma pessoa do
  // sistema; autorizadorLabel é o fallback pra autorizador não-pessoa
  // (ex.: "Administração do Clube", "Reciprocidade — CC Curitiba").
  autorizadorId: string | null;
  autorizadorLabel?: string;
  // Rótulo de agrupamento puro (ex.: "Baile de Debutantes") — sem
  // significado de local. Ver spec §1.1.
  eventoId?: string;
  // Sócio Titular/Dependente/Equipe Administrativa/Porteiro: sem fim
  // (ligado ao status de associação/função, não a um período). Demais
  // motivos: início/fim reais em ISO.
  periodoInicio: string | null;
  periodoFim: string | null;
  observacoes?: string;
  revogada: boolean;
  criadaEm: string;
}

export function statusAutorizacao(auth: Authorization, agora: Date = new Date()): AuthorizationStatus {
  if (auth.revogada) return "revogada";
  const semPrazo = auth.motivo === "Sócio Titular" || auth.motivo === "Dependente" || auth.motivo === "Equipe Administrativa" || auth.motivo === "Porteiro";
  if (semPrazo && !auth.periodoFim) return "vigente";
  if (!auth.periodoInicio || !auth.periodoFim) return "vigente";
  const inicio = new Date(auth.periodoInicio);
  const fim = new Date(auth.periodoFim);
  if (agora < inicio) return "futura";
  if (agora > fim) return "expirada";
  return "vigente";
}

// Rótulo pra exibir quem autorizou, resolvendo id → nome quando existir.
export function rotuloAutorizador(auth: Authorization, nomePessoa: string | undefined): string {
  if (auth.autorizadorId && nomePessoa) return nomePessoa;
  return auth.autorizadorLabel ?? "Administração do Clube";
}
