export const MOCK_AUTHORIZATIONS = [
  {
    id: "1",
    name: "Carlos Personal",
    avatar: "https://i.pravatar.cc/150?u=carlos",
    cpf: "999.888.777-66",
    type: "Prestador de Serviço",
    spot: "Academia",
    sponsor: "João Silva (Titular)", // Vínculo com o sócio
    status: "No local",
    entrada: "Hoje, 07:15",
  },
  {
    id: "2",
    name: "Maria Souza",
    avatar: "https://i.pravatar.cc/150?u=maria",
    cpf: "555.666.777-88",
    type: "Convidado",
    spot: "Clube Geral",
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
    spot: "Manutenção Predial",
    sponsor: "Administração do Clube",
    status: "No local",
    entrada: "Hoje, 06:00",
  },
];

// Diretório de pessoas já cadastradas no clube (Quem passa pela roleta/portaria)
export const REGISTERED_PEOPLE = [
  { 
    id: "r1", 
    name: "João Silva", 
    cpf: "111.222.333-44", 
    type: "Sócio Titular", 
    statusTitulo: "Adimplente",
    avatar: "https://i.pravatar.cc/150?u=joao" 
  },
  { 
    id: "r2", 
    name: "Ana Costa", 
    cpf: "222.333.444-55", 
    type: "Sócio Dependente", 
    sponsor: "João Silva",
    statusTitulo: "Adimplente",
    avatar: "https://i.pravatar.cc/150?u=ana" 
  },
  { 
    id: "r3", 
    name: "Maria Souza", 
    cpf: "555.666.777-88", 
    type: "Convidado", 
    sponsor: "Ana Costa",
    avatar: "https://i.pravatar.cc/150?u=maria" 
  },
];