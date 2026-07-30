export type TipoDotacao = "Exclusivo" | "Não Exclusivo";

/** Uma unidade orçamentária com dotação climática no exercício. */
export type Orgao = {
  /** Rótulo completo da fonte, ex.: "713/001 - SEPLAN". */
  nome: string;
  /** Código da unidade, ex.: "713/001". */
  codigo: string;
  /** Sigla, ex.: "SEPLAN". */
  sigla: string;
  total: number;
  exclusivo: number;
  naoExclusivo: number;
  /** Classificação predominante do órgão. */
  tipo: TipoDotacao;
  /** Ex.: "Exclusivo (19%) / Não Exclusivo (81%)". */
  intensidade: string;
  /** Valor por eixo, indexado pelo número do eixo (1..7). */
  eixos: Record<string, number>;
};

export type ResumoOrcamento = {
  numeroOrgaosAtuantes: number;
  acoesExclusivas: number;
  acoesNaoExclusivas: number;
  gastoExclusivo: number;
  gastoNaoExclusivo: number;
  total: number;
};

export type Orcamento = {
  exercicio: number;
  fonte: string;
  resumo: ResumoOrcamento;
  orgaos: Orgao[];
};

/** Uma ação orçamentária individual dentro de um órgão × eixo. */
export type Aplicacao = {
  aplicacao: string;
  dotacao: number;
  tipo: TipoDotacao;
};

/** órgão (`Orgao.nome`) → número do eixo ("1".."7") → aplicações daquele eixo. */
export type Aplicacoes = Record<string, Record<string, Aplicacao[]>>;

/** Filtros aplicáveis ao painel; `null` significa "sem restrição". */
export type Filtros = {
  exercicio: number | null;
  eixo: number | null;
  orgao: string | null;
  tipo: TipoDotacao | null;
  busca: string;
};

export const FILTROS_VAZIOS: Filtros = {
  exercicio: null,
  eixo: null,
  orgao: null,
  tipo: null,
  busca: "",
};

export type TotalPorEixo = {
  numero: number;
  romano: string;
  rotulo: string;
  titulo: string;
  cor: string;
  valor: number;
  participacao: number;
};

export type TotalPorOrgao = {
  nome: string;
  codigo: string;
  sigla: string;
  valor: number;
  exclusivo: number;
  naoExclusivo: number;
  participacao: number;
};
