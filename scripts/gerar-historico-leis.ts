/**
 * Acervo normativo climático do Acre -> data/historico-leis.json
 *
 *   npm run historico:leis
 *   npm run historico:leis -- caminho/para/outra-planilha.xlsx
 *
 * Lê "HISTÓRICO DE LEIS ORÇAMENTO CLIMÁTICO.xlsx" — o levantamento manual das
 * normas estaduais com recorte climático, de 1965 a hoje — e grava o acervo
 * como JSON, mais um `.meta.json` com a procedência.
 *
 * Este é o único script de ingestão que NÃO usa `lib-xlsx.ts`: os links para o
 * legis.ac.gov.br não estão no texto das células, e sim como hyperlink do
 * Excel, que o leitor caseiro não extrai. O `exceljs` (já usado em
 * `gerar-linha-do-tempo.ts`) lê `cell.hyperlink` — sem o link, cada norma
 * perderia a referência ao texto oficial, que é metade do valor do acervo.
 *
 * A planilha tem seis abas, cada uma com um leiaute próprio. O que é comum:
 * a coluna 2 traz a designação da norma com o link, e a coluna 3 a ementa.
 * O resto muda de aba para aba e está declarado em `ABAS`.
 *
 * Recusa-se a escrever se a contagem por aba divergir do esperado, se algum
 * link estiver fora do domínio conhecido, ou se alguma norma sair sem ementa.
 */
import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import ExcelJS from "exceljs";

const RAIZ = resolve(import.meta.dirname, "..");
const PADRAO = join(RAIZ, "Histórico", "HISTÓRICO DE LEIS ORÇAMENTO CLIMÁTICO.xlsx");

/* ---------- tipos ---------- */

const TIPOS_NORMA = [
  "Lei Ordinária",
  "Decreto",
  "Estrutura Administrativa",
  "PPA",
  "LDO",
  "LOA",
] as const;
type TipoNorma = (typeof TIPOS_NORMA)[number];

type Citacao = { descritor: string; total: number };

type OrgaoLOA = {
  codigo: string | null;
  nome: string;
  rp: number;
  outrasFontes: number;
  total: number;
};

type ValoresLOA = {
  rp: number;
  outrasFontes: number;
  total: number;
  moeda: "Cr$" | "R$";
  orgaos: OrgaoLOA[];
};

type Norma = {
  id: string;
  tipo: TipoNorma;
  especie: string;
  numero: string;
  ementa: string;
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
  abas: TipoNorma[];
};

/* ---------- leiaute das abas ---------- */

type Colunas = {
  /** Nº sequencial da colega. Só documenta a ordem original; não vai para o JSON. */
  ordem: number;
  designacao: number;
  ementa: number;
  orgaos?: number;
  metas?: number;
  /** Faixa das contagens de descritores, inclusiva. O rótulo vem do cabeçalho. */
  citacoes?: { de: number; ate: number; cabecalho: number };
  loa?: { codigo: number; nome: number; rp: number; outrasFontes: number; total: number };
};

type Aba = { nome: string; tipo: TipoNorma; esperado: number; colunas: Colunas };

// As linhas de cabeçalho diferem em cada aba (há de duas a quatro linhas de
// metadados no topo), por isso a faixa de dados não é declarada: uma norma
// começa onde há hyperlink na coluna da designação. Isso também descarta os
// rodapés de legenda ("REVOGADA NA ÍNTEGRA") e as centenas de linhas em branco
// já formatadas abaixo dos dados.
const ABAS: Aba[] = [
  {
    nome: "Lei Ordinária",
    tipo: "Lei Ordinária",
    esperado: 142,
    colunas: { ordem: 1, designacao: 2, ementa: 3 },
  },
  {
    nome: "Decreto",
    tipo: "Decreto",
    esperado: 106,
    colunas: { ordem: 1, designacao: 2, ementa: 3 },
  },
  {
    nome: "Estrutura básica da adm",
    tipo: "Estrutura Administrativa",
    esperado: 25,
    colunas: { ordem: 1, designacao: 2, ementa: 3, orgaos: 4 },
  },
  {
    nome: "PPA",
    tipo: "PPA",
    esperado: 15,
    colunas: {
      ordem: 1,
      designacao: 2,
      ementa: 3,
      citacoes: { de: 4, ate: 20, cabecalho: 7 },
    },
  },
  {
    nome: "LDO",
    tipo: "LDO",
    esperado: 36,
    colunas: {
      ordem: 1,
      designacao: 2,
      ementa: 3,
      metas: 5,
      citacoes: { de: 6, ate: 23, cabecalho: 4 },
    },
  },
  {
    nome: "LOA",
    tipo: "LOA",
    esperado: 36,
    colunas: {
      ordem: 1,
      designacao: 2,
      ementa: 3,
      loa: { codigo: 4, nome: 5, rp: 6, outrasFontes: 7, total: 8 },
    },
  },
];

