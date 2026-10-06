import type { Eixo } from "@/data/eixos";
import { EIXOS_EN } from "@/data/eixos-en";
import type { InstrumentoLegal } from "@/data/instrumentos-legais";
import { INSTRUMENTOS_EN } from "@/data/instrumentos-legais-en";
import { INDICADORES_ODS_EN, ODS_TITULOS_EN } from "@/data/ods-en";
import type { Dicionario, Locale } from "@/lib/i18n";

export function tituloDoEixo(numero: number, padrao: string, lang: Locale): string {
  return lang === "pt" ? padrao : (EIXOS_EN[numero]?.titulo ?? padrao);
}

export function rotuloDoEixo(numero: number, padrao: string, lang: Locale): string {
  return lang === "pt" ? padrao : (EIXOS_EN[numero]?.rotulo ?? padrao);
}

export function descricaoDoEixo(eixo: Eixo, lang: Locale): string {
  return lang === "pt" ? eixo.descricao : (EIXOS_EN[eixo.numero]?.descricao ?? eixo.descricao);
}

export function tituloDoOds(numero: number, padrao: string, lang: Locale): string {
  return lang === "pt" ? padrao : (ODS_TITULOS_EN[numero] ?? padrao);
}

export function codDoOds(cod: string, lang: Locale): string {
  return lang === "en" ? cod.replace("ODS", "SDG") : cod;
}

export function descricaoDoIndicador(
  codigo: string | null,
  padrao: string,
  lang: Locale,
): string {
  if (lang === "pt" || !codigo) return padrao;
  return INDICADORES_ODS_EN[codigo] ?? padrao;
}

/**
 * Tradução do instrumento para o idioma pedido. Sobre a fonte PT: o registro
 * EN só carrega o que muda com o idioma — qualquer campo que ele não traduzir
 * (como um `url` novo que a fonte ganhar) herda o valor original em vez de
 * sumir silenciosamente.
 */
export function instrumentoDoIdioma(item: InstrumentoLegal, lang: Locale): InstrumentoLegal {
  if (lang === "pt") return item;
  return { ...item, ...INSTRUMENTOS_EN[item.titulo] };
}

/** "4.679" em PT; "4,679" em EN — o separador de milhar acompanha o idioma. */
export function numeroNorma(numero: string, lang: Locale): string {
  return lang === "en" ? numero.replace(/\./g, ",") : numero;
}

/** Data de assinatura/publicação no idioma atual, a partir do ISO da ingestão. */
export function dataLocale(iso: string | null, lang: Locale): string | null {
  if (!iso) return null;
  if (lang === "pt") {
    const [ano, mes, dia] = iso.split("-");
    return dia && mes && ano ? `${dia}/${mes}/${ano}` : null;
  }
  const data = new Date(`${iso}T12:00:00`);
  return Number.isNaN(data.getTime()) ? null : data.toLocaleDateString("en-US");
}

/** Recompõe "Exclusivo (19%) / Não Exclusivo (81%)" com os rótulos do idioma. */
export function rotuloIntensidade(
  texto: string,
  dados: Dicionario["dados"],
): string {
  return texto.replace(
    /^Exclusivo \((\d+)%\) \/ Não Exclusivo \((\d+)%\)$/,
    (_total, exclusivo: string, naoExclusivo: string) =>
      `${dados.tipoDotacao["Exclusivo"]} (${exclusivo}%) / ${dados.tipoDotacao["Não Exclusivo"]} (${naoExclusivo}%)`,
  );
}
