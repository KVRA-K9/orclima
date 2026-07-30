"use client";

import {
  Home,
  LayoutGrid,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
  Table,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useMemo, useState } from "react";

import { useFiltros } from "@/components/painel/filtros-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Item = { aba: string; rotulo: string; icone: LucideIcon };

type ContextoSidebar = { recolhida: boolean; alternar: () => void };

const SidebarContext = createContext<ContextoSidebar | null>(null);

/**
 * O estado de recolhimento é compartilhado porque o botão que o controla fica
 * *fora* da sidebar — no cabeçalho, ao lado do conteúdo.
 */
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [recolhida, setRecolhida] = useState(false);
  const valor = useMemo<ContextoSidebar>(
    () => ({ recolhida, alternar: () => setRecolhida((r) => !r) }),
    [recolhida],
  );
  return <SidebarContext.Provider value={valor}>{children}</SidebarContext.Provider>;
}

function useSidebar(): ContextoSidebar {
  const contexto = useContext(SidebarContext);
  if (!contexto) throw new Error("useSidebar precisa estar dentro de <SidebarProvider>");
  return contexto;
}

/** Largura da sidebar em cada estado — a mesma usada no posicionamento do botão. */
const LARGURA = { aberta: 268, recolhida: 76 } as const;

/**
 * Botão de recolher/expandir, centrado sobre a borda direita da sidebar —
 * metade sobre o painel, metade sobre o conteúdo.
 *
 * `fixed`, e não `absolute`: a sidebar é `sticky` e permanece na tela ao rolar,
 * então o botão precisa permanecer junto. Como o painel fica sempre colado à
 * esquerda da viewport em `lg+`, a coordenada é determinística —
 * `largura − metade do botão` põe o centro exatamente sobre a borda.
 */
export function SidebarToggle() {
  const { recolhida, alternar } = useSidebar();

  // A seta aponta para onde o painel vai: para a esquerda quando o clique
  // fecha, para a direita quando abre.
  const Icone = recolhida ? PanelLeftOpen : PanelLeftClose;

  return (
    <Button
      variant="outline"
      size="icon-sm"
      // z acima do cabeçalho (z-50), senão ele cobriria a metade direita.
      className="fixed top-4 z-60 hidden rounded-full shadow-sm transition-[left] duration-200 lg:inline-flex"
      style={{ left: (recolhida ? LARGURA.recolhida : LARGURA.aberta) - 16 }}
      aria-label={recolhida ? "Expandir menu lateral" : "Recolher menu lateral"}
      aria-expanded={!recolhida}
      onClick={alternar}
    >
      <Icone className="size-4" />
    </Button>
  );
}

/** Os valores de `aba` são os mesmos consumidos por `painel-conteudo.tsx`. */
const ITENS: Item[] = [
  { aba: "analises", rotulo: "Visão Geral", icone: LayoutGrid },
  { aba: "acoes", rotulo: "Tabela Detalhada", icone: Table },
  { aba: "instrumentos", rotulo: "Instrumentos Legais", icone: Scale },
  { aba: "ods", rotulo: "ODS", icone: Target },
];

function Marca({ recolhida }: { recolhida: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Image
        src="/bandeira-acre.png"
        alt="Bandeira do Acre"
        width={44}
        height={31}
        className="shrink-0 rounded-[3px] shadow-sm"
        priority
      />
      {recolhida ? null : (
        <span className="min-w-0 leading-tight">
          {/* Sem `truncate`: "Orçamento Climático" mal cabe em uma linha na
              largura da sidebar, e quebrar lê melhor que reticências. */}
          <span className="block text-sm font-semibold">Orçamento Climático</span>
          <span className="block truncate text-xs text-muted-foreground">Estado do Acre</span>
        </span>
      )}
    </span>
  );
}

/** Lista de navegação, compartilhada pela sidebar fixa e pela gaveta do mobile. */
function Navegacao({
  recolhida,
  aoNavegar,
}: {
  recolhida: boolean;
  aoNavegar?: () => void;
}) {
  const { aba, definirAba } = useFiltros();

  const classe = (ativo: boolean) =>
    cn(
      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
      recolhida && "justify-center px-0",
      ativo
        ? "bg-primary/20 font-medium text-primary"
        : "text-foreground/80 hover:bg-primary/10 hover:text-foreground",
    );

  return (
    <nav aria-label="Seções do painel" className="flex flex-col gap-1">
      <Link
        href="/"
        className={classe(false)}
        title={recolhida ? "Voltar à Página Inicial" : undefined}
        onClick={aoNavegar}
      >
        <Home className="size-4.5 shrink-0" strokeWidth={1.75} />
        {recolhida ? null : "Voltar à Página Inicial"}
      </Link>

      {ITENS.map((item) => {
        const Icone = item.icone;
        const ativo = aba === item.aba;
        return (
          <button
            key={item.aba}
            type="button"
            aria-current={ativo ? "page" : undefined}
            title={recolhida ? item.rotulo : undefined}
            onClick={() => {
              definirAba(item.aba);
              aoNavegar?.();
            }}
            className={classe(ativo)}
          >
            <Icone className="size-4.5 shrink-0" strokeWidth={1.75} />
            {recolhida ? null : item.rotulo}
          </button>
        );
      })}
    </nav>
  );
}

export function PainelSidebar() {
  const { recolhida } = useSidebar();

  return (
    <aside
      // Largura vem de LARGURA para não divergir do posicionamento do toggle,
      // que se apoia nela para ficar centrado sobre a borda.
      style={{ width: recolhida ? LARGURA.recolhida : LARGURA.aberta }}
      className="sticky top-0 hidden h-svh shrink-0 flex-col border-r border-border/60 bg-primary/10 transition-[width] duration-200 lg:flex"
    >
      <div
        className={cn(
          "flex h-16 items-center px-4",
          recolhida && "justify-center px-0",
        )}
      >
        <Marca recolhida={recolhida} />
      </div>

      {/* O alternador de tema saiu daqui do rodapé: virou o botão flutuante
          `TemaFlutuante`, na borda direita da sidebar. */}
      <div className={cn("flex-1 overflow-y-auto px-3 pb-4", recolhida && "px-2")}>
        <Navegacao recolhida={recolhida} />
      </div>
    </aside>
  );
}

/** Gaveta com a mesma navegação, para telas menores que `lg`. */
export function PainelSidebarMobile() {
  const [aberta, setAberta] = useState(false);

  return (
    <Sheet open={aberta} onOpenChange={setAberta}>
      <SheetTrigger asChild>
        {/* Fixo: sem cabeçalho, este botão é a única porta de entrada da
            navegação abaixo de `lg`, e precisa estar sempre alcançável. */}
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 shadow-sm lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      {/* O tom verde vai num filho, não no SheetContent: `bg-primary/10` ali
          substituiria o `bg-background` do componente (tailwind-merge resolve o
          conflito pelo último) e a gaveta ficaria translúcida sobre a página. */}
      <SheetContent side="left" className="w-[280px] gap-0 p-0">
        <SheetTitle className="sr-only">Seções do painel</SheetTitle>
        <div className="flex h-full flex-col bg-primary/10">
          <div className="flex h-16 shrink-0 items-center px-4">
            <Marca recolhida={false} />
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <Navegacao recolhida={false} aoNavegar={() => setAberta(false)} />
          </div>
          <div className="flex items-center gap-2 border-t border-border/60 px-3 py-3">
            <ThemeToggle />
            <span className="text-xs text-muted-foreground">Tema claro / escuro</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
