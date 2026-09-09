/**
 * Acervo normativo climático do Acre — camada tipada sobre o JSON gerado.
 *
 * O JSON vem de `scripts/gerar-historico-leis.ts` (npm run historico:leis) e
 * não deve ser editado à mão. Aqui ficam os tipos e as leituras derivadas que
 * a aba Histórico consome prontas.
 */
import metaBruta from "@/data/historico-leis.meta.json";
import normasBrutas from "@/data/historico-leis.json";

export const TIPOS_NORMA = [
  "Lei Ordinária",
  "Decreto",
  "Estrutura Administrativa",
  "PPA",
  "LDO",
  "LOA",
] as const;

export type TipoNorma = (typeof TIPOS_NORMA)[number];

export type Citacao = { descritor: string; total: number };

export type OrgaoLOA = {
  codigo: string | null;
  nome: string;
  rp: number;
  outrasFontes: number;
  total: number;
};

export type ValoresLOA = {
  /** Recursos Próprios do Tesouro. */
  rp: number;
  outrasFontes: number;
  total: number;
  /** Cr$ nos exercícios anteriores a 1995 — valores nunca convertidos. */
  moeda: "Cr$" | "R$";
  orgaos: OrgaoLOA[];
};

export type Norma = {
  id: string;
  tipo: TipoNorma;
  /** "Lei", "Lei Complementar", "Decreto", "Constituição Estadual". */
  especie: string;
  numero: string;
  ementa: string;
  /** Ano de assinatura — não confundir com o exercício a que a norma se refere. */
  ano: number;
  data: string | null;
  publicacao: string | null;
  link: string | null;
  exercicio: number | null;
  quadrienio: [number, number] | null;
  orgaos: string | null;
  citacoes: Citacao[];
  metas: string[];
  loa: ValoresLOA | null;
  /** Abas da planilha em que a norma aparece — mais de uma quando ela se repete. */
  abas: TipoNorma[];
};

export type MetaHistoricoLeis = {
  arquivoFonte: string;
  origem: string;
  geradoEm: string;
  normas: number;
  porTipo: Record<string, number>;
  atualizacoes: { aba: string; atualizadoEm: string | null }[];
  observacoes: string[];
};

export const META_LEIS = metaBruta as unknown as MetaHistoricoLeis;

/** Já ordenadas da mais recente para a mais antiga pelo script de ingestão. */
export const NORMAS = normasBrutas as unknown as Norma[];

export const TOTAL_POR_TIPO: Record<TipoNorma, number> = Object.fromEntries(
  TIPOS_NORMA.map((tipo) => [tipo, NORMAS.filter((n) => n.tipo === tipo).length]),
) as Record<TipoNorma, number>;

export const ANOS_NORMAS = [...new Set(NORMAS.map((n) => n.ano))].sort((a, b) => b - a);

export type PontoLOA = {
  exercicio: number;
  numero: string;
  rp: number;
  outrasFontes: number;
  total: number;
};

const comLOA = NORMAS.filter(
  (n): n is Norma & { loa: ValoresLOA; exercicio: number } =>
    n.loa !== null && n.exercicio !== null,
);

/**
 * A série do gráfico. Só a era do real: os exercícios de 1991 a 1994 estão em
 * cruzeiro e a hiperinflação do período torna qualquer conversão por fator
 * fixo enganosa — eles continuam na lista de normas, com o valor original.
 */
export const SERIE_LOA: PontoLOA[] = comLOA
  .filter((n) => n.loa.moeda === "R$")
  .map((n) => ({
    exercicio: n.exercicio,
    numero: n.numero,
    rp: n.loa.rp,
    outrasFontes: n.loa.outrasFontes,
    total: n.loa.total,
  }))
  .sort((a, b) => a.exercicio - b.exercicio);

export const EXERCICIOS_EM_CRUZEIRO = comLOA
  .filter((n) => n.loa.moeda !== "R$")
  .map((n) => n.exercicio)
  .sort((a, b) => a - b);

/**
 * Exercício -> id da norma. Indispensável para ligar o gráfico à lista: a LOA
 * do exercício X é sancionada em X−1, então `norma.ano` não serve de chave.
 */
export const NORMA_POR_EXERCICIO: ReadonlyMap<number, string> = new Map(
  comLOA.map((n) => [n.exercicio, n.id]),
);