/**
 * O real entrou em julho de 1994, mas a primeira LOA inteiramente orçada nele
 * é a do exercício de 1995. Os quatro exercícios anteriores estão em cruzeiro,
 * cruzeiro novo ou cruzeiro real, e a hiperinflação do período torna qualquer
 * conversão por fator fixo enganosa — ficam registrados na moeda original e
 * fora da série do gráfico.
 */
const PRIMEIRO_EXERCICIO_EM_REAL = 1995;

const DOMINIO_LINKS = /^https?:\/\/(www\.)?legis\.ac\.gov\.br\//;

/**
 * Erros de digitação no cabeçalho dos descritores, corrigidos na saída.
 *
 * O rótulo é nome de categoria, não citação — vai para a tela como legenda de
 * uma barra, e ali o erro se lê como defeito do painel. A correção também
 * alinha PPA e LDO, que grafam o mesmo descritor de formas diferentes.
 */
const CORRECOES_DESCRITOR: Record<string, string> = {
  "Meio Amnbiente": "Meio Ambiente",
};

/* ---------- leitura de células ---------- */

type ValorCelula = ExcelJS.CellValue;

/**
 * Texto de uma célula. O `exceljs` devolve formas bem diferentes conforme a
 * célula: string crua, rich text (quando há trechos com formatação distinta),
 * `{ text, hyperlink }` quando há link — e nesse caso `text` pode ser, por sua
 * vez, rich text — e `{ formula, result }` nas fórmulas.
 */
function texto(valor: ValorCelula): string {
  if (valor == null) return "";
  if (Array.isArray(valor)) return valor.map(texto).join("");
  if (valor instanceof Date) return valor.toISOString().slice(0, 10);
  if (typeof valor === "object") {
    const v = valor as unknown as Record<string, unknown>;
    if ("richText" in v) return texto(v.richText as ValorCelula);
    if ("text" in v) return texto(v.text as ValorCelula);
    if ("result" in v) return texto(v.result as ValorCelula);
    return "";
  }
  return String(valor);
}

const limpar = (valor: ValorCelula) => texto(valor).replace(/\s+/g, " ").trim();

