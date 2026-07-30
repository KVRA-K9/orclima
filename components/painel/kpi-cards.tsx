"use client";

import { Building2, Layers, Leaf, TriangleAlert, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useFiltros } from "@/components/painel/filtros-context";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { contarAcoes } from "@/lib/data";
import { formatCompactoBRL, formatNumero, formatPercentual } from "@/lib/format";

type Kpi = {
  titulo: string;
  valor: string;
  rotuloValor?: string;
  subtitulo: string;
  icone: LucideIcon;
  /**
   * Ressalva sobre o número, exibida no botão "i". Só o rótulo, sem texto
   * explicativo: a única formulação com origem documentada é a do
   * `docs/03-PADROES-UI.md`. Qualquer prosa além disso seria paráfrase, e o
   * ponto do marcador é ser honesto sobre o dado.
   */
  nota?: string;
};

/**
 * Botão "i" com a ressalva sobre o número. Popover, e não Tooltip: a nota
 * precisa ser alcançável no toque, e tooltip depende de hover.
 */
function NotaKpi({ nota, titulo }: { nota: string; titulo: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Âmbar tingido, não preenchido: marca a ressalva sem competir com o
            número do cartão (1,12 de contraste no claro, 1,38 no escuro — o
            sólido dava 2,15 e 7,08). Cada tema puxa um passo diferente do
            âmbar: no claro o texto precisa ser escuro (amber-800, 6,31 sobre o
            tingimento) e no escuro precisa ser claro (amber-400, 6,59). Um par
            único não atenderia aos dois. */}
        <button
          type="button"
          aria-label={`${nota} — sobre ${titulo}`}
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-500/30 transition-colors hover:bg-amber-500/25 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-amber-400/15 dark:text-amber-400 dark:ring-amber-400/30 dark:hover:bg-amber-400/25"
        >
          i
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-3">
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <TriangleAlert aria-hidden className="size-3.5 shrink-0 text-amber-500" />
          {nota}
        </p>
      </PopoverContent>
    </Popover>
  );
}

export function KpiCards() {
  const { resumo, filtros } = useFiltros();
  const acoes = contarAcoes(filtros);

  const participacaoExclusiva =
    resumo.total > 0 ? resumo.gastoExclusivo / resumo.total : 0;

  const kpis: Kpi[] = [
    {
      titulo: "Órgãos Atuantes",
      valor: formatNumero(resumo.numeroOrgaosAtuantes),
      subtitulo: "Identificados",
      icone: Building2,
    },
    {
      titulo: "Orçamento Climático Exclusivo Planejado",
      valor: formatCompactoBRL(resumo.gastoExclusivo),
      subtitulo: `${formatPercentual(participacaoExclusiva)} do total`,
      icone: Leaf,
    },
    {
      titulo: "Dotação Exclusiva",
      valor: formatNumero(acoes.exclusivas),
      rotuloValor: "Aplicações programadas",
      subtitulo: formatCompactoBRL(resumo.gastoExclusivo),
      icone: Wallet,
    },
    {
      titulo: "Dotação Não Exclusiva",
      valor: formatNumero(acoes.naoExclusivas),
      rotuloValor: "Aplicações programadas",
      subtitulo: formatCompactoBRL(resumo.gastoNaoExclusivo),
      icone: Layers,
      // Literal de docs/03-PADROES-UI.md, que herda o marcador do dashboard
      // anterior e manda mantê-lo enquanto a validação setorial não terminar.
      // Sem prosa em volta: o Roteiro Operativo (fonte primária) não afirma em
      // lugar nenhum que a validação está pendente — isso é conclusão do
      // docs/01-METODOLOGIA.md, e não cabe reproduzir como se fosse citação.
      nota: "Em fase de validação",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, indice) => {
        const Icone = kpi.icone;
        return (
          // Os KPIs abrem a área de dados e costumam nascer na primeira dobra:
          // entram por tempo, escalonados, e não pela rolagem — que os
          // entregaria prontos por já estarem em tela.
          <Card
            key={kpi.titulo}
            className="revelar-entrada relative gap-0 overflow-hidden"
            style={{ animationDelay: `${240 + indice * 90}ms` }}
          >
            {/* Marca d'água: sangra pelas bordas e é recortada pelo rounded-xl
                do cartão. Decorativo, então fora da árvore de acessibilidade —
                não acrescenta nada ao que o texto já diz.
                Vem antes do texto para ficar atrás dele sem z-index negativo,
                que em alguns navegadores some atrás do fundo do cartão.
                Opacidade maior no escuro: lá o primary é verde claro (#4ade80)
                e precisa de mais alfa para o mesmo peso visual. */}
            <Icone
              aria-hidden
              strokeWidth={1.5}
              className="pointer-events-none absolute -right-3 -bottom-4 size-28 text-primary/35 dark:text-primary/40"
            />
            {/* relative: mantém o texto acima da marca d'água. Sem o ícone
                ocupando uma coluna, o conteúdo usa a largura inteira. */}
            <CardContent className="relative">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm leading-snug font-medium text-muted-foreground">
                  {kpi.titulo}
                </p>
                {kpi.nota ? <NotaKpi nota={kpi.nota} titulo={kpi.titulo} /> : null}
              </div>
              {/* 24px: com a sidebar ocupando 268px, o cartão fica em ~269px
                  — a 30px "R$ 200,1 MI" quebrava. */}
              <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                {kpi.valor}
              </p>
              {kpi.rotuloValor ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{kpi.rotuloValor}</p>
              ) : null}
              <p className="mt-1.5 text-sm font-medium text-primary">{kpi.subtitulo}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
