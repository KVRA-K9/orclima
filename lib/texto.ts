/** Minúsculas e sem acento — para comparar marcadores e busca sem surpresa. */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}
