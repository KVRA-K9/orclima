/**
 * Cruzamento do Orçamento Climático com o QDD -> data/fontes.json
 *
 *   npm run ingest:fontes
 *   npm run ingest:fontes -- caminho/para/outro-QDD.xlsx
 *
 * A planilha oficial do Orçamento Climático ("ORCAMENTOS - PROGRAMAS.xlsx")
 * não traz a fonte de recursos — ela só existe no QDD (Quadro de Detalhamento
 * da Despesa), coluna "Fonte". Este script liga as duas pela chave
 * `órgão/unidade#código projeto-atividade` e grava, para cada chave, a
 * PARTICIPAÇÃO de cada fonte na dotação inicial daquela ação.
 *
 * Grava proporções, e não valores: a dotação climática de uma aplicação Não
 * Exclusiva é menor que a dotação do QDD (é a fatia classificada como
 * climática), então o painel rateia a dotação climática por estas proporções.
 * Assim o arquivo continua válido se o valor climático for revisto sem que o
 * QDD mude.
 *
 * As correções de `correcoes-orcamentos-programas.ts` são obrigatórias aqui:
 * sem elas 2 aplicações não acham chave (dígito perdido no código) e 12 caem
 * em chave zerada (unidades transferidas de secretaria).
 *
 * Recusa-se a escrever se alguma aplicação ficar sem lastro no QDD.
 */
import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { lerPlanilha, numero } from "./lib-xlsx.ts";
import { aplicarCorrecoes } from "./correcoes-orcamentos-programas.ts";

const RAIZ = resolve(import.meta.dirname, "..");
const PADRAO_QDD = join(RAIZ, "QDD_Orclim.xlsx");
const PADRAO_CLIMA = join(RAIZ, "docs", "fonte", "ORCAMENTOS - PROGRAMAS.xlsx");
const SAIDA = join(RAIZ, "data", "fontes.json");

/** Colunas do QDD (cabeçalho na linha 5, dados a partir da 6). */
const QDD = {
  orgao: "A",
  unidade: "B",
  projetoAtividade: "E",
  fonte: "I",
  dotacaoInicial: "J",
} as const;

/** Colunas da planilha do Orçamento Climático — as mesmas do ingest principal. */
const CLIMA = {
  eixo: "A",
  orgao: "D",
  dotacao: "E",
  codigo: "F",
  aplicacao: "G",
} as const;

/** Só os dígitos, à esquerda do texto: "715 SEFAZ …" -> "715". */
function prefixoNumerico(v: string | number | undefined): string {
  return /^\s*(\d+)/.exec(String(v ?? ""))?.[1] ?? "";
}

/** Só os dígitos: "'01031229012790000" -> "01031229012790000". */
function digitos(v: string | number | undefined): string {
  return String(v ?? "").replace(/\D/g, "");
}

const chaveDe = (orgao: string, codigo: string) => `${orgao}|${codigo}`;

