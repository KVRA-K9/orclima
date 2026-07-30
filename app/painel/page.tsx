import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { FiltrosProvider } from "@/components/painel/filtros-context";
import { Filtros } from "@/components/painel/filtros";
import { PainelBanner } from "@/components/painel/painel-banner";
import { PainelConteudo } from "@/components/painel/painel-conteudo";
import {
  PainelSidebar,
  PainelSidebarMobile,
  SidebarProvider,
  SidebarToggle,
} from "@/components/painel/painel-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Painel de dados",
  description:
    "Painel interativo do Orçamento Climático do Estado do Acre: dotação por eixo temático, por órgão e por Objetivo de Desenvolvimento Sustentável.",
};

export default function PainelPage() {
  return (
    // O estado do painel vive na query string, então tudo que depende de
    // useSearchParams — inclusive a navegação da sidebar — fica sob um único
    // limite de Suspense.
    <Suspense fallback={<EsqueletoPainel />}>
      <FiltrosProvider>
        <SidebarProvider>
          <div className="flex min-h-svh w-full">
            <PainelSidebar />
            {/* Fora do <aside>: flutua sobre a borda entre painel e conteúdo. */}
            <SidebarToggle />
            {/* Alternador de tema no canto superior direito da área de
                conteúdo — que é colada à direita da viewport, então `fixed`
                resolve sem depender da largura da sidebar. A gaveta do mobile
                mantém o alternador dela; este só existe de `lg` para cima. */}
            <div className="fixed top-4 right-4 z-60 hidden lg:block">
              <ThemeToggle
                variant="outline"
                size="icon-sm"
                className="rounded-full shadow-sm"
              />
            </div>
            {/* Abaixo de `lg` a sidebar some; este é o acesso à navegação. */}
            <PainelSidebarMobile />

            <div className="flex min-w-0 flex-1 flex-col">
              {/* `min-h-svh` além do `flex-1`: a aba "Instrumentos legais" é
                  curta, e se o main ficasse menor que uma tela a camada da foto
                  (de `h-svh`) seria mais alta que o pai — aí o sticky não gruda
                  e a foto rolaria junto com o conteúdo. */}
              <main className="relative isolate min-h-svh flex-1">
                {/* Foto de fundo com o mesmo tratamento das seções da landing:
                    camada sticky travada na viewport, `contrast-110
                    saturate-105` e véu escuro em gradiente. Fica dentro do
                    <main>, e não fixa na raiz do painel, para não passar por
                    trás da sidebar. */}
                <div className="sticky top-0 -z-10 h-svh w-full overflow-hidden">
                  <Image
                    src="/seringueiras.jpg"
                    alt=""
                    fill
                    sizes="100vw"
                    className="pointer-events-none object-cover object-center contrast-110 saturate-105"
                  />
                  {/* Véu um pouco mais leve que o das seções da landing: aqui
                      ele não precisa sustentar texto solto — todo dado do
                      painel está dentro de cartão opaco. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60"
                  />
                </div>

                {/* `pt-20` abaixo de `lg`: abre espaço para o botão de menu,
                    que é fixo agora que não há mais cabeçalho. */}
                <div className="-mt-[100svh] mx-auto w-full max-w-7xl space-y-4 px-4 pt-20 pb-8 sm:px-6 lg:pt-8">
                  <PainelBanner />
                  <Filtros />
                  <PainelConteudo />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </FiltrosProvider>
    </Suspense>
  );
}

function EsqueletoPainel() {
  return (
    <div className="flex min-h-svh w-full">
      <div className="hidden w-[268px] shrink-0 border-r border-border/60 bg-primary/10 p-4 lg:block">
        <Skeleton className="h-10 w-full" />
        <div className="mt-6 space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8 sm:px-6">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
