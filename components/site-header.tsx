"use client";

import { BarChart3, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useHrefLang, useI18n } from "@/lib/i18n/cliente";

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const { t, lang } = useI18n();
  const hrefLang = useHrefLang();

  const navegacao = [
    { href: "/#sobre", rotulo: t.header.sobre },
    { href: "/#eixos", rotulo: t.header.eixos },
  ];

  return (
    <header className="sticky top-0 z-50 overflow-hidden border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        {/* A marca leva à home do idioma atual: na raiz ("/") o proxy
            redireciona para /pt, e o clique viria um recarregamento inteiro
            da página em vez de uma navegação suave. */}
        <Link href={`/${lang}`} className="flex min-w-0 items-center gap-3">
          {/* Logo bem horizontal (~7:1): a altura é fixada e a largura acompanha,
              menor no mobile para sobrar espaço ao nome do site ao lado.
              Duas versões trocadas por classe: a verde não se lê sobre o fundo
              escuro do tema noturno, e a branca sumiria no claro. */}
          <Image
            src="/seplan-horizontal.png"
            alt={t.header.altLogo}
            width={3113}
            height={439}
            priority
            className="h-6 w-auto shrink-0 sm:h-8 dark:hidden"
          />
          <Image
            src="/seplan-horizontal-branco.png"
            alt={t.header.altLogo}
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
              {t.comum.marca}
            </span>
            <span className="block truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {t.comum.marcaSubtitulo}
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navegacao.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={hrefLang(item.href)}>{item.rotulo}</Link>
            </Button>
          ))}
        </nav>

        {/* Só preferências aqui, sem CTA: o caminho ao painel fica com o botão
            do hero — que domina a primeira dobra —, com o CTA que fecha a
            página e com o menu mobile. Um botão de ação no header sticky
            competiria com o hero na primeira dobra, levando ao mesmo lugar. */}
        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-2">
          <LocaleToggle />
          <ThemeToggle />

          <Sheet open={aberto} onOpenChange={setAberto}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label={t.header.abrirMenu}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{t.header.navegacao}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navegacao.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setAberto(false)}
                  >
                    <Link href={hrefLang(item.href)}>{item.rotulo}</Link>
                  </Button>
                ))}
                <Button asChild className="mt-3" onClick={() => setAberto(false)}>
                  <Link href={hrefLang("/painel")}>
                    <BarChart3 className="size-4" />
                    {t.header.acessarPainel}
                  </Link>
                </Button>
                <div className="mt-3 flex items-center justify-center py-2">
                  <LocaleToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
