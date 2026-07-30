import { INSTRUMENTOS_LEGAIS } from "@/data/instrumentos-legais";

/**
 * Grupo de documentos (relatórios, planos) — vai para a seção "Relatórios e
 * publicações"; as demais categorias formam a "Base legal".
 */
export const CATEGORIA_PUBLICACOES = "Publicações Oficiais";

export const PUBLICACOES =
  INSTRUMENTOS_LEGAIS.find((g) => g.categoria === CATEGORIA_PUBLICACOES)?.itens ?? [];

export const NORMAS = INSTRUMENTOS_LEGAIS.filter(
  (g) => g.categoria !== CATEGORIA_PUBLICACOES,
);
