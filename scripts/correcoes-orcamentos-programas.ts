/**
 * Correções conhecidas sobre `docs/fonte/ORCAMENTOS - PROGRAMAS.xlsx`,
 * indexadas por número de linha. A planilha oficial NÃO é alterada — é o
 * registro de origem; estas correções são aplicadas em memória por
 * `ingest-orcamentos-programas.ts`.
 *
 * Portado de
 * `Projeto Cŕedito de Carbono/kit-metodologia-orcamento-climatico/correcoes-planilha.mjs`,
 * onde as mesmas correções valem para o dashboard-credito-carbono — os dois
 * projetos leem a mesma planilha oficial e devem chegar ao mesmo total
 * (R$ 978.779.440,37). Ver
 * `docs/05-DIVERGENCIAS-CONHECIDAS.md` §1b para o achado completo e
 * `docs/07-CICLO-MENSAL.md` para como cada valor foi confirmado contra o QDD.
 */

/** Dígito perdido na digitação — código correto identificado no QDD pelo
 * mesmo órgão/unidade e o mesmo texto de aplicação. Não afeta valor. */
export const CORRECOES_CODIGO: readonly { linha: number; de: string; para: string; evidencia: string }[] = [
  { linha: 103, de: "1152000", para: "11520000", evidencia: "QDD 759/001 código 11520000, mesma aplicação" },
  { linha: 139, de: "1130000", para: "11300000", evidencia: "QDD 744/203 código 11300000, mesma aplicação" },
];

/**
 * Correção de dupla contagem: 8 aplicações lançadas em mais de um eixo com o
 * valor cheio duplicado, em vez de dividido/compartilhado (Roteiro, linha
 * 349). Critério, por chave (órgão/unidade#código):
 *
 *  - SPLIT   duas entradas com valor idêntico, que juntas duplicam o valor do
 *            QDD → dividir igualmente entre os eixos.
 *  - CARVE   uma entrada já bate sozinha com o QDD (a "base"); a outra é um
 *            valor extra sem lastro no QDD (o "secundário", mantido como
 *            está — é o julgamento do classificador sobre o que pertence
 *            àquele eixo) → subtrai o secundário da base.
 *
 * Indexadas por número de linha (a chave mais robusta). Ausência de `novo`
 * significa "mantido como está" — é a entrada secundária de um carve.
 */
export type CorrecaoValor = {
  linha: number;
  orgao: string;
  aplicacao: string;
  tratamento: "split" | "carve" | "mantido";
  de?: number;
  novo?: number;
  evidencia: string;
};

