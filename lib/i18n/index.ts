import type { Dicionario } from "./dicionarios/pt";

export type Locale = "pt" | "en";

export const LOCALES = ["pt", "en"] as const;

/** Português é o principal: sem prefixo de idioma na URL, o proxy redireciona para cá. */
export const LOCALE_PADRAO: Locale = "pt";

export type { Dicionario };

export function hasLocale(valor: string): valor is Locale {
  return (LOCALES as readonly string[]).includes(valor);
}

const dicionarios: Record<Locale, () => Promise<Dicionario>> = {
  pt: () => import("./dicionarios/pt").then((m) => m.pt),
  en: () => import("./dicionarios/en").then((m) => m.en),
};

export async function getDictionary(locale: Locale): Promise<Dicionario> {
  return dicionarios[locale]();
}
