// Mensagem inicial com o menu de atendimento (simula o roteamento do bot)
export const MENU_MESSAGE = {
  id: "menu",
  type: "received" as const,
  text: "Olá! Sou o assistente virtual do Clube 🏌️. Como posso te ajudar hoje?",
  time: "10:00",
};

export const MENU_OPTIONS: { id: ScenarioId; label: string }[] = [
  { id: "visitante", label: "Concluir cadastro de Visitante" },
  { id: "dependente", label: "Cadastrar Dependente" },
  { id: "prestador", label: "Concluir cadastro de Prestador" },
  { id: "atualizar", label: "Atualizar meus dados" },
];

export type ScenarioId = "visitante" | "dependente" | "prestador" | "atualizar";

export type ChatMessage = {
  id: string;
  type: "received" | "sent";
  text?: string;
  time: string;
  isPass?: boolean;
  isSelfieRequest?: boolean;
  isSelfieReply?: boolean;
  passInfo?: { name: string; subtitle: string };
};

// Cada cenário representa um fluxo completo, incluindo confirmação de identidade quando aplicável
export const SCENARIOS: Record<ScenarioId, ChatMessage[]> = {
  // Caso de uso: Cadastrar visitantes + Concluir cadastro iniciado pelo App Concierge + Confirmar identidade
  visitante: [
    { id: "v1", type: "received", text: "Perfeito! A Portaria já iniciou seu pré-cadastro como *Visitante*. Vamos concluir juntos. Qual seu *Nome Completo*?", time: "10:01" },
    { id: "v2", type: "sent", text: "João da Silva", time: "10:01" },
    { id: "v3", type: "received", text: "Obrigado, João. Digite seu *CPF*:", time: "10:02" },
    { id: "v4", type: "sent", text: "111.222.333-44", time: "10:02" },
    { id: "v5", type: "received", text: "Qual a *data da visita*? (Ex: DD/MM/AAAA)", time: "10:02" },
    { id: "v6", type: "sent", text: "15/06/2026", time: "10:03" },
    { id: "v7", type: "received", text: "Última etapa: para confirmar sua identidade, envie uma *selfie* segurando um documento com foto.", time: "10:03", isSelfieRequest: true },
    { id: "v8", type: "sent", text: "", time: "10:04", isSelfieReply: true },
    { id: "v9", type: "received", text: "Identidade confirmada ✅\n\n*Resumo do Cadastro:*\nNome: João da Silva\nCPF: 111.222.333-44\nMotivo: Day Use\nData: 15/06/2026\n\nSua solicitação foi enviada para o titular aprovar no App Check-in.", time: "10:05" },
    { id: "v10", type: "received", text: "O Titular *aprovou* o seu acesso! ✅\n\nAqui está o seu Passe de Acesso. Apresente-o na portaria junto com seu documento oficial.", time: "10:15" },
    { id: "v11", type: "received", text: "PASSE", isPass: true, time: "10:15", passInfo: { name: "João da Silva", subtitle: "Day Use • 15/06" } },
  ],

  // Caso de uso: Cadastrar dependentes + Concluir cadastro iniciado pelo App Check-in
  dependente: [
    { id: "d1", type: "received", text: "Vi que o titular solicitou a inclusão de um *Dependente* pelo App Check-in. Vamos completar os dados que faltam. Qual o *Nome Completo* do dependente?", time: "10:01" },
    { id: "d2", type: "sent", text: "Lucas Almeida", time: "10:01" },
    { id: "d3", type: "received", text: "Qual o *Parentesco*?\n1 - Filho(a)\n2 - Cônjuge\n3 - Pai/Mãe", time: "10:02" },
    { id: "d4", type: "sent", text: "1", time: "10:02" },
    { id: "d5", type: "received", text: "Para confirmar a identidade do dependente, envie uma *selfie* dele com documento com foto.", time: "10:03", isSelfieRequest: true },
    { id: "d6", type: "sent", text: "", time: "10:03", isSelfieReply: true },
    { id: "d7", type: "received", text: "Identidade confirmada ✅\n\n*Resumo:*\nNome: Lucas Almeida\nParentesco: Filho(a)\n\nSeu cadastro foi enviado para aprovação do clube. Você será avisado por aqui assim que for aprovado.", time: "10:04" },
  ],

  // Caso de uso: Cadastrar prestadores de serviço + Concluir cadastro iniciado pelo App Concierge
  prestador: [
    { id: "p1", type: "received", text: "A Portaria iniciou seu pré-cadastro como *Prestador de Serviço*. Qual o *Nome Completo*?", time: "10:01" },
    { id: "p2", type: "sent", text: "Carlos Mendes", time: "10:01" },
    { id: "p3", type: "received", text: "Qual a *Empresa* (ou CNPJ)?", time: "10:02" },
    { id: "p4", type: "sent", text: "Hidro Serviços Ltda", time: "10:02" },
    { id: "p5", type: "received", text: "Para concluir, envie uma *selfie* com documento com foto para confirmação de identidade.", time: "10:03", isSelfieRequest: true },
    { id: "p6", type: "sent", text: "", time: "10:03", isSelfieReply: true },
    { id: "p7", type: "received", text: "Identidade confirmada ✅\n\nSeu cadastro foi enviado para o *Manager* solicitar o Background Check. Avisaremos assim que seu acesso for liberado.", time: "10:04" },
  ],

  // Caso de uso: Atualizar informações cadastrais + Confirmar identidade
  atualizar: [
    { id: "a1", type: "received", text: "Sem problemas! Localizei seu cadastro. O que deseja atualizar?\n1 - Telefone\n2 - Foto de Perfil\n3 - E-mail", time: "10:01" },
    { id: "a2", type: "sent", text: "1", time: "10:01" },
    { id: "a3", type: "received", text: "Certo, envie o novo *telefone* com DDD:", time: "10:02" },
    { id: "a4", type: "sent", text: "(11) 98888-1234", time: "10:02" },
    { id: "a5", type: "received", text: "Por segurança, para confirmar que é você, envie uma *selfie* rápida.", time: "10:02", isSelfieRequest: true },
    { id: "a6", type: "sent", text: "", time: "10:03", isSelfieReply: true },
    { id: "a7", type: "received", text: "Identidade confirmada ✅\n\nSeu telefone foi atualizado para *(11) 98888-1234* com sucesso!", time: "10:03" },
  ],
};
