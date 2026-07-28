// Fila de trabalho do Manager — SÓ dependentes precisam de aprovação da
// administração (ver PERGUNTAS-PARA-O-CLUBE §A: "o sócio autoriza e a
// administração aprova"). Convidado é livre — o sócio patrocina direto, sem
// fila; o Manager só acompanha isso depois pelo Histórico (ver LOGS).
// titular/titularId aqui porque todo dependente é vinculado a um sócio —
// a fila precisa deixar isso visível, não só o nome do dependente.
export const MOCK_FILA_DEPENDENTES = [
  { id: "fd1", name: "Enzo Rossi", cpf: "123.456.789-00", avatar: "https://i.pravatar.cc/150?u=enzo", type: "Familiar", titular: "Roberto Almeida", titularId: "8493" },
  { id: "fd2", name: "Beatriz Oliveira", cpf: "987.654.321-11", avatar: "https://i.pravatar.cc/150?u=bia", type: "Familiar", titular: "Fernando Silva", titularId: "5521" },
  { id: "fd3", name: "Lucas Nogueira", cpf: "222.111.333-44", avatar: "https://i.pravatar.cc/150?u=lucasn", type: "Familiar", titular: "Patrícia Nogueira", titularId: "6702" },
];

// PACC é um clube único — o dashboard reflete operação e eventos, não uma
// contagem de "clubes ativos" (esse conceito era do modelo multi-condomínio do ES).
export const MOCK_DASHBOARD = {
  totalAcessosHoje: 145,
  acessosPendentes: 12,
  eventosAtivos: 2, // ex.: Baile de Debutantes (22/ago) em preparação
  visitantesSemana: 890
};

// Mapa Operacional — quem está dentro de cada espaço do clube agora.
// Responde diretamente ao pedido da administração: "o sócio vê duas pessoas
// que não conhece no bar, quem são, quem autorizou?" (ver CLAUDE.md §5).
export interface PessoaPresente {
  id: string;
  name: string;
  avatar: string;
  tipo: string;
  autorizadoPor: string;
  entrada: string;
}

export const MOCK_PRESENCA: Record<string, PessoaPresente[]> = {
  "1": [
    { id: "pr1", name: "Fernanda Lopes", avatar: "https://i.pravatar.cc/150?u=fernanda", tipo: "Sócia", autorizadoPor: "Entrada por placa (LPR)", entrada: "Hoje, 18:40" },
    { id: "pr2", name: "Marcos Bittencourt", avatar: "https://i.pravatar.cc/150?u=marcosb", tipo: "Visitante", autorizadoPor: "Autorizado por Fernanda Lopes", entrada: "Hoje, 19:05" },
  ],
  "2": [],
  "3": [
    { id: "pr3", name: "Rafael Nunes", avatar: "https://i.pravatar.cc/150?u=rafael", tipo: "Prestador de Serviço", autorizadoPor: "Admin — escala fixa", entrada: "Hoje, 10:00" },
    { id: "pr4", name: "Camila Reis", avatar: "https://i.pravatar.cc/150?u=camila", tipo: "Familiar", autorizadoPor: "Herdado de Roberto Almeida", entrada: "Hoje, 17:20" },
  ],
  "4": [],
  "5": [
    { id: "pr5", name: "Eduardo Klein", avatar: "https://i.pravatar.cc/150?u=eduardo", tipo: "Visitante", autorizadoPor: "Reciprocidade — Country Club de Curitiba", entrada: "Hoje, 08:15" },
  ],
};

// Gerenciar Sócios — roster completo, integrado (na ficção do protótipo) ao
// ERP Forza. titularId bate com o titularId usado em MOCK_DEPENDENTES_ADMIN.
export const MOCK_SOCIOS = [
  { id: "8493", name: "Roberto Almeida", cpf: "123.456.789-00", telefone: "(11) 99999-8888", email: "roberto@email.com", categoria: "Sócio Titular", inadimplente: false },
  { id: "5521", name: "Fernando Silva", cpf: "456.789.123-00", telefone: "(51) 98888-7777", email: "fernando.silva@email.com", categoria: "Sócio Titular", inadimplente: false },
  { id: "3390", name: "Marcelo Costa", cpf: "789.123.456-00", telefone: "(51) 97777-6666", email: "marcelo.costa@email.com", categoria: "Sócio Remido", inadimplente: true },
  { id: "6702", name: "Patrícia Nogueira", cpf: "321.654.987-00", telefone: "(51) 96666-5555", email: "patricia.nog@email.com", categoria: "Sócia Contribuinte", inadimplente: false },
];

