import { notFound } from "next/navigation";

import { CtaPainel } from "@/components/landing/cta";
import { Eixos } from "@/components/landing/eixos";
import { Hero } from "@/components/landing/hero";
import { Sobre } from "@/components/landing/sobre";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, hasLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDictionary(lang);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero textos={d.landing.hero} rolagem={d.landing.rolagem} lang={lang} />
        <Sobre textos={d.landing.sobre} />
        <Eixos textos={d.landing.eixos} lang={lang} />
        {/* Base legal e Relatórios saíram da landing: o mesmo conteúdo já está
            na aba "Instrumentos Legais" do painel. */}
        <CtaPainel textos={d.landing.cta} informativo={d.landing.informativo} lang={lang} />
      </main>
      <SiteFooter textos={d.footer} lang={lang} />
    </>
  );
}