/** Número de uma célula, tolerando texto e fórmula. Ausente vira 0. */
function numero(valor: ValorCelula): number {
  if (typeof valor === "number") return valor;
  const bruto = texto(valor).replace(/[^\d.,-]/g, "");
  if (!bruto) return 0;
  // A planilha grava em formato americano (ponto decimal); a vírgula só
  // aparece como separador de milhar quando a célula é texto.
  const n = Number(bruto.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const dataISO = (dia: string, mes: string, ano: string) =>
  `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;

/* ---------- interpretação da designação ---------- */

type Designacao = {
  especie: string;
  numero: string;
  data: string | null;
  publicacao: string | null;
  ano: number;
};

/**
 * Separa a designação, que vem concatenada sem delimitador:
 *
 *   "Lei nº 4.759, de 19/01/2026Publicada no DOE de 26/01/2026"
 *   "Decreto nº 11.924, de 10/07/2026Publicado no DOE de 13/07/2026"
 *   "Lei Complementar nº 300, de 09/07/2015Publicada no DOE de 09/07/2015"
 *
 * A Constituição Estadual foge do padrão (a colega colou a URL junto da data,
 * sem hyperlink) e é tratada à parte por `constituicao()`.
 */
function interpretar(designacao: string): Designacao | null {
  const [antes, depois] = designacao.split(/Publicad[ao] no DOE de\s*/i);

  const cabecalho = antes.match(
    /^(.*?)\s*n[ºo°.]?\s*([\d.]+)\s*,?\s*de\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i,
  );
  if (!cabecalho) return null;

  const [, especieBruta, num, dia, mes, ano] = cabecalho;
  const doe = depois?.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);

  return {
    especie: especieBruta.trim() || "Lei",
    numero: num,
    data: dataISO(dia, mes, ano),
    publicacao: doe ? dataISO(doe[1], doe[2], doe[3]) : null,
    ano: Number(ano),
  };
}

/** A Constituição Estadual de 1989: "https://…/detalhar_constituicao/0 03 de outubro de 1989". */
function constituicao(designacao: string): (Designacao & { link: string }) | null {
  const url = designacao.match(/https?:\/\/\S*detalhar_constituicao\S*/i);
  if (!url) return null;
  const data = designacao.match(/(\d{1,2}) de ([a-zçãé]+) de (\d{4})/i);
  const MESES = "janeiro fevereiro março abril maio junho julho agosto setembro outubro novembro dezembro".split(" ");
  const mes = data ? MESES.indexOf(data[2].toLowerCase()) + 1 : 0;

  return {
    especie: "Constituição Estadual",
    numero: "—",
    data: data && mes ? dataISO(data[1], String(mes), data[3]) : null,
    publicacao: null,
    ano: data ? Number(data[3]) : 1989,
    link: url[0],
  };
}

/* ---------- extrações da ementa ---------- */

/** "para o exercício financeiro de 2026", "para o ano de 1995". */
function exercicioDe(ementa: string): number | null {
  const m = ementa.match(/(?:exerc[íi]cio(?: financeiro)?|ano) de (\d{4})/i);
  return m ? Number(m[1]) : null;
}

/** "quadriênio 2024-2027", "quadriênio de 2008 - 2011", "quadriênio 1992 – 1995". */
function quadrienioDe(ementa: string): [number, number] | null {
  const m = ementa.match(/quadri[êe]nio\s*(?:de\s*)?(\d{4})\s*[-–—]\s*(\d{4})/i);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/* ---------- leitura de uma aba ---------- */

type Bruto = { norma: Norma; linha: number };

function lerAba(planilha: ExcelJS.Worksheet, aba: Aba, erros: string[]): Bruto[] {
  const { colunas } = aba;

  // Rótulos dos descritores, lidos do cabeçalho — cada aba tem a sua lista, e
  // há erro de digitação no original ("Meio Amnbiente" na LDO) que fica como
  // está: o rótulo é o que a colega escreveu.
  const descritores: string[] = [];
  if (colunas.citacoes) {
    const cabecalho = planilha.getRow(colunas.citacoes.cabecalho);
    for (let c = colunas.citacoes.de; c <= colunas.citacoes.ate; c++) {
      const rotulo = limpar(cabecalho.getCell(c).value);
      descritores.push(CORRECOES_DESCRITOR[rotulo] ?? rotulo);
    }
  }

  const normas: Bruto[] = [];
  let atual: Bruto | null = null;

  for (let r = 1; r <= planilha.rowCount; r++) {
    const linha = planilha.getRow(r);
    const celula = linha.getCell(colunas.designacao);
    const designacao = limpar(celula.value);
    const link = celula.hyperlink ? String(celula.hyperlink) : null;

    // Nas LOAs antigas a designação se repete a cada órgão, mas o hyperlink
    // só existe na primeira linha do bloco — por isso o link, e não o texto,
    // é o que marca o início de uma norma.
    const inicio = Boolean(link) || Boolean(constituicao(designacao));
    if (!inicio) {
      if (atual && colunas.loa && limpar(linha.getCell(colunas.loa.nome).value)) {
        atual.norma.loa?.orgaos.push(lerOrgao(linha, colunas.loa));
      }
      continue;
    }

    const ementa = limpar(linha.getCell(colunas.ementa).value);
    if (!ementa) {
      erros.push(`${aba.nome} linha ${r}: norma sem ementa`);
      continue;
    }

    const especial = constituicao(designacao);
    const info = especial ?? interpretar(designacao);
    if (!info) {
      erros.push(`${aba.nome} linha ${r}: designação fora do padrão — ${designacao}`);
      continue;
    }

    const href = especial ? especial.link : link;
    if (href && !DOMINIO_LINKS.test(href)) {
      erros.push(`${aba.nome} linha ${r}: link fora do legis.ac.gov.br — ${href}`);
    }

    const norma: Norma = {
      id: `${aba.tipo}-${r}`,
      tipo: aba.tipo,
      especie: info.especie,
      numero: info.numero,
      ementa,
      ano: info.ano,
      data: info.data,
      publicacao: info.publicacao,
      link: href,
      exercicio: aba.tipo === "LOA" || aba.tipo === "LDO" ? exercicioDe(ementa) : null,
      quadrienio: aba.tipo === "PPA" ? quadrienioDe(ementa) : null,
      orgaos: colunas.orgaos ? limpar(linha.getCell(colunas.orgaos).value) || null : null,
      citacoes: [],
      metas: [],
      loa: null,
      abas: [aba.tipo],
    };

    if (colunas.citacoes) {
      for (let c = colunas.citacoes.de, i = 0; c <= colunas.citacoes.ate; c++, i++) {
        const total = numero(linha.getCell(c).value);
        if (total > 0) norma.citacoes.push({ descritor: descritores[i], total });
      }
    }

    if (colunas.metas) {
      // O campo é um bloco de texto com quebras de linha: cada parágrafo é um
      // artigo transcrito, ou a nota de revogação da própria LDO.
      norma.metas = texto(linha.getCell(colunas.metas).value)
        .split(/\r?\n/)
        .map((p) => p.replace(/\s+/g, " ").trim())
        .filter(Boolean);
    }

    if (colunas.loa) {
      const exercicio = norma.exercicio;
      norma.loa = {
        rp: 0,
        outrasFontes: 0,
        total: 0,
        moeda:
          exercicio && exercicio >= PRIMEIRO_EXERCICIO_EM_REAL ? "R$" : "Cr$",
        orgaos: [lerOrgao(linha, colunas.loa)],
      };
    }

    atual = { norma, linha: r };
    normas.push(atual);
  }

  if (normas.length !== aba.esperado) {
    erros.push(
      `${aba.nome}: ${normas.length} normas lidas, ${aba.esperado} esperadas`,
    );
  }
  return normas;
}

function lerOrgao(linha: ExcelJS.Row, cols: NonNullable<Colunas["loa"]>): OrgaoLOA {
  return {
    codigo: limpar(linha.getCell(cols.codigo).value) || null,
    nome: limpar(linha.getCell(cols.nome).value),
    rp: numero(linha.getCell(cols.rp).value),
    outrasFontes: numero(linha.getCell(cols.outrasFontes).value),
    total: numero(linha.getCell(cols.total).value),
  };
}

/* ---------- deduplicação ---------- */

/** Os links variam entre `http://www.legis…` e `https://legis…` para a mesma norma. */
const chaveLink = (link: string) =>
  link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "").toLowerCase();

/** Quantos campos úteis a norma tem — decide qual cópia sobrevive. */
function preenchidos(n: Norma): number {
  return (
    (n.data ? 1 : 0) +
    (n.publicacao ? 1 : 0) +
    (n.orgaos ? 1 : 0) +
    (n.exercicio ? 1 : 0) +
    (n.quadrienio ? 1 : 0) +
    (n.loa ? 1 : 0) +
    n.citacoes.length +
    n.metas.length
  );
}

/**
 * A mesma norma aparece mais de uma vez — dentro da aba (a Lei 1.116/1994 está
 * duplicada nas Leis Ordinárias, a 4.282/2023 nos PPAs, a 1.156/1995 nas LDOs)
 * e entre abas (uma LDO revogada por outra lei que também é LDO). Mantém a
 * cópia mais completa e registra em `abas` todas as abas onde ela aparecia.
 */
function deduplicar(todas: Norma[]): Norma[] {
  const porChave = new Map<string, Norma>();
  const soltas: Norma[] = [];

  for (const norma of todas) {
    if (!norma.link) {
      soltas.push(norma);
      continue;
    }
    const chave = chaveLink(norma.link);
    const anterior = porChave.get(chave);
    if (!anterior) {
      porChave.set(chave, norma);
      continue;
    }
    const vencedora = preenchidos(norma) > preenchidos(anterior) ? norma : anterior;
    const perdedora = vencedora === norma ? anterior : norma;
    for (const aba of perdedora.abas) {
      if (!vencedora.abas.includes(aba)) vencedora.abas.push(aba);
    }
    porChave.set(chave, vencedora);
  }

  return [...porChave.values(), ...soltas];
}

/* ---------- execução ---------- */

const caminho = process.argv[2] ? resolve(process.argv[2]) : PADRAO;
const livro = new ExcelJS.Workbook();
await livro.xlsx.readFile(caminho);

const erros: string[] = [];
const lidas: Norma[] = [];
const porAba: Record<string, number> = {};

for (const aba of ABAS) {
  const planilha = livro.getWorksheet(aba.nome);
  if (!planilha) {
    erros.push(`aba "${aba.nome}" não encontrada na planilha`);
    continue;
  }
  const normas = lerAba(planilha, aba, erros);
  porAba[aba.nome] = normas.length;
  lidas.push(...normas.map((b) => b.norma));
}

// Os totais da LOA são a soma dos órgãos daquele exercício. A planilha traz o
// total por órgão numa fórmula; somamos as parcelas para não depender do valor
// que o Excel deixou em cache.
for (const norma of lidas) {
  if (!norma.loa) continue;
  for (const orgao of norma.loa.orgaos) {
    norma.loa.rp += orgao.rp;
    norma.loa.outrasFontes += orgao.outrasFontes;
  }
  norma.loa.total = norma.loa.rp + norma.loa.outrasFontes;
}

const normas = deduplicar(lidas).sort(
  (a, b) => b.ano - a.ano || a.tipo.localeCompare(b.tipo, "pt-BR") || a.numero.localeCompare(b.numero, "pt-BR"),
);

if (erros.length) {
  console.error("A ingestão não fecha:\n" + erros.map((e) => `  • ${e}`).join("\n"));
  process.exit(1);
}

/* ---------- procedência ---------- */

/** "Atualizado em:" está na coluna ao lado do rótulo, em alguma das linhas do topo. */
function atualizadoEm(planilha: ExcelJS.Worksheet): string | null {
  for (let r = 1; r <= 8; r++) {
    const linha = planilha.getRow(r);
    for (let c = 1; c <= 3; c++) {
      if (/^Atualizado em/i.test(limpar(linha.getCell(c).value))) {
        const valor = linha.getCell(c + 1).value;
        if (valor instanceof Date) return valor.toISOString().slice(0, 10);
        const texto = limpar(valor);
        if (texto) return texto;
      }
    }
  }
  return null;
}

const atualizacoes = ABAS.map((aba) => {
  const planilha = livro.getWorksheet(aba.nome);
  return { aba: aba.nome, atualizadoEm: planilha ? atualizadoEm(planilha) : null };
});

const porTipo = Object.fromEntries(
  TIPOS_NORMA.map((tipo) => [tipo, normas.filter((n) => n.tipo === tipo).length]),
);

const meta = {
  arquivoFonte: caminho.slice(RAIZ.length + 1).replace(/\\/g, "/"),
  origem: "Histórico de leis do Orçamento Climático, levantamento manual da SEPLAN",
  geradoEm: new Date().toISOString().slice(0, 10),
  normas: normas.length,
  porTipo,
  atualizacoes,
  descritores: {
    PPA: ABAS.find((a) => a.tipo === "PPA")!.colunas.citacoes,
    LDO: ABAS.find((a) => a.tipo === "LDO")!.colunas.citacoes,
  },
  observacoes: [
    "As normas foram levantadas por busca dos descritores climáticos no texto de cada ato. O acervo cobre o recorte ambiental e climático, não toda a legislação estadual.",
    `Os valores das LOAs somam as dotações dos órgãos ambientais de cada exercício. Os exercícios anteriores a ${PRIMEIRO_EXERCICIO_EM_REAL} estão em cruzeiro e não foram convertidos.`,
    "A planilha marca normas revogadas por cor de célula; essa informação não é lida por este script.",
  ],
};

const destino = join(RAIZ, "data");
writeFileSync(join(destino, "historico-leis.json"), JSON.stringify(normas, null, 2) + "\n");
writeFileSync(join(destino, "historico-leis.meta.json"), JSON.stringify(meta, null, 2) + "\n");

const comLoa = normas.filter((n) => n.loa);
const emReal = comLoa.filter((n) => n.loa!.moeda === "R$");
console.log(`data/historico-leis.json — ${normas.length} normas`);
for (const [tipo, total] of Object.entries(porTipo)) console.log(`  ${tipo.padEnd(26)} ${total}`);
console.log(`  LOAs em real: ${emReal.length} (exercícios ${Math.min(...emReal.map((n) => n.exercicio!))}–${Math.max(...emReal.map((n) => n.exercicio!))})`);
console.log(`  sem link:     ${normas.filter((n) => !n.link).length}`);
