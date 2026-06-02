// Centralizando a Interface (o molde do objeto)
export interface Club {
  id: string;
  name: string;
  matricula?: string; // O '?' deixa a matrícula opcional, caso alguma tela não use
  color: string;
}

// Centralizando os Dados reais dos clubes
export const CLUBS: Club[] = [
  { id: "1", name: "COUNTRY CLUB SÃO PAULO", matricula: "123456-0", color: "bg-blue-600" },
  { id: "2", name: "CLUBE PINHEIROS", matricula: "88990-2", color: "bg-emerald-600" },
  { id: "3", name: "CLUBE DE REGATAS", matricula: "77665-1", color: "bg-purple-600" },
  { id: "4", name: "DUBAI", matricula: "654321-0", color: "bg-blue-600" },
  { id: "5", name: "ILHAS RESORT", matricula: "564785-1", color: "bg-emerald-600" },
  { id: "6", name: "ALPHAVILLE", matricula: "675869-0", color: "bg-purple-600" },
];