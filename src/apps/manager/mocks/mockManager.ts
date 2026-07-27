// Fila de trabalho isolada do domínio Manager (aprovações de dependentes e convidados)
export const INITIAL_PENDING = [
  { id: "mp1", name: "Enzo Rossi", cpf: "123.456.789-00", avatar: "https://i.pravatar.cc/150?u=enzo", type: "Filho(a)" },
  { id: "mp2", name: "Beatriz Oliveira", cpf: "987.654.321-11", avatar: "https://i.pravatar.cc/150?u=bia", type: "Cônjuge" },
  { id: "mp3", name: "Carlos Mendes", cpf: "111.222.333-44", avatar: "https://i.pravatar.cc/150?u=carlos", type: "Social (1 Dia)" },
  { id: "mp4", name: "Juliana Costa", cpf: "222.333.444-55", avatar: "https://i.pravatar.cc/150?u=juliana", type: "Esportiva" },
];

export const MOCK_DASHBOARD = {
  totalAcessosHoje: 145,
  acessosPendentes: 12,
  clubesAtivos: 6,
  visitantesSemana: 890
};

export const LOGS = [
  {
    id: "l1",
    usuario: "Fernando Silva",
    acao: "Gerou Convite",
    detalhes: "Convite gerado para João Pedro (Day Use) em COUNTRY CLUB SÃO PAULO",
    data: "Hoje, 14:32",
    tipo: "criacao",
  },
  {
    id: "l2",
    usuario: "Portaria - Portão A",
    acao: "Acesso Liberado",
    detalhes: "Maria Santos entrou como Prestadora de Serviço em CLUBE PINHEIROS",
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
