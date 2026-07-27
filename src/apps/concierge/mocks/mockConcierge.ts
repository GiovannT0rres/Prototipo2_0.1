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
