// mockConcierge.ts — refletindo a realidade da portaria do PACC:
// LPR (placa) como mecanismo primário para sócios/dependentes, CPF para o resto.

export const MOCK_AUTHORIZATIONS = [
  {
    id: "1",
    name: "Carlos Personal",
    avatar: "https://i.pravatar.cc/150?u=carlos",
    cpf: "999.888.777-66",
    type: "Prestador de Serviço",
    spot: "Campo de Golfe",
    sponsor: "João Silva (Titular)", // Vínculo com o sócio
    status: "No local",
    entrada: "Hoje, 07:15",
  },
  {
    id: "2",
    name: "Maria Souza",
    avatar: "https://i.pravatar.cc/150?u=maria",
    cpf: "555.666.777-88",
    type: "Convidado Social",
    spot: "English Bar",
    sponsor: "Ana Costa (Titular)",
    status: "No local",
    entrada: "Hoje, 10:30",
  },
  {
    id: "3",
    name: "Roberto Manutenção",
    avatar: "https://i.pravatar.cc/150?u=roberto",
    cpf: "333.444.555-66",
    type: "Funcionário",
    spot: "Manutenção / Jardinagem",
    sponsor: "Administração do Clube",
    status: "No local",
    entrada: "Hoje, 06:00",
  },
];

// Diretório de pessoas já cadastradas no clube (quem passa pela portaria)
export const REGISTERED_PEOPLE = [
  {
    id: "r1",
    name: "João Silva",
    cpf: "111.222.333-44",
    type: "Sócio Titular",
    statusTitulo: "Adimplente",
    placa: "ABC1D23",
    avatar: "https://i.pravatar.cc/150?u=joao"
  },
  {
    id: "r2",
    name: "Ana Costa",
    cpf: "222.333.444-55",
    type: "Sócio Dependente",
    sponsor: "João Silva",
    statusTitulo: "Adimplente",
    placa: "ABC1D23",
    avatar: "https://i.pravatar.cc/150?u=ana"
  },
  {
    id: "r3",
    name: "Maria Souza",
    cpf: "555.666.777-88",
    type: "Convidado Social",
    sponsor: "Ana Costa",
    placa: null,
    avatar: "https://i.pravatar.cc/150?u=maria"
  },
  {
    id: "r4",
    name: "Pedro Almeida",
    cpf: "444.555.666-77",
    type: "Visitante Jogador",
    sponsor: "Country Club Ipanema (reciprocidade)",
    placa: "XYZ9K88",
    avatar: "https://i.pravatar.cc/150?u=pedro"
  },
];

// Histórico de acessos por pessoa (chave = REGISTERED_PEOPLE.id), consultado
// na tela de Perfil da Pessoa na portaria.
export const MOCK_ACCESS_HISTORY: Record<string, { id: string; data: string; gate: string; status: "Entrada" | "Saída" }[]> = {
  r1: [
    { id: "h1", data: "Hoje, 07:10", gate: "Portaria Principal (placa)", status: "Entrada" },
    { id: "h2", data: "Ontem, 19:45", gate: "Portaria Principal (placa)", status: "Saída" },
    { id: "h3", data: "Ontem, 07:05", gate: "Portaria Principal (placa)", status: "Entrada" },
  ],
  r2: [
    { id: "h4", data: "Hoje, 10:20", gate: "Portaria Principal", status: "Entrada" },
    { id: "h5", data: "05/07/2026, 18:30", gate: "Portaria Principal", status: "Saída" },
  ],
  r3: [
    { id: "h6", data: "Hoje, 10:30", gate: "Portaria Principal", status: "Entrada" },
  ],
  r4: [
    { id: "h7", data: "20/07/2026, 09:00", gate: "Portaria do Campo", status: "Entrada" },
    { id: "h8", data: "20/07/2026, 16:15", gate: "Portaria do Campo", status: "Saída" },
  ],
};
