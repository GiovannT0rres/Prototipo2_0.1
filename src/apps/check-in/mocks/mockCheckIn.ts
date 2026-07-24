// mockCheckIn.ts

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

export const INITIAL_PENDING = [
  { id: "p1", name: "Enzo Rossi", cpf: "123.456.789-00", phone: "(11) 98765-4321", avatar: "https://i.pravatar.cc/150?u=enzo", requestDate: "Hoje, 14:20", type: "dayuse", clubId: "1", startDate: hoje, endDate: amanha, canManageAccess: false },
  { id: "p2", name: "Beatriz Oliveira", cpf: "987.654.321-11", phone: "(11) 91234-5678", avatar: "https://i.pravatar.cc/150?u=bia", requestDate: "Hoje, 13:15", type: "familiar", clubId: "1", startDate: hoje, endDate: "", canManageAccess: true },
  { id: "p3", name: "Carlos Mendes", cpf: "111.222.333-44", phone: "(11) 99999-8888", avatar: "https://i.pravatar.cc/150?u=carlos", requestDate: "Hoje, 11:30", type: "prestador", clubId: "2", startDate: hoje, endDate: amanha, canManageAccess: false },
];

export const MOTIVOS_ACESSO = [
  { id: "familiar", label: "Familiar" },
  { id: "dayuse", label: "Day Use" },
  { id: "cuidador", label: "Cuidador" },
  { id: "prestador", label: "Serviço" }, 
];

export const MOCK_CONTACTS = [
  {
    id: "c1",
    name: "Ana Silva Santos",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    email: "ana.silva@email.com",
  },
  {
    id: "c2",
    name: "Carlos Eduardo Lima",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    cpf: "987.654.321-11",
    phone: "(21) 99999-8888",
    email: "carlos.edu@email.com",
  },
];
