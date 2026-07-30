import { CtaPainel } from "@/components/landing/cta";
import { Eixos } from "@/components/landing/eixos";
import { Hero } from "@/components/landing/hero";
import { Sobre } from "@/components/landing/sobre";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Sobre />
        <Eixos />
        {/* Base legal e Relatórios saíram da landing: o mesmo conteúdo já está
            na aba "Instrumentos Legais" do painel. */}
        <CtaPainel />
      </main>
      <SiteFooter />
    </>
  );
}