export const CORRECOES_VALOR: readonly CorrecaoValor[] = [
  {
    linha: 19, orgao: "753/001 - SEAGRI", aplicacao: "FORTALECIMENTO, CONSOLIDAÇÃO E AMPLIAÇÃO DAS CADEIAS DE VALOR AGROFLORESTAL E AGROPECUÁRIA.",
    tratamento: "carve", de: 59446200, novo: 56346200,
    evidencia: "QDD 753/001#10790000 inicial = R$59.446.200,00 (bate com esta linha sozinha); linha 148 (Eixo III, R$3.100.000,00) é excedente sem lastro no QDD",
  },
  { linha: 148, orgao: "753/001 - SEAGRI", aplicacao: "FORTALECIMENTO, CONSOLIDAÇÃO E AMPLIAÇÃO DAS CADEIAS DE VALOR AGROFLORESTAL E AGROPECUÁRIA.", tratamento: "mantido", evidencia: "secundário do carve da linha 19" },

  {
    linha: 10, orgao: "720/001 - SEMA", aplicacao: "CONSOLIDAÇÃO DOS SISTEMAS DE OUVIDORIA.",
    tratamento: "split", de: 11000, novo: 5500,
    evidencia: "QDD 720/001#11260000 inicial = R$11.000,00; linhas 10 e 186 duplicam esse valor (R$11.000,00 cada) em vez de dividir",
  },
  { linha: 186, orgao: "720/001 - SEMA", aplicacao: "CONSOLIDAÇÃO DOS SISTEMAS DE OUVIDORIA.", tratamento: "split", de: 11000, novo: 5500, evidencia: "par da linha 10" },

  {
    linha: 40, orgao: "719/001 - SEJUSP", aplicacao: "MONITORAMENTO AMBIENTAL-COMANDO E CONTROLE.",
    tratamento: "carve", de: 1198684.01, novo: 1195904.88,
    evidencia: "QDD 719/001#13470000 inicial = R$1.198.684,01 (bate com esta linha sozinha); linha 95 (Eixo III, R$2.779,13) é excedente sem lastro no QDD",
  },
  { linha: 95, orgao: "719/001 - SEJUSP", aplicacao: "MONITORAMENTO AMBIENTAL-COMANDO E CONTROLE.", tratamento: "mantido", evidencia: "secundário do carve da linha 40" },

  {
    linha: 21, orgao: "753/001 - SEAGRI", aplicacao: "PROMOÇÃO DA LOGÍSTICA DE BENEFICIAMENTO, ARMAZENAGEM E ESCOAMENTO DA PRODUÇÃO.",
    tratamento: "carve", de: 3345000, novo: 3344000,
    evidencia: "QDD 753/001#10810000 inicial = R$3.345.000,00 (bate com esta linha sozinha); linha 149 (Eixo III, R$1.000,00) é excedente sem lastro no QDD",
  },
  { linha: 149, orgao: "753/001 - SEAGRI", aplicacao: "PROMOÇÃO DA LOGÍSTICA DE BENEFICIAMENTO, ARMAZENAGEM E ESCOAMENTO DA PRODUÇÃO.", tratamento: "mantido", evidencia: "secundário do carve da linha 21" },

  {
    linha: 45, orgao: "720/001 - SEMA", aplicacao: "MANUTENÇÃO DAS ATIVIDADES ADMINISTRATIVAS E OPERACIONAIS-SEMA.",
    tratamento: "carve", de: 1832764.37, novo: 1831764.37,
    evidencia: "QDD 720/001#21630000 inicial = R$1.832.764,37 (bate com esta linha sozinha); linha 143 (Eixo III, R$1.000,00) é excedente sem lastro no QDD",
  },
  { linha: 143, orgao: "720/001 - SEMA", aplicacao: "MANUTENÇÃO DAS ATIVIDADES ADMINISTRATIVAS E OPERACIONAIS-SEMA.", tratamento: "mantido", evidencia: "secundário do carve da linha 45" },

  {
    linha: 60, orgao: "720/605 - SEMA (Fundo Est. de Comando e Controle Ambiental)", aplicacao: "FORTALECIMENTO DA EDUCAÇÃO AMBIENTAL.",
    tratamento: "split", de: 1000, novo: 500,
    evidencia: "QDD 720/605#11350000 inicial = R$1.000,00; linhas 60 e 189 duplicam esse valor (R$1.000,00 cada) em vez de dividir",
  },
  { linha: 189, orgao: "720/605 - SEMA (Fundo Est. de Comando e Controle Ambiental)", aplicacao: "FORTALECIMENTO DA EDUCAÇÃO AMBIENTAL.", tratamento: "split", de: 1000, novo: 500, evidencia: "par da linha 60" },

  {
    linha: 179, orgao: "744/001 - SEHURB", aplicacao: "REGULARIZAÇÃO FUNDIÁRIA ESTADUAL URBANA.",
    tratamento: "carve", de: 1151000, novo: 1150000,
    evidencia: "QDD 744/001#13390000 inicial = R$1.151.000,00 (bate com esta linha sozinha); linha 150 (Eixo III, R$1.000,00) é excedente sem lastro no QDD",
  },
  { linha: 150, orgao: "744/001 - SEHURB", aplicacao: "REGULARIZAÇÃO FUNDIÁRIA ESTADUAL URBANA.", tratamento: "mantido", evidencia: "secundário do carve da linha 179" },

  {
    linha: 190, orgao: "761/301 - FUNTAC", aplicacao: "MELHORIA, MODERNIZAÇÃO E INOVAÇÃO DOS SERVIÇOS DA FUNTAC.",
    tratamento: "carve", de: 60, novo: 50,
    evidencia: "QDD 761/301#11560000 inicial = R$60,00 (bate com esta linha sozinha); linha 145 (Eixo III, R$10,00) é excedente sem lastro no QDD",
  },
  { linha: 145, orgao: "761/301 - FUNTAC", aplicacao: "MELHORIA, MODERNIZAÇÃO E INOVAÇÃO DOS SERVIÇOS DA FUNTAC.", tratamento: "mantido", evidencia: "secundário do carve da linha 190" },
];

