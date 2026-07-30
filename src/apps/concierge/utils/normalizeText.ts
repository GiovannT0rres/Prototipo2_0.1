// Normaliza texto pra comparacao de busca - minusculas e sem acento, pra
// "sao" encontrar "Sao" e "salao" encontrar "Salao" sem exigir o acento certo.
export function normalizeText(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase();
}
