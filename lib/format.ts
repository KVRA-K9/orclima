import type { Locale } from "@/lib/i18n";

const INTL_LOCALE: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
};

const BRL: Record<Locale, Intl.NumberFormat> = {
  pt: new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  en: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
};

const INTEIRO: Record<Locale, Intl.NumberFormat> = {
  pt: new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }),
};

/** Sufixos da abreviação de escala em cada idioma. */
const SUFIXOS: Record<Locale, { bi: string; mi: string; mil: string }> = {
  pt: { bi: " bi", mi: " MI", mil: " mil" },
  en: { bi: " bn", mi: " M", mil: " k" },
};

/** R$ 200.124.164,91 / R$ 200,124,164.91 */
export function formatBRL(valor: number, lang: Locale = "pt"): string {
  return BRL[lang].format(valor);
}

/** 200.124.164 (sem centavos, sem símbolo) */
export function formatNumero(valor: number, lang: Locale = "pt"): string {
  return INTEIRO[lang].format(valor);
}

/**
 * Abreviação usada nos cartões e eixos dos gráficos, na mesma escala do painel
 * atual: PT "1,2 bi" / "340,5 MI" / "700 mil"; EN "1.2 bn" / "340.5 M" / "700 k".
 */
export function formatCompacto(valor: number, lang: Locale = "pt"): string {
  const abs = Math.abs(valor);
  if (abs >= 1e9) return escala(valor / 1e9, 1, lang) + SUFIXOS[lang].bi;
  if (abs >= 1e6) return escala(valor / 1e6, 1, lang) + SUFIXOS[lang].mi;
  if (abs >= 1e3) return escala(valor / 1e3, 0, lang) + SUFIXOS[lang].mil;
  return valor.toLocaleString(INTL_LOCALE[lang]);
}

/** "R$ 340,5 MI" / "R$ 340.5 M" */
export function formatCompactoBRL(valor: number, lang: Locale = "pt"): string {
  return `R$ ${formatCompacto(valor, lang)}`;
}

function escala(valor: number, casas: number, lang: Locale): string {
  return valor.toLocaleString(INTL_LOCALE[lang], {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

/**
 * Participação, com piso de precisão: `"46,5%"`, mas `"< 0,1%"` (PT) /
 * `"< 0.1%"` (EN) para o que não chega a uma décima. Fontes de recurso pequenas
 * — R$ 6 mil num orçamento de quase R$ 1 bilhão — apareciam como "0,0%", que
 * se lê como defeito. Zero exato continua "0,0%": ali é verdade, não
 * arredondamento.
 */
export function formatParticipacao(fracao: number, casas = 1, lang: Locale = "pt"): string {
  const minimo = 10 ** -casas;
  if (fracao > 0 && fracao * 100 < minimo) {
    return `< ${minimo.toLocaleString(INTL_LOCALE[lang], {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas,
    })}%`;
  }
  return formatPercentual(fracao, casas, lang);
}

/** 12,4% / 12.4% */
export function formatPercentual(fracao: number, casas = 1, lang: Locale = "pt"): string {
  return `${(fracao * 100).toLocaleString(INTL_LOCALE[lang], {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })}%`;
}
