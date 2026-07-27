// Centralizando a Interface (o molde do objeto)
// PACC Clube é um cliente único (não multi-clube como o Entrada Segura) —
// o que varia não é "qual clube", e sim "qual espaço" dentro do PACC.
export interface Espaco {
  id: string;
  name: string;
  tipo: "Salão de Eventos" | "Bar" | "Campo" | "Área Comum";
  ageRestriction?: string; // regra de idade, quando houver (ex: Novo Bar é 18+)
  color: string;
}

// Inventário real do clube, conforme respostas da administração
// (2 salões, 2 bares e o campo — ver PERGUNTAS-PARA-O-CLUBE.md, seção D)
export const ESPACOS: Espaco[] = [
  { id: "1", name: "Salão Social 1", tipo: "Salão de Eventos", color: "bg-blue-600" },
  { id: "2", name: "Salão Social 2", tipo: "Salão de Eventos", color: "bg-indigo-600" },
  { id: "3", name: "English Bar", tipo: "Bar", color: "bg-emerald-600" },
  { id: "4", name: "Novo Bar", tipo: "Bar", ageRestriction: "18+", color: "bg-amber-600" },
  { id: "5", name: "Campo de Golfe", tipo: "Campo", color: "bg-green-700" },
];