/**
 * Unidade transferida de secretaria: a classificação ficou no código de órgão
 * antigo, então a chave `órgão/unidade#código` aparece ZERADA no QDD e o
 * dinheiro está sob o órgão novo. Não afeta valor nem contagem de aplicações —
 * só a qual órgão a dotação é atribuída. O total segue R$ 978.779.440,37 e os
 * órgãos seguem 58 (os destinos não existiam antes, então não há fusão).
 *
 * O efeito de não corrigir é silencioso: o rateio de `cruzar-qdd.mjs` divide
 * pela dotação inicial do QDD, que é zero na chave antiga, então estas 12
 * aplicações (R$ 12.575.000,00) entravam na execução mensal com valor zero.
 *
 * Confirmado nos dois sentidos: o QDD traz o mesmo projeto/atividade sob o
 * órgão novo, batendo ao centavo em 10 das 12 (nas 2 restantes, Não
 * Exclusivas, o valor climático é menor que a dotação, como esperado); e
 * `Orçamento Climático_Dotações 2026_Atualizado.xlsx` grava o órgão como
 * "AGEAC (SEOP)" e lança Eficiência Energética sob SEOP.
 *
 * Ver `docs/07-CICLO-MENSAL.md` §3 para o achado completo.
 */
export const CORRECOES_ORGAO: readonly {
  linha: number;
  de: string;
  para: string;
  evidencia: string;
}[] = [
  // AGEAC — Agência Reguladora dos Serviços Públicos: 715 SEFAZ -> 754 SEOP
  { linha: 43, de: "715/210 - AGEAC", para: "754/210 - AGEAC", evidencia: "QDD 754/210#13570000 inicial = R$1.000,00; 715/210 zerado" },
  { linha: 64, de: "715/210 - AGEAC", para: "754/210 - AGEAC", evidencia: "QDD 754/210#10470000 inicial = R$70.000,00; 715/210 zerado" },
  { linha: 65, de: "715/210 - AGEAC", para: "754/210 - AGEAC", evidencia: "QDD 754/210#10460000 inicial = R$480.000,00; 715/210 zerado" },
  { linha: 136, de: "715/210 - AGEAC", para: "754/210 - AGEAC", evidencia: "QDD 754/210#10450000 inicial = R$325.000,00; 715/210 zerado" },

  // SANEACRE — Serviço de Água e Esgoto: 744 SEHURB -> 754 SEOP
  { linha: 42, de: "744/203 - SANEACRE", para: "754/203 - SANEACRE", evidencia: "QDD 754/203#11330000 inicial = R$31.000,00; 744/203 zerado" },
  { linha: 138, de: "744/203 - SANEACRE", para: "754/203 - SANEACRE", evidencia: "QDD 754/203#11290000 inicial = R$27.554.995,15 (Não Exclusivo, clima R$6.030.000,00); 744/203 zerado" },
  { linha: 139, de: "744/203 - SANEACRE", para: "754/203 - SANEACRE", evidencia: "QDD 754/203#11300000 inicial = R$5.310.000,00 (Não Exclusivo, clima R$799.000,00); 744/203 zerado" },

  // PROCON / IPDC — Instituto de Proteção e Defesa do Consumidor: 719 Justiça -> 760 SEASDH
  { linha: 169, de: "719/216 - PROCON", para: "760/216 - PROCON", evidencia: "QDD 760/216#10270000 inicial = R$178.000,00; 719/216 zerado" },
  { linha: 170, de: "719/216 - PROCON", para: "760/216 - PROCON", evidencia: "QDD 760/216#10280000 inicial = R$71.000,00; 719/216 zerado" },
  { linha: 171, de: "719/216 - PROCON", para: "760/216 - PROCON", evidencia: "QDD 760/216#10290000 inicial = R$321.000,00; 719/216 zerado" },
  { linha: 172, de: "719/216 - PROCON", para: "760/216 - PROCON", evidencia: "QDD 760/216#10300000 inicial = R$221.000,00; 719/216 zerado" },
  { linha: 173, de: "719/216 - PROCON", para: "760/216 - PROCON", evidencia: "QDD 760/216#20830000 inicial = R$4.048.000,00; 719/216 zerado" },
];

/** Aplica as correções acima a uma linha lida por `lerPlanilha`, nas colunas de
 * órgão, código e dotação. Retorna { orgao, codigo, dotacao } prontos. */
export function aplicarCorrecoes(
  linha: number,
  codigoOriginal: string,
  dotacaoOriginal: number,
  orgaoOriginal: string,
): { codigo: string; dotacao: number; orgao: string } {
  const cCodigo = CORRECOES_CODIGO.find((c) => c.linha === linha);
  const cValor = CORRECOES_VALOR.find((c) => c.linha === linha && c.novo !== undefined);
  const cOrgao = CORRECOES_ORGAO.find((c) => c.linha === linha);
  return {
    codigo: cCodigo ? cCodigo.para : codigoOriginal,
    dotacao: cValor ? cValor.novo! : dotacaoOriginal,
    orgao: cOrgao ? cOrgao.para : orgaoOriginal,
  };
}
