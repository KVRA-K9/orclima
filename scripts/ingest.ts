/**
 * Ingestão da planilha oficial -> data/orcamento.json
 *
 *   npm run ingest                    # usa o primeiro .csv de data/raw/
 *   npm run ingest -- data/raw/x.csv  # arquivo específico
 *
 * Espera um CSV com uma linha por alocação (órgão × eixo, idealmente por ação).
 * Delimitador `;` ou `,` detectado automaticamente; números em pt-BR
 * ("1.234,56") ou en-US ("1234.56"). Os nomes de coluna aceitos estão em
 * COLUNAS abaixo — a comparação ignora acentos, caixa e espaços.
 *
 * Se o XLSX ainda estiver em formato Excel, exporte como "CSV UTF-8" antes.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const RAIZ = resolve(import.meta.dirname, "..");
const DIR_RAW = join(RAIZ, "data", "raw");
const SAIDA = join(RAIZ, "data", "orcamento.json");

const COLUNAS = {
  orgao: ["orgao", "unidade", "unidadeorcamentaria", "secretaria", "sigla"],
  eixo: ["eixo", "eixotematico", "eixonumero"],
  valor: ["valor", "valorclimatico", "dotacao", "orcamento", "montante"],
  tipo: ["tipo", "classificacao", "intensidade", "exclusividade"],
  acao: ["acao", "codigoacao", "aplicacao", "programa"],
  exercicio: ["exercicio", "ano"],
} as const;

type Campo = keyof typeof COLUNAS;

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

function separarLinhas(texto: string, delim: string): string[][] {
  const linhas: string[][] = [];
  let campo = "";
  let linha: string[] = [];
  let aspas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else aspas = false;
      } else campo += c;
      continue;
    }
    if (c === '"') aspas = true;
    else if (c === delim) {
      linha.push(campo);
      campo = "";
    } else if (c === "\n") {
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = "";
    } else if (c !== "\r") campo += c;
  }
  if (campo !== "" || linha.length) {
    linha.push(campo);
    linhas.push(linha);
  }
  return linhas.filter((l) => l.some((c) => c.trim() !== ""));
}

function paraNumero(bruto: string): number {
  const s = bruto.replace(/[^\d,.-]/g, "").trim();
  if (!s) return 0;
  // "1.234,56" (pt-BR) vs "1234.56" (en-US): decide pelo separador mais à direita.
  const ultimaVirgula = s.lastIndexOf(",");
  const ultimoPonto = s.lastIndexOf(".");
  const limpo =
    ultimaVirgula > ultimoPonto
      ? s.replace(/\./g, "").replace(",", ".")
      : s.replace(/,/g, "");
  const n = Number(limpo);
  if (Number.isNaN(n)) throw new Error(`valor numérico inválido: ${JSON.stringify(bruto)}`);
  return n;
}

const ROMANOS: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7 };

function numeroDoEixo(bruto: string): number {
  const s = bruto.trim();
  const romano = /eixo\s+([ivx]+)\b/i.exec(s);
  if (romano && ROMANOS[romano[1].toUpperCase()]) return ROMANOS[romano[1].toUpperCase()];
  const arabe = /(\d+)/.exec(s);
  if (arabe) {
    const n = Number(arabe[1]);
    if (n >= 1 && n <= 7) return n;
  }
  throw new Error(`eixo não reconhecido: ${JSON.stringify(bruto)}`);
}

function ehExclusivo(bruto: string): boolean {
  const n = normalizar(bruto);
  if (n.startsWith("naoexclusivo") || n.startsWith("nexclusivo")) return false;
  if (n.startsWith("exclusivo")) return true;
  throw new Error(`tipo não reconhecido: ${JSON.stringify(bruto)}`);
}

function localizarArquivo(): string {
  const arg = process.argv[2];
  if (arg) return resolve(arg);
  const candidatos = readdirSync(DIR_RAW).filter((f) => /\.csv$/i.test(f));
  if (!candidatos.length) {
    throw new Error(
      `nenhum .csv encontrado em data/raw/.\n` +
        `Coloque a planilha lá (exportada como "CSV UTF-8") ou passe o caminho:\n` +
        `  npm run ingest -- caminho/para/planilha.csv`,
    );
  }
  return join(DIR_RAW, candidatos[0]);
}

function main() {
  const arquivo = localizarArquivo();
  const texto = readFileSync(arquivo, "utf8").replace(/^﻿/, "");
  const primeiraLinha = texto.slice(0, texto.indexOf("\n") + 1 || undefined);
  const delim = (primeiraLinha.match(/;/g)?.length ?? 0) > (primeiraLinha.match(/,/g)?.length ?? 0) ? ";" : ",";

  const linhas = separarLinhas(texto, delim);
  if (linhas.length < 2) throw new Error("planilha sem linhas de dados");

  const cabecalho = linhas[0].map(normalizar);
  const indice = {} as Record<Campo, number>;
  for (const [campo, apelidos] of Object.entries(COLUNAS) as [Campo, readonly string[]][]) {
    indice[campo] = cabecalho.findIndex((c) => apelidos.includes(c));
  }

  const faltando = (["orgao", "eixo", "valor", "tipo"] as Campo[]).filter((c) => indice[c] < 0);
  if (faltando.length) {
    throw new Error(
      `colunas obrigatórias ausentes: ${faltando.join(", ")}\n` +
        `cabeçalho lido: ${linhas[0].join(" | ")}\n` +
        `apelidos aceitos: ${faltando.map((c) => `${c} -> ${COLUNAS[c].join("/")}`).join("; ")}`,
    );
  }

  type Acumulado = {
    nome: string;
    codigo: string;
    sigla: string;
    eixos: Record<string, number>;
    exclusivo: number;
    naoExclusivo: number;
  };

  const porOrgao = new Map<string, Acumulado>();
  const acoes = { exclusivas: new Set<string>(), naoExclusivas: new Set<string>() };
  let exercicio = new Date().getFullYear();
  const temColunaAcao = indice.acao >= 0;

  linhas.slice(1).forEach((linha, i) => {
    const posicao = `linha ${i + 2}`;
    try {
      const nome = linha[indice.orgao].trim();
      if (!nome) return;
      const eixo = numeroDoEixo(linha[indice.eixo]);
      const valor = paraNumero(linha[indice.valor]);
      const exclusivo = ehExclusivo(linha[indice.tipo]);
      if (indice.exercicio >= 0 && linha[indice.exercicio]?.trim()) {
        exercicio = Number(paraNumero(linha[indice.exercicio]));
      }

      const m = /^(\d+\/\d+)\s*-\s*(.+)$/.exec(nome);
      const atual: Acumulado = porOrgao.get(nome) ?? {
        nome,
        codigo: m ? m[1] : "",
        sigla: m ? m[2] : nome,
        eixos: {},
        exclusivo: 0,
        naoExclusivo: 0,
      };
      atual.eixos[eixo] = (atual.eixos[eixo] ?? 0) + valor;
      if (exclusivo) atual.exclusivo += valor;
      else atual.naoExclusivo += valor;
      porOrgao.set(nome, atual);

      if (temColunaAcao) {
        const chave = `${nome}|${linha[indice.acao].trim()}`;
        (exclusivo ? acoes.exclusivas : acoes.naoExclusivas).add(chave);
      }
    } catch (erro) {
      throw new Error(`${posicao}: ${(erro as Error).message}`);
    }
  });

  const r2 = (n: number) => Math.round(n * 100) / 100;

  const orgaos = [...porOrgao.values()]
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    .map((o) => {
      const total = r2(o.exclusivo + o.naoExclusivo);
      const pct = total === 0 ? 0 : Math.round((o.exclusivo / total) * 100);
      return {
        nome: o.nome,
        codigo: o.codigo,
        sigla: o.sigla,
        total,
        exclusivo: r2(o.exclusivo),
        naoExclusivo: r2(o.naoExclusivo),
        tipo: o.exclusivo > o.naoExclusivo ? "Exclusivo" : "Não Exclusivo",
        intensidade: `Exclusivo (${pct}%) / Não Exclusivo (${100 - pct}%)`,
        eixos: Object.fromEntries(
          Object.entries(o.eixos)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([k, v]) => [k, r2(v)]),
        ),
      };
    });

  const gastoExclusivo = r2(orgaos.reduce((s, o) => s + o.exclusivo, 0));
  const gastoNaoExclusivo = r2(orgaos.reduce((s, o) => s + o.naoExclusivo, 0));

  const anterior = JSON.parse(readFileSync(SAIDA, "utf8"));
  const saida = {
    exercicio,
    fonte: anterior.fonte,
    resumo: {
      numeroOrgaosAtuantes: orgaos.length,
      acoesExclusivas: temColunaAcao ? acoes.exclusivas.size : anterior.resumo.acoesExclusivas,
      acoesNaoExclusivas: temColunaAcao
        ? acoes.naoExclusivas.size
        : anterior.resumo.acoesNaoExclusivas,
      gastoExclusivo,
      gastoNaoExclusivo,
      total: r2(gastoExclusivo + gastoNaoExclusivo),
    },
    orgaos,
  };

  writeFileSync(SAIDA, JSON.stringify(saida, null, 2) + "\n");

  const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  console.log(`fonte: ${arquivo}`);
  console.log(`exercício ........... ${saida.exercicio}`);
  console.log(`órgãos .............. ${saida.resumo.numeroOrgaosAtuantes}`);
  console.log(`exclusivo ........... ${brl(gastoExclusivo)}`);
  console.log(`não exclusivo ....... ${brl(gastoNaoExclusivo)}`);
  console.log(`total ............... ${brl(saida.resumo.total)}`);
  console.log(
    `aplicações .......... ${saida.resumo.acoesExclusivas} exclusivas / ${saida.resumo.acoesNaoExclusivas} não exclusivas` +
      (temColunaAcao ? "" : "  (mantidas do arquivo anterior — sem coluna de ação no CSV)"),
  );
  console.log(`\n-> ${SAIDA}`);
}

main();