function main() {
  const arquivoQdd = resolve(process.argv[2] ?? PADRAO_QDD);
  const arquivoClima = resolve(process.argv[3] ?? PADRAO_CLIMA);

  /* --- QDD: dotação inicial por chave × fonte --- */

  const qdd = new Map<string, Map<string, number>>();
  for (const l of lerPlanilha(arquivoQdd)) {
    const orgao = prefixoNumerico(l[QDD.orgao]);
    const unidade = prefixoNumerico(l[QDD.unidade]);
    const codigo = digitos(l[QDD.projetoAtividade]);
    if (!orgao || !unidade || !codigo) continue; // cabeçalho e faixas de filtro

    const fonte = digitos(l[QDD.fonte]).padStart(8, "0");
    const chave = chaveDe(`${orgao}/${unidade}`, codigo);
    const porFonte = qdd.get(chave) ?? new Map<string, number>();
    porFonte.set(fonte, (porFonte.get(fonte) ?? 0) + numero(l[QDD.dotacaoInicial]));
    qdd.set(chave, porFonte);
  }

  /* --- Orçamento Climático: as chaves que precisam de lastro --- */

  const linhas = lerPlanilha(arquivoClima).filter(
    (l) => l[CLIMA.eixo] && l[CLIMA.eixo] !== "Eixo",
  );
  if (!linhas.length) throw new Error(`nenhuma linha de dados em ${arquivoClima}`);

  type Alvo = { chave: string; aplicacao: string; dotacao: number; linha: number };
  const alvos: Alvo[] = linhas.map((l) => {
    const { codigo, dotacao, orgao } = aplicarCorrecoes(
      l._linha,
      String(l[CLIMA.codigo] ?? "").trim(),
      numero(l[CLIMA.dotacao]),
      String(l[CLIMA.orgao] ?? "").trim(),
    );
    const codigoOrgao = /^(\d+\/\d+)/.exec(orgao)?.[1];
    if (!codigoOrgao) {
      throw new Error(`linha ${l._linha}: órgão sem código ${JSON.stringify(orgao)}`);
    }
    return {
      chave: chaveDe(codigoOrgao, digitos(codigo)),
      aplicacao: String(l[CLIMA.aplicacao] ?? "").trim(),
      dotacao,
      linha: l._linha,
    };
  });

  /* --- proporções, uma vez por chave distinta --- */

  const erros: string[] = [];
  const saida: Record<string, Record<string, number>> = {};

  for (const alvo of alvos) {
    if (saida[alvo.chave]) continue;

    const porFonte = qdd.get(alvo.chave);
    if (!porFonte) {
      erros.push(`linha ${alvo.linha}: ${alvo.chave} não existe no QDD (${alvo.aplicacao})`);
      continue;
    }

    const entradas = [...porFonte.entries()].filter(([, v]) => v > 0);
    const total = entradas.reduce((s, [, v]) => s + v, 0);
    if (total <= 0) {
      erros.push(`linha ${alvo.linha}: ${alvo.chave} tem dotação inicial zero no QDD`);
      continue;
    }

    // Arredondar a 6 casas evita dízimas longas no JSON, mas arredondar cada
    // fonte isoladamente faz a soma escapar de 1. A maior fonte (a primeira,
    // já ordenada) fica com o complemento, e o conjunto fecha exato.
    const ordenadas = entradas.sort(([, a], [, b]) => b - a);
    const r6 = (n: number) => Math.round(n * 1e6) / 1e6;
    const resto = ordenadas.slice(1).map(([fonte, valor]) => [fonte, r6(valor / total)] as const);
    const proporcoes = Object.fromEntries([
      [ordenadas[0][0], r6(1 - resto.reduce((s, [, v]) => s + v, 0))],
      ...resto,
    ]);
    const soma = Object.values(proporcoes).reduce((s, v) => s + v, 0);
    if (Math.abs(soma - 1) > 1e-6) {
      erros.push(`${alvo.chave}: proporções somam ${soma}, deveriam somar 1`);
      continue;
    }
    saida[alvo.chave] = proporcoes;
  }

  if (erros.length) {
    console.log(`Cruzamento com o QDD falhou — nada foi escrito:\n`);
    for (const e of erros) console.log(`  ${e}`);
    process.exit(1);
  }

  /* --- gravar --- */

  const ordenado = Object.fromEntries(
    Object.keys(saida)
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .map((k) => [k, saida[k]]),
  );
  writeFileSync(SAIDA, `${JSON.stringify(ordenado, null, 2)}\n`, "utf8");

  /* --- relatório --- */

  const climaPorFonte = new Map<string, number>();
  for (const alvo of alvos) {
    for (const [fonte, proporcao] of Object.entries(saida[alvo.chave])) {
      climaPorFonte.set(fonte, (climaPorFonte.get(fonte) ?? 0) + alvo.dotacao * proporcao);
    }
  }
  const multiplas = Object.values(saida).filter((f) => Object.keys(f).length > 1).length;
  const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  console.log(`QDD ................. ${arquivoQdd}`);
  console.log(`orçamento climático . ${arquivoClima}`);
  console.log(`aplicações .......... ${alvos.length}`);
  console.log(`chaves órgão#ação ... ${Object.keys(saida).length} (${multiplas} com mais de uma fonte)`);
  console.log(`fontes distintas .... ${climaPorFonte.size}`);
  console.log(`\n10 maiores fontes por valor climático:`);
  for (const [fonte, valor] of [...climaPorFonte.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)) {
    console.log(`  ${fonte}  ${brl(valor)}`);
  }
  console.log(`\n-> ${SAIDA}`);
}

main();
