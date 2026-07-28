// Fila de trabalho isolada do domínio Manager (aprovações de dependentes e convidados)
export const INITIAL_PENDING = [
  { id: "mp1", name: "Enzo Rossi", cpf: "123.456.789-00", avatar: "https://i.pravatar.cc/150?u=enzo", type: "Filho(a)" },
  { id: "mp2", name: "Beatriz Oliveira", cpf: "987.654.321-11", avatar: "https://i.pravatar.cc/150?u=bia", type: "Cônjuge" },
  { id: "mp3", name: "Carlos Mendes", cpf: "111.222.333-44", avatar: "https://i.pravatar.cc/150?u=carlos", type: "Convidado Social (1 Dia)" },
  { id: "mp4", name: "Juliana Costa", cpf: "222.333.444-55", avatar: "https://i.pravatar.cc/150?u=juliana", type: "Visitante Jogador" },
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
    { id: "pr2", name: "Marcos Bittencourt", avatar: "https://i.pravatar.cc/150?u=marcosb", tipo: "Convidado Social", autorizadoPor: "Autorizado por Fernanda Lopes", entrada: "Hoje, 19:05" },
  ],
  "2": [],
  "3": [
    { id: "pr3", name: "Rafael Nunes", avatar: "https://i.pravatar.cc/150?u=rafael", tipo: "Prestador (Bar)", autorizadoPor: "Admin — escala fixa", entrada: "Hoje, 10:00" },
    { id: "pr4", name: "Camila Reis", avatar: "https://i.pravatar.cc/150?u=camila", tipo: "Dependente", autorizadoPor: "Herdado de Roberto Almeida", entrada: "Hoje, 17:20" },
  ],
  "4": [],
  "5": [
    { id: "pr5", name: "Eduardo Klein", avatar: "https://i.pravatar.cc/150?u=eduardo", tipo: "Visitante Jogador", autorizadoPor: "Reciprocidade — Country Club de Curitiba", entrada: "Hoje, 08:15" },
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
// da autogestão do sócio no app Check-in.
export const MOCK_DEPENDENTES_ADMIN = [
  { id: "dep1", name: "Ana Almeida", parentesco: "Cônjuge", titular: "Roberto Almeida", titularId: "8493", idade: 45, status: "Ativo" },
  { id: "dep2", name: "Lucas Almeida", parentesco: "Filho(a)", titular: "Roberto Almeida", titularId: "8493", idade: 16, status: "Ativo" },
  { id: "dep3", name: "Maria Silva", parentesco: "Cônjuge", titular: "Fernando Silva", titularId: "5521", idade: 39, status: "Ativo" },
  { id: "dep4", name: "João Pedro Silva", parentesco: "Filho(a)", titular: "Fernando Silva", titularId: "5521", idade: 20, status: "Pendente" },
  { id: "dep5", name: "Beatriz Costa", parentesco: "Filho(a)", titular: "Marcelo Costa", titularId: "3390", idade: 17, status: "Bloqueado" },
];

// Gerenciar Access Managers (RBAC de equipe — gestores de eventos, portaria, admin)
export const MOCK_ACCESS_MANAGERS = [
  { id: "am1", name: "Juliana Ferraz", email: "juliana.ferraz@paccclube.com.br", cargo: "Coordenadora de Eventos", escopo: "Salão Social 1, Salão Social 2", status: "Ativo" },
  { id: "am2", name: "Bruno Tavares", email: "bruno.tavares@paccclube.com.br", cargo: "Gestor de Portaria", escopo: "Todas as portarias", status: "Ativo" },
  { id: "am3", name: "Patrícia Nogueira", email: "patricia.nogueira@paccclube.com.br", cargo: "Coordenadora de Eventos", escopo: "Baile de Debutantes (22/08)", status: "Convite Pendente" },
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
  { id: "al1", titulo: "Prestador com restrição encontrada", detalhe: "Background check reprovado para um CPF cadastrado hoje. Verifique em Gestão de Prestadores.", severidade: "alta", data: "Hoje, 15:02", resolvido: false },
  { id: "al2", titulo: "Sócio inadimplente tentou gerar convite", detalhe: "Roberto Almeida (Título 8493) está inadimplente no ERP Forza e tentou autorizar um convidado.", severidade: "media", data: "Hoje, 13:40", resolvido: false },
  { id: "al3", titulo: "Pessoas não identificadas relatadas no English Bar", detalhe: "Um sócio relatou à administração duas pessoas desconhecidas no bar. Verifique o Mapa Operacional.", severidade: "alta", data: "Ontem, 20:15", resolvido: false },
  { id: "al4", titulo: "Convite expirado utilizado na portaria", detalhe: "Tentativa de acesso com iToken expirado na portaria do campo de golfe.", severidade: "baixa", data: "Ontem, 16:30", resolvido: true },
];

export const LOGS = [
  {
    id: "l1",
    usuario: "Fernando Silva",
    acao: "Gerou Convite",
    detalhes: "Convite gerado para João Pedro (Convidado Social) no Salão Social 1",
    data: "Hoje, 14:32",
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
