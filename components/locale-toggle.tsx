"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import { useI18n } from "@/lib/i18n/cliente";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Bandeira e nome nativo de cada idioma — o nome é o que o leitor de tela anuncia. */
const BANDEIRAS: Record<Locale, { src: string; nome: string }> = {
  pt: { src: "/bandeiras/brasil.webp", nome: "Português" },
  en: { src: "/bandeiras/reino-unido.webp", nome: "English" },
};

/**
 * Alternador PT | EN: navega para a mesma rota com os filtros da URL mantidos.
 * O `useSearchParams` exige limite de Suspense em páginas estáticas — a landing
 * não tem um por fora, então o limite é aqui dentro.
 */
function AlternadorIdioma({ className }: { className?: string }) {
  const { t, lang } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const destino = useMemo(() => {
    const query = searchParams.toString();
    return (alvo: Locale) => {
      const segmentos = pathname.split("/");
      segmentos[1] = alvo;
      const caminho = segmentos.join("/") || `/${alvo}`;
      return query ? `${caminho}?${query}` : caminho;
    };
  }, [pathname, searchParams]);

  return (
    <div
      role="group"
      aria-label={t.comum.idioma}
      // Sem borda, sem fundo: as bandeiras ficam soltas, como um seletor de
      // idioma transparente. O `className` do chamador pode reaver o chip
      // (fundo + recuo) onde ele precisa se destacar da superfície embaixo.
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {(["pt", "en"] as const).map((alvo) => {
        const ativo = lang === alvo;
        return (
          <Link
            key={alvo}
            href={destino(alvo)}
            aria-label={BANDEIRAS[alvo].nome}
            title={BANDEIRAS[alvo].nome}
            aria-current={ativo ? "true" : undefined}
            // `size-9` é a mesma área do botão de tema ao lado: a fileira do
            // cabeçalho alinha e o toque fica confortável — a bandeira é quem
            // enxerga, o padding é quem aponta.
            className={cn(
              "flex size-9 items-center justify-center rounded-md transition-opacity focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              ativo ? "opacity-100" : "opacity-55 hover:opacity-100",
            )}
          >
            <Image
              src={BANDEIRAS[alvo].src}
              alt=""
              width={24}
              height={16}
              className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-black/10 dark:ring-white/20"
            />
          </Link>
        );
      })}
    </div>
  );
}

export function LocaleToggle({ className }: { className?: string }) {
  // Mesmas bandeiras do alternador, soltas e sem ação: o destino do link é o que
  // depende do `useSearchParams`, as imagens não — então o fallback já sai com
  // o desenho final e a troca por ele é imperceptível.
  return (
    <Suspense
      fallback={
        <span
          aria-hidden
          className={cn("inline-flex items-center gap-0.5", className)}
        >
          {(["pt", "en"] as const).map((alvo) => (
            <span
              key={alvo}
              className="flex size-9 items-center justify-center rounded-md opacity-55"
            >
              <Image
                src={BANDEIRAS[alvo].src}
                alt=""
                width={24}
                height={16}
                className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-black/10 dark:ring-white/20"
              />
            </span>
          ))}
        </span>
      }
    >
      <AlternadorIdioma className={className} />
    </Suspense>
  );
}
