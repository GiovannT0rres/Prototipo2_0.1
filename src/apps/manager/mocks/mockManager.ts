import type { Person } from "../types";

// Quem está no clube agora — só o booleano, sem espaço (spec §1.1/§6.2.2).
// Decisão de produto preservada: só Visitante e Prestador de Serviço
// aparecem como presentes — sócio/dependente/funcionário têm relação já
// esperada com o clube, não são "desconhecidos" a identificar.
export const MOCK_DENTRO_DO_CLUBE: string[] = ["cv3", "pr9", "am2"];

// Roster de pessoas — integrado (na ficção do protótipo) ao ERP Forza.
// Antes fragmentado em MOCK_SOCIOS/MOCK_DEPENDENTES_ADMIN/MOCK_CONVIDADOS_ADMIN
// (3 formatos com campos diferentes); agora é um único Person[], e o que
// cada pessoa PODE fazer vive nas Authorization[] (mockManagerStore.ts).
export const MOCK_PESSOAS: (Person & { categoriaTitulo?: string; inadimplente?: boolean; titularId?: string })[] = [
  { id: "8493", nome: "Roberto Almeida", cpf: "123.456.789-00", telefone: "(11) 99999-8888", avatar: "https://i.pravatar.cc/150?u=8493", categoriaTitulo: "Sócio Titular", inadimplente: false },
  { id: "5521", nome: "Fernando Silva", cpf: "456.789.123-00", telefone: "(51) 98888-7777", avatar: "https://i.pravatar.cc/150?u=5521", categoriaTitulo: "Sócio Titular", inadimplente: false },
  { id: "3390", nome: "Marcelo Costa", cpf: "789.123.456-00", telefone: "(51) 97777-6666", avatar: "https://i.pravatar.cc/150?u=3390", categoriaTitulo: "Sócio Remido", inadimplente: true },
  { id: "6702", nome: "Patrícia Nogueira", cpf: "321.654.987-00", telefone: "(51) 96666-5555", avatar: "https://i.pravatar.cc/150?u=6702", categoriaTitulo: "Sócia Contribuinte", inadimplente: false },
  { id: "dep1", nome: "Ana Almeida", cpf: "111.222.333-01", telefone: "(11) 99999-0001", avatar: "https://i.pravatar.cc/150?u=dep1", titularId: "8493" },
  { id: "dep2", nome: "Lucas Almeida", cpf: "111.222.333-02", telefone: "(11) 99999-0002", avatar: "https://i.pravatar.cc/150?u=dep2", titularId: "8493" },
  { id: "dep3", nome: "Maria Silva", cpf: "222.333.444-03", telefone: "(51) 98888-0003", avatar: "https://i.pravatar.cc/150?u=dep3", titularId: "5521" },
  { id: "dep4", nome: "João Pedro Silva", cpf: "222.333.444-04", telefone: "(51) 98888-0004", avatar: "https://i.pravatar.cc/150?u=dep4", titularId: "5521" },
  { id: "dep5", nome: "Beatriz Costa", cpf: "333.444.555-05", telefone: "(51) 97777-0005", avatar: "https://i.pravatar.cc/150?u=dep5", titularId: "3390" },
  { id: "cv1", nome: "Carlos Mendes", cpf: "444.555.666-06", telefone: "(51) 96666-0006", avatar: "https://i.pravatar.cc/150?u=cv1", titularId: "8493" },
  { id: "cv2", nome: "Juliana Costa", cpf: "444.555.666-07", telefone: "(51) 96666-0007", avatar: "https://i.pravatar.cc/150?u=cv2", titularId: "8493" },
  { id: "cv3", nome: "Maria Souza", cpf: "444.555.666-08", telefone: "(51) 96666-0008", avatar: "https://i.pravatar.cc/150?u=cv3", titularId: "5521" },
  { id: "pr9", nome: "Rafael Nunes", cpf: "555.666.777-09", telefone: "(51) 95555-0009", avatar: "https://i.pravatar.cc/150?u=pr9" },
  { id: "am1", nome: "Juliana Ferraz", cpf: "666.777.888-10", telefone: "(51) 96666-0010", avatar: "https://i.pravatar.cc/150?u=am1" },
  { id: "am2", nome: "Bruno Tavares", cpf: "777.888.999-14", telefone: "(51) 97777-0014", avatar: "https://i.pravatar.cc/150?u=am2" },
];

// Notificações — substitui MOCK_ALERTAS. Agrupadas por motivo (spec §6.4):
// "acao" é o que precisa do gestor, "seguranca" são alertas de segurança,
// "atividade" é registro de eventos recentes. Cada uma leva a algum lugar
// (vaiParaTag aplica um filtro na busca) ou é puramente informativa (null).
export interface Notificacao {
  id: string;
  categoria: "acao" | "seguranca" | "atividade";
  titulo: string;
  detalhe: string;
  quando: string;
  lida: boolean;
  vaiParaTag: string | null;
}

export const MOCK_NOTIFICACOES: Notificacao[] = [
  { id: "n1", categoria: "acao", titulo: "<b>Beatriz Nogueira</b> concluiu o cadastro e aguarda autorização", detalhe: "Convidada por Pedro Meireles · a pendência é dele, você pode assumir", quando: "há 8 min", lida: false, vaiParaTag: "cadastro:aguardando-autorizacao" },
  { id: "n2", categoria: "acao", titulo: "<b>Sandra Michels</b> concluiu o cadastro e aguarda autorização", detalhe: "Prestadora · você pode assumir a autorização", quando: "há 41 min", lida: false, vaiParaTag: "cadastro:aguardando-autorizacao" },
  { id: "n3", categoria: "acao", titulo: "Convidados do Baile de Debutantes ainda sem autorização", detalhe: "Evento em 22/08 — confira a lista", quando: "hoje, 08:00", lida: false, vaiParaTag: "evento:baile-debutantes-2026" },
  { id: "n4", categoria: "seguranca", titulo: "Prestador com <b>restrição encontrada</b>", detalhe: "Background check reprovado para um CPF cadastrado hoje na Concierge. O acesso não deve ser liberado na portaria.", quando: "hoje, 15:02", lida: false, vaiParaTag: null },
  { id: "n5", categoria: "seguranca", titulo: "<b>Marcelo Costa</b> está inadimplente e tentou gerar convite", detalhe: "Título 8493 está inadimplente no ERP Forza.", quando: "hoje, 13:40", lida: false, vaiParaTag: "financeiro:inadimplente" },
  { id: "n6", categoria: "atividade", titulo: "<b>2 autorizações</b> vencem hoje às 23:59", detalhe: "Confira quem precisa renovar ou expirar.", quando: "hoje, 07:00", lida: true, vaiParaTag: "status:vencendo-hoje" },
  { id: "n7", categoria: "atividade", titulo: "<b>Fernando Silva</b> autorizou Maria Souza como Visitante", detalhe: "Baile de Debutantes · até 08/08", quando: "hoje, 09:10", lida: true, vaiParaTag: "autorizador:5521" },
];
