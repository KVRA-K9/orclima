import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { IndicadorRolagem } from "@/components/landing/indicador-rolagem";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate min-h-svh">
      {/* A foto é uma camada `sticky` de uma tela de altura, e não um `fill` na
          seção inteira: assim ela fica travada na viewport enquanto o conteúdo
          rola por cima, e só sai de cena quando a seção seguinte a cobre.
          Nenhum ancestral pode ter `overflow-hidden` — isso vira container de
          rolagem e o sticky para de funcionar. Por isso o recorte fica aqui. */}
      <div className="sticky top-0 -z-10 h-svh w-full overflow-hidden">
        <Image
          src="/croa.jpg"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="pointer-events-none object-cover object-center contrast-110 saturate-105"
        />
        {/* Véu escuro em gradiente vertical: mais fechado nas pontas, onde
            ficam o cabeçalho e o indicador de rolagem, e mais aberto no meio,
            que é onde a foto tem o que mostrar. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/75"
        />
      </div>

      {/* A margem negativa devolve o conteúdo para cima da camada da foto. */}
      <div className="-mt-[100svh] flex min-h-svh flex-col justify-center px-4 pt-24 pb-32 sm:px-6">
        {/* Cores fixas em branco, e não os tokens do tema: atrás do texto está
            sempre a foto sob o véu escuro, nos dois temas. */}
        <div className="mx-auto w-full max-w-6xl text-white [text-shadow:0_2px_8px_rgb(0_0_0/0.6)]">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Orçamento Climático{" "}
            <span className="text-emerald-300">do Estado do Acre</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Ferramenta inédita para organizar e acompanhar os gastos públicos destinados à
            proteção ambiental e ao enfrentamento das mudanças climáticas.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/painel">
                Acessar painel interativo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Crédito da foto: sem fundo, então a legibilidade vem do texto branco
          com sombra. Fica abaixo do indicador, que começa em `bottom-8`. */}
      <p className="absolute right-4 bottom-3 z-10 text-[11px] font-medium text-white/95 [text-shadow:0_1px_4px_rgb(0_0_0/0.85)] sm:right-6">
        Fotografia: Pedro Devani - SECOM/AC
      </p>

      <IndicadorRolagem destino="#sobre" />
    </section>
  );
}
