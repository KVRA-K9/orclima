"use client";

import { BarChart3, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAVEGACAO = [
  { href: "/#sobre", rotulo: "Sobre" },
  { href: "/#eixos", rotulo: "Eixos" },
];

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="sticky top-0 z-50 overflow-hidden border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {/* Logo bem horizontal (~7:1): a altura é fixada e a largura acompanha,
              menor no mobile para sobrar espaço ao nome do site ao lado.
              Duas versões trocadas por classe: a verde não se lê sobre o fundo
              escuro do tema noturno, e a branca sumiria no claro. */}
          <Image
            src="/seplan-horizontal.png"
            alt="SEPLAN — Secretaria de Estado de Planejamento"
            width={3113}
            height={439}
            priority
            className="h-6 w-auto shrink-0 sm:h-8 dark:hidden"
          />
          <Image
            src="/seplan-horizontal-branco.png"
            alt="SEPLAN — Secretaria de Estado de Planejamento"
            width={3113}
            height={439}
            priority
            className="hidden h-6 w-auto shrink-0 sm:h-8 dark:block"
          />
          {/* Espelha a construção da própria logo: marca em verde, barra
              amarela e descritivo cinza em caixa alta. O amarelo é literal
              porque vem da identidade da SEPLAN, não do tema. */}
          {/* Traço da barra amarela da logo, um pouco mais encorpado para não
              sumir nas alturas pequenas do cabeçalho. */}
          <span aria-hidden className="h-6 w-0.5 shrink-0 bg-[#f5b800]/75 sm:h-8" />
          <span className="min-w-0 leading-tight">
            {/* No escuro o `--primary` é verde-claro e brigava com a logo
                branca ao lado; aqui o nome acompanha a marca. */}
            <span className="block truncate text-sm font-bold tracking-wide text-primary uppercase dark:text-white">
              Orçamento Climático
            </span>
            <span className="block truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Estado do Acre
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAVEGACAO.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.rotulo}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/painel">
              <BarChart3 className="size-4" />
              Acessar painel
            </Link>
          </Button>

          <Sheet open={aberto} onOpenChange={setAberto}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Navegação</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAVEGACAO.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setAberto(false)}
                  >
                    <Link href={item.href}>{item.rotulo}</Link>
                  </Button>
                ))}
                <Button asChild className="mt-3" onClick={() => setAberto(false)}>
                  <Link href="/painel">
                    <BarChart3 className="size-4" />
                    Acessar painel
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
