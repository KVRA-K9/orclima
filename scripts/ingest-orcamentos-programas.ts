/**
 * Ingestão nativa de "ORCAMENTOS - PROGRAMAS.xlsx" (o Quadro de Alocação e
 * Classificação do Orçamento Climático) -> data/orcamento.json + data/aplicacoes.json
 *
 *   npm run ingest:orcamentos-programas
 *   npm run ingest:orcamentos-programas -- caminho/para/outra-planilha.xlsx
 *
 * Diferente de `ingest.ts` (que lê um CSV genérico exportado manualmente),
 * este script lê o `.xlsx` oficial diretamente — mesmas colunas de
 * `docs/fonte/ORCAMENTOS - PROGRAMAS.xlsx`: Eixo, Função, Subfunção, Órgão,
 * Dotação, Código - Projeto/Atividade, Aplicação Programada, Classificação do
 * Gasto — e aplica as correções conhecidas de
 * `correcoes-orcamentos-programas.ts` (2 códigos com dígito perdido e 8 casos
 * de dupla contagem entre eixos, ver docs/05-DIVERGENCIAS-CONHECIDAS.md §1b).
 *
 * Produz as duas camadas que o painel consome:
 *  - data/orcamento.json  — resumo + órgão × eixo (o que ingest.ts também gera)
 *  - data/aplicacoes.json — órgão × eixo × aplicação (cada dotação individual)
 *
 * Recusa-se a escrever se a cascata de integridade não fechar (soma das
 * aplicações de cada órgão bate com o total do órgão, soma dos órgãos bate
 * com o total geral).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { lerPlanilha, numero } from "./lib-xlsx.ts";
import { aplicarCorrecoes } from "./correcoes-orcamentos-programas.ts";

const RAIZ = resolve(import.meta.dirname, "..");
const PADRAO = join(RAIZ, "docs", "fonte", "ORCAMENTOS - PROGRAMAS.xlsx");
const SAIDA_ORCAMENTO = join(RAIZ, "data", "orcamento.json");
const SAIDA_APLICACOES = join(RAIZ, "data", "aplicacoes.json");

const COL = {
  eixo: "A",
  orgao: "D",
  dotacao: "E",
  codigo: "F",
  aplicacao: "G",
  classificacao: "H",
} as const;

const ROMANOS: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7 };

function numeroDoEixo(rotulo: string): number {
  const romano = /eixo\s+([ivx]+)\b/i.exec(rotulo);
  if (romano && ROMANOS[romano[1].toUpperCase()]) return ROMANOS[romano[1].toUpperCase()];
  throw new Error(`eixo não reconhecido: ${JSON.stringify(rotulo)}`);
}

type Aplicacao = {
  orgao: string;
  codigo: string;
  eixoNumero: number;
  aplicacao: string;
  classificacao: "Exclusivo" | "Não Exclusivo";
  dotacao: number;
};

function main() {
  const arquivo = resolve(process.argv[2] ?? PADRAO);
  const linhas = lerPlanilha(arquivo).filter((l) => l[COL.eixo] && l[COL.eixo] !== "Eixo");
  if (!linhas.length) throw new Error(`nenhuma linha de dados em ${arquivo}`);

  const aplicacoes: Aplicacao[] = linhas.map((l) => {
    const { codigo, dotacao, orgao } = aplicarCorrecoes(
      l._linha,
      String(l[COL.codigo] ?? "").trim(),
      numero(l[COL.dotacao]),
      String(l[COL.orgao] ?? "").trim(),
    );
    const classificacao = String(l[COL.classificacao] ?? "").trim();
    if (classificacao !== "Exclusivo" && classificacao !== "Não Exclusivo") {
      throw new Error(`linha ${l._linha}: classificação inesperada ${JSON.stringify(classificacao)}`);
    }
    return {
      orgao,
      codigo,
      eixoNumero: numeroDoEixo(String(l[COL.eixo])),
      aplicacao: String(l[COL.aplicacao] ?? "").trim(),
      classificacao,
      dotacao,
    };
  });

  const r2 = (n: number) => Math.round(n * 100) / 100;

  /* --- camada 3: aplicacoes.json --- */

  const aplicacoesPorOrgao: Record<string, Record<string, { aplicacao: string; dotacao: number; tipo: string }[]>> = {};
  for (const a of aplicacoes) {
    const porEixo = (aplicacoesPorOrgao[a.orgao] ??= {});
    (porEixo[String(a.eixoNumero)] ??= []).push({
      aplicacao: a.aplicacao,
      dotacao: r2(a.dotacao),
      tipo: a.classificacao,
    });
  }

  /* --- camada 1+2: orcamento.json --- */

  type Acumulado = { eixos: Record<number, number>; exclusivo: number; naoExclusivo: number };
  const porOrgao = new Map<string, Acumulado>();
  for (const a of aplicacoes) {
    const acc = porOrgao.get(a.orgao) ?? { eixos: {}, exclusivo: 0, naoExclusivo: 0 };
    acc.eixos[a.eixoNumero] = (acc.eixos[a.eixoNumero] ?? 0) + a.dotacao;
    if (a.classificacao === "Exclusivo") acc.exclusivo += a.dotacao;
    else acc.naoExclusivo += a.dotacao;
    porOrgao.set(a.orgao, acc);
  }

  const orgaosOrdenados = [...porOrgao.keys()].sort((a, b) => a.localeCompare(b, "pt-BR"));

  const orgaos = orgaosOrdenados.map((nome) => {
    const acc = porOrgao.get(nome)!;
    const exclusivo = r2(acc.exclusivo);
    const naoExclusivo = r2(acc.naoExclusivo);
    const total = r2(exclusivo + naoExclusivo);
    const percentual = total > 0 ? Math.round((exclusivo / total) * 100) / 100 : 0;
    const pctExclusivo = Math.round(percentual * 100);
    const m = /^(\d+\/\d+)\s*-\s*(.+)$/.exec(nome);

    return {
      nome,
      codigo: m ? m[1] : nome,
      sigla: m ? m[2] : nome,
      total,
      exclusivo,
      naoExclusivo,
      tipo: percentual >= 0.5 ? "Exclusivo" : "Não Exclusivo",
      intensidade: `Exclusivo (${pctExclusivo}%) / Não Exclusivo (${100 - pctExclusivo}%)`,
      eixos: Object.fromEntries(
        Object.entries(acc.eixos)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([k, v]) => [k, r2(v)]),
      ),
    };
  });

  const gastoExclusivo = r2(orgaos.reduce((s, o) => s + o.exclusivo, 0));
  const gastoNaoExclusivo = r2(orgaos.reduce((s, o) => s + o.naoExclusivo, 0));
  const total = r2(gastoExclusivo + gastoNaoExclusivo);
  const acoesExclusivas = aplicacoes.filter((a) => a.classificacao === "Exclusivo").length;
  const acoesNaoExclusivas = aplicacoes.filter((a) => a.classificacao === "Não Exclusivo").length;

  /* --- cascata de integridade --- */

  const erros: string[] = [];
  for (const o of orgaos) {
    const somaAplicacoesOrgao = Object.values(aplicacoesPorOrgao[o.nome] ?? {})
      .flat()
      .reduce((s, a) => s + a.dotacao, 0);
    if (Math.abs(r2(somaAplicacoesOrgao) - o.total) > 0.01) {
      erros.push(`${o.nome}: aplicações somam ${r2(somaAplicacoesOrgao)}, total do órgão é ${o.total}`);
    }
  }
  const somaOrgaos = r2(orgaos.reduce((s, o) => s + o.total, 0));
  if (Math.abs(somaOrgaos - total) > 0.01) {
    erros.push(`soma dos órgãos (${somaOrgaos}) difere do total geral (${total})`);
  }
  if (erros.length) {
    console.log(`Cascata de integridade falhou — nada foi escrito:\n`);
    for (const e of erros) console.log(`  ${e}`);
    process.exit(1);
  }

  /* --- gravar --- */

  const anterior = JSON.parse(readFileSync(SAIDA_ORCAMENTO, "utf8"));
  const saidaOrcamento = {
    exercicio: anterior.exercicio,
    fonte: anterior.fonte,
    resumo: {
      numeroOrgaosAtuantes: orgaos.length,
      acoesExclusivas,
      acoesNaoExclusivas,
      gastoExclusivo,
      gastoNaoExclusivo,
      total,
    },
    orgaos,
  };

  writeFileSync(SAIDA_ORCAMENTO, `${JSON.stringify(saidaOrcamento, null, 2)}\n`, "utf8");
  writeFileSync(SAIDA_APLICACOES, `${JSON.stringify(aplicacoesPorOrgao, null, 2)}\n`, "utf8");

  const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  console.log(`fonte: ${arquivo}`);
  console.log(`órgãos .............. ${orgaos.length}`);
  console.log(`aplicações .......... ${aplicacoes.length} (${acoesExclusivas} exclusivas / ${acoesNaoExclusivas} não exclusivas)`);
  console.log(`exclusivo ........... ${brl(gastoExclusivo)}`);
  console.log(`não exclusivo ....... ${brl(gastoNaoExclusivo)}`);
  console.log(`total ............... ${brl(total)}`);
  console.log(`\n-> ${SAIDA_ORCAMENTO}`);
  console.log(`-> ${SAIDA_APLICACOES}`);
}

main();
