// Centralizando a Interface (o molde do objeto)
export interface Club {
  id: string;
  name: string;
  matricula?: string; // O '?' deixa a matrícula opcional, caso alguma tela não use
  color: string;
}

// Centralizando os Dados reais dos clubes
// Múltiplos clubes = o Check-in é pensado para funcionar em qualquer clube
// que use a Entrada Segura, não só no Porto Alegre Country Club.
export const CLUBS: Club[] = [
  { id: "1", name: "Porto Alegre Country Club", matricula: "004521-3", color: "bg-emerald-700" },
  { id: "2", name: "Country Club de Curitiba", matricula: "123456-0", color: "bg-blue-600" },
  { id: "3", name: "Clube Campestre de São Paulo", matricula: "88990-2", color: "bg-purple-600" },
  { id: "4", name: "Iate Clube Santa Catarina", matricula: "77665-1", color: "bg-cyan-600" },
  { id: "5", name: "Golfe Clube Búzios", matricula: "564785-1", color: "bg-amber-600" },
  { id: "6", name: "Clube Atlântico Recife", matricula: "675869-0", color: "bg-rose-600" },
];