// Gerenciar Dependentes — visão administrativa (todos os titulares), diferente
// da autogestão do sócio no app Check-in. Status genérico "Familiar" — não
// importa se é cônjuge, filho(a) etc., o Manager só precisa saber que é
// família do titular (ver CLAUDE.md §5: motivos de acesso são só 3 categorias).
export const MOCK_DEPENDENTES_ADMIN = [
  { id: "dep1", name: "Ana Almeida", tipo: "Familiar", titular: "Roberto Almeida", titularId: "8493", idade: 45, status: "Ativo" },
  { id: "dep2", name: "Lucas Almeida", tipo: "Familiar", titular: "Roberto Almeida", titularId: "8493", idade: 16, status: "Ativo" },
  { id: "dep3", name: "Maria Silva", tipo: "Familiar", titular: "Fernando Silva", titularId: "5521", idade: 39, status: "Ativo" },
  { id: "dep4", name: "João Pedro Silva", tipo: "Familiar", titular: "Fernando Silva", titularId: "5521", idade: 20, status: "Pendente" },
  { id: "dep5", name: "Beatriz Costa", tipo: "Familiar", titular: "Marcelo Costa", titularId: "3390", idade: 17, status: "Bloqueado" },
];

// Convidados patrocinados por sócios (visão admin, cruzando com titularId de MOCK_SOCIOS)
export const MOCK_CONVIDADOS_ADMIN = [
  { id: "cv1", name: "Carlos Mendes", titular: "Roberto Almeida", titularId: "8493", tipo: "Visitante", status: "Ativo" },
  { id: "cv2", name: "Juliana Costa", titular: "Roberto Almeida", titularId: "8493", tipo: "Visitante", status: "Expirado" },
  { id: "cv3", name: "Maria Souza", titular: "Fernando Silva", titularId: "5521", tipo: "Visitante", status: "Ativo" },
];

// Prestadores vinculados a um sócio específico (ex.: personal, babá — diferente
// dos prestadores recorrentes do clube em si, como bar/cozinha).
export const MOCK_PRESTADORES_VINCULADOS = [
  { id: "pv1", name: "Carlos Personal", titular: "Roberto Almeida", titularId: "8493", tipo: "Recorrente", status: "Ativo" },
  { id: "pv2", name: "Regina Cuidadora", titular: "Marcelo Costa", titularId: "3390", tipo: "Temporário", status: "Background Check Pendente" },
];

// Gerenciar Access Managers — poder temporário de convidar/vincular pessoas a um
// lugar (ex.: cerimonialista de um evento). O Manager precisa saber quem
// promoveu quem (promovidoPor) e quem esse gestor já trouxe abaixo dele
// (subordinados), cada um com sua categoria (funcionário de apoio, decoração...).
export interface AccessManagerSubordinado {
  id: string;
  name: string;
  categoria: string;
}

export const MOCK_ACCESS_MANAGERS = [
  {
    id: "am1",
    name: "Juliana Ferraz",
    email: "juliana.ferraz@paccclube.com.br",
    cargo: "Cerimonialista",
    vinculo: "Baile de Debutantes (22/08/2026)",
    temporario: true,
    validade: "22/08/2026 a 23/08/2026",
    promovidoPor: "Roberto Almeida (Sócio)",
    status: "Ativo",
    subordinados: [
      { id: "sub1", name: "Ricardo Mendes", categoria: "Funcionário de Apoio" },
      { id: "sub2", name: "Camila Duarte", categoria: "Decoração" },
    ] as AccessManagerSubordinado[],
  },
  {
    id: "am2",
    name: "Bruno Tavares",
    email: "bruno.tavares@paccclube.com.br",
    cargo: "Gestor de Portaria",
    vinculo: "Todas as portarias",
    temporario: false,
    validade: null as string | null,
    promovidoPor: "Administração",
    status: "Ativo",
    subordinados: [] as AccessManagerSubordinado[],
  },
  {
    id: "am3",
    name: "Patrícia Nogueira",
    email: "patricia.nogueira@paccclube.com.br",
    cargo: "Cerimonialista",
    vinculo: "Baile de Debutantes (22/08/2026)",
    temporario: true,
    validade: "22/08/2026 a 23/08/2026",
    promovidoPor: "Administração",
    status: "Convite Pendente",
    subordinados: [] as AccessManagerSubordinado[],
  },
];

