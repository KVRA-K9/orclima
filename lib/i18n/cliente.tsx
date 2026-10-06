"use client";

import { createContext, useCallback, useContext } from "react";

import { en } from "@/lib/i18n/dicionarios/en";
import { pt } from "@/lib/i18n/dicionarios/pt";
import type { Dicionario, Locale } from "@/lib/i18n";

const dicionarios: Record<Locale, Dicionario> = { pt, en };

const LocaleContext = createContext<{ locale: Locale; dicionario: Dicionario } | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale, dicionario: dicionarios[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n(): { lang: Locale; t: Dicionario } {
  const contexto = useContext(LocaleContext);
  if (!contexto) throw new Error("useI18n precisa estar dentro de <LocaleProvider>");
  return { lang: contexto.locale, t: contexto.dicionario };
}

/** Prefixa um href interno com o idioma atual: "/painel" -> "/pt/painel". */
export function useHrefLang(): (href: string) => string {
  const { lang } = useI18n();
  return useCallback((href: string) => `/${lang}${href}`, [lang]);
}
