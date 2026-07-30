import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaPainel() {
  return (
    <section className="relative isolate min-h-svh">
      {/* Mesma camada sticky das seções anteriores: a foto trava na viewport
          enquanto o cartão passa por cima. O `overflow-hidden` fica aqui, e não
          na seção — num ancestral ele quebraria o sticky. */}
      <div className="sticky top-0 -z-10 h-svh w-full overflow-hidden">
        {/* O recorte é ancorado um pouco à direita do centro, onde estão o
            corte da seringueira e a tigela — nas telas estreitas o
            `object-cover` come as laterais e o assunto sairia de quadro. */}
        <Image
          src="/seringueira.jpg"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover object-[60%_50%] brightness-115 contrast-110 saturate-105"
        />
        {/* Véu bem mais leve que o das demais seções: o texto aqui está todo
            dentro do cartão escuro, que já se sustenta sozinho — o véu só
            precisa segurar o crédito no rodapé. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/45"
        />
      </div>

      <div className="-mt-[100svh] flex min-h-svh flex-col justify-center px-4 py-24 sm:px-6">
        {/* O bg-primary/5 original era translúcido demais para ficar sobre
            foto: aqui o cartão ganha um fundo escuro próprio, como o
            "Em outras palavras" da seção Sobre. */}
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-white/25 bg-black/40 px-6 py-14 text-center text-white backdrop-blur-sm [text-shadow:0_1px_4px_rgb(0_0_0/0.7)] sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Explore os dados do Orçamento Climático
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-balance text-white/85">
            Consulte a dotação por eixo temático, por órgão e por Objetivo de
            Desenvolvimento Sustentável, com filtros e exportação dos resultados.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/painel">
              Acessar dados
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Crédito da foto, no mesmo canto e no mesmo tratamento das demais. */}
      <p className="absolute right-4 bottom-3 z-10 text-[11px] font-medium text-white/95 [text-shadow:0_1px_4px_rgb(0_0_0/0.85)] sm:right-6">
        Fotografia: Agência de Notícias do Acre
      </p>
    </section>
  );
}
