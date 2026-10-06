import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

import { RevelarAoRolar } from "@/components/revelar-ao-rolar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/cliente";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Sem `generateStaticParams` de propósito: com pré-renderização estática, o
// HTML do painel viraria o esqueleto do Suspense (o `useSearchParams` só resolve
// no cliente) e a página inteira piscaria esqueleto -> conteúdo a cada
// abertura. Renderizando sob demanda, o servidor devolve a página pronta —
// com os filtros da URL já aplicados — e não há troca visível.
export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const t = await getDictionary(hasLocale(lang) ? lang : "pt");

  return {
    title: {
      default: t.meta.siteTitulo,
      template: t.meta.siteTemplate,
    },
    description: t.meta.siteDescricao,
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang === "pt" ? "pt-BR" : "en"}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <LocaleProvider locale={lang}>{children}</LocaleProvider>
            {/* Observa os blocos `data-revelar` de qualquer rota. Não renderiza
                nada, então fica fora da árvore visual. */}
            <RevelarAoRolar />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