// Gerenciar Hierarquia de Autorizações — escalas configuráveis por evento,
// conforme pedido da administração para o Baile de Debutantes.
export const MOCK_HIERARQUIAS = [
  {
    id: "h1",
    nome: "Baile de Debutantes — Decoração",
    evento: "Baile de Debutantes (22/08/2026)",
    niveis: ["Sócio / Cerimonialista", "Responsável pela Decoração", "Funcionário de Apoio"],
  },
  {
    id: "h2",
    nome: "Baile de Debutantes — Som e Iluminação",
    evento: "Baile de Debutantes (22/08/2026)",
    niveis: ["Sócio / Cerimonialista", "Responsável pelo Som", "Funcionário de Apoio"],
  },
  {
    id: "h3",
    nome: "Padrão — Fornecedor de Evento",
    evento: "Aplicável a qualquer evento",
    niveis: ["Coordenador de Eventos", "Fornecedor Responsável", "Equipe do Fornecedor"],
  },
];

// Alertas de Segurança — versão completa (o Dashboard mostra só um resumo)
export const MOCK_ALERTAS = [
  { id: "al1", titulo: "Prestador com restrição encontrada", detalhe: "Background check reprovado para um CPF cadastrado hoje na Concierge. O acesso não deve ser liberado na portaria.", severidade: "alta", data: "Hoje, 15:02", resolvido: false },
  { id: "al2", titulo: "Sócio inadimplente tentou gerar convite", detalhe: "Roberto Almeida (Título 8493) está inadimplente no ERP Forza e tentou autorizar um convidado.", severidade: "media", data: "Hoje, 13:40", resolvido: false },
  { id: "al3", titulo: "Pessoas não identificadas relatadas no English Bar", detalhe: "Um sócio relatou à administração duas pessoas desconhecidas no bar. Verifique o Mapa Operacional.", severidade: "alta", data: "Ontem, 20:15", resolvido: false },
  { id: "al4", titulo: "Convite expirado utilizado na portaria", detalhe: "Tentativa de acesso com iToken expirado na portaria do campo de golfe.", severidade: "baixa", data: "Ontem, 16:30", resolvido: true },
];

// LOGS é onde o Manager acompanha "quem convidou quem" — convidado não passa
// por aprovação (é livre, o sócio patrocina direto), então o histórico é o
// único lugar onde essa relação sócio → convidado fica registrada.
export const LOGS = [
  {
    id: "l1",
    usuario: "Roberto Almeida",
    acao: "Gerou Convite",
    detalhes: "Convite gerado para Carlos Mendes (Visitante) no Salão Social 1",
    data: "Hoje, 14:32",
    tipo: "criacao",
  },
  {
    id: "l5",
    usuario: "Fernando Silva",
    acao: "Gerou Convite",
    detalhes: "Convite gerado para Maria Souza (Visitante) no English Bar",
    data: "Hoje, 09:10",
    tipo: "criacao",
  },
  {
    id: "l2",
    usuario: "Portaria - Portão Social",
    acao: "Acesso Liberado",
    detalhes: "Maria Santos entrou como Prestadora de Serviço no Campo de Golfe",
    data: "Hoje, 11:15",
    tipo: "acesso",
  },
  {
    id: "l3",
    usuario: "Fernando Silva",
    acao: "Revogou Acesso",
    detalhes: "Acesso de Carlos (Cuidador) foi revogado",
    data: "Ontem, 18:45",
    tipo: "revogacao",
  },
  {
    id: "l4",
    usuario: "Sistema",
    acao: "Convite Expirado",
    detalhes: "Convite de Ana Costa expirou",
    data: "Ontem, 23:59",
    tipo: "sistema",
  }
];
