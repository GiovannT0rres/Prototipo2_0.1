// mockAutorizacoes.ts

export const DEPENDENTS_ACTIVE = [
  {
    id: "d1",
    name: "Maria Silva",
    type: "Familiar",
    clubId: "1",
    avatar: "https://i.pravatar.cc/150?u=maria",
    pending: false,
    invites: 12,
    canManageAccess: true, // É autorizadora
    guestList: [
      { id: "g1", name: "Lucas Silva", date: "01/06/2026", type: "Familiar", startDate: "01/06/2026", endDate: "01/06/2026" },
      { id: "g2", name: "Julia Silva", date: "01/06/2026", type: "Familiar", startDate: "01/06/2026", endDate: "01/06/2026" },
      { id: "g3", name: "Marcos Silva", date: "02/06/2026", type: "Day Use", startDate: "02/06/2026", endDate: "02/06/2026" },
      { id: "g4", name: "Pedro Silva", date: "02/06/2026", type: "Familiar", startDate: "02/06/2026", endDate: "05/06/2026" },
      { id: "g5", name: "Ana Silva", date: "03/06/2026", type: "Day Use", startDate: "03/06/2026", endDate: "03/06/2026" },
      { id: "g6", name: "Paulo Silva", date: "03/06/2026", type: "Familiar", startDate: "03/06/2026", endDate: "06/06/2026" },
      { id: "g7", name: "Carlos Silva", date: "04/06/2026", type: "Day Use", startDate: "04/06/2026", endDate: "04/06/2026" },
      { id: "g8", name: "Renata Silva", date: "04/06/2026", type: "Familiar", startDate: "04/06/2026", endDate: "07/06/2026" },
      { id: "g9", name: "Joana Silva", date: "05/06/2026", type: "Day Use", startDate: "05/06/2026", endDate: "05/06/2026" },
      { id: "g10", name: "Thiago Silva", date: "05/06/2026", type: "Familiar", startDate: "05/06/2026", endDate: "08/06/2026" },
      { id: "g11", name: "Fernando Silva", date: "06/06/2026", type: "Day Use", startDate: "06/06/2026", endDate: "06/06/2026" },
      { id: "g12", name: "Rafael Silva", date: "06/06/2026", type: "Familiar", startDate: "06/06/2026", endDate: "09/06/2026" },
    ],
  },
  {
    id: "d2",
    name: "João Pedro",
    type: "Familiar",
    clubId: "2",
    avatar: "https://i.pravatar.cc/150?u=joao",
    pending: true,
    invites: 0,
    canManageAccess: false,
    guestList: [],
  },
];

export const DEPENDENTS_HISTORY = [
  { id: "h1", name: "Ana Costa", clubId: "1", status: "Expirado", startDate: "01/05/2026", endDate: "12/05/2026", cancelledBy: "Sistema", type: "Familiar" },
  { id: "h2", name: "Roberto Almeida", clubId: "3", status: "Revogado", startDate: "05/05/2026", endDate: "10/05/2026", cancelledBy: "Titular", type: "Day Use" },
];

const hoje = new Date().toISOString().split("T")[0];
const amanha = new Date(Date.now() + 86400000).toISOString().split("T")[0];

// 10 Exemplos de Pendentes para você testar a rolagem
export const INITIAL_PENDING = [
  { id: "p1", name: "Enzo Rossi", cpf: "123.456.789-00", phone: "(11) 98765-4321", avatar: "https://i.pravatar.cc/150?u=enzo", requestDate: "Hoje, 14:20", type: "dayuse", clubId: "1", startDate: hoje, endDate: amanha, canManageAccess: false },
  { id: "p2", name: "Beatriz Oliveira", cpf: "987.654.321-11", phone: "(11) 91234-5678", avatar: "https://i.pravatar.cc/150?u=bia", requestDate: "Hoje, 13:15", type: "familiar", clubId: "1", startDate: hoje, endDate: "", canManageAccess: true },
  { id: "p3", name: "Carlos Mendes", cpf: "111.222.333-44", phone: "(11) 99999-8888", avatar: "https://i.pravatar.cc/150?u=carlos", requestDate: "Hoje, 11:30", type: "prestador", clubId: "2", startDate: hoje, endDate: amanha, canManageAccess: false },
  { id: "p4", name: "Fernanda Lima", cpf: "222.333.444-55", phone: "(11) 97777-6666", avatar: "https://i.pravatar.cc/150?u=fernanda", requestDate: "Ontem, 18:45", type: "cuidador", clubId: "1", startDate: hoje, endDate: "", canManageAccess: false },
  { id: "p5", name: "Thiago Santos", cpf: "333.444.555-66", phone: "(11) 95555-4444", avatar: "https://i.pravatar.cc/150?u=thiago", requestDate: "Ontem, 16:20", type: "dayuse", clubId: "3", startDate: hoje, endDate: hoje, canManageAccess: false },
  { id: "p6", name: "Juliana Castro", cpf: "444.555.666-77", phone: "(11) 94444-3333", avatar: "https://i.pravatar.cc/150?u=juliana", requestDate: "Ontem, 14:10", type: "familiar", clubId: "2", startDate: hoje, endDate: "", canManageAccess: false },
  { id: "p7", name: "Rafael Gomes", cpf: "555.666.777-88", phone: "(11) 93333-2222", avatar: "https://i.pravatar.cc/150?u=rafael", requestDate: "Ontem, 09:05", type: "prestador", clubId: "1", startDate: hoje, endDate: "2026-12-31", canManageAccess: false },
  { id: "p8", name: "Aline Rocha", cpf: "666.777.888-99", phone: "(11) 92222-1111", avatar: "https://i.pravatar.cc/150?u=aline", requestDate: "20/05, 15:30", type: "familiar", clubId: "3", startDate: hoje, endDate: "", canManageAccess: true },
  { id: "p9", name: "Marcos Paulo", cpf: "777.888.999-00", phone: "(11) 91111-0000", avatar: "https://i.pravatar.cc/150?u=marcos", requestDate: "20/05, 10:15", type: "dayuse", clubId: "2", startDate: hoje, endDate: amanha, canManageAccess: false },
  { id: "p10", name: "Camila Dias", cpf: "888.999.000-11", phone: "(11) 90000-9999", avatar: "https://i.pravatar.cc/150?u=camila", requestDate: "19/05, 17:40", type: "cuidador", clubId: "1", startDate: hoje, endDate: "", canManageAccess: false },
];

export const MOTIVOS_ACESSO = [
  { id: "familiar", label: "Familiar" },
  { id: "dayuse", label: "Day Use" },
  { id: "cuidador", label: "Cuidador" },
  { id: "prestador", label: "Serviço" }, // Encurtado para caber bem nas tags
];