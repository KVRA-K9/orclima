/**
 * Leitor mínimo de .xlsx — sem dependências.
 *
 * Um .xlsx é um ZIP de XMLs. Aqui há o suficiente para ler planilhas de dados:
 * descompacta o ZIP (store e deflate), resolve sharedStrings e strings inline,
 * e devolve as linhas como objetos indexados pela letra da coluna.
 *
 *   import { lerPlanilha } from "./lib-xlsx";
 *   const linhas = lerPlanilha("arquivo.xlsx");        // 1ª planilha
 *   const linhas = lerPlanilha("arquivo.xlsx", 2);     // 2ª planilha
 *   // -> [ { _linha: 6, A: "Eixo", B: "Função", … }, … ]
 *
 * Não interpreta fórmulas (usa o último valor calculado, que é o que o Excel
 * grava) nem converte datas seriais.
 */
import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

export type LinhaPlanilha = { _linha: number } & Record<string, string | number>;

/* ---------- ZIP ---------- */

function abrirZip(caminho: string): Map<string, Buffer> {
  const buf = readFileSync(caminho);

  // End of Central Directory: assinatura 0x06054b50, buscada do fim para o começo
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 65558; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error(`Não parece um .xlsx válido: ${caminho}`);

  const total = buf.readUInt16LE(eocd + 10);
  let ptr = buf.readUInt32LE(eocd + 16);
  const arquivos = new Map<string, Buffer>();

  for (let n = 0; n < total; n++) {
    if (buf.readUInt32LE(ptr) !== 0x02014b50) break;
    const metodo = buf.readUInt16LE(ptr + 10);
    const tamComprimido = buf.readUInt32LE(ptr + 20);
    const tamNome = buf.readUInt16LE(ptr + 28);
    const tamExtra = buf.readUInt16LE(ptr + 30);
    const tamComentario = buf.readUInt16LE(ptr + 32);
    const offsetLocal = buf.readUInt32LE(ptr + 42);
    const nome = buf.toString("utf8", ptr + 46, ptr + 46 + tamNome);

    // No cabeçalho local os tamanhos de nome/extra podem diferir do central
    const nomeLocal = buf.readUInt16LE(offsetLocal + 26);
    const extraLocal = buf.readUInt16LE(offsetLocal + 28);
    const inicio = offsetLocal + 30 + nomeLocal + extraLocal;
    const bruto = buf.subarray(inicio, inicio + tamComprimido);

    arquivos.set(nome, metodo === 0 ? bruto : inflateRawSync(bruto));
    ptr += 46 + tamNome + tamExtra + tamComentario;
  }
  return arquivos;
}

/* ---------- XML ---------- */

const ENTIDADES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

const desescapar = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(+d))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&(amp|lt|gt|quot|apos);/g, (m) => ENTIDADES[m]);

/** Concatena os <t> de um bloco, ignorando <rPh> (leitura fonética japonesa). */
const textoDe = (xml: string) =>
  [...xml.replace(/<rPh[\s\S]*?<\/rPh>/g, "").matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
    .map((m) => desescapar(m[1]))
    .join("");

/* ---------- Planilha ---------- */

/**
 * @param caminho arquivo .xlsx
 * @param indice  1 = primeira planilha (padrão)
 */
export function lerPlanilha(caminho: string, indice = 1): LinhaPlanilha[] {
  const zip = abrirZip(caminho);

  const ssBuf = zip.get("xl/sharedStrings.xml");
  const compartilhadas = ssBuf
    ? [...ssBuf.toString("utf8").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textoDe(m[1]))
    : [];

  const nomes = [...zip.keys()]
    .filter((n) => /^xl\/worksheets\/sheet\d*\.xml$/.test(n))
    .sort((a, b) => {
      const na = +(/(\d+)/.exec(a)?.[1] ?? 0);
      const nb = +(/(\d+)/.exec(b)?.[1] ?? 0);
      return na - nb;
    });
  const alvo = nomes[indice - 1];
  if (!alvo) throw new Error(`Planilha ${indice} não existe em ${caminho} (há ${nomes.length})`);

  const xml = zip.get(alvo)!.toString("utf8");
  const linhas: LinhaPlanilha[] = [];

  for (const linha of xml.matchAll(/<row[^>]*?r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
    const obj: LinhaPlanilha = { _linha: +linha[1] };
    let vazia = true;

    for (const c of linha[2].matchAll(/<c\s+r="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g)) {
      const coluna = c[1];
      const tipo = /t="([^"]+)"/.exec(c[2])?.[1];
      let valor: string | number | undefined;

      if (tipo === "inlineStr") {
        valor = textoDe(c[3]);
      } else {
        const v = /<v>([\s\S]*?)<\/v>/.exec(c[3])?.[1];
        if (v === undefined) continue;
        if (tipo === "s") valor = compartilhadas[+v];
        else if (tipo === "str" || tipo === "e") valor = desescapar(v);
        else valor = Number(v);
      }
      if (valor === undefined || valor === "") continue;
      obj[coluna] = valor;
      vazia = false;
    }
    if (!vazia) linhas.push(obj);
  }
  return linhas;
}

/** Número tolerante: aceita "1.234,56" (pt-BR), "1234.56" e já-número. */
export function numero(v: string | number | undefined | null): number {
  if (typeof v === "number") return v;
  if (v === undefined || v === null || v === "") return 0;
  const s = String(v).trim();
  const n = Number(/,\d{1,2}$/.test(s) ? s.replace(/\./g, "").replace(",", ".") : s);
  return Number.isNaN(n) ? 0 : n;
}
